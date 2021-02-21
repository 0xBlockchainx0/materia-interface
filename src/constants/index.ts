import { ChainId, JSBI, Percent, Token, IETH } from '@materia-dex/sdk'
import { AbstractConnector } from '@web3-react/abstract-connector'

import { fortmatic, injected, portis, walletconnect, walletlink } from '../connectors'

export const FACTORY_ADDRESS = '0x79B79A0B356a882F32Fc105E0222EF698fa9aE6A'
export const ORCHESTRATOR_ADDRESS = '0x53C57Ab46d88992e26A5fdc3208AaE0b4221BA16'
export const MATERIA_DFO_ADDRESS = '0xf056aE03Cf991e4587Da458B2c85e9a353684B3a'
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'
export const ETHEREUM_OBJECT_ID = '11027808402393750762873608378930398077418220124669629658698890017122249518391'

export const ERC20WRAPPER: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '0xC46abE9805c54107114e04bdb30F189434ccE2d3',
  [ChainId.RINKEBY]: ZERO_ADDRESS,
  [ChainId.ROPSTEN]: '0x6ba2091f1f415867b02cCAD07876960e3aE926c2',
  [ChainId.GÖRLI]: ZERO_ADDRESS,
  [ChainId.KOVAN]: ZERO_ADDRESS
}

export const ETHITEM_START_BLOCK: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '11092976',
  [ChainId.RINKEBY]: '',
  [ChainId.ROPSTEN]: '8900000',
  [ChainId.GÖRLI]: '',
  [ChainId.KOVAN]: ''
}

// a list of tokens by chain
type ChainTokenList = {
  readonly [chainId in ChainId]: Token[]
}

export const GIL: { [chainId in ChainId]: Token } = {
  [ChainId.MAINNET]: new Token(ChainId.MAINNET, '0x020810D775fC019480CD56ECb960389d3477039D', 18, 'GIL', 'Materia'),
  [ChainId.RINKEBY]: new Token(ChainId.RINKEBY, ZERO_ADDRESS, 18, 'GIL', 'Materia'),
  [ChainId.ROPSTEN]: new Token(ChainId.ROPSTEN, '0xa5a5f4ECD079e8C92d4D8Ec3AC7bFcD37B5e4ab2', 18, 'LIG', 'Materia'),
  [ChainId.GÖRLI]: new Token(ChainId.GÖRLI, ZERO_ADDRESS, 18, 'GIL', 'Materia'),
  [ChainId.KOVAN]: new Token(ChainId.KOVAN, ZERO_ADDRESS, 18, 'GIL', 'Materia')
}

export const WUSD: { [chainId in ChainId]: Token } = {
  [ChainId.MAINNET]: new Token(ChainId.MAINNET, '0x7C974104DF9dd7fb91205ab3D66d15AFf1049DE8', 18, 'WUSD', 'Wrapped USD'),
  [ChainId.RINKEBY]: new Token(ChainId.RINKEBY, ZERO_ADDRESS, 18, 'WUSD', 'Wrapped USD'),
  [ChainId.ROPSTEN]: new Token(ChainId.ROPSTEN, '0x3CF9679b78075054093E04bB27758A0b25c2BdBc', 18, 'PIT', 'Pitfall'),
  [ChainId.GÖRLI]: new Token(ChainId.GÖRLI, ZERO_ADDRESS, 18, 'WUSD', 'Wrapped USD'),
  [ChainId.KOVAN]: new Token(ChainId.KOVAN, ZERO_ADDRESS, 18, 'WUSD', 'Wrapped USD'),
}

export const WBTC: { [chainId in ChainId]: Token } = {
  [ChainId.MAINNET]: new Token(ChainId.MAINNET, '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599', 8, 'WBTC', 'Wrapped BTC'),
  [ChainId.RINKEBY]: new Token(ChainId.RINKEBY, ZERO_ADDRESS, 8, 'WBTC', 'Wrapped BTC'),
  [ChainId.ROPSTEN]: new Token(ChainId.ROPSTEN, '0x65058d7081fcdc3cd8727dbb7f8f9d52cefdd291', 8, 'WBTC', 'Wrapped BTC'),
  [ChainId.GÖRLI]: new Token(ChainId.GÖRLI, ZERO_ADDRESS, 8, 'WBTC', 'Wrapped BTC'),
  [ChainId.KOVAN]: new Token(ChainId.KOVAN, ZERO_ADDRESS, 8, 'WBTC', 'Wrapped BTC'),
}

export const DAI = new Token(ChainId.MAINNET, '0x6B175474E89094C44Da98b954EedeAC495271d0F', 18, 'DAI', 'Dai Stablecoin')
export const USDC = new Token(ChainId.MAINNET, '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 6, 'USDC', 'WUSD//C')
export const USDT = new Token(ChainId.MAINNET, '0xdAC17F958D2ee523a2206206994597C13D831ec7', 6, 'USDT', 'Tether WUSD')
export const COMP = new Token(ChainId.MAINNET, '0xc00e94Cb662C3520282E6f5717214004A7f26888', 18, 'COMP', 'Compound')
export const MKR = new Token(ChainId.MAINNET, '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2', 18, 'MKR', 'Maker')
export const AMPL = new Token(ChainId.MAINNET, '0xD46bA6D942050d489DBd938a2C909A5d5039A161', 9, 'AMPL', 'Ampleforth')

// EthItems
export const IGIL: { [chainId in ChainId]: Token } = {
  [ChainId.MAINNET]: new Token(ChainId.MAINNET, ZERO_ADDRESS, 18, 'IGIL', 'MateriaItem'),
  [ChainId.RINKEBY]: new Token(ChainId.RINKEBY, ZERO_ADDRESS, 18, 'IGIL', 'MateriaItem'),
  [ChainId.ROPSTEN]: new Token(ChainId.ROPSTEN, '0xf2a16989b81898e5952a13714ae0d3dd81b346bd', 18, 'ILIG', 'MateriaItem'),
  [ChainId.GÖRLI]: new Token(ChainId.GÖRLI, ZERO_ADDRESS, 18, 'IGIL', 'MateriaItem'),
  [ChainId.KOVAN]: new Token(ChainId.KOVAN, ZERO_ADDRESS, 18, 'IGIL', 'MateriaItem')
}

export const IUSDC: { [chainId in ChainId]: Token } = {
  [ChainId.MAINNET]: new Token(ChainId.MAINNET, ZERO_ADDRESS, 18, 'IUSDC', 'USD CoinItem'),
  [ChainId.RINKEBY]: new Token(ChainId.RINKEBY, ZERO_ADDRESS, 18, 'IUSDC', 'USD CoinItem'),
  [ChainId.ROPSTEN]: new Token(ChainId.ROPSTEN, ZERO_ADDRESS, 18, 'IUSDC', 'USD CoinItem'),
  [ChainId.GÖRLI]: new Token(ChainId.GÖRLI, ZERO_ADDRESS, 18, 'IUSDC', 'USD CoinItem'),
  [ChainId.KOVAN]: new Token(ChainId.KOVAN, ZERO_ADDRESS, 18, 'IUSDC', 'USD CoinItem')
}

export const IDAI: { [chainId in ChainId]: Token } = {
  [ChainId.MAINNET]: new Token(ChainId.MAINNET, ZERO_ADDRESS, 18, 'IDAI', 'Dai StablecoinItem'),
  [ChainId.RINKEBY]: new Token(ChainId.RINKEBY, ZERO_ADDRESS, 18, 'IDAI', 'Dai StablecoinItem'),
  [ChainId.ROPSTEN]: new Token(ChainId.ROPSTEN, ZERO_ADDRESS, 18, 'IDAI', 'Dai StablecoinItem'),
  [ChainId.GÖRLI]: new Token(ChainId.GÖRLI, ZERO_ADDRESS, 18, 'IDAI', 'Dai StablecoinItem'),
  [ChainId.KOVAN]: new Token(ChainId.KOVAN, ZERO_ADDRESS, 18, 'IDAI', 'Dai StablecoinItem')
}

export const IWBTC: { [chainId in ChainId]: Token } = {
  [ChainId.MAINNET]: new Token(ChainId.MAINNET, ZERO_ADDRESS, 18, 'IWBTC', 'Wrapped BTCItem'),
  [ChainId.RINKEBY]: new Token(ChainId.RINKEBY, ZERO_ADDRESS, 18, 'IWBTC', 'Wrapped BTCItem'),
  [ChainId.ROPSTEN]: new Token(ChainId.ROPSTEN, ZERO_ADDRESS, 18, 'IWBTC', 'Wrapped BTCItem'),
  [ChainId.GÖRLI]: new Token(ChainId.GÖRLI, ZERO_ADDRESS, 18, 'IWBTC', 'Wrapped BTCItem'),
  [ChainId.KOVAN]: new Token(ChainId.KOVAN, ZERO_ADDRESS, 18, 'IWBTC', 'Wrapped BTCItem')
}

export const MERKLE_DISTRIBUTOR_ADDRESS: { [chainId in ChainId]?: string } = {
  [ChainId.MAINNET]: ZERO_ADDRESS,
  [ChainId.ROPSTEN]: '0x2Bc31241b68D68863730d1dDC680217c682c1dc0',
}

const WUSD_ONLY: ChainTokenList = {
  [ChainId.MAINNET]: [WUSD[ChainId.MAINNET]],
  [ChainId.ROPSTEN]: [WUSD[ChainId.ROPSTEN]],
  [ChainId.RINKEBY]: [WUSD[ChainId.RINKEBY]],
  [ChainId.GÖRLI]: [WUSD[ChainId.GÖRLI]],
  [ChainId.KOVAN]: [WUSD[ChainId.KOVAN]]
}

// used to construct intermediary pairs for trading
export const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList = {
  ...WUSD_ONLY,
  [ChainId.MAINNET]: [...WUSD_ONLY[ChainId.MAINNET]],
  [ChainId.ROPSTEN]: [...WUSD_ONLY[ChainId.ROPSTEN]]
}

/**
 * Some tokens can only be swapped via certain pairs, so we override the list of bases that are considered for these
 * tokens.
 */
export const CUSTOM_BASES: { [chainId in ChainId]?: { [tokenAddress: string]: Token[] } } = {
  [ChainId.MAINNET]: {
    [AMPL.address]: [DAI, IETH[ChainId.MAINNET]]
  }
}

// used for display in the default list when adding liquidity
export const SUGGESTED_BASES: ChainTokenList = {
  ...WUSD_ONLY,
  [ChainId.MAINNET]: [...WUSD_ONLY[ChainId.MAINNET]],
  [ChainId.ROPSTEN]: [...WUSD_ONLY[ChainId.ROPSTEN]]
}

// used to construct the list of all pairs we consider by default in the frontend
export const BASES_TO_TRACK_LIQUIDITY_FOR: ChainTokenList = {
  ...WUSD_ONLY,
  [ChainId.MAINNET]: [...WUSD_ONLY[ChainId.MAINNET]],
  [ChainId.ROPSTEN]: [...WUSD_ONLY[ChainId.ROPSTEN]]
}

export const PINNED_PAIRS: { readonly [chainId in ChainId]?: [Token, Token][] } = {
  [ChainId.MAINNET]: [
    [IETH[ChainId.MAINNET], WUSD[ChainId.MAINNET]]
  ],
  [ChainId.ROPSTEN]: [
    [IETH[ChainId.ROPSTEN], WUSD[ChainId.ROPSTEN]]
  ],
  [ChainId.RINKEBY]: [
    [IETH[ChainId.RINKEBY], WUSD[ChainId.RINKEBY]]
  ],
  [ChainId.GÖRLI]: [
    [IETH[ChainId.GÖRLI], WUSD[ChainId.GÖRLI]]
  ],
  [ChainId.KOVAN]: [
    [IETH[ChainId.KOVAN], WUSD[ChainId.KOVAN]]
  ]
}

export interface WalletInfo {
  connector?: AbstractConnector
  name: string
  iconName: string
  description: string
  href: string | null
  color: string
  primary?: true
  mobile?: true
  mobileOnly?: true
}

export const SUPPORTED_WALLETS: { [key: string]: WalletInfo } = {
  INJECTED: {
    connector: injected,
    name: 'Injected',
    iconName: 'arrow-right.svg',
    description: 'Injected web3 provider.',
    href: null,
    color: '#010101',
    primary: true
  },
  METAMASK: {
    connector: injected,
    name: 'MetaMask',
    iconName: 'metamask.png',
    description: 'Easy-to-use browser extension.',
    href: null,
    color: '#E8831D'
  },
  WALLET_CONNECT: {
    connector: walletconnect,
    name: 'WalletConnect',
    iconName: 'walletConnectIcon.svg',
    description: 'Connect to Trust Wallet, Rainbow Wallet and more...',
    href: null,
    color: '#4196FC',
    mobile: true
  },
  WALLET_LINK: {
    connector: walletlink,
    name: 'Coinbase Wallet',
    iconName: 'coinbaseWalletIcon.svg',
    description: 'Use Coinbase Wallet app on mobile device',
    href: null,
    color: '#315CF5'
  },
  COINBASE_LINK: {
    name: 'Open in Coinbase Wallet',
    iconName: 'coinbaseWalletIcon.svg',
    description: 'Open in Coinbase Wallet app.',
    href: 'https://go.cb-w.com/mtUDhEZPy1',
    color: '#315CF5',
    mobile: true,
    mobileOnly: true
  },
  FORTMATIC: {
    connector: fortmatic,
    name: 'Fortmatic',
    iconName: 'fortmaticIcon.png',
    description: 'Login using Fortmatic hosted wallet',
    href: null,
    color: '#6748FF',
    mobile: true
  },
  Portis: {
    connector: portis,
    name: 'Portis',
    iconName: 'portisIcon.png',
    description: 'Login using Portis hosted wallet',
    href: null,
    color: '#4A6C9B',
    mobile: true
  }
}

export const NetworkContextName = 'NETWORK'

// default allowed slippage, in bips
export const INITIAL_ALLOWED_SLIPPAGE = 50
// 20 minutes, denominated in seconds
export const DEFAULT_DEADLINE_FROM_NOW = 60 * 20

export const BIG_INT_ZERO = JSBI.BigInt(0)

// one basis point
export const ONE_BIPS = new Percent(JSBI.BigInt(1), JSBI.BigInt(10000))
export const BIPS_BASE = JSBI.BigInt(10000)
// used for warning states
export const ALLOWED_PRICE_IMPACT_LOW: Percent = new Percent(JSBI.BigInt(100), BIPS_BASE) // 1%
export const ALLOWED_PRICE_IMPACT_MEDIUM: Percent = new Percent(JSBI.BigInt(300), BIPS_BASE) // 3%
export const ALLOWED_PRICE_IMPACT_HIGH: Percent = new Percent(JSBI.BigInt(500), BIPS_BASE) // 5%
// if the price slippage exceeds this number, force the user to type 'confirm' to execute
export const PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN: Percent = new Percent(JSBI.BigInt(1000), BIPS_BASE) // 10%
// for non expert mode disable swaps above this
export const BLOCKED_PRICE_IMPACT_NON_EXPERT: Percent = new Percent(JSBI.BigInt(1500), BIPS_BASE) // 15%

// used to ensure the user doesn't send so much ETH so they end up with <.01
export const MIN_ETH: JSBI = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(16)) // .01 ETH
export const BETTER_TRADE_LINK_THRESHOLD = new Percent(JSBI.BigInt(75), JSBI.BigInt(10000))
