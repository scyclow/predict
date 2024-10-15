

// PredictBase: 0x5FbDB2315678afecb367f032d93F642f64180aa3
// ONE: 0xa16E02E87b7454126E5E10d957A927A7F5B5d2be
// TWO: 0xB7A5bd0345EF1Cc5E66bf61BdeC17D2461fBd968
// THREE: 0xeEBe00Ac0756308ac4AaBfD76c05c4F3088B8883
// FOUR: 0x10C6E9530F1C1AF873a391030a1D9E8ed0630D26
// FIVE: 0x603E1BD79259EbcbAaeD0c83eeC09cA0B89a5bcC
const erc20ABI = [
  'function balanceOf(address) external view returns (uint256)',
]

export const CONTRACTS = {
  PredictTheNumber: {
    addr: {
      local: '0xa16E02E87b7454126E5E10d957A927A7F5B5d2be',
      baseSepolia: '0xe388bA235D3D9ac88Ee0fAD2737e7B8accEE589D',
      sepolia: '0xad8f8791e5b92E2deFfB1fb32be65f2aCAf97c83',
      base: ''
    },
    abi: [
      'function create() external payable',
      'function redeem(uint256) external payable',
      'function PRIZE_PER_COIN() external view returns (uint256)',
      ...erc20ABI,
    ]
  },
  ONE: {
    addr: {
      local: '0xa16E02E87b7454126E5E10d957A927A7F5B5d2be',
      baseSepolia: '0xd84e962F09683C4aba4e3272ec31ec68e18be217',
      sepolia: '0x0e14e1b0f55860809251F9745A867037F4F8B40d',
      base: ''
    },
    abi: erc20ABI,
  },
  TWO: {
    addr: {
      local: '0xB7A5bd0345EF1Cc5E66bf61BdeC17D2461fBd968',
      baseSepolia: '0xAe396e3eA9E7Cc121e041AF459f88B83c8D90D9D',
      sepolia: '0x2b3B0D8B32B0BA527A3406F8F5401de208Ae1A0f',
      base: ''
    },
    abi: erc20ABI,
  },
  THREE: {
    addr: {
      local: '0xeEBe00Ac0756308ac4AaBfD76c05c4F3088B8883',
      baseSepolia: '0x85D91b39c27C7aaeE449eB15871aBd80f6521a5E',
      sepolia: '0x463A9160B6E5Df60883604bC91A6e9dCB7729dE0',
      base: ''
    },
    abi: erc20ABI,
  },
  FOUR: {
    addr: {
      local: '0x10C6E9530F1C1AF873a391030a1D9E8ed0630D26',
      baseSepolia: '0x0F5702c37BF04a6dCC2820f5F3dbb1Ba056659b7',
      sepolia: '0x2BcF593823E1f0d7903cBF06cF8265EbC262B660',
      base: ''
    },
    abi: erc20ABI,
  },
  FIVE: {
    addr: {
      local: '0x603E1BD79259EbcbAaeD0c83eeC09cA0B89a5bcC',
      baseSepolia: '0x5AC3328014D0C82Cff5504E5b0671a5641005bEF',
      sepolia: '0xE4641Fe831Ae0274f264bA01070B7abb7FA7010B',
      base: ''
    },
    abi: erc20ABI,
  },
  // UNISWAP_V2: {
  //   addr: {
  //     mainnet: '0xFa7c69169ec5fF252be24bF0fF7B356dAe9aDeDA'
  //   },
  //   abi: [
  //     'function getReserves() external view returns (uint112 etfReserve, uint112 ethReserve, uint32 _blockTimestampLast)'
  //   ]
  // }
}

  // async function getEthUsd(uniswapV2) {
  //   const decimals = 2
  //   const { _reserve0, _reserve1 } = await uniswapV2.getReserves()
  //   return _reserve0.mul(1000000000000).mul(10**decimals).div(_reserve1).toNumber() / 10**decimals
  // }