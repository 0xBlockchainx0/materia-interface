import { ChainId, JSBI, Percent, Token, IETH } from '@materia-dex/sdk'
import { AbstractConnector } from '@web3-react/abstract-connector'

import { fortmatic, injected, portis, walletconnect, walletlink } from '../connectors'

export const FACTORY_ADDRESS = '0xeF663993b89aD5eDFdF77E2f7b97CD18d2A497e4'
export const ORCHESTRATOR_ADDRESS = '0x304fe8c33D057581d1ff550c2E7b79Dc697eD286'
// export const ORCHESTRATOR_ADDRESS = '0x0bae0744F6D7C8137fB4D727fdfeE91c1B4eed44'
export const MATERIA_DFO_ADDRESS = '0x2272f81205db240f6fCbC87ace0A5F1Cf7E49E5A'
export const TIMELOCK_ADDRESS = '0x1a9C8182C09F50C8318d769245beA52c32BE35BC'
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'
export const ETHEREUM_OBJECT_ID = '11027808402393750762873608378930398077418220124669629658698890017122249518391'

export const ETHITEM_ORCHESTRATOR_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '0x12329b2F9e52C5D3422D6E6C026AA9D5b00CC075',
  [ChainId.RINKEBY]: ZERO_ADDRESS,
  [ChainId.ROPSTEN]: '0xf785abac1b79ccb53052799d6b84d6299d47a05a',
  [ChainId.GÖRLI]: ZERO_ADDRESS,
  [ChainId.KOVAN]: ZERO_ADDRESS
}

export const ERC20WRAPPER: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '0xc4681b7f5206603715998daBAC4fa87c586Ad63D',
  [ChainId.RINKEBY]: ZERO_ADDRESS,
  [ChainId.ROPSTEN]: '0x651a6837457f1f7179a590dec647ec5d647b8231',
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
  [ChainId.MAINNET]: new Token(ChainId.MAINNET, ZERO_ADDRESS, 18, 'GIL', 'GIL'),
  [ChainId.RINKEBY]: new Token(ChainId.RINKEBY, ZERO_ADDRESS, 18, 'GIL', 'GIL'),
  // [ChainId.ROPSTEN]: new Token(ChainId.ROPSTEN, '0x1D4f770032A551D70c240D937a8e8cf19Ee37E7d', 18, 'GIL', 'GIL'),
  [ChainId.ROPSTEN]: new Token(ChainId.ROPSTEN, '0xa5a5f4ECD079e8C92d4D8Ec3AC7bFcD37B5e4ab2', 18, 'LIG', 'LIG'),
  [ChainId.GÖRLI]: new Token(ChainId.GÖRLI, ZERO_ADDRESS, 18, 'GIL', 'GIL'),
  [ChainId.KOVAN]: new Token(ChainId.KOVAN, ZERO_ADDRESS, 18, 'GIL', 'GIL')
}

export const USD: { [chainId in ChainId]: Token } = {
  [ChainId.MAINNET]: new Token(ChainId.MAINNET, '0x44086035439E676c02D411880FcCb9837CE37c57', 18, 'uSD', 'unified Stable Dollar'),
  [ChainId.RINKEBY]: new Token(ChainId.RINKEBY, ZERO_ADDRESS, 18, 'uSD', 'unified Stable Dollar'),
  [ChainId.ROPSTEN]: new Token(ChainId.ROPSTEN, '0x3CF9679b78075054093E04bB27758A0b25c2BdBc', 18, 'PIT', 'Pitfall'),
  [ChainId.GÖRLI]: new Token(ChainId.GÖRLI, ZERO_ADDRESS, 18, 'uSD', 'unified Stable Dollar'),
  [ChainId.KOVAN]: new Token(ChainId.KOVAN, ZERO_ADDRESS, 18, 'uSD', 'unified Stable Dollar'),
}

export const WBTC: { [chainId in ChainId]: Token } = {
  [ChainId.MAINNET]: new Token(ChainId.MAINNET, '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599', 8, 'WBTC', 'Wrapped BTC'),
  [ChainId.RINKEBY]: new Token(ChainId.RINKEBY, ZERO_ADDRESS, 8, 'WBTC', 'Wrapped BTC'),
  [ChainId.ROPSTEN]: new Token(ChainId.ROPSTEN, '0x65058d7081fcdc3cd8727dbb7f8f9d52cefdd291', 8, 'WBTC', 'Wrapped BTC'),
  [ChainId.GÖRLI]: new Token(ChainId.GÖRLI, ZERO_ADDRESS, 8, 'WBTC', 'Wrapped BTC'),
  [ChainId.KOVAN]: new Token(ChainId.KOVAN, ZERO_ADDRESS, 8, 'WBTC', 'Wrapped BTC'),
}

export const DAI = new Token(ChainId.MAINNET, '0x6B175474E89094C44Da98b954EedeAC495271d0F', 18, 'DAI', 'Dai Stablecoin')
export const USDC = new Token(ChainId.MAINNET, '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 6, 'USDC', 'USD//C')
export const USDT = new Token(ChainId.MAINNET, '0xdAC17F958D2ee523a2206206994597C13D831ec7', 6, 'USDT', 'Tether USD')
export const COMP = new Token(ChainId.MAINNET, '0xc00e94Cb662C3520282E6f5717214004A7f26888', 18, 'COMP', 'Compound')
export const MKR = new Token(ChainId.MAINNET, '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2', 18, 'MKR', 'Maker')
export const AMPL = new Token(ChainId.MAINNET, '0xD46bA6D942050d489DBd938a2C909A5d5039A161', 9, 'AMPL', 'Ampleforth')

export const COMMON_CONTRACT_NAMES: { [address: string]: string } = {
  [TIMELOCK_ADDRESS]: 'Timelock',
  [GIL[ChainId.MAINNET].address]: 'GIL',
  [GIL[ChainId.ROPSTEN].address]: 'GIL'
}

// TODO: specify merkle distributor for mainnet
export const MERKLE_DISTRIBUTOR_ADDRESS: { [chainId in ChainId]?: string } = {
  [ChainId.MAINNET]: '0x090D4613473dEE047c3f2706764f49E0821D256e'
}

const USD_ONLY: ChainTokenList = {
  [ChainId.MAINNET]: [USD[ChainId.MAINNET]],
  [ChainId.ROPSTEN]: [USD[ChainId.ROPSTEN]],
  [ChainId.RINKEBY]: [USD[ChainId.RINKEBY]],
  [ChainId.GÖRLI]: [USD[ChainId.GÖRLI]],
  [ChainId.KOVAN]: [USD[ChainId.KOVAN]]
}

// used to construct intermediary pairs for trading
export const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList = {
  ...USD_ONLY,
  [ChainId.MAINNET]: [...USD_ONLY[ChainId.MAINNET]],
  [ChainId.ROPSTEN]: [...USD_ONLY[ChainId.ROPSTEN]]
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
  ...USD_ONLY,
  [ChainId.MAINNET]: [...USD_ONLY[ChainId.MAINNET]],
  [ChainId.ROPSTEN]: [...USD_ONLY[ChainId.ROPSTEN]]
}

// used to construct the list of all pairs we consider by default in the frontend
export const BASES_TO_TRACK_LIQUIDITY_FOR: ChainTokenList = {
  ...USD_ONLY,
  [ChainId.MAINNET]: [...USD_ONLY[ChainId.MAINNET]],
  [ChainId.ROPSTEN]: [...USD_ONLY[ChainId.ROPSTEN]]
}

export const PINNED_PAIRS: { readonly [chainId in ChainId]?: [Token, Token][] } = {
  [ChainId.MAINNET]: [
    [IETH[ChainId.MAINNET], USD[ChainId.MAINNET]]
  ],
  [ChainId.ROPSTEN]: [
    [IETH[ChainId.ROPSTEN], USD[ChainId.ROPSTEN]]
  ],
  [ChainId.RINKEBY]: [
    [IETH[ChainId.RINKEBY], USD[ChainId.RINKEBY]]
  ],
  [ChainId.GÖRLI]: [
    [IETH[ChainId.GÖRLI], USD[ChainId.GÖRLI]]
  ],
  [ChainId.KOVAN]: [
    [IETH[ChainId.KOVAN], USD[ChainId.KOVAN]]
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
