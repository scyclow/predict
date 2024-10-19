

// PredictBase: 0x5FbDB2315678afecb367f032d93F642f64180aa3
// ONE: 0xa16E02E87b7454126E5E10d957A927A7F5B5d2be
// TWO: 0xB7A5bd0345EF1Cc5E66bf61BdeC17D2461fBd968
// THREE: 0xeEBe00Ac0756308ac4AaBfD76c05c4F3088B8883
// FOUR: 0x10C6E9530F1C1AF873a391030a1D9E8ed0630D26
// FIVE: 0x603E1BD79259EbcbAaeD0c83eeC09cA0B89a5bcC
const erc20ABI = [
  'function balanceOf(address) external view returns (uint256)',
]
const uniswapV3 = [
  'function swap(address recipient, bool zeroForOne, int256 amountSpecified, uint160 sqrtPriceLimitX96, bytes calldata data) external returns (int256 amount0, int256 amount1)'
]

export const CONTRACTS = {
  PredictTheNumber: {
    addr: {
      local: '0xa16E02E87b7454126E5E10d957A927A7F5B5d2be',
      sepolia: '0x63530Ded5A86C5c8782DEB83592F3396a74fD0a2',
      base: ''
      // baseSepolia: '0xe388bA235D3D9ac88Ee0fAD2737e7B8accEE589D',
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
      sepolia: '0xc3766FF02501b110D244ff0f4e78181640884F63',
      base: ''
      // baseSepolia: '0xd84e962F09683C4aba4e3272ec31ec68e18be217',
    },
    abi: erc20ABI,
  },

  TWO: {
    addr: {
      local: '0xB7A5bd0345EF1Cc5E66bf61BdeC17D2461fBd968',
      sepolia: '0x202bE85361c9b18133fF52e920dBDBC1C2825Aa0',
      base: ''
      // baseSepolia: '0xAe396e3eA9E7Cc121e041AF459f88B83c8D90D9D',
    },
    abi: erc20ABI,
  },

  THREE: {
    addr: {
      local: '0xeEBe00Ac0756308ac4AaBfD76c05c4F3088B8883',
      sepolia: '0xe88D053c7dc514F87a310797A2Ff28AF565DBb8C',
      base: ''
      // baseSepolia: '0x85D91b39c27C7aaeE449eB15871aBd80f6521a5E',
    },
    abi: erc20ABI,
  },

  FOUR: {
    addr: {
      local: '0x10C6E9530F1C1AF873a391030a1D9E8ed0630D26',
      sepolia: '0xd53764c74FD23dFe118E9a095e17A7B297d932fe',
      base: ''
      // baseSepolia: '0x0F5702c37BF04a6dCC2820f5F3dbb1Ba056659b7',
    },
    abi: erc20ABI,
  },

  FIVE: {
    addr: {
      local: '0x603E1BD79259EbcbAaeD0c83eeC09cA0B89a5bcC',
      sepolia: '0x5899d8e5b15909d1dcD7e6ef9403D2807828E5c4',
      base: ''
      // baseSepolia: '0x5AC3328014D0C82Cff5504E5b0671a5641005bEF',
    },
    abi: erc20ABI,
  },


  WETH: {
    addr: {
      local: '',
      sepolia: '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14',
      base: ''
      // baseSepolia: '',
    },
    abi: erc20ABI,
  },


  ONE_POOL: {
    addr: {
      local: '',
      sepolia: '0x539F5525AC3c0a2430281e1D6956650B66582C49',
      base: ''
      // baseSepolia: '',
    },
    abi: [],
  },
  TWO_POOL: {
    addr: {
      local: '',
      // TODO ->
      sepolia: '0x4e8294E1F045399f717E8bcDB5291E3352EaDF7C',
      base: ''
      // baseSepolia: '',
    },
    abi: [],
  },
  THREE_POOL: {
    addr: {
      local: '',
      // TODO ->
      sepolia: '0xad0612911725eB907DCa69d37BF77348c2E10E93',
      base: ''
      // baseSepolia: '',
    },
    abi: [],
  },
  FOUR_POOL: {
    addr: {
      local: '',
      // TODO ->
      sepolia: '0xb3e2B29ee742b09e3f61551f78876d41cDd769c5',
      base: ''
      // baseSepolia: '',
    },
    abi: [],
  },
  FIVE_POOL: {
    addr: {
      local: '',
      // TODO ->
      sepolia: '0xD344EfDa0553cfcD4049fc4Cde7ACF0e0FeAAc6a',
      base: ''
      // baseSepolia: '',
    },
    abi: [],
  },
  PREDICT_POOL: {
    addr: {
      local: '',
      // TODO ->
      sepolia: '0x9EecF47AFB6A3aC22B86F71E53E650Aa74b1F358',
      base: ''
      // baseSepolia: '',
    },
    abi: [],
  },
}

  // async function getEthUsd(uniswapV2) {
  //   const decimals = 2
  //   const { _reserve0, _reserve1 } = await uniswapV2.getReserves()
  //   return _reserve0.mul(1000000000000).mul(10**decimals).div(_reserve1).toNumber() / 10**decimals
  // }