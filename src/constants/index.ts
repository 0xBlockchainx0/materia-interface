import { ChainId, JSBI, Percent, Token, IETH } from '@materia-dex/sdk'
import { WETH } from '@uniswap/sdk'

import { AbstractConnector } from '@web3-react/abstract-connector'

import { fortmatic, injected, portis, walletconnect, walletlink } from '../connectors'

export const FACTORY_ADDRESS = '0xB498a69fF7b9a73C58491d564Fc6a462b259c860'
export const ORCHESTRATOR_ADDRESS = '0xB0F720Baa5BD1715897d4790A59f5c7aa1377D79'
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
  [ChainId.ROPSTEN]: new Token(ChainId.ROPSTEN, '0x1D4f770032A551D70c240D937a8e8cf19Ee37E7d', 18, 'GIL', 'Materia'),
  [ChainId.GÖRLI]: new Token(ChainId.GÖRLI, ZERO_ADDRESS, 18, 'GIL', 'Materia'),
  [ChainId.KOVAN]: new Token(ChainId.KOVAN, ZERO_ADDRESS, 18, 'GIL', 'Materia')
}

export const WUSD: { [chainId in ChainId]: Token } = {
  [ChainId.MAINNET]: new Token(
    ChainId.MAINNET,
    '0x7C974104DF9dd7fb91205ab3D66d15AFf1049DE8',
    18,
    'WUSD',
    'Wrapped USD'
  ),
  [ChainId.RINKEBY]: new Token(ChainId.RINKEBY, ZERO_ADDRESS, 18, 'WUSD', 'Wrapped USD'),
  [ChainId.ROPSTEN]: new Token(ChainId.ROPSTEN, '0x3CF9679b78075054093E04bB27758A0b25c2BdBc', 18, 'PIT', 'Pitfall'),
  [ChainId.GÖRLI]: new Token(ChainId.GÖRLI, ZERO_ADDRESS, 18, 'WUSD', 'Wrapped USD'),
  [ChainId.KOVAN]: new Token(ChainId.KOVAN, ZERO_ADDRESS, 18, 'WUSD', 'Wrapped USD')
}

export const WBTC: { [chainId in ChainId]: Token } = {
  [ChainId.MAINNET]: new Token(ChainId.MAINNET, '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599', 8, 'WBTC', 'Wrapped BTC'),
  [ChainId.RINKEBY]: new Token(ChainId.RINKEBY, ZERO_ADDRESS, 8, 'WBTC', 'Wrapped BTC'),
  [ChainId.ROPSTEN]: new Token(ChainId.ROPSTEN, '0x65058d7081fcdc3cd8727dbb7f8f9d52cefdd291', 8, 'WBTC', 'Wrapped BTC'),
  [ChainId.GÖRLI]: new Token(ChainId.GÖRLI, ZERO_ADDRESS, 8, 'WBTC', 'Wrapped BTC'),
  [ChainId.KOVAN]: new Token(ChainId.KOVAN, ZERO_ADDRESS, 8, 'WBTC', 'Wrapped BTC')
}

export const DAI = new Token(ChainId.MAINNET, '0x6B175474E89094C44Da98b954EedeAC495271d0F', 18, 'DAI', 'Dai Stablecoin')
export const USDC = new Token(ChainId.MAINNET, '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 6, 'USDC', 'WUSD//C')
export const USDT = new Token(ChainId.MAINNET, '0xdAC17F958D2ee523a2206206994597C13D831ec7', 6, 'USDT', 'Tether WUSD')
export const COMP = new Token(ChainId.MAINNET, '0xc00e94Cb662C3520282E6f5717214004A7f26888', 18, 'COMP', 'Compound')
export const MKR = new Token(ChainId.MAINNET, '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2', 18, 'MKR', 'Maker')
export const AMPL = new Token(ChainId.MAINNET, '0xD46bA6D942050d489DBd938a2C909A5d5039A161', 9, 'AMPL', 'Ampleforth')

// EthItems
export const IGIL: { [chainId in ChainId]: Token } = {
  [ChainId.MAINNET]: new Token(
    ChainId.MAINNET,
    '0xE51a7641A2D62119458B38e074367D9bFA8a3916',
    18,
    'iGIL',
    'Materia item'
  ),
  [ChainId.RINKEBY]: new Token(ChainId.RINKEBY, ZERO_ADDRESS, 18, 'iGIL', 'Materia item'),
  [ChainId.ROPSTEN]: new Token(
    ChainId.ROPSTEN,
    '0x2E78e06859476359967a222eb5fB51A5b0C95e8C',
    18,
    'iGIL',
    'Materia item'
  ),
  [ChainId.GÖRLI]: new Token(ChainId.GÖRLI, ZERO_ADDRESS, 18, 'iGIL', 'Materia item'),
  [ChainId.KOVAN]: new Token(ChainId.KOVAN, ZERO_ADDRESS, 18, 'iGIL', 'Materia item')
}

export const IUSDC: { [chainId in ChainId]: Token } = {
  [ChainId.MAINNET]: new Token(
    ChainId.MAINNET,
    '0x7a3428F1CBA2756aB9a6D672311ca6C8DcE65C6B',
    18,
    'iUSDC',
    'USD Coin item'
  ),
  [ChainId.RINKEBY]: new Token(ChainId.RINKEBY, ZERO_ADDRESS, 18, 'iUSDC', 'USD Coin item'),
  [ChainId.ROPSTEN]: new Token(
    ChainId.ROPSTEN,
    '0xCE34847810703C5FD47b23327c1B8dAD6413B1A9',
    18,
    'iUSDC',
    'USD Coin item'
  ),
  [ChainId.GÖRLI]: new Token(ChainId.GÖRLI, ZERO_ADDRESS, 18, 'iUSDC', 'USD Coin item'),
  [ChainId.KOVAN]: new Token(ChainId.KOVAN, ZERO_ADDRESS, 18, 'iUSDC', 'USD Coin item')
}

export const IDAI: { [chainId in ChainId]: Token } = {
  [ChainId.MAINNET]: new Token(
    ChainId.MAINNET,
    '0x4d69a1d482ff9b89600c1DD9e535538957Cd8E29',
    18,
    'iDAI',
    'Dai Stablecoin item'
  ),
  [ChainId.RINKEBY]: new Token(ChainId.RINKEBY, ZERO_ADDRESS, 18, 'iDAI', 'Dai Stablecoin item'),
  [ChainId.ROPSTEN]: new Token(
    ChainId.ROPSTEN,
    '0x25E4ac6a9ADba26eFb3aDE755aC33A7C85552F0f',
    18,
    'iDAI',
    'Dai Stablecoin item'
  ),
  [ChainId.GÖRLI]: new Token(ChainId.GÖRLI, ZERO_ADDRESS, 18, 'iDAI', 'Dai Stablecoin item'),
  [ChainId.KOVAN]: new Token(ChainId.KOVAN, ZERO_ADDRESS, 18, 'iDAI', 'Dai Stablecoin item')
}

export const IWBTC: { [chainId in ChainId]: Token } = {
  [ChainId.MAINNET]: new Token(
    ChainId.MAINNET,
    '0x4FA2d28cEc65f86A843Bd1806Dc88930554b6756',
    18,
    'iWBTC',
    'Wrapped BTC item'
  ),
  [ChainId.RINKEBY]: new Token(ChainId.RINKEBY, ZERO_ADDRESS, 18, 'iWBTC', 'Wrapped BTC item'),
  [ChainId.ROPSTEN]: new Token(
    ChainId.ROPSTEN,
    '0x0419b5c078cdf1cac30051ae1a84e20b3642c9a3',
    18,
    'iWBTC',
    'Wrapped BTC item'
  ),
  [ChainId.GÖRLI]: new Token(ChainId.GÖRLI, ZERO_ADDRESS, 18, 'iWBTC', 'Wrapped BTC item'),
  [ChainId.KOVAN]: new Token(ChainId.KOVAN, ZERO_ADDRESS, 18, 'iWBTC', 'Wrapped BTC item')
}

export const MERKLE_DISTRIBUTOR_ADDRESS: { [chainId in ChainId]?: string } = {
  [ChainId.MAINNET]: '0x0e31Da738c6B429436735243D9A1737387521F37',
  [ChainId.ROPSTEN]: '0x0e31Da738c6B429436735243D9A1737387521F37'
}

const WUSD_ONLY: ChainTokenList = {
  [ChainId.MAINNET]: [WUSD[ChainId.MAINNET]],
  [ChainId.ROPSTEN]: [WUSD[ChainId.ROPSTEN]],
  [ChainId.RINKEBY]: [WUSD[ChainId.RINKEBY]],
  [ChainId.GÖRLI]: [WUSD[ChainId.GÖRLI]],
  [ChainId.KOVAN]: [WUSD[ChainId.KOVAN]]
}

const WETH_ONLY: ChainTokenList = {
  [ChainId.MAINNET]: [WETH[ChainId.MAINNET]],
  [ChainId.ROPSTEN]: [WETH[ChainId.ROPSTEN]],
  [ChainId.RINKEBY]: [WETH[ChainId.RINKEBY]],
  [ChainId.GÖRLI]: [WETH[ChainId.GÖRLI]],
  [ChainId.KOVAN]: [WETH[ChainId.KOVAN]]
}

// used to construct intermediary pairs for trading
export const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList = {
  ...WUSD_ONLY,
  [ChainId.MAINNET]: [...WUSD_ONLY[ChainId.MAINNET]],
  [ChainId.ROPSTEN]: [...WUSD_ONLY[ChainId.ROPSTEN]]
}

export const BASES_TO_CHECK_TRADES_AGAINST_UNISWAP: ChainTokenList = {
  ...WETH_ONLY,
  [ChainId.MAINNET]: [...WETH_ONLY[ChainId.MAINNET]],
  [ChainId.ROPSTEN]: [...WETH_ONLY[ChainId.ROPSTEN]],
  [ChainId.RINKEBY]: [...WETH_ONLY[ChainId.RINKEBY]],
  [ChainId.GÖRLI]: [...WETH_ONLY[ChainId.GÖRLI]],
  [ChainId.KOVAN]: [...WETH_ONLY[ChainId.KOVAN]]
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

export const CUSTOM_BASES_UNISWAP: { [chainId in ChainId]?: { [tokenAddress: string]: Token[] } } = {
  [ChainId.MAINNET]: {
    [AMPL.address]: [DAI, WETH[ChainId.MAINNET]]
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
  [ChainId.MAINNET]: [[IETH[ChainId.MAINNET], WUSD[ChainId.MAINNET]]],
  [ChainId.ROPSTEN]: [[IETH[ChainId.ROPSTEN], WUSD[ChainId.ROPSTEN]]],
  [ChainId.RINKEBY]: [[IETH[ChainId.RINKEBY], WUSD[ChainId.RINKEBY]]],
  [ChainId.GÖRLI]: [[IETH[ChainId.GÖRLI], WUSD[ChainId.GÖRLI]]],
  [ChainId.KOVAN]: [[IETH[ChainId.KOVAN], WUSD[ChainId.KOVAN]]]
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
  }
  // FORTMATIC: {
  //   connector: fortmatic,
  //   name: 'Fortmatic',
  //   iconName: 'fortmaticIcon.png',
  //   description: 'Login using Fortmatic hosted wallet',
  //   href: null,
  //   color: '#6748FF',
  //   mobile: true
  // },
  // Portis: {
  //   connector: portis,
  //   name: 'Portis',
  //   iconName: 'portisIcon.png',
  //   description: 'Login using Portis hosted wallet',
  //   href: null,
  //   color: '#4A6C9B',
  //   mobile: true
  // }
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

export const ZERO_HEX = '0x0'
export const ZERO_HEX_PERMIT = '0x0000000000000000000000000000000000000000000000000000000000000000'

export const MIN_BATCH_SWAP_OUTPUTS = 1
export const MAX_BATCH_SWAP_OUTPUTS = 10
export const MAX_BATCH_SWAP_OUTPUTS_FREE = 2
export const MIN_GIL_UNLOCK_FULL_BATCHSWAP = JSBI.BigInt(1000 * 10 ** 18)
export const MIN_IGIL_UNLOCK_FULL_BATCHSWAP = JSBI.BigInt(1000 * 10 ** 18)
export const MIN_GIL_UNLOCK_FULL_BATCHSWAP_TEXT = '1000'
export const MIN_IGIL_UNLOCK_FULL_BATCHSWAP_TEXT = '1000'

export const MATERIA_BATCH_SWAPPER_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '0x54c5aFB953a7AEbbf9F5D092Cd03e16Ef14De4aa',
  [ChainId.RINKEBY]: ZERO_ADDRESS,
  [ChainId.ROPSTEN]: '0x54c5aFB953a7AEbbf9F5D092Cd03e16Ef14De4aa',
  [ChainId.GÖRLI]: ZERO_ADDRESS,
  [ChainId.KOVAN]: ZERO_ADDRESS
}

export const DEX_BATCH_SWAPPER_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '0x69dEb16AAd308F9D760bf02F7F739d220fa81F54',
  [ChainId.RINKEBY]: ZERO_ADDRESS,
  [ChainId.ROPSTEN]: '0x69dEb16AAd308F9D760bf02F7F739d220fa81F54',
  [ChainId.GÖRLI]: ZERO_ADDRESS,
  [ChainId.KOVAN]: ZERO_ADDRESS
}

export const UNISWAP_V2_INIT_CODE_HASH = '0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f'

export const UNISWAP_V2_FACTORY_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
  [ChainId.RINKEBY]: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
  [ChainId.ROPSTEN]: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
  [ChainId.GÖRLI]: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
  [ChainId.KOVAN]: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f'
}

export const UNISWAP_V2_BRIDGE_TOKEN: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: WETH[ChainId.MAINNET].address,
  [ChainId.RINKEBY]: WETH[ChainId.RINKEBY].address,
  [ChainId.ROPSTEN]: WETH[ChainId.ROPSTEN].address,
  [ChainId.GÖRLI]: WETH[ChainId.GÖRLI].address,
  [ChainId.KOVAN]: WETH[ChainId.KOVAN].address
}
