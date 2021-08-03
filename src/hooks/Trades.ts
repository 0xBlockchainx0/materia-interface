import { Currency, CurrencyAmount, Pair, Token, Trade, ETHER, IETH, ChainId } from '@materia-dex/sdk'
import {
  Trade as UniswapTrade,
  Pair as UniswapPair,
  Token as UniswapToken,
  Currency as UniswapCurrency,
  CurrencyAmount as UniswapCurrencyAmount,
  ETHER as UNISWAP_ETHER,
  WETH as UNISWAP_WETH
} from '@uniswap/sdk'
import flatMap from 'lodash.flatmap'
import { useMemo } from 'react'
import {
  BASES_TO_CHECK_TRADES_AGAINST,
  BASES_TO_CHECK_TRADES_AGAINST_UNISWAP,
  CUSTOM_BASES,
  CUSTOM_BASES_UNISWAP
} from '../constants'
import { PairState, usePairs, useUniswapPairs } from '../data/Reserves'
import { wrappedCurrency } from '../utils/wrappedCurrency'
import {
  wrappedCurrencyUniswap,
  wrappedCurrencyAmountUniswap,
  wrappedCurrencyUniswapObject
} from '../utils/utilsUniswap'

import { useActiveWeb3React } from './index'

function useAllCommonPairs(currencyA?: Currency, currencyB?: Currency): Pair[] {
  const { chainId } = useActiveWeb3React()

  const bases: Token[] = chainId ? BASES_TO_CHECK_TRADES_AGAINST[chainId] : []

  const [tokenA, tokenB] = chainId
    ? [wrappedCurrency(currencyA, chainId), wrappedCurrency(currencyB, chainId)]
    : [undefined, undefined]

  const basePairs: [Token, Token][] = useMemo(
    () =>
      flatMap(bases, (base): [Token, Token][] => bases.map(otherBase => [base, otherBase])).filter(
        ([t0, t1]) => t0.address !== t1.address
      ),
    [bases]
  )

  const allPairCombinations: [Token, Token][] = useMemo(
    () =>
      tokenA && tokenB
        ? [
            // the direct pair
            [tokenA, tokenB],
            // token A against all bases
            ...bases.map((base): [Token, Token] => [tokenA, base]),
            // token B against all bases
            ...bases.map((base): [Token, Token] => [tokenB, base]),
            // each base against all bases
            ...basePairs
          ]
            .filter((tokens): tokens is [Token, Token] => Boolean(tokens[0] && tokens[1]))
            .filter(([t0, t1]) => t0.address !== t1.address)
            .filter(([tokenA, tokenB]) => {
              if (!chainId) return true
              const customBases = CUSTOM_BASES[chainId]
              if (!customBases) return true

              const customBasesA: Token[] | undefined = customBases[tokenA.address]
              const customBasesB: Token[] | undefined = customBases[tokenB.address]

              if (!customBasesA && !customBasesB) return true

              if (customBasesA && !customBasesA.find(base => tokenB.equals(base))) return false
              if (customBasesB && !customBasesB.find(base => tokenA.equals(base))) return false

              return true
            })
        : [],
    [tokenA, tokenB, bases, basePairs, chainId]
  )

  const allPairs = usePairs(allPairCombinations)

  // only pass along valid pairs, non-duplicated pairs
  return useMemo(
    () =>
      Object.values(
        allPairs
          // filter out invalid pairs
          .filter((result): result is [PairState.EXISTS, Pair] => Boolean(result[0] === PairState.EXISTS && result[1]))
          // filter out duplicated pairs
          .reduce<{ [pairAddress: string]: Pair }>((memo, [, curr]) => {
            memo[curr.liquidityToken.address] = memo[curr.liquidityToken.address] ?? curr
            return memo
          }, {})
      ),
    [allPairs]
  )
}

function useUniswapAllCommonPairs(currencyA?: UniswapCurrency, currencyB?: UniswapCurrency): UniswapPair[] {
  const { chainId } = useActiveWeb3React()

  const bases: UniswapToken[] = chainId ? BASES_TO_CHECK_TRADES_AGAINST_UNISWAP[chainId] : []

  const [tokenA, tokenB] = chainId
    ? [wrappedCurrencyUniswapObject(currencyA, chainId), wrappedCurrencyUniswapObject(currencyB, chainId)]
    : [undefined, undefined]

  const basePairs: [UniswapToken, UniswapToken][] = useMemo(
    () =>
      flatMap(bases, (base): [UniswapToken, UniswapToken][] => bases.map(otherBase => [base, otherBase])).filter(
        ([t0, t1]) => t0.address !== t1.address
      ),
    [bases]
  )

  const allPairCombinations: [UniswapToken, UniswapToken][] = useMemo(
    () =>
      tokenA && tokenB
        ? [
            // the direct pair
            [tokenA, tokenB],
            // token A against all bases
            ...bases.map((base): [UniswapToken, UniswapToken] => [tokenA, base]),
            // token B against all bases
            ...bases.map((base): [UniswapToken, UniswapToken] => [tokenB, base]),
            // each base against all bases
            ...basePairs
          ]
            .filter((tokens): tokens is [UniswapToken, UniswapToken] => Boolean(tokens[0] && tokens[1]))
            .filter(([t0, t1]) => t0.address !== t1.address)
            .filter(([tokenA, tokenB]) => {
              if (!chainId) return true
              const customBases = CUSTOM_BASES_UNISWAP[chainId]
              if (!customBases) return true

              const customBasesA: UniswapToken[] | undefined = customBases[tokenA.address]
              const customBasesB: UniswapToken[] | undefined = customBases[tokenB.address]

              if (!customBasesA && !customBasesB) return true

              if (customBasesA && !customBasesA.find(base => tokenB.equals(base))) return false
              if (customBasesB && !customBasesB.find(base => tokenA.equals(base))) return false

              return true
            })
        : [],
    [tokenA, tokenB, bases, basePairs, chainId]
  )

  const allPairs = useUniswapPairs(allPairCombinations)

  // only pass along valid pairs, non-duplicated pairs
  return useMemo(
    () =>
      Object.values(
        allPairs
          // filter out invalid pairs
          .filter((result): result is [PairState.EXISTS, UniswapPair] =>
            Boolean(result[0] === PairState.EXISTS && result[1])
          )
          // filter out duplicated pairs
          .reduce<{ [pairAddress: string]: UniswapPair }>((memo, [, curr]) => {
            memo[curr.liquidityToken.address] = memo[curr.liquidityToken.address] ?? curr
            return memo
          }, {})
      ),
    [allPairs]
  )
}

/**
 * Returns the best trade for the exact amount of tokens in to the given token out
 */
export function useTradeExactIn(currencyAmountIn?: CurrencyAmount, currencyOut?: Currency): Trade | null {
  const allowedPairs = useAllCommonPairs(currencyAmountIn?.currency, currencyOut)

  return useMemo(() => {
    if (currencyAmountIn && currencyOut && allowedPairs.length > 0) {
      return (
        Trade.bestTradeExactIn(allowedPairs, currencyAmountIn, currencyOut, { maxHops: 2, maxNumResults: 1 })[0] ?? null
      )
    }
    return null
  }, [allowedPairs, currencyAmountIn, currencyOut])
}

/**
 * Returns the best trade for the token in to the exact amount of token out
 */
export function useTradeExactOut(currencyIn?: Currency, currencyAmountOut?: CurrencyAmount): Trade | null {
  const allowedPairs = useAllCommonPairs(currencyIn, currencyAmountOut?.currency)

  return useMemo(() => {
    if (currencyIn && currencyAmountOut && allowedPairs.length > 0) {
      return (
        Trade.bestTradeExactOut(allowedPairs, currencyIn, currencyAmountOut, { maxHops: 2, maxNumResults: 1 })[0] ??
        null
      )
    }
    return null
  }, [allowedPairs, currencyIn, currencyAmountOut])
}

/**
 * Returns the best trade for the exact amount of tokens in to the given token out
 */
export function useUniswapTradeExactIn(currencyAmountIn?: CurrencyAmount, currencyOut?: Currency): UniswapTrade | null {
  const { chainId } = useActiveWeb3React()
  const uniswapCurrencyAmountIn = wrappedCurrencyAmountUniswap(currencyAmountIn as UniswapCurrencyAmount, chainId)
  const uniswapCurrencyOut = wrappedCurrencyUniswap(currencyOut as UniswapCurrency, chainId)
  const allowedPairs = useUniswapAllCommonPairs(uniswapCurrencyAmountIn?.currency, uniswapCurrencyOut)

  return useMemo(() => {
    if (uniswapCurrencyAmountIn && uniswapCurrencyOut && allowedPairs.length > 0) {
      return (
        UniswapTrade.bestTradeExactIn(allowedPairs, uniswapCurrencyAmountIn, uniswapCurrencyOut, {
          maxHops: 2,
          maxNumResults: 1
        })[0] ?? null
      )
    }
    return null
  }, [chainId, allowedPairs, uniswapCurrencyAmountIn, uniswapCurrencyOut])
}

/**
 * Returns the best trade for the token in to the exact amount of token out
 */
export function useUniswapTradeExactOut(
  currencyIn?: Currency,
  currencyAmountOut?: CurrencyAmount
): UniswapTrade | null {
  const { chainId } = useActiveWeb3React()
  const uniswapCurrencyIn = wrappedCurrencyUniswap(currencyIn as UniswapCurrency, chainId)
  const uniswapCurrencyAmountOut = wrappedCurrencyAmountUniswap(currencyAmountOut as UniswapCurrencyAmount, chainId)
  const allowedPairs = useUniswapAllCommonPairs(uniswapCurrencyIn, uniswapCurrencyAmountOut?.currency)

  return useMemo(() => {
    if (uniswapCurrencyIn && uniswapCurrencyAmountOut && allowedPairs.length > 0) {
      return (
        UniswapTrade.bestTradeExactOut(allowedPairs, uniswapCurrencyIn, uniswapCurrencyAmountOut, {
          maxHops: 2,
          maxNumResults: 1
        })[0] ?? null
      )
    }
    return null
  }, [chainId, allowedPairs, uniswapCurrencyIn, uniswapCurrencyAmountOut])
}
