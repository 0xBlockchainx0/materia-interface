import { JSBI } from '@materia-dex/sdk'
import { Contract } from 'ethers'
import { ZERO_ADDRESS } from '../constants'
import { useSingleCallResult } from '../state/multicall/hooks'
import { getOrchestratorContract } from '../utils'
import { useActiveWeb3React } from './index'

export interface EthItem1155TokenInfo {
  native: boolean
  collection?: string
  address?: string
  decimals?: number
  objectId?: string
  rawObjectId?: JSBI
}

/**
 * Return the Native EthItem informations (address, collection, objectId, decimals) if the provided address is a native EthItem
 */
export default function useGetNativeEthItemTokenInfo(address: string | undefined): EthItem1155TokenInfo | undefined {
  const { account, chainId, library } = useActiveWeb3React()
  const isETH = address == 'ETH'

  address = address && !isETH ? address : ZERO_ADDRESS

  const contract: Contract | null = (!library || !account || !chainId) ? null : getOrchestratorContract(chainId, library, account)
  const { result: checkIsNative } = useSingleCallResult(contract, 'isNativeItem', [address])

  const isNative = checkIsNative?.native ?? false
  const mainInterface = checkIsNative?.collection
  const rawEthItemObjectId: JSBI | undefined = isNative && checkIsNative?.itemId
    ? JSBI.BigInt(checkIsNative?.itemId)
    : undefined
  const ethItemObjectId = rawEthItemObjectId?.toString() ?? undefined
  const mainInterfaceDecimals = checkIsNative?.decimals

  return !isNative ? undefined : {
    native: isNative,
    collection: mainInterface,
    address: address,
    decimals: mainInterfaceDecimals == 1 ? 0 : 18,
    objectId: ethItemObjectId,
    rawObjectId: rawEthItemObjectId
  }
}