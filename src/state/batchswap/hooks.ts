import useENS from '../../hooks/useENS'
import { ChainId, Currency, CurrencyAmount, ETHER, IETH, JSBI, Token, Trade } from '@materia-dex/sdk'
import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useActiveWeb3React } from '../../hooks'
import { useCurrency } from '../../hooks/Tokens'
import { useTradeExactIn, useTradeExactOut } from '../../hooks/Trades'
import { isAddress } from '../../utils'
import { AppDispatch, AppState } from '../index'
import { useCurrencyBalances } from '../wallet/hooks'
import { clearCurrency, Field, selectCurrency, typeInput, setInitialDefaultInput } from './actions'
import { useUserSlippageTolerance } from '../user/hooks'
import { computeSlippageAdjustedAmounts } from '../../utils/prices'
import useGetEthItemInteroperable from '../../hooks/useGetEthItemInteroperable'
import { BAD_RECIPIENT_ADDRESSES, involvesAddress, tryParseAmount } from '../swap/hooks'
import { TokenOutParameter } from '../../hooks/useBatchSwapCallback'
import { unwrappedToken, wrappedCurrency } from '../../utils/wrappedCurrency'
import { WUSD } from '../../constants'

export function useBatchSwapState(): AppState['batchswap'] {
  return useSelector<AppState, AppState['batchswap']>(state => state.batchswap)
}

export function useBatchSwapActionHandlers(): {
  onCurrencySelection: (field: Field, otherField: Field, currency: Currency, interoperable?: string) => void
  onCurrencyRemoval: (field: Field) => void
  onUserInput: (field: Field, typedValue: string) => void
} {
  const dispatch = useDispatch<AppDispatch>()
  const onCurrencySelection = useCallback(
    (field: Field, otherField: Field, currency: Currency, interoperable?: string) => {
      dispatch(
        selectCurrency({
          field,
          otherField,
          currency: currency,
          currencyId: currency instanceof Token ? currency.address : currency === ETHER ? 'ETH' : '',
          interoperable: interoperable
        })
      )
    },
    [dispatch]
  )

  const onCurrencyRemoval = useCallback(
    (field: Field) => {
      dispatch(
        clearCurrency({
          field
        })
      )
    },
    [dispatch]
  )

  const onUserInput = useCallback(
    (field: Field, typedValue: string) => {
      dispatch(typeInput({ field, typedValue }))
    },
    [dispatch]
  )

  return {
    onCurrencySelection,
    onCurrencyRemoval,
    onUserInput
  }
}

// from the current batch swap inputs, compute the best trade and return it.
export function useDerivedBatchSwapInfo(
  outputField: Field,
  interoperable: boolean | false
): {
  currencies: { [field in Field]?: Currency }
  originalCurrencies: { [field in Field]?: Currency }
  currencyBalances: { [field in Field]?: CurrencyAmount }
  originalCurrencyBalances: { [field in Field]?: CurrencyAmount }
  parsedAmount: CurrencyAmount | undefined
  v2Trade: Trade | undefined
  inputError?: string
} {
  const { account, chainId } = useActiveWeb3React()
  const batchSwapState = useBatchSwapState()
  const {
    independentField,
    [Field.INPUT]: { typedValue: inputTypedValue, currencyId: inputCurrencyId },
    [outputField]: { typedValue: outputTypedValue, currencyId: outputCurrencyId },
    recipient
  } = batchSwapState

  const outputPercentage: number = parseFloat(outputTypedValue ?? 0)
  const calculatedTypedValue = (parseFloat(inputTypedValue ?? 0) * outputPercentage) / 100
  const typedValue = calculatedTypedValue.toString()

  const inputCurrencyInteroperableId = useGetEthItemInteroperable(inputCurrencyId)
  const outputCurrencyInteroperableId = useGetEthItemInteroperable(outputCurrencyId)

  const inputCurrency: Currency | undefined = useCurrency(inputCurrencyId) ?? undefined
  const outputCurrency: Currency | undefined = useCurrency(outputCurrencyId) ?? undefined

  let inputCurrencyInteroperable: Currency | undefined = useCurrency(inputCurrencyInteroperableId) ?? undefined
  let outputCurrencyInteroperable: Currency | undefined = useCurrency(outputCurrencyInteroperableId) ?? undefined

  inputCurrencyInteroperable = inputCurrency === ETHER ? IETH[chainId ?? 1] : inputCurrencyInteroperable
  outputCurrencyInteroperable = outputCurrency === ETHER ? IETH[chainId ?? 1] : outputCurrencyInteroperable

  const recipientLookup = useENS(recipient ?? undefined)
  const to: string | null = (recipient === null ? account : recipientLookup.address) ?? null

  const originalRelevantTokenBalances = useCurrencyBalances(account ?? undefined, [
    inputCurrency ?? undefined,
    outputCurrency ?? undefined
  ])

  const relevantTokenBalances = useCurrencyBalances(account ?? undefined, [
    interoperable ? inputCurrencyInteroperable ?? inputCurrency : inputCurrency ?? undefined,
    interoperable ? outputCurrencyInteroperable ?? outputCurrency : outputCurrency ?? undefined
  ])

  const isExactIn: boolean = independentField === Field.INPUT

  const parsedAmount = tryParseAmount(
    typedValue,
    (isExactIn ? inputCurrencyInteroperable ?? inputCurrency : outputCurrencyInteroperable ?? outputCurrency) ??
      undefined
  )

  const bestTradeExactIn = useTradeExactIn(
    isExactIn ? parsedAmount : undefined,
    outputCurrencyInteroperable ?? outputCurrency ?? undefined
  )
  const bestTradeExactOut = useTradeExactOut(
    inputCurrencyInteroperable ?? inputCurrency ?? undefined,
    !isExactIn ? parsedAmount : undefined
  )

  const v2Trade = isExactIn ? bestTradeExactIn : bestTradeExactOut

  const currencyBalances = {
    [Field.INPUT]: relevantTokenBalances[0],
    [outputField]: relevantTokenBalances[1]
  }
  const currencies: { [field in Field]?: Currency } = {
    [Field.INPUT]: interoperable ? inputCurrencyInteroperable ?? inputCurrency : inputCurrency ?? undefined,
    [outputField]: interoperable ? outputCurrencyInteroperable ?? outputCurrency : outputCurrency ?? undefined
  }

  const originalCurrencyBalances = {
    [Field.INPUT]: originalRelevantTokenBalances[0],
    [outputField]: originalRelevantTokenBalances[1]
  }
  const originalCurrencies: { [field in Field]?: Currency } = {
    [Field.INPUT]: inputCurrency ?? undefined,
    [outputField]: outputCurrency ?? undefined
  }

  let inputError: string | undefined
  if (!account) {
    inputError = 'Connect Wallet'
  }

  if (!parsedAmount) {
    inputError = inputError ?? 'Enter an amount'
  }

  if (!originalCurrencies[Field.INPUT] || !originalCurrencies[outputField]) {
    inputError = inputError ?? 'Select a token'
  }

  const formattedTo = isAddress(to)
  if (!to || !formattedTo) {
    inputError = inputError ?? 'Enter a recipient'
  } else {
    if (
      BAD_RECIPIENT_ADDRESSES.indexOf(formattedTo) !== -1 ||
      (bestTradeExactIn && involvesAddress(bestTradeExactIn, formattedTo)) ||
      (bestTradeExactOut && involvesAddress(bestTradeExactOut, formattedTo))
    ) {
      inputError = inputError ?? 'Invalid recipient'
    }
  }

  const [allowedSlippage] = useUserSlippageTolerance()

  const slippageAdjustedAmounts = v2Trade && allowedSlippage && computeSlippageAdjustedAmounts(v2Trade, allowedSlippage)

  // compare input balance to max input
  const [balanceIn, amountIn] = [
    originalCurrencyBalances[Field.INPUT],
    slippageAdjustedAmounts ? slippageAdjustedAmounts[Field.INPUT] : null
  ]

  if (balanceIn && amountIn && balanceIn.lessThan(amountIn)) {
    inputError = 'Insufficient ' + originalCurrencies[Field.INPUT]?.symbol + ' balance'
  }

  return {
    currencies,
    originalCurrencies,
    currencyBalances,
    originalCurrencyBalances,
    parsedAmount,
    v2Trade: v2Trade ?? undefined,
    inputError
  }
}

export function useOutputsParametersInfo(
  outputFields: Field[]
): {
  outputsInfo: TokenOutParameter[] | undefined
} {
  const { chainId } = useActiveWeb3React()
  const batchSwapState = useBatchSwapState()
  const outputsInfo: TokenOutParameter[] = []

  outputFields.map(outputField => {
    const {
      [outputField]: { typedValue: outputTypedValue, currency: outputCurrency, interoperable: interoperable }
    } = batchSwapState

    const outputToken = wrappedCurrency(outputCurrency, chainId)
    const outputInfo: TokenOutParameter = {
      token: outputToken,
      interoperable: interoperable,
      percentage: parseInt(outputTypedValue ?? 0),
      amount: undefined
    }

    outputsInfo.push(outputInfo)
  })

  return {
    outputsInfo: outputsInfo
  }
}

export function useBatchSwapDefaults(): { inputCurrencyId: string | undefined } | undefined {
  const { chainId } = useActiveWeb3React()
  const dispatch = useDispatch<AppDispatch>()
  const [result, setResult] = useState<{ inputCurrencyId: string | undefined } | undefined>()

  useEffect(() => {
    if (!chainId) return

    const token = WUSD[chainId]

    dispatch(
      setInitialDefaultInput({
        inputCurrencyId: token.address
      })
    )

    setResult({ inputCurrencyId: token.address })
  }, [dispatch, chainId])

  return result
}
