import { parseBytes32String, toUtf8Bytes } from '@ethersproject/strings'
import { Currency, ETHER, Token, currencyEquals } from '@materia-dex/sdk'
import { keccak256, sha256 } from 'ethers/lib/utils'
import { useMemo } from 'react'
import { useAllTokenList, useSelectedTokenList } from '../state/lists/hooks'
import { CallState, NEVER_RELOAD, Result, toCallState, useSingleCallResult } from '../state/multicall/hooks'
import { useUserAddedTokens } from '../state/user/hooks'
import { isAddress } from '../utils'
import Web3 from 'web3';

import { useActiveWeb3React } from './index'
import { useBytes32TokenContract, useEthItemKnowledgeBaseContract, useEthItemOrchestratorContract, useTokenContract, useWERC20TokenContract } from './useContract'
import { WERC20_ABI } from '../constants/abis/erc20'

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

export function useAllWrappedERC20Tokens(): { [address: string]: Token } {
  const { chainId } = useActiveWeb3React()

  //Call the Orchestrator and then the KnowledgeBase to retrieve all the ERC20Wrappers
  const ethItemOrchestrator = useEthItemOrchestratorContract(false)
  const knowledgeBaseAddress = useSingleCallResult(ethItemOrchestrator, 'knowledgeBase', undefined, NEVER_RELOAD)
  const knowledgeBase = useEthItemKnowledgeBaseContract(knowledgeBaseAddress.result?.[0], false)

  const ethItemERC20WrapperAddresses = useSingleCallResult(knowledgeBase, 'erc20Wrappers', undefined, NEVER_RELOAD)
  const factoryAddresses = useSingleCallResult(ethItemOrchestrator, 'factory', undefined, NEVER_RELOAD)

  const collections = ethItemERC20WrapperAddresses.result?.[0]

  const web3 = new Web3(Web3.givenProvider);

  //Prepare a var to collect all the ITEMs
  var allCollections = [];

  if (collections !== undefined) {
    for (var collectionAddress of collections) {
      //Normalize the address for eventual search by address purposes
      collectionAddress = web3.utils.toChecksumAddress(collectionAddress);

      //Collection category to distinguish all collection types, "W20" means that this Collection is a Wrapper of ERC20 Tokens
      var collectionCategory = "W20";

      var collectionABI = WERC20_ABI;

      //The needed basic info to operate are of course the Collection address, category and Smart Contract. They can be of course enriched
      allCollections.push({
        address: collectionAddress,
        category: collectionCategory,
        //contract: new web3.eth.Contract(collectionABI, collectionAddress)
      });
    }
  }

  //Grab the desired Collection addresses. You can choose any single Collection or group of Collections you want. In this case we grab all
  var collectionAddresses = allCollections.map(it => it.address);

  //The EthItem Token Standard implements the event NewItem(uint256 indexed objectId, address indexed interoperableInterfaceAddress) raised every time a new Item is created/wrapped for the first time
  var topics = [web3.utils.sha3("NewItem(uint256,address)")];

  var logs = useLogsResult(collectionAddresses, topics)

  //logs.then(function (result) {
    console.log('***************************************')
    console.log('logs: ', logs)
    console.log('collectionAddresses: ', collectionAddresses)
    console.log('***************************************')
  //})

  return useMemo(() => {
    if (!chainId) return undefined
    if (ethItemERC20WrapperAddresses.loading || knowledgeBaseAddress.loading) return null
    if (ethItemERC20WrapperAddresses.result) {
      return collections
    }
  }, [
    chainId,
    ethItemERC20WrapperAddresses.loading,
    ethItemERC20WrapperAddresses.result,
    knowledgeBaseAddress.loading,
    knowledgeBaseAddress.result,
    collections
  ])
}

export function useLogsResult(
  addresses: string[] | string | undefined,
  topics: (string | null)[],
) {
  const web3 = new Web3(Web3.givenProvider);

  const result = useMemo(() => web3.eth.getPastLogs({
    address: addresses,
    topics
  }), [addresses, topics])

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
