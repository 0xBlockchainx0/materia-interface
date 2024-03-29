import { ChainId, Pair, Token } from '@materia-dex/sdk'
import flatMap from 'lodash.flatmap'
import { useCallback, useMemo } from 'react'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { BASES_TO_TRACK_LIQUIDITY_FOR, PINNED_PAIRS } from '../../constants'

import { useActiveWeb3React } from '../../hooks'
import { useAllTokens, useTokens } from '../../hooks/Tokens'
import { AppDispatch, AppState } from '../index'
import {
  addSerializedPair,
  addSerializedToken,
  removeSerializedToken,
  SerializedPair,
  SerializedToken,
  updateUserDarkMode,
  updateUserDeadline,
  updateUserExpertMode,
  updateUserSlippageTolerance,
  toggleURLWarning,
  updateUserClassicMode,
  addInteroperableTokens,
  removeInteroperableTokens
} from './actions'

function serializeToken(token: Token): SerializedToken {
  return {
    chainId: token.chainId,
    address: token.address,
    decimals: token.decimals,
    symbol: token.symbol,
    name: token.name
  }
}

function deserializeToken(serializedToken: SerializedToken): Token {
  return new Token(
    serializedToken.chainId,
    serializedToken.address,
    serializedToken.decimals,
    serializedToken.symbol,
    serializedToken.name
  )
}

export function useIsDarkMode(): boolean {
  const { userDarkMode, matchesDarkMode } = useSelector<
    AppState,
    { userDarkMode: boolean | null; matchesDarkMode: boolean }
  >(
    ({ user: { matchesDarkMode, userDarkMode } }) => ({
      userDarkMode,
      matchesDarkMode
    }),
    shallowEqual
  )

  return userDarkMode === null ? matchesDarkMode : userDarkMode
}

export function useDarkModeManager(): [boolean, () => void] {
  const dispatch = useDispatch<AppDispatch>()
  const darkMode = useIsDarkMode()

  const toggleSetDarkMode = useCallback(() => {
    dispatch(updateUserDarkMode({ userDarkMode: !darkMode }))
  }, [darkMode, dispatch])

  return [darkMode, toggleSetDarkMode]
}

export function useIsClassicMode(): boolean {
  const { userClassicMode, matchesClassicMode } = useSelector<
    AppState,
    { userClassicMode: boolean | null; matchesClassicMode: boolean }
  >(
    ({ user: { matchesClassicMode, userClassicMode } }) => ({
      userClassicMode,
      matchesClassicMode
    }),
    shallowEqual
  )

  return userClassicMode === null ? matchesClassicMode : userClassicMode
}

export function useClassicModeManager(): [boolean, () => void] {
  const dispatch = useDispatch<AppDispatch>()
  const classicMode = useIsClassicMode()

  const toggleSetClassicMode = useCallback(() => {
    dispatch(updateUserClassicMode({ userClassicMode: !classicMode }))
  }, [classicMode, dispatch])

  return [classicMode, toggleSetClassicMode]
}

export function useIsExpertMode(): boolean {
  return useSelector<AppState, AppState['user']['userExpertMode']>(state => state.user.userExpertMode)
}

export function useExpertModeManager(): [boolean, () => void] {
  const dispatch = useDispatch<AppDispatch>()
  const expertMode = useIsExpertMode()

  const toggleSetExpertMode = useCallback(() => {
    dispatch(updateUserExpertMode({ userExpertMode: !expertMode }))
  }, [expertMode, dispatch])

  return [expertMode, toggleSetExpertMode]
}

export function useUserSlippageTolerance(): [number, (slippage: number) => void] {
  const dispatch = useDispatch<AppDispatch>()
  const userSlippageTolerance = useSelector<AppState, AppState['user']['userSlippageTolerance']>(state => {
    return state.user.userSlippageTolerance
  })

  const setUserSlippageTolerance = useCallback(
    (userSlippageTolerance: number) => {
      dispatch(updateUserSlippageTolerance({ userSlippageTolerance }))
    },
    [dispatch]
  )

  return [userSlippageTolerance, setUserSlippageTolerance]
}

export function useUserTransactionTTL(): [number, (slippage: number) => void] {
  const dispatch = useDispatch<AppDispatch>()
  const userDeadline = useSelector<AppState, AppState['user']['userDeadline']>(state => {
    return state.user.userDeadline
  })

  const setUserDeadline = useCallback(
    (userDeadline: number) => {
      dispatch(updateUserDeadline({ userDeadline }))
    },
    [dispatch]
  )

  return [userDeadline, setUserDeadline]
}

export function useAddUserToken(): (token: Token) => void {
  const dispatch = useDispatch<AppDispatch>()
  return useCallback(
    (token: Token) => {
      dispatch(addSerializedToken({ serializedToken: serializeToken(token) }))
    },
    [dispatch]
  )
}

export function useRemoveUserAddedToken(): (chainId: number, address: string) => void {
  const dispatch = useDispatch<AppDispatch>()
  return useCallback(
    (chainId: number, address: string) => {
      dispatch(removeSerializedToken({ chainId, address }))
    },
    [dispatch]
  )
}

export function useUserAddedTokens(): Token[] {
  const { chainId } = useActiveWeb3React()
  const serializedTokensMap = useSelector<AppState, AppState['user']['tokens']>(({ user: { tokens } }) => tokens)

  return useMemo(() => {
    if (!chainId) return []
    return Object.values(serializedTokensMap[chainId as ChainId] ?? {}).map(deserializeToken)
  }, [serializedTokensMap, chainId])
}

export function useInteroperableTokens(): string[] {
  const { chainId } = useActiveWeb3React()
  const interoperableTokensMap = useSelector<AppState, AppState['user']['interoperableTokens']>(({ user: { interoperableTokens } }) => interoperableTokens)

  return useMemo(() => {
    if (!chainId) return []
    return Object.values(interoperableTokensMap[chainId as ChainId] ?? {})
  }, [interoperableTokensMap, chainId])
}

function serializePair(pair: Pair): SerializedPair {
  return {
    token0: serializeToken(pair.token0),
    token1: serializeToken(pair.token1)
  }
}

export function usePairAdder(): (pair: Pair) => void {
  const dispatch = useDispatch<AppDispatch>()

  return useCallback(
    (pair: Pair) => {
      dispatch(addSerializedPair({ serializedPair: serializePair(pair) }))
    },
    [dispatch]
  )
}

export function useURLWarningVisible(): boolean {
  return useSelector((state: AppState) => state.user.URLWarningVisible)
}

export function useURLWarningToggle(): () => void {
  const dispatch = useDispatch()
  return useCallback(() => dispatch(toggleURLWarning()), [dispatch])
}

export function useAddInteroperableTokens(): (chainId: number, interoperableTokens: string[]) => void {
  const dispatch = useDispatch<AppDispatch>()
  return useCallback(
    (chainId: number, interoperableTokens: string[]) => {
      dispatch(
        addInteroperableTokens({ chainId: chainId, interoperableTokens: interoperableTokens }))
    },
    [dispatch]
  )
}

export function useRemoveInteroperableTokens(): (chainId: number) => void {
  const dispatch = useDispatch<AppDispatch>()
  return useCallback(
    (chainId: number) => {
      dispatch(removeInteroperableTokens({ chainId: chainId }))
    },
    [dispatch]
  )
}

/**
 * Given two tokens return the liquidity token that represents its liquidity shares
 * @param tokenA one of the two tokens
 * @param tokenB the other token
 */
export function toLiquidityToken([tokenA, tokenB]: [Token, Token]): Token {
  return new Token(tokenA.chainId, Pair.getAddress(tokenA, tokenB), 18, 'MP', 'Materia Pool')
}

/**
 * Returns all the pairs of tokens that are tracked by the user for the current chain ID.
 */
export function useTrackedTokenPairs(): [Token, Token][] {
  const { chainId } = useActiveWeb3React()
  const interoperableTokens = useInteroperableTokens() ?? []
  
  let tokens = useAllTokens()
  let newInteroperableTokens = interoperableTokens.filter(x => !tokens[x])

  const wrappedTokens = useTokens(newInteroperableTokens)

  tokens = useMemo(() => {
    if (wrappedTokens == undefined) return tokens

    return (Object.keys(wrappedTokens).reduce<{ [address: string]: Token }>(
      (tokenMap, wrappedTokenAddress, index) => {
        if(!tokenMap[wrappedTokenAddress]) tokenMap[wrappedTokenAddress] = wrappedTokens[index]
        return tokenMap
      },
      { ...tokens }
    ))
  }, [tokens, wrappedTokens])

  // pinned pairs
  const pinnedPairs = useMemo(() => (chainId ? PINNED_PAIRS[chainId] ?? [] : []), [chainId])

  // pairs for every token against every base
  const generatedPairs: [Token, Token][] = useMemo(
    () =>
      chainId
        ? flatMap(Object.keys(tokens), tokenAddress => {
          const token = tokens[tokenAddress]
          // for each token on the current chain,
          return (
            // loop though all bases on the current chain
            (BASES_TO_TRACK_LIQUIDITY_FOR[chainId] ?? [])
              // to construct pairs of the given token with each base
              .map(base => {
                if (base.address === token.address) {
                  return null
                } else {
                  return [base, token]
                }
              })
              .filter((p): p is [Token, Token] => p !== null)
          )
        })
        : [],
    [tokens, chainId]
  )

  // pairs saved by users
  const savedSerializedPairs = useSelector<AppState, AppState['user']['pairs']>(({ user: { pairs } }) => pairs)

  const userPairs: [Token, Token][] = useMemo(() => {
    if (!chainId || !savedSerializedPairs) return []
    const forChain = savedSerializedPairs[chainId]
    if (!forChain) return []

    return Object.keys(forChain).map(pairId => {
      return [deserializeToken(forChain[pairId].token0), deserializeToken(forChain[pairId].token1)]
    })
  }, [savedSerializedPairs, chainId])

  const combinedList = useMemo(() => userPairs.concat(generatedPairs).concat(pinnedPairs), [
    generatedPairs,
    pinnedPairs,
    userPairs
  ])

  return useMemo(() => {
    // dedupes pairs of tokens in the combined list
    const keyed = combinedList.reduce<{ [key: string]: [Token, Token] }>((memo, [tokenA, tokenB]) => {
      const sorted = tokenA.sortsBefore(tokenB)
      const key = sorted ? `${tokenA.address}:${tokenB.address}` : `${tokenB.address}:${tokenA.address}`
      if (memo[key]) return memo
      memo[key] = sorted ? [tokenA, tokenB] : [tokenB, tokenA]
      return memo
    }, {})

    return Object.keys(keyed).map(key => keyed[key])
  }, [combinedList])
}
