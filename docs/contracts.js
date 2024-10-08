

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
  ETF: {
    addr: {
      local: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
      sepolia: '',
      base: ''
    },
    abi: [

    ],
  },
  ONE: {
    addr: {
      local: '0xa16E02E87b7454126E5E10d957A927A7F5B5d2be',
      sepolia: '',
      base: ''
    },
    abi: erc20ABI,
  },
  TWO: {
    addr: {
      local: '0xB7A5bd0345EF1Cc5E66bf61BdeC17D2461fBd968',
      sepolia: '',
      base: ''
    },
    abi: erc20ABI,
  },
  THREE: {
    addr: {
      local: '0xeEBe00Ac0756308ac4AaBfD76c05c4F3088B8883',
      sepolia: '',
      base: ''
    },
    abi: erc20ABI,
  },
  FOUR: {
    addr: {
      local: '0x10C6E9530F1C1AF873a391030a1D9E8ed0630D26',
      sepolia: '',
      base: ''
    },
    abi: erc20ABI,
  },
  FIVE: {
    addr: {
      local: '0x603E1BD79259EbcbAaeD0c83eeC09cA0B89a5bcC',
      sepolia: '',
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