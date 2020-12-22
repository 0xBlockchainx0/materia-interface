import { IETH, JSBI } from '@materia-dex/sdk'
import { Contract } from 'ethers'
import { ERC20WRAPPER, ZERO_ADDRESS } from '../constants'
import { useSingleCallResult } from '../state/multicall/hooks'
import { getERC20WrapperCollectionContract } from '../utils'
import { useActiveWeb3React } from './index'

/**
 * Return the EthItem interoperable address of a token if present in the ERC20 Wrapper Collection
 */
export default function useGetEthItemInteroperable(address: string | undefined): string | undefined {
  const isETH = address == 'ETH'

  address = address && !isETH ? address : ZERO_ADDRESS
  
  const { account, chainId, library } = useActiveWeb3React()
  const erc20Wrapper: Contract | null = (!library || !account || !chainId) ? null : getERC20WrapperCollectionContract(chainId, ERC20WRAPPER[chainId ?? 1], library, account)
  const ethItemObjectId: JSBI = JSBI.BigInt(useSingleCallResult(erc20Wrapper, 'object', [address ?? ZERO_ADDRESS])?.result?.objectId ?? 0)
  const interoperable = (useSingleCallResult(erc20Wrapper, 'asInteroperable', [ethItemObjectId?.toString() ?? "0"]).result ?? [])[0] ?? ZERO_ADDRESS
  const result = isETH ? IETH[chainId ?? 1].address : !interoperable || interoperable == ZERO_ADDRESS ? undefined : interoperable

  return result
}