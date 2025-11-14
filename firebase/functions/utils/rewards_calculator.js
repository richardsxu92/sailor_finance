let POOLS_WEEKS = [
  // 01-27 - 02-02
  {
    "0xeb873126235e8e19b88acf66ee6189f9fd48083c": { rewardAmount: 18910 }, // USDC-SEI 0.3%
    "0x64c4c35ca2a4c4014b8f8b9aa993e847e6cf9736": { rewardAmount: 7560 }, // WBTC-SEI 0.3%
    "0x28634b5703542037565b99ee8b6f0efbd864588d": { rewardAmount: 6570 }, // WETH-SEI 0.3%
  },
  // 02-03 - 02-09
  {
    "0xeb873126235e8e19b88acf66ee6189f9fd48083c": { rewardAmount: 44580 }, // USDC-SEI 0.3%
    "0x64c4c35ca2a4c4014b8f8b9aa993e847e6cf9736": { rewardAmount: 8040 }, // WBTC-SEI 0.3%
    "0x28634b5703542037565b99ee8b6f0efbd864588d": { rewardAmount: 7090 }, // WETH-SEI 0.3%
  },
  // ... 更多周数据
  {},
  {},
  {},
  {},
];
let BOOST_START_TIME;
let BOOST_END_TIME;
const BOOST_DURATION = 7; // days

function GetPools() {
  BOOST_START_TIME = 1737907200; // 2025-01-27 00:00:00 UTC+8
  let POOLS_INDEX = 0;
  while (
    BOOST_START_TIME + 7 * 24 * 3600 <
    Math.floor(new Date().getTime() / 1000)
  ) {
    BOOST_START_TIME += 7 * 24 * 3600;
    POOLS_INDEX++;
  }
  BOOST_END_TIME = Math.min(
    BOOST_START_TIME + BOOST_DURATION * 24 * 3600,
    Math.floor(new Date().getTime() / 1000)
  );
  return POOLS_WEEKS[POOLS_INDEX];
}

module.exports = { GetPools };

