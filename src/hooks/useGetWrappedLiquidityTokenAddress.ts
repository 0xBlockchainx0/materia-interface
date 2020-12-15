import { JSBI, Token } from '@materia-dex/sdk'
import { Contract } from 'ethers'
import { ERC20WRAPPER, ZERO_ADDRESS } from '../constants'
import { Result, useSingleCallResult } from '../state/multicall/hooks'
import { getERC20WrapperCollectionContract } from '../utils'
import { useActiveWeb3React } from './index'

/**
 * Return the interoperable address for liquidity token passed as argument
 */
export default function useGetWrappedLiquidityTokenAddress(liquidityTokenAddress: string | null | undefined): string {
  const { account, chainId, library } = useActiveWeb3React()
  const erc20WrapperAddress = ERC20WRAPPER[chainId ?? 1]
  const contract: Contract | null = (!library || !account || !chainId) ? null : getERC20WrapperCollectionContract(chainId, erc20WrapperAddress, library, account)
  const { result: objectResult } = useSingleCallResult(contract, 'object', [liquidityTokenAddress ?? ZERO_ADDRESS])
  const ethItemObjectId: JSBI = JSBI.BigInt(objectResult?.objectId ?? 0)
  const { result: interoperable } = useSingleCallResult(contract, 'asInteroperable', [ethItemObjectId?.toString() ?? "0"])
  const interoperableAddress = (interoperable ?? [])[0] ?? ZERO_ADDRESS
  
  return interoperableAddress
}