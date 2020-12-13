import { Contract } from 'ethers'
import { ZERO_ADDRESS } from '../constants'
import { Result, useSingleCallResult } from '../state/multicall/hooks'
import { getProxyContract } from '../utils'
import { useActiveWeb3React } from './index'

/**
 * Return an object with wrapped Materia LP token infos
 */
export default function useGetWrappedLPInfo(tokenA: string | null | undefined, tokenB: string | null | undefined): Result | undefined {
  const { account, chainId, library } = useActiveWeb3React()
  const contract: Contract | null = (!library || !account || !chainId) ? null : getProxyContract(chainId, library, account)
  const tokenAddressA = tokenA ? tokenA : ZERO_ADDRESS
  const tokenAddresB = tokenB ? tokenB : ZERO_ADDRESS
  const { result: wrappedLPInfo } = useSingleCallResult(contract, 'getWrappedLP', [tokenAddressA, tokenAddresB])

  return wrappedLPInfo
}