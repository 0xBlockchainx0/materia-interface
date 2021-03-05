import Web3 from 'web3'
import { ChainId } from '@materia-dex/sdk'
import { Web3Provider } from '@ethersproject/providers'
import { ERC20WRAPPER, ETHITEM_START_BLOCK } from '../constants'

export default function useUpdateWrappedERC20TokensCallback(
  chainId: ChainId | undefined, 
  library: Web3Provider | undefined,
  addInteroperableTokens: (chainId: number, interoperableTokens: string[]) => void
): { execute: (() => Promise<void>)} {
  return {
    execute: async () => {
      const web3 = new Web3();
      const topics = [web3.utils.sha3("NewItem(uint256,address)") ?? ""];
      const logs = await library?.getLogs({
        address: ERC20WRAPPER[chainId ?? 1],
        topics: topics,
        fromBlock: parseInt(ETHITEM_START_BLOCK[chainId ?? 1]),
        toBlock: "latest"
      })
      const wrappedTokensAddresses: string[] = logs?.map(log => web3.eth.abi.decodeParameter("address", log.topics[2]).toString()) ?? []
    
      addInteroperableTokens(chainId ?? 1, wrappedTokensAddresses)
    }
  }
}