import {
  Trade,
  Route,
  Pair,
  TradeType,
  ChainId,
  Currency,
  Token,
  TokenAmount,
  ETHER,
  IETH
} from '@materia-dex/sdk'
import {
  Trade as UniswapTrade,
  Route as UniswapRoute,
  Pair as UniswapPair,
  TradeType as UniswapTradeType,
  ChainId as UniswapChainId,
  Currency as UniswapCurrency,
  CurrencyAmount as UniswapCurrencyAmount,
  Token as UniswapToken,
  TokenAmount as UniswapTokenAmount,
  ETHER as UNISWAP_ETHER,
  WETH as UNISWAP_WETH
} from '@uniswap/sdk'

export function wrappedCurrencyUniswap(
  currency: UniswapCurrency | undefined,
  chainId: UniswapChainId | undefined
): UniswapToken | undefined {
  return chainId && (currency === UNISWAP_ETHER || currency === ETHER) ? UNISWAP_WETH[chainId] : materiaToUniswapToken(currency)
}

export function wrappedCurrencyUniswapObject(currency: UniswapCurrency | undefined, chainId: UniswapChainId | undefined): UniswapToken | undefined {
  return chainId && (currency === UNISWAP_ETHER || currency === ETHER) ? UNISWAP_WETH[chainId] : currency instanceof UniswapToken ? currency : undefined
}

export function wrappedCurrencyAmountUniswap(
  currencyAmount: UniswapCurrencyAmount | undefined,
  chainId: UniswapChainId | undefined
): UniswapTokenAmount | UniswapCurrencyAmount | undefined {
  const token = currencyAmount && chainId ? wrappedCurrencyUniswap(currencyAmount.currency, chainId) : undefined
  return token && currencyAmount ? new UniswapTokenAmount(token, currencyAmount.raw) : undefined
}

export function unwrappedTokenUniswap(token: UniswapToken): UniswapCurrency {
  if (token?.equals(UNISWAP_WETH[token.chainId])) return UNISWAP_ETHER
  return token
}

export function materiaToUniswapToken(token: Token | Currency | undefined): UniswapToken | undefined {
  return token instanceof Token
    ? new UniswapToken(token.chainId, token.address, token.decimals, token.symbol, token.name)
    : undefined
}

export function uniswapToMateriaTrade(uniswapTrade: UniswapTrade, chainId: ChainId): Trade {
  const route = uniswapToMateriaRoute(uniswapTrade.route, chainId)
  const amount =
    uniswapTrade.tradeType == UniswapTradeType.EXACT_INPUT
      ? uniswapToMateriaTokenAmount(uniswapTrade.inputAmount, chainId)
      : uniswapToMateriaTokenAmount(uniswapTrade.outputAmount, chainId)
  const tradeType =
    uniswapTrade.tradeType == UniswapTradeType.EXACT_INPUT ? TradeType.EXACT_INPUT : TradeType.EXACT_OUTPUT
  const trade = new Trade(route, amount, tradeType)

  return trade
}

export function uniswapToMateriaRoute(uniswapRoute: UniswapRoute, chainId: ChainId): Route {
  const pairs = uniswapRoute.pairs.map(pair => uniswapToMateriaPair(pair, chainId))
  const input = uniswapToMateriaToken(uniswapRoute.input, chainId) ?? IETH[chainId]
  const output = uniswapToMateriaToken(uniswapRoute.output, chainId) ?? IETH[chainId]
  const route = new Route(pairs, input, output)

  return route
}

export function uniswapToMateriaPair(uniswapPair: UniswapPair, chainId: ChainId): Pair {
  const tokenAmountA = uniswapToMateriaTokenAmount(uniswapPair.reserve0, chainId)
  const tokenAmountB = uniswapToMateriaTokenAmount(uniswapPair.reserve1, chainId)
  const pair = new Pair(tokenAmountA, tokenAmountB)

  return pair
}

export function uniswapToMateriaTokenAmount(uniswapTokenAmount: UniswapTokenAmount | UniswapCurrencyAmount, chainId: ChainId): TokenAmount {
  const uniswapToken = uniswapTokenAmount instanceof UniswapCurrencyAmount ? uniswapTokenAmount.currency : (uniswapTokenAmount as UniswapTokenAmount).token
  const token = uniswapToMateriaToken(uniswapToken, chainId) ?? IETH[chainId]
  const tokenAmount = new TokenAmount(token, uniswapTokenAmount.raw)

  return tokenAmount
}

export function uniswapToMateriaToken(
  token: UniswapToken | UniswapCurrency | undefined,
  chainId: ChainId
): Token | undefined {
  if (!token) {
    return undefined
  }
  if (token === UNISWAP_WETH[chainId]) {
    return IETH[chainId]
  }

  const uniswapToken = token as UniswapToken

  return new Token(
    uniswapToken.chainId,
    uniswapToken.address,
    uniswapToken.decimals,
    uniswapToken.symbol,
    uniswapToken.name
  )
}
