import { Token } from '@materia-dex/sdk'
import { useMemo } from 'react'
import { WUSD } from '../constants'
import { useActiveWeb3React } from './index'

/**
 * Return the WUSD Token object using selected chain
 */
export default function useWUSD(): Token | undefined {
  const { chainId } = useActiveWeb3React()

  return useMemo(() => {
    if (!chainId) return undefined

    return WUSD[chainId]
  }, [chainId])
}