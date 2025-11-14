const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
const mysql = require("mysql");
const util = require("util");
const fs = require("fs");
const Decimal = require("decimal.js");
const { subgraphUrl, getTokenContract } = require("./config/config.js");
let conPrivate = mysql.createConnection({
  //host: "34.124.146.145",
  host: "10.119.122.3",
  port: 3306,
  user: "root",
  password: "password",
  database: "v3",
});
let sql_query = util.promisify(conPrivate.query).bind(conPrivate);

function ensureDbConnection() {
  if (conPrivate.state === "disconnected") {
    conPrivate = mysql.createConnection({
      //host: "34.124.146.145",
      host: "10.119.122.3",
      port: 3306,
      user: "root",
      password: "password",
      database: "v3",
    });
    sql_query = util.promisify(conPrivate.query).bind(conPrivate);
  }
}

const Other = express();

Other.use(cors({ origin: true }));

require("dotenv").config();

const zealy_apiKey = "bfa1fcf6c2da8ecebbabc8f7fd09cfb2";



// CMC接口 - 获取所有池子信息
Other.get("/cmc/c1", async (req, res) => {
  try {
    ensureDbConnection();
    const { getTokenByAddress } = require("./config/config.js");
    const result = {};
    let skip = 0;

    // 查询所有池子
    while (true) {
      const query = `{
        pools(first: 1000, orderBy: id, orderDirection: desc, skip: ${skip}) {
          id
          token0 {
            id
            symbol
            name
            decimals
          }
          token1 {
            id
            symbol
            name
            decimals
          }
          sqrtPrice
          tick
          volumeToken0
          volumeToken1
        }
      }`;

      let fetchResponse = await fetch(subgraphUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          query,
        }),
      });
      let rows = await fetchResponse.json();

      if (typeof rows.data == "undefined" || !rows.data.pools) {
        break;
      }

      rows = rows.data.pools;

      // 处理每个池子
      for (let j = 0; j < rows.length; j++) {
        const pool = rows[j];
        const poolId = pool.id;
        const token0 = pool.token0;
        const token1 = pool.token1;
        
        // 检查token0和token1是否都在TOKENS配置中
        const token0Config = getTokenByAddress(token0.id);
        const token1Config = getTokenByAddress(token1.id);
        
        // 如果任一token不在配置中，跳过这个池子
        if (!token0Config || !token1Config) {
          continue;
        }
        
        const sqrtPrice = pool.sqrtPrice;
        
        // 计算 last_price: (sqrtPrice / 2^96)^2
        const sqrtPriceDecimal = new Decimal(sqrtPrice);
        const divisor = new Decimal(2).pow(96);
        const priceRatio = sqrtPriceDecimal.div(divisor);
        const lastPrice = priceRatio.pow(2).toString();

        // 直接使用 volumeToken0 和 volumeToken1
        const baseVolume = pool.volumeToken0 || "0";
        const quoteVolume = pool.volumeToken1 || "0";

        // 构建key: token0_id_token1_id
        const key = `${token0.id}_${token1.id}`;

        // 构建返回对象
        result[key] = {
          base_id: token0.id,
          base_name: token0.name,
          base_symbol: token0.symbol,
          quote_id: token1.id,
          quote_name: token1.name,
          quote_symbol: token1.symbol,
          last_price: lastPrice,
          base_volume: baseVolume,
          quote_volume: quoteVolume
        };
      }

      skip += 1000;
      if (rows.length < 1000) {
        break;
      }
    }

    res.status(200).send(result);
  } catch (error) {
    console.error("Error fetching CMC data:", error);
    res.status(500).send({
      error: "Failed to fetch CMC data",
      message: error.message
    });
  }
});

// 辅助函数：批量获取代币价格（与poolapi.js中的fetchPriceBatch类似）
async function fetchPriceBatchForCMC() {
  const { getTokenContract, getUSDAddresses } = require("./config/config.js");
  const token_contract = getTokenContract();
  const usd = getUSDAddresses();
  const result = {};

  try {
    // 调用外部接口获取代币价格
    const response = await fetch(
      "https://asia-southeast1-ktx-finance-2.cloudfunctions.net/sailor_otherapi/getTokenPrices"
    );
    
    if (!response.ok) {
      console.error("Failed to fetch prices, status:", response.status);
      return result;
    }
    
    const priceData = await response.json();

    // 将返回的数据转换为 symbolToPriceMap
    const symbolToPriceMap = {};
    if (priceData.success && priceData.data) {
      for (const row of priceData.data) {
        symbolToPriceMap[row.symbol] = {
          price: row.price,
          dailychange: row.dailychange,
        };
      }
    }

    for (const contract_addr in token_contract) {
      const symbol = token_contract[contract_addr];
      let w_symbol = symbol;

      if (contract_addr.toLowerCase() == "0x541fd749419ca806a8bc7da8ac23d346f2df8b77") {
        w_symbol = "SOLVBTC";
      }
      if (contract_addr.toLowerCase() == "0x78e26e8b953c7c78a58d69d8b9a91745c2bbb258") {
        w_symbol = "UBTC";
      }

      if (usd.includes(contract_addr)) {
        result[contract_addr] = { symbol: symbol, price: 1, dailychange: 0 };
        continue;
      }

      if (symbolToPriceMap[symbol]) {
        result[contract_addr] = {
          symbol: w_symbol,
          price: symbolToPriceMap[symbol].price,
          dailychange: symbolToPriceMap[symbol].dailychange,
        };
      } else {
        result[contract_addr] = {};
      }
    }
  } catch (error) {
    console.error("Error fetching prices:", error);
  }

  return result;
}

// CMC接口 - C3 获取池子详细信息用于流动性挖矿
Other.get("/cmc/c3", async (req, res) => {
  try {
    ensureDbConnection();
    const { GetPools } = require("./utils/rewards_calculator.js");
    const { getTokenByAddress } = require("./config/config.js");
    
    // WSEI地址
    const WSEI_ADDRESS = "0xe30fedd158a2e3b13e9badaeabafc5516e95e8c7";
    
    // 获取当前周的奖励池信息
    const POOLS = GetPools();
    
    // 批量获取所有代币价格
    const pricesData = await fetchPriceBatchForCMC() || {};
    
    // 获取SEI价格对象
    const sei_price = pricesData["0xe30fedd158a2e3b13e9badaeabafc5516e95e8c7"];

    const pools = [];
    let skip = 0;

    // 查询所有有奖励的池子
    while (true) {
      const query = `{
        pools(first: 1000, orderBy: id, orderDirection: desc, skip: ${skip}) {
          id
          token0 {
            id
            symbol
            name
            decimals
          }
          token1 {
            id
            symbol
            name
            decimals
          }
          feeTier
          totalValueLockedToken0
          totalValueLockedToken1
        }
      }`;

      let fetchResponse = await fetch(subgraphUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          query,
        }),
      });
      let rows = await fetchResponse.json();

      if (typeof rows.data == "undefined" || !rows.data.pools) {
        break;
      }

      rows = rows.data.pools;

      // 处理每个池子
      for (let j = 0; j < rows.length; j++) {
        const pool = rows[j];
        const poolId = pool.id;

        const token0 = pool.token0;
        const token1 = pool.token1;
        const feeTier = pool.feeTier;

        // 应用统一符号映射
        const token0FromConfig = getTokenByAddress(token0.id);
        const token1FromConfig = getTokenByAddress(token1.id);
        
        // 如果任一token不在配置中，跳过这个池子
        if (!token0FromConfig || !token1FromConfig) {
          continue;
        }
        
        const token0Symbol = token0FromConfig.symbol;
        const token1Symbol = token1FromConfig.symbol;

        // 构建池子名称: sailor TOKEN0-TOKEN1-FEETIER
        const feeTierBps = new Decimal(feeTier).div(10000).toNumber(); // 转换为百分比形式
        const name = `sailor ${token0Symbol}-${token1Symbol}-${feeTierBps}%`;

        // 构建pair
        const pair = `${token0Symbol}-${token1Symbol}`;

        // 构建pairLink
        const pairLink = `https://app.sailor.finance/clmm/create-position/?pool_id=${poolId}`;

        // 确定poolRewards - 如果token0或token1是WSEI，则奖励该代币
        let poolRewards = [];
        const token0IsWsei = token0.id.toLowerCase() === WSEI_ADDRESS;
        const token1IsWsei = token1.id.toLowerCase() === WSEI_ADDRESS;
        
        if (token0IsWsei) {
          poolRewards = [token0Symbol];
        } else if (token1IsWsei) {
          poolRewards = [token1Symbol];
        }

        // 计算APR - 如果池子没有奖励，rewardAmount为0
        const rewardAmount = (POOLS[poolId] && POOLS[poolId].rewardAmount) ? POOLS[poolId].rewardAmount : 0;

        const boost_value_per_day = (rewardAmount * (sei_price?.price || 0)) / 7;

        // 计算totalStaked - 需要将token0和token1的TVL都换算成USD
        let totalStaked = 0;
        
        const token0_id = token0.id.toLowerCase();
        const token1_id = token1.id.toLowerCase();
        const data0 = pricesData[token0_id] || {};
        const data1 = pricesData[token1_id] || {};

        let token0PriceUsd = 1;
        let token1PriceUsd = 1;

        if (data0 && data0.price && Object.keys(data0).length > 0) {
          token0PriceUsd = parseFloat(data0.price);
        }
        if (data1 && data1.price && Object.keys(data1).length > 0) {
          token1PriceUsd = parseFloat(data1.price);
        }

        const token0Tvl = parseFloat(pool.totalValueLockedToken0 || 0) * token0PriceUsd;
        const token1Tvl = parseFloat(pool.totalValueLockedToken1 || 0) * token1PriceUsd;
        
        totalStaked = token0Tvl + token1Tvl;

        // 计算APR
        const apr = totalStaked > 0 ? (boost_value_per_day * 365) / totalStaked : 0;


        pools.push({
          name,
          pair,
          pairLink,
          poolRewards,
          apr: parseFloat(apr.toFixed(4)), // 返回数字类型，保留4位小数
          totalStaked: parseFloat(totalStaked.toFixed(2)) // 返回数字类型，保留2位小数
        });
      }

      skip += 1000;
      if (rows.length < 1000) {
        break;
      }
    }

    const response = {
      provider: "Sailor",
      provider_logo: "https://storage.googleapis.com/app-sailor/sailorLogo.png",
      provider_URL: "https://app.sailor.finance/",
      links: [
        {
          title: "Twitter",
          link: "https://x.com/SailorFi"
        },
        {
          title: "Telegram",
          link: "https://t.me/Sailorfi"
        }
      ],
      pools
    };

    res.status(200).send(response);
  } catch (error) {
    console.error("Error fetching CMC C3 data:", error);
    res.status(500).send({
      error: "Failed to fetch CMC C3 data",
      message: error.message
    });
  }
});

// Sailor Subgraph 代理接口
Other.post("/sailor/subgraph", async (req, res) => {
  try {
    const { query, variables } = req.body;

    // 验证必需参数
    if (!query) {
      return res.status(400).send({
        error: "Missing required parameter: query"
      });
    }

    const sailorSubgraphUrl = "https://api.goldsky.com/api/public/project_cmhfns5et0001qkp218kp5z6s/subgraphs/sailor/v0.0.2/gn";

    // 发起请求到 Sailor subgraph
    const response = await fetch(sailorSubgraphUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        query,
        variables: variables || {}
      }),
    });

    if (!response.ok) {
      throw new Error(`Sailor Subgraph API responded with status: ${response.status}`);
    }

    const data = await response.json();
    
    res.status(200).send({
      success: true,
      data: data
    });

  } catch (error) {
    console.error("Error fetching Sailor Subgraph data:", error);
    res.status(500).send({
      error: "Failed to fetch data from Sailor Subgraph",
      message: error.message
    });
  }
});

module.exports = Other;