import { Token } from '@uniswap/sdk'
import { useMemo } from 'react'
import { USD } from '../constants'
import { useActiveWeb3React } from './index'

/**
 * Return the uSD Token object using selected chain
 */
export default function useUSD(): Token | undefined {
  const { chainId } = useActiveWeb3React()

  return useMemo(() => {
    if (!chainId) return undefined

    return USD[chainId]
  }, [chainId])
}