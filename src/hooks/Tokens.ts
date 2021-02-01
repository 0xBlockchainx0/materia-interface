import { parseBytes32String, toUtf8Bytes } from '@ethersproject/strings'
import { Currency, ETHER, Token, currencyEquals, ChainId } from '@materia-dex/sdk'
import { keccak256, sha256 } from 'ethers/lib/utils'
import { useEffect, useMemo, useState } from 'react'
import { useAllTokenList, useSelectedTokenList } from '../state/lists/hooks'
import { CallState, NEVER_RELOAD, Result, toCallState, useMultipleContractSingleData, useSingleCallResult } from '../state/multicall/hooks'
import { useInteroperableChecks, usePairAdder, useRemoveInteroperableCheck, useUserAddedTokens } from '../state/user/hooks'
import { isAddress } from '../utils'
import Web3 from 'web3';

import { useActiveWeb3React } from './index'
import { useBytes32TokenContract, useTokenContract } from './useContract'
import { ERC20WRAPPER, ETHITEM_START_BLOCK, USD, ZERO_ADDRESS } from '../constants'
import { unwrappedToken } from '../utils/wrappedCurrency'
import useGetEthItemInteroperable from './useGetEthItemInteroperable'
import { usePair } from '../data/Reserves'
import ERC20_INTERFACE from '../constants/abis/erc20'

export function useManagePairInteroperableChecks(chainId: ChainId): void {
  const tokenAddressUSD = USD[chainId]?.address ?? ""
  const currencyUSD = unwrappedToken(USD[chainId])
  const interoperableChecks = useInteroperableChecks()

  const addTrackedPair = usePairAdder()
  const removeInteroperableCheck = useRemoveInteroperableCheck()

  // interoperableChecks.map((interoperableCheck) => {
  //   const otherCurrencyAddress = interoperableCheck.token0 == tokenAddressUSD ? interoperableCheck.token1 : interoperableCheck.token0
  //   const otherCurrencyInteroperableAddress = useGetEthItemInteroperable(otherCurrencyAddress)
  //   const otherCurrencyInteroperable: Currency | undefined = useCurrency(otherCurrencyInteroperableAddress) ?? undefined
  //   const [pairState, pair] = usePair(currencyUSD, otherCurrencyInteroperable)

  //   if (pair && otherCurrencyInteroperable) {
  //     addTrackedPair(pair)
  //     removeInteroperableCheck(chainId, interoperableCheck.token0, interoperableCheck.token1)
  //   }
  // })
}

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

// export function useAllWrappedERC20Tokens(): { [address: string]: Token } | undefined {
//   const web3 = new Web3();
//   const { chainId, library } = useActiveWeb3React()

//   const topics = [web3.utils.sha3("NewItem(uint256,address)") ?? ""];
//   const logs = useMemo(() =>
//     library?.getLogs({
//       address: ERC20WRAPPER[chainId ?? 1],
//       topics: topics,
//       fromBlock: parseInt(ETHITEM_START_BLOCK[chainId ?? 1]),
//       toBlock: "latest"
//     }), [topics, ERC20WRAPPER, ETHITEM_START_BLOCK])

//   let [resultWrappedToken, setResultWrappedToken] = useState<{ [address: string]: Token } | undefined>(undefined)

//   return useMemo(() => {
//     if (!chainId) return undefined
//     if (!logs) return undefined

//     logs.then(pastLogs => {
//       let wrappedTokens: { [address: string]: Token } = {}

//       pastLogs.reduce<{ [address: string]: Token }>(
//         (previousToken, log) => {
//           const interoperableInterfaceAddress = web3.eth.abi.decodeParameter("address", log.topics[2]).toString()
//           const collectionItem: Token = new Token(chainId ?? 1, interoperableInterfaceAddress ?? ZERO_ADDRESS, 18)

//           wrappedTokens[interoperableInterfaceAddress] = collectionItem

//           return wrappedTokens
//         },
//         { ...wrappedTokens }
//       )

//       console.log('*********************************')
//       console.log('wrappedTokens: ', wrappedTokens)
//       console.log('*********************************')

//       setResultWrappedToken(wrappedTokens)
//     })

//     return resultWrappedToken
//   }, [chainId, logs, resultWrappedToken, setResultWrappedToken])
// }

export function useAllWrappedERC20Tokens(): { [address: string]: Token } | undefined {
  const web3 = new Web3();
  const { chainId, library } = useActiveWeb3React()

  const topics = [web3.utils.sha3("NewItem(uint256,address)") ?? ""];
  const logs = //useMemo(() =>
    library?.getLogs({
      address: ERC20WRAPPER[chainId ?? 1],
      topics: topics,
      fromBlock: parseInt(ETHITEM_START_BLOCK[chainId ?? 1]),
      toBlock: "latest"
    })//, 
  //   [chainId, topics, ETHITEM_START_BLOCK]
  // )

  const [resultWrappedToken, setResultWrappedToken] = useState<{ [address: string]: Token } | undefined>(undefined)
  const [resultWrappedTokenAddresses, setResultWrappedTokenAddresses] = useState<string[]>([])

  // return useMemo(() => {
  // if (!chainId) return undefined
  // if (!logs) return undefined

  let wrappedTokensAddresses: string[] = []

  logs?.then(pastLogs => {
    // const wrappedTokensAddresses: string[] = pastLogs.map(log => web3.eth.abi.decodeParameter("address", log.topics[2]).toString())
    wrappedTokensAddresses = pastLogs.map(log => web3.eth.abi.decodeParameter("address", log.topics[2]).toString())
    setResultWrappedTokenAddresses(wrappedTokensAddresses)
  })

  const tokens = useTokens(resultWrappedTokenAddresses)
  const wrappedLoadedTokens: Token[] = tokens?.filter((item: Token | undefined): item is Token => {
    return !!item
  }) ?? []

  let wrappedTokens: { [address: string]: Token } = {}

  // return useMemo(() => {
  if (!chainId) return undefined
  // if (!logs) return undefined

  wrappedLoadedTokens.reduce<{ [address: string]: Token }>(
    (previousElement, token) => {
      wrappedTokens[token.address] = token
      return wrappedTokens
    },
    { ...wrappedTokens }
  )

  console.log('*********************************')
  console.log('tokens: ', tokens)
  console.log('wrappedTokens: ', wrappedTokens)
  console.log('*********************************')

  setResultWrappedToken(wrappedTokens)

  return resultWrappedToken
  // }, [chainId, resultWrappedToken, setResultWrappedToken])
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

// undefined if invalid or does not exist
// null if loading
// otherwise returns the token
export function useTokens(tokenAddresses?: string[]): Token[] | undefined {
  const { chainId } = useActiveWeb3React()
  const tokenNames = useMultipleContractSingleData(tokenAddresses ?? [], ERC20_INTERFACE, 'name', undefined, NEVER_RELOAD)
  const tokenSymbols = useMultipleContractSingleData(tokenAddresses ?? [], ERC20_INTERFACE, 'symbol', undefined, NEVER_RELOAD)
  const tokenDecimals = useMultipleContractSingleData(tokenAddresses ?? [], ERC20_INTERFACE, 'decimals', undefined, NEVER_RELOAD)

  return useMemo(() => {
    if (!chainId || !tokenAddresses) return undefined

    const tokens = tokenAddresses.map((tokenAddress, index) => {
      const tokenName = tokenNames[index]
      const symbol = tokenSymbols[index]
      const decimals = tokenDecimals[index]

      if (decimals.loading || symbol.loading || tokenName.loading) return null
      if (decimals.result) {
        return new Token(
          chainId,
          tokenAddress,
          decimals.result[0],
          symbol.result?.[0] ?? 'UNKNOWN',
          tokenName.result?.[0] ?? 'Unknown Token'
        )
      }
      return undefined
    }).filter((item: Token | null | undefined): item is Token => {
      return !!item
    })

    return tokens
  }, [
    chainId,
    tokenAddresses,
    tokenNames,
    tokenSymbols,
    tokenDecimals
  ])
}

export function useCurrency(currencyId: string | undefined): Currency | null | undefined {
  const isETH = currencyId?.toUpperCase() === 'ETH'
  const token = useToken(isETH ? undefined : currencyId)
  return isETH ? ETHER : token
}

export function useCurrencies(currenciesIds: string[] | undefined): Currency[] | null | undefined {
  const tokens = useTokens(currenciesIds)
  return tokens
}