import { parseBytes32String, toUtf8Bytes } from '@ethersproject/strings'
import { Currency, ETHER, Token, currencyEquals } from '@materia-dex/sdk'
import { keccak256, sha256 } from 'ethers/lib/utils'
import { useEffect, useMemo } from 'react'
import { useAllTokenList, useSelectedTokenList } from '../state/lists/hooks'
import { CallState, NEVER_RELOAD, Result, toCallState, useSingleCallResult } from '../state/multicall/hooks'
import { useUserAddedTokens } from '../state/user/hooks'
import { isAddress } from '../utils'
import Web3 from 'web3';

import { useActiveWeb3React } from './index'
import { useBytes32TokenContract, useEthItemKnowledgeBaseContract, useEthItemOrchestratorContract, useTokenContract, useWERC20TokenContract } from './useContract'
import { WERC20_ABI } from '../constants/abis/erc20'
import { ETHITEM_START_BLOCK, ZERO_ADDRESS } from '../constants'

export function useAllTokens(): { [address: string]: Token } {
  const { chainId, } = useActiveWeb3React()
  const userAddedTokens = useUserAddedTokens()
  const allTokens = useSelectedTokenList()

  return useMemo(() => {
    if (!chainId) return {}
    return (
      userAddedTokens
        // reduce into all ALL_TOKENS filtered by the current chain
        .reduce<{ [address: string]: Token }>(
          (tokenMap, token) => {
            tokenMap[token.address] = token
            return tokenMap
          },
          // must make a copy because reduce modifies the map, and we do not
          // want to make a copy in every iteration
          { ...allTokens[chainId] }
        )
    )
  }, [chainId, userAddedTokens, allTokens])
}

// export function useAllWrappedERC20Tokens(): { [address: string]: Token }[] {
export function useAllWrappedERC20Tokens(): void {
  const { chainId, library } = useActiveWeb3React()

  //Call the Orchestrator and then the KnowledgeBase to retrieve all the ERC20Wrappers
  const ethItemOrchestrator = useEthItemOrchestratorContract(false)
  const knowledgeBaseAddress = useSingleCallResult(ethItemOrchestrator, 'knowledgeBase', undefined, NEVER_RELOAD)
  const knowledgeBase = useEthItemKnowledgeBaseContract(knowledgeBaseAddress.result?.[0], false)

  const ethItemERC20WrapperAddresses = useSingleCallResult(knowledgeBase, 'erc20Wrappers', undefined, NEVER_RELOAD)
  const factoryAddresses = useSingleCallResult(ethItemOrchestrator, 'factory', undefined, NEVER_RELOAD)

  const collections = ethItemERC20WrapperAddresses.result?.[0]

  const web3 = new Web3(Web3.givenProvider);

  //Prepare a var to collect all the ITEMs
  let allCollections: any[] = [];

  if (collections !== undefined) {
    for (let collectionAddress of collections) {
      //Normalize the address for eventual search by address purposes
      collectionAddress = web3.utils.toChecksumAddress(collectionAddress);

      //Collection category to distinguish all collection types, "W20" means that this Collection is a Wrapper of ERC20 Tokens
      const collectionCategory = "W20";
      const collectionABI = WERC20_ABI;

      //The needed basic info to operate are of course the Collection address, category and Smart Contract. They can be of course enriched
      allCollections.push({
        address: collectionAddress,
        category: collectionCategory,
        //contract: new web3.eth.Contract(collectionABI, collectionAddress)
      });
    }
  }

  //Grab the desired Collection addresses. You can choose any single Collection or group of Collections you want. In this case we grab all
  const collectionAddresses = allCollections.map(it => it.address);

  //The EthItem Token Standard implements the event NewItem(uint256 indexed objectId, address indexed interoperableInterfaceAddress) raised every time a new Item is created/wrapped for the first time
  const topics = [web3.utils.sha3("NewItem(uint256,address)")];
  const logs = useLogsResult(collectionAddresses, topics, ETHITEM_START_BLOCK[chainId ?? 1], "latest")
  let pastLogs: any[] = []
  // let resultCollection: { [address: string]: Token }[] = allCollections
  let resultCollection: any[] = []

  useEffect(() => {
    logs.then(logs => {
      pastLogs = logs
      
      //Navigate logs
      for(var log of logs) {

        //Get the Collection that created this item (the original event emitter)
        var collectionAddress = web3.utils.toChecksumAddress(log.address);
        // resultCollection = allCollections.filter(it => it.address === collectionAddress)[0];

        //Object Id is the first argument param of the Event
        var collectionItemObjectId = web3.eth.abi.decodeParameter("uint256", log.topics[1]);

        //Object ERC20 Wrapper is the second param of the Event
        var { interoperableInterfaceAddress } = web3.eth.abi.decodeParameter("address", log.topics[2])

        
        console.log('***************************************')
        console.log('keys: ', interoperableInterfaceAddress)
        console.log('***************************************')
        


        //Create the contract
        // var collectionItemInteroperableInterfaceContract = new web3.eth.Contract(configuration.IEthItemInteroperableInterfaceABI, interoperableInterfaceAddress);

        //Assemble the Collection Item, you can add all the additional info you want (e.g. cross-referencing the Collection this Item belongs to)
        var collectionItem: Token = new Token(chainId ?? 1, interoperableInterfaceAddress ?? ZERO_ADDRESS, 18, 'GIL', 'GIL')
        
        //Add every single Collection Item to the corresponding Collection's array
        // resultCollection.push(collectionItem);
        resultCollection.push(interoperableInterfaceAddress);
      }

      console.log('***************************************')
      console.log('resultCollection: ', resultCollection)
      console.log('***************************************')
    })
  }, [chainId, logs, pastLogs, allCollections, resultCollection])

  // return useMemo(() => {
  //   if (!resultCollection) return []
  //   // if (!chainId) return undefined
  //   // if (ethItemERC20WrapperAddresses.loading || knowledgeBaseAddress.loading) return null
  //   if (ethItemERC20WrapperAddresses.result) {
  //     return resultCollection
  //   }
  // }, [
  //   // chainId,
  //   // ethItemERC20WrapperAddresses.loading,
  //   ethItemERC20WrapperAddresses.result,
  //   // knowledgeBaseAddress.loading,
  //   // knowledgeBaseAddress.result,
  //   resultCollection
  // ])
}

export function useLogsResult(
  addresses: string[] | string | undefined,
  topics: (string | null)[],
  startBlock: string,
  endBlock: string,
) {
  const web3 = new Web3(Web3.givenProvider);

  const result = useMemo(() => web3.eth.getPastLogs({
    address: addresses,
    topics: topics,
    fromBlock: startBlock,
    toBlock: endBlock
  }), [addresses, topics, endBlock, endBlock])

  return useMemo(() => {
    return result
  }, [result])
}

export function useAllListTokens(): { [address: string]: Token } {
  const { chainId } = useActiveWeb3React()
  const userAddedTokens = useUserAddedTokens()
  const allTokens = useAllTokenList()

  return useMemo(() => {
    if (!chainId) return {}
    return (
      userAddedTokens
        // reduce into all ALL_TOKENS filtered by the current chain
        .reduce<{ [address: string]: Token }>(
          (tokenMap, token) => {
            tokenMap[token.address] = token
            return tokenMap
          },
          // must make a copy because reduce modifies the map, and we do not
          // want to make a copy in every iteration
          { ...allTokens[chainId] }
        )
    )
  }, [chainId, userAddedTokens, allTokens])
}

// Check if currency is included in custom list from user storage
export function useIsUserAddedToken(currency: Currency): boolean {
  const userAddedTokens = useUserAddedTokens()
  return !!userAddedTokens.find(token => currencyEquals(currency, token))
}

// parse a name or symbol from a token response
const BYTES32_REGEX = /^0x[a-fA-F0-9]{64}$/
function parseStringOrBytes32(str: string | undefined, bytes32: string | undefined, defaultValue: string): string {
  return str && str.length > 0
    ? str
    : bytes32 && BYTES32_REGEX.test(bytes32)
      ? parseBytes32String(bytes32)
      : defaultValue
}

// undefined if invalid or does not exist
// null if loading
// otherwise returns the token
export function useToken(tokenAddress?: string): Token | undefined | null {
  const { chainId } = useActiveWeb3React()
  const tokens = useAllTokens()

  const address = isAddress(tokenAddress)

  const tokenContract = useTokenContract(address ? address : undefined, false)
  const tokenContractBytes32 = useBytes32TokenContract(address ? address : undefined, false)
  const token: Token | undefined = address ? tokens[address] : undefined

  const tokenName = useSingleCallResult(token ? undefined : tokenContract, 'name', undefined, NEVER_RELOAD)
  const tokenNameBytes32 = useSingleCallResult(
    token ? undefined : tokenContractBytes32,
    'name',
    undefined,
    NEVER_RELOAD
  )
  const symbol = useSingleCallResult(token ? undefined : tokenContract, 'symbol', undefined, NEVER_RELOAD)
  const symbolBytes32 = useSingleCallResult(token ? undefined : tokenContractBytes32, 'symbol', undefined, NEVER_RELOAD)
  const decimals = useSingleCallResult(token ? undefined : tokenContract, 'decimals', undefined, NEVER_RELOAD)

  return useMemo(() => {
    if (token) return token
    if (!chainId || !address) return undefined
    if (decimals.loading || symbol.loading || tokenName.loading) return null
    if (decimals.result) {
      return new Token(
        chainId,
        address,
        decimals.result[0],
        parseStringOrBytes32(symbol.result?.[0], symbolBytes32.result?.[0], 'UNKNOWN'),
        parseStringOrBytes32(tokenName.result?.[0], tokenNameBytes32.result?.[0], 'Unknown Token')
      )
    }
    return undefined
  }, [
    address,
    chainId,
    decimals.loading,
    decimals.result,
    symbol.loading,
    symbol.result,
    symbolBytes32.result,
    token,
    tokenName.loading,
    tokenName.result,
    tokenNameBytes32.result
  ])
}

export function useCurrency(currencyId: string | undefined): Currency | null | undefined {
  const isETH = currencyId?.toUpperCase() === 'ETH'
  const token = useToken(isETH ? undefined : currencyId)
  return isETH ? ETHER : token
}
