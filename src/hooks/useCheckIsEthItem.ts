import { Contract } from 'ethers'
import { Result, useSingleCallResult } from '../state/multicall/hooks'
import { getOrchestratorContract } from '../utils'
import { useActiveWeb3React } from './index'

/**
 * Return an object with EthItem infos if token is an EthItem
 */
export default function useCheckIsEthItem(tokenAddress: string): Result | undefined {
  const { account, chainId, library } = useActiveWeb3React()
  const contract: Contract | null = (!library || !account || !chainId) ? null : getOrchestratorContract(chainId, library, account)
  const { result: checkIsEthItem } = useSingleCallResult(contract, 'isEthItem', [tokenAddress])

  return checkIsEthItem
}