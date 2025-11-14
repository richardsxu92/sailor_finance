const subgraphUrl =
  "https://api.goldsky.com/api/public/project_cmhfns5et0001qkp218kp5z6s/subgraphs/sailor/v0.0.2/gn";

// 统一的代币配置 - 包含所有代币信息
const TOKENS = {
  WSEI: {
    id: "0xE30feDd158A2e3b13e9badaeABaFc5516e95e8C7",
    name: "Wrapped SEI",
    symbol: "WSEI",
    decimals: 18,
    url: "https://dzyb4dm7r8k8w.cloudfront.net/prod/logos/0xE30feDd158A2e3b13e9badaeABaFc5516e95e8C7/logo.png",
    priceMapping: "SEI",
    isWhitelisted: true,
    isUSD: false,
  },
  SEI: {
    id: "0x0000000000000000000000000000000000000000",
    name: "SEI",
    symbol: "SEI",
    decimals: 18,
    url: "https://dzyb4dm7r8k8w.cloudfront.net/prod/logos/0xE30feDd158A2e3b13e9badaeABaFc5516e95e8C7/logo.png",
    priceMapping: "SEI",
    isWhitelisted: true,
    isUSD: false,
  },
  USDT: {
    id: "0xB75D0B03c06A926e488e2659DF1A861F860bD3d1",
    name: "kavaUSDT", // 应用映射：原本是USDT，映射为kavaUSDT
    symbol: "kavaUSDT", // 应用映射：原本是USDT，映射为kavaUSDT
    decimals: 6,
    url: "https://storage.googleapis.com/app-sailor/kavaUSDT.jpg",
    priceMapping: "USDT",
    isWhitelisted: true,
    isUSD: true,
  },
  USDC: {
    id: "0xe15fC38F6D8c56aF07bbCBe3BAf5708A2Bf42392",
    name: "USDC",
    symbol: "USDC",
    decimals: 6,
    url: "https://dzyb4dm7r8k8w.cloudfront.net/prod/logos/0x3894085Ef7Ff0f0aeDf52E2A2704928d1Ec074F1/logo.png",
    priceMapping: "USDC",
    isWhitelisted: true,
    isUSD: true,
  },
  "USDC.N": {
    id: "0x3894085Ef7Ff0f0aeDf52E2A2704928d1Ec074F1",
    name: "USDC.n",
    symbol: "USDC.n",
    decimals: 6,
    url: "https://dzyb4dm7r8k8w.cloudfront.net/prod/logos/0x3894085Ef7Ff0f0aeDf52E2A2704928d1Ec074F1/logo.png",
    priceMapping: "USDC",
    isWhitelisted: true,
    isUSD: true,
  },
  SYUSD: {
    id: "0x059A6b0bA116c63191182a0956cF697d0d2213eC",
    name: "syUSD",
    symbol: "SYUSD",
    decimals: 18,
    url: "https://assets.coingecko.com/coins/images/50179/standard/7.png?1726164913",
    priceMapping: "USDT",
    isWhitelisted: true,
    isUSD: true,
  },
  USDA: {
    id: "0xff12470a969Dd362EB6595FFB44C82c959Fe9ACc",
    name: "USDa",
    symbol: "USDA",
    decimals: 18,
    url: "https://729569225-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FlcdCcIXgWo7dKoZEUxKp%2Fuploads%2FC3rBj7o0RhyZ7mSRppBC%2FUSDa.png?alt=media&token=a4735826-4925-4f78-9842-f56b6e6cd982",
    priceMapping: "USDT",
    isWhitelisted: true,
    isUSD: true,
  },
  SUSDA: {
    id: "0x6aB5d5E96aC59f66baB57450275cc16961219796",
    name: "sUSDa",
    symbol: "SUSDA",
    decimals: 18,
    url: "https://729569225-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FlcdCcIXgWo7dKoZEUxKp%2Fuploads%2Fvl6qQIG4mONwxo1QO7WR%2FsUSDa.png?alt=media&token=57cd569a-8dde-4f77-bb97-3445331662e2",
    priceMapping: "USDT",
    isWhitelisted: true,
    isUSD: true,
  },
  WBTC: {
    id: "0x0555E30da8f98308EdB960aa94C0Db47230d2B9c",
    name: "Wrapped BTC",
    symbol: "WBTC",
    decimals: 8,
    url: "https://sailor.finance/images/coins/wbtc.png",
    priceMapping: "BTC",
    isWhitelisted: true,
    isUSD: false,
  },
  ISEI: {
    id: "0x5Cf6826140C1C56Ff49C808A1A75407Cd1DF9423",
    name: "iSEI",
    symbol: "ISEI",
    decimals: 6,
    url: "https://dzyb4dm7r8k8w.cloudfront.net/prod/logos/0x5Cf6826140C1C56Ff49C808A1A75407Cd1DF9423/logo.png",
    priceMapping: "SEI",
    isWhitelisted: true,
    isUSD: false,
  },
  WETH: {
    id: "0x160345fC359604fC6e70E3c5fAcbdE5F7A9342d8",
    name: "Wrapped ETH",
    symbol: "WETH",
    decimals: 18,
    url: "https://sailor.finance/images/coins/weth.png",
    priceMapping: "ETH",
    isWhitelisted: true,
    isUSD: false,
  },
  FXS: {
    id: "0x64445f0aecC51E94aD52d8AC56b7190e764E561a",
    name: "Frax Share",
    symbol: "FXS",
    decimals: 18,
    url: "https://dzyb4dm7r8k8w.cloudfront.net/prod/logos/0x64445f0aecC51E94aD52d8AC56b7190e764E561a/logo.png",
    priceMapping: "FXS",
    isWhitelisted: true,
    isUSD: false,
  },
  FASTUSD: {
    id: "0x37a4dD9CED2b19Cfe8FAC251cd727b5787E45269",
    name: "fastUSD",
    symbol: "FASTUSD",
    decimals: 18,
    url: "https://dzyb4dm7r8k8w.cloudfront.net/prod/logos/0x37a4dD9CED2b19Cfe8FAC251cd727b5787E45269/logo.png",
    priceMapping: "USDT",
    isWhitelisted: true,
    isUSD: true,
  },
  SOLVBTC: {
    id: "0x541FD749419CA806a8bc7da8ac23D346f2dF8B77",
    name: "Solv BTC",
    symbol: "SOLVBTC",
    decimals: 18,
    url: "https://storage.googleapis.com/app-sailor/SolvBTC.png",
    priceMapping: "BTC",
    isWhitelisted: true,
    isUSD: false,
  },
  "SOLVBTC.BBN": {
    id: "0xCC0966D8418d412c599A6421b760a847eB169A8c",
    name: "XSOLVBTC", // 应用映射：统一使用XSOLVBTC名称
    symbol: "XSOLVBTC", // 应用映射：统一使用XSOLVBTC符号
    decimals: 18,
    url: "https://sailor.finance/xSolvBTC.png",
    priceMapping: "BTC",
    isWhitelisted: true,
    isUSD: false,
  },
  XSOLVBTC: {
    id: "0xCC0966D8418d412c599A6421b760a847eB169A8c", // 与SOLVBTC.BBN相同地址
    name: "XSOLVBTC",
    symbol: "XSOLVBTC",
    decimals: 18,
    url: "https://sailor.finance/xSolvBTC.png",
    priceMapping: "BTC",
    isWhitelisted: true,
    isUSD: false,
  },
  UBTC: {
    id: "0x78E26E8b953C7c78A58d69d8B9A91745C2BbB258",
    name: "uBTC",
    symbol: "UBTC",
    decimals: 18,
    url: "https://www.geckoterminal.com/_next/image?url=https%3A%2F%2Fassets.geckoterminal.com%2Fjhsuvluz0eq3jq39k0aw8kth7pmm&w=64&q=75",
    priceMapping: "BTC",
    isWhitelisted: true,
    isUSD: false,
  },
  "USD₮0": {
    id: "0x9151434b16b9763660705744891fA906F660EcC5",
    name: "USDT", // 应用映射：原本是USD₮0，映射为USDT
    symbol: "USDT", // 应用映射：原本是USD₮0，映射为USDT
    decimals: 6,
    url: "https://raw.githubusercontent.com/Seitrace/sei-assetlist/main/images/usdt0.png",
    priceMapping: "USDT",
    isWhitelisted: true,
    isUSD: true,
  },
  FISHW: {
    id: "0x805679729Df385815C57c24B20f4161BD34B655f",
    name: "Fishwar",
    symbol: "FISHW",
    decimals: 18,
    url: "https://storage.googleapis.com/app-sailor/fishwar.png",
    priceMapping: "FISHW",
    isWhitelisted: true,
    isUSD: false,
  },
  MAD: {
    id: "0x0814f0476b6686630df19b7c86c3ec41ce8676c0",
    name: "MAD",
    symbol: "MAD",
    decimals: 18,
    url: "https://storage.googleapis.com/app-sailor/mad.jpg",
    priceMapping: "MAD",
    isWhitelisted: true,
    isUSD: false,
  },
  SPSEI: {
    id: "0xc257361320f4514d91c05f461006ce6a0300e2d2",
    name: "Splashing SEI",
    symbol: "SPSEI",
    decimals: 18,
    url: "https://raw.githubusercontent.com/Seitrace/sei-assetlist/main/images/spSEI.png",
    priceMapping: "SPSEI",
    isWhitelisted: true,
    isUSD: false,
  },
  CLO: {
    id: "0x81d3a238b02827f62b9f390f947d36d4a5bf89d2",
    name: "CLOVIS",
    symbol: "CLO",
    decimals: 18,
    url: "https://storage.googleapis.com/rs-ktx-test/11_CLO_Token_Icon.png",
    priceMapping: "SEI",
    isWhitelisted: true,
    isUSD: false,
  },
};

// 动态生成工具映射对象（仅在需要时使用）
function getTokenContract() {
  const contract = {};
  Object.values(TOKENS).forEach((token) => {
    contract[token.id.toLowerCase()] = token.priceMapping;
  });
  return contract;
}

function getWhiteTokenList() {
  return Object.entries(TOKENS)
    .filter(([_, config]) => config.isWhitelisted)
    .map(([symbol, _]) => symbol);
}

function getUSDAddresses() {
  return Object.values(TOKENS)
    .filter((token) => token.isUSD)
    .map((token) => token.id.toLowerCase());
}

// 新增：根据符号获取完整代币信息的工具函数
function getTokenBySymbol(symbol) {
  return TOKENS[symbol] || null;
}

// 新增：根据地址获取完整代币信息的工具函数
function getTokenByAddress(address) {
  const lowerAddress = address?.toLowerCase();
  return (
    Object.values(TOKENS).find(
      (token) => token.id.toLowerCase() === lowerAddress
    ) || null
  );
}

// 新增：获取所有USD稳定币信息
function getUSDTokens() {
  return Object.values(TOKENS).filter((token) => token.isUSD);
}

// 新增：获取所有白名单代币信息
function getWhitelistedTokens() {
  return Object.values(TOKENS).filter((token) => token.isWhitelisted);
}

module.exports = {
  // 主要配置
  subgraphUrl,
  TOKENS, // 统一配置对象

  // 工具函数
  getTokenBySymbol,
  getTokenByAddress,
  getUSDTokens,
  getWhitelistedTokens,
  getTokenContract,
  getWhiteTokenList,
  getUSDAddresses,
};

