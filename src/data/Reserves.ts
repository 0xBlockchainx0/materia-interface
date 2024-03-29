import { TokenAmount, Pair, Currency, JSBI } from '@materia-dex/sdk'
import { useMemo } from 'react'
import { abi as IMateriaPairABI } from '@materia-dex/materia-contracts-core/build/IMateriaPair.json'
import { Interface } from '@ethersproject/abi'
import { useActiveWeb3React } from '../hooks'

import { useMultipleContractSingleData } from '../state/multicall/hooks'
import { wrappedCurrency } from '../utils/wrappedCurrency'

const PAIR_INTERFACE = new Interface(IMateriaPairABI)
const PAIR_BASE_FEE = JSBI.BigInt(30)

export enum PairState {
  LOADING,
  NOT_EXISTS,
  EXISTS,
  INVALID
}

export function usePairs(currencies: [Currency | undefined, Currency | undefined][]): [PairState, Pair | null][] {
  const { chainId } = useActiveWeb3React()

  const tokens = useMemo(
    () =>
      currencies.map(([currencyA, currencyB]) => [
        wrappedCurrency(currencyA, chainId),
        wrappedCurrency(currencyB, chainId)
      ]),
    [chainId, currencies]
  )

  const pairAddresses = useMemo(
    () =>
      tokens.map(([tokenA, tokenB]) => {
        return tokenA && tokenB && !tokenA.equals(tokenB) ? Pair.getAddress(tokenA, tokenB) : undefined
      }),
    [tokens]
  )

  const results = useMultipleContractSingleData(pairAddresses, PAIR_INTERFACE, 'getReserves')
  const swapFees = useMultipleContractSingleData(pairAddresses, PAIR_INTERFACE, 'swapFee')

  return useMemo(() => {
    return results.map((result, i) => {
      const { result: reserves, loading } = result
      const tokenA = tokens[i][0]
      const tokenB = tokens[i][1]
      const { result: swapFee, loading: feeLoading } = swapFees[i]

      if (loading || feeLoading) return [PairState.LOADING, null]
      if (!tokenA || !tokenB || tokenA.equals(tokenB)) return [PairState.INVALID, null]
      if (!reserves) return [PairState.NOT_EXISTS, null]
      let calculatedSwapFee = PAIR_BASE_FEE
      const { reserve0, reserve1 } = reserves
      const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA]
      
      if (swapFee) calculatedSwapFee = JSBI.BigInt(parseInt(Object.keys(swapFee).map(key => swapFee[key])[0]) * 10) ?? PAIR_BASE_FEE
      
      return [
        PairState.EXISTS,
        new Pair(new TokenAmount(token0, reserve0.toString()), new TokenAmount(token1, reserve1.toString()), calculatedSwapFee)
      ]
    })
  }, [results, tokens, swapFees])
}

export function usePair(tokenA?: Currency, tokenB?: Currency): [PairState, Pair | null] {
  return usePairs([[tokenA, tokenB]])[0]
}
