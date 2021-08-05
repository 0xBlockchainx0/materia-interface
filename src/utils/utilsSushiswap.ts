import { Trade, Route, Pair, TradeType, ChainId, Currency, Token, TokenAmount, ETHER, IETH } from '@materia-dex/sdk'
import {
  Trade as SushiswapTrade,
  Route as SushiswapRoute,
  Pair as SushiswapPair,
  TradeType as SushiswapTradeType,
  ChainId as SushiswapChainId,
  Currency as SushiswapCurrency,
  CurrencyAmount as SushiswapCurrencyAmount,
  Token as SushiswapToken,
  TokenAmount as SushiswapTokenAmount,
  ETHER as SUSHISWAP_ETHER,
  WETH as SUSHISWAP_WETH
} from '@sushiswap/sdk'

export function wrappedCurrencySushiswap(
  currency: SushiswapCurrency | undefined,
  chainId: SushiswapChainId | undefined
): SushiswapToken | undefined {
  return chainId && (currency === SUSHISWAP_ETHER || currency === ETHER)
    ? SUSHISWAP_WETH[chainId]
    : materiaToSushiswapToken(currency)
}

export function wrappedCurrencySushiswapObject(
  currency: SushiswapCurrency | undefined,
  chainId: SushiswapChainId | undefined
): SushiswapToken | undefined {
  return chainId && (currency === SUSHISWAP_ETHER || currency === ETHER)
    ? SUSHISWAP_WETH[chainId]
    : currency instanceof SushiswapToken
    ? currency
    : undefined
}

export function wrappedCurrencyAmountSushiswap(
  currencyAmount: SushiswapCurrencyAmount | undefined,
  chainId: SushiswapChainId | undefined
): SushiswapTokenAmount | SushiswapCurrencyAmount | undefined {
  const token = currencyAmount && chainId ? wrappedCurrencySushiswap(currencyAmount.currency, chainId) : undefined
  return token && currencyAmount ? new SushiswapTokenAmount(token, currencyAmount.raw) : undefined
}

export function unwrappedTokenSushiswap(token: SushiswapToken): SushiswapCurrency {
  if (token?.equals(SUSHISWAP_WETH[token.chainId])) return SUSHISWAP_ETHER
  return token
}

export function materiaToSushiswapToken(token: Token | Currency | undefined): SushiswapToken | undefined {
  return token instanceof Token
    ? new SushiswapToken(token.chainId, token.address, token.decimals, token.symbol, token.name)
    : undefined
}

export function sushiswapToMateriaTrade(sushiswapTrade: SushiswapTrade, chainId: ChainId): Trade {
  const route = sushiswapToMateriaRoute(sushiswapTrade.route, chainId)
  const amount =
    sushiswapTrade.tradeType == SushiswapTradeType.EXACT_INPUT
      ? sushiswapToMateriaTokenAmount(sushiswapTrade.inputAmount, chainId)
      : sushiswapToMateriaTokenAmount(sushiswapTrade.outputAmount, chainId)
  const tradeType =
    sushiswapTrade.tradeType == SushiswapTradeType.EXACT_INPUT ? TradeType.EXACT_INPUT : TradeType.EXACT_OUTPUT
  const trade = new Trade(route, amount, tradeType)

  return trade
}

export function sushiswapToMateriaRoute(sushiswapRoute: SushiswapRoute, chainId: ChainId): Route {
  const pairs = sushiswapRoute.pairs.map(pair => sushiswapToMateriaPair(pair, chainId))
  const input = sushiswapToMateriaToken(sushiswapRoute.input, chainId) ?? IETH[chainId]
  const output = sushiswapToMateriaToken(sushiswapRoute.output, chainId) ?? IETH[chainId]
  const route = new Route(pairs, input, output)

  return route
}

export function sushiswapToMateriaPair(sushiswapPair: SushiswapPair, chainId: ChainId): Pair {
  const tokenAmountA = sushiswapToMateriaTokenAmount(sushiswapPair.reserve0, chainId)
  const tokenAmountB = sushiswapToMateriaTokenAmount(sushiswapPair.reserve1, chainId)
  const pair = new Pair(tokenAmountA, tokenAmountB)

  return pair
}

export function sushiswapToMateriaTokenAmount(
  sushiswapTokenAmount: SushiswapTokenAmount | SushiswapCurrencyAmount,
  chainId: ChainId
): TokenAmount {
  const sushiswapToken =
    sushiswapTokenAmount instanceof SushiswapCurrencyAmount
      ? sushiswapTokenAmount.currency
      : (sushiswapTokenAmount as SushiswapTokenAmount).token
  const token = sushiswapToMateriaToken(sushiswapToken, chainId) ?? IETH[chainId]
  const tokenAmount = new TokenAmount(token, sushiswapTokenAmount.raw)

  return tokenAmount
}

export function sushiswapToMateriaToken(
  token: SushiswapToken | SushiswapCurrency | undefined,
  chainId: ChainId
): Token | undefined {
  if (!token) {
    return undefined
  }
  if (token === SUSHISWAP_WETH[chainId]) {
    return IETH[chainId]
  }

  const sushiswapToken = token as SushiswapToken

  return new Token(
    sushiswapToMateriaChainId(sushiswapToken.chainId),
    sushiswapToken.address,
    sushiswapToken.decimals,
    sushiswapToken.symbol,
    sushiswapToken.name
  )
}

export function sushiswapToMateriaChainId(chainId: SushiswapChainId): ChainId {
  if (chainId == ChainId.ROPSTEN) return ChainId.ROPSTEN
  if (chainId == ChainId.GÖRLI) return ChainId.GÖRLI
  if (chainId == ChainId.KOVAN) return ChainId.KOVAN
  if (chainId == ChainId.RINKEBY) return ChainId.RINKEBY

  return ChainId.MAINNET
}
