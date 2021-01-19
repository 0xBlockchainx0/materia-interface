import useENS from '../../hooks/useENS'
import { parseUnits } from '@ethersproject/units'
import { ChainId, Currency, CurrencyAmount, ETHER, IETH, JSBI, Token, TokenAmount, Trade } from '@materia-dex/sdk'
import { ParsedQs } from 'qs'
import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useActiveWeb3React } from '../../hooks'
import { useCurrency } from '../../hooks/Tokens'
import { useTradeExactIn, useTradeExactOut } from '../../hooks/Trades'
import useParsedQueryString from '../../hooks/useParsedQueryString'
import { isAddress } from '../../utils'
import { AppDispatch, AppState } from '../index'
import { useCurrencyBalances } from '../wallet/hooks'
import { Field, replaceSwapState, selectCurrency, setRecipient, switchCurrencies, typeInput } from './actions'
import { SwapState } from './reducer'
import { useUserSlippageTolerance } from '../user/hooks'
import { computeSlippageAdjustedAmounts } from '../../utils/prices'
import { ERC20WRAPPER, FACTORY_ADDRESS, MATERIA_DFO_ADDRESS, ORCHESTRATOR_ADDRESS, USD } from '../../constants'
import useGetEthItemInteroperable from '../../hooks/useGetEthItemInteroperable'
import { formatUnits } from 'ethers/lib/utils'

export function useSwapState(): AppState['swap'] {
  return useSelector<AppState, AppState['swap']>(state => state.swap)
}

export function useSwapActionHandlers(): {
  onCurrencySelection: (field: Field, currency: Currency) => void
  onSwitchTokens: () => void
  onUserInput: (field: Field, typedValue: string) => void
  onChangeRecipient: (recipient: string | null) => void
} {
  const dispatch = useDispatch<AppDispatch>()
  const onCurrencySelection = useCallback(
    (field: Field, currency: Currency) => {
      dispatch(
        selectCurrency({
          field,
          currencyId: currency instanceof Token ? currency.address : currency === ETHER ? 'ETH' : ''
        })
      )
    },
    [dispatch]
  )

  const onSwitchTokens = useCallback(() => {
    dispatch(switchCurrencies())
  }, [dispatch])

  const onUserInput = useCallback(
    (field: Field, typedValue: string) => {
      dispatch(typeInput({ field, typedValue }))
    },
    [dispatch]
  )

  const onChangeRecipient = useCallback(
    (recipient: string | null) => {
      dispatch(setRecipient({ recipient }))
    },
    [dispatch]
  )

  return {
    onSwitchTokens,
    onCurrencySelection,
    onUserInput,
    onChangeRecipient
  }
}

// try to parse a user entered amount for a given token
export function tryParseAmount(value?: string, currency?: Currency): CurrencyAmount | undefined {
  if (!value || !currency) {
    return undefined
  }
  try {
    const typedValueParsed = parseUnits(value, currency.decimals).toString()
    if (typedValueParsed !== '0') {
      return currency instanceof Token
        ? new TokenAmount(currency, JSBI.BigInt(typedValueParsed))
        : CurrencyAmount.ether(JSBI.BigInt(typedValueParsed))
    }
  } catch (error) {
    // should fail if the user specifies too many decimal places of precision (or maybe exceed max uint?)
    console.debug(`Failed to parse input amount: "${value}"`, error)
  }
  // necessary for all paths to return a value
  return undefined
}

// try to parse a user entered amount for a given token
export function trySaferParseAmount(value?: string, currency?: Currency, decimals?: number): CurrencyAmount | undefined {
  if (!value || !currency) {
    return undefined
  }
  try {
    const typedValueParsed = parseUnits(value, currency.decimals).toString()
    if (typedValueParsed !== '0') {
      return currency instanceof Token
        ? new TokenAmount(currency, JSBI.BigInt(typedValueParsed))
        : CurrencyAmount.ether(JSBI.BigInt(typedValueParsed))
    }
  } catch (error) {
    // should fail if the user specifies too many decimal places of precision (or maybe exceed max uint?)
    console.debug(`Failed to parse input amount: "${value}"`, error)
    try {
      if (decimals) {
        const typedValueParsed = parseUnits(value, decimals).toString()
        if (typedValueParsed !== '0') {
          return currency instanceof Token
            ? new TokenAmount(currency, JSBI.BigInt(typedValueParsed))
            : CurrencyAmount.ether(JSBI.BigInt(typedValueParsed))
        }
      }
    } catch (error) {
      // should fail if the user specifies too many decimal places of precision (or maybe exceed max uint?)
      console.debug(`Failed to parse input amount with provided decimals: "${value}"`, error)
    }
  }
  // necessary for all paths to return a value
  return undefined
}

// try to parse a user entered amount for a given token
export function trySaferParseAmountIncludingZeroValues(value?: string, currency?: Currency, decimals?: number): CurrencyAmount | undefined {
  if (!value || !currency) {
    return undefined
  }
  try {
    const typedValueParsed = parseUnits(value, currency.decimals).toString()
    return currency instanceof Token
      ? new TokenAmount(currency, JSBI.BigInt(typedValueParsed))
      : CurrencyAmount.ether(JSBI.BigInt(typedValueParsed))
  } catch (error) {
    // should fail if the user specifies too many decimal places of precision (or maybe exceed max uint?)
    console.debug(`Failed to parse input amount: "${value}"`, error)
    try {
      if (decimals) {
        const typedValueParsed = parseUnits(value, decimals).toString()
        return currency instanceof Token
          ? new TokenAmount(currency, JSBI.BigInt(typedValueParsed))
          : CurrencyAmount.ether(JSBI.BigInt(typedValueParsed))
      }
    } catch (error) {
      // should fail if the user specifies too many decimal places of precision (or maybe exceed max uint?)
      console.debug(`Failed to parse input amount with provided decimals: "${value}"`, error)
    }
  }
  // necessary for all paths to return a value
  return undefined
}

export function decodeInteroperableValueToERC20TokenAmount(currencyAmount?: CurrencyAmount, erc20CurrencyAmount?: CurrencyAmount): CurrencyAmount | undefined {
  if (!currencyAmount || !erc20CurrencyAmount) {
    return undefined
  }
  const value = currencyAmount.toExact()
  const currency = currencyAmount.currency
  const erc20Currency = erc20CurrencyAmount.currency

  if (!value || !currency || !erc20Currency) {
    return undefined
  }
  try {
    const formattedDecimals = currency.decimals - erc20Currency.decimals
    const typedValueParsed = parseUnits(value, currency.decimals).toString()

    let typedValueFormatted: Number = Number(0)

    if (formattedDecimals >= 0) {
      typedValueFormatted = Number(formatUnits(typedValueParsed, formattedDecimals))
    }
    else {
      // EthItem can't unwrap token with more than 18 decimals 
      throw 'Too much decimals for EthItem'
    }

    // console.log('*********************************')
    // console.log('typedValueParsed: ', typedValueParsed)
    // console.log('typedValueFormatted: ', typedValueFormatted)
    // console.log('*********************************')

    return erc20Currency instanceof Token
      ? new TokenAmount(erc20Currency, JSBI.BigInt(typedValueFormatted))
      : CurrencyAmount.ether(JSBI.BigInt(typedValueFormatted))
  } catch (error) {
    // should fail if the user specifies too many decimal places of precision (or maybe exceed max uint?)
    console.log(`Failed to parse input amount: "${value}"`, error)
  }
  return undefined
}

const BAD_RECIPIENT_ADDRESSES: string[] = [
  FACTORY_ADDRESS,
  ORCHESTRATOR_ADDRESS,
  MATERIA_DFO_ADDRESS,
  ERC20WRAPPER[ChainId.ROPSTEN],
  ERC20WRAPPER[ChainId.MAINNET]
]

/**
 * Returns true if any of the pairs or tokens in a trade have the given checksummed address
 * @param trade to check for the given address
 * @param checksummedAddress address to check in the pairs and tokens
 */
function involvesAddress(trade: Trade, checksummedAddress: string): boolean {
  return (
    trade.route.path.some(token => token.address === checksummedAddress) ||
    trade.route.pairs.some(pair => pair.liquidityToken.address === checksummedAddress)
  )
}

// from the current swap inputs, compute the best trade and return it.
export function useDerivedSwapInfo(
  interoperable: boolean | false
): {
  currencies: { [field in Field]?: Currency }
  originalCurrencies: { [field in Field]?: Currency }
  currencyBalances: { [field in Field]?: CurrencyAmount }
  originalCurrencyBalances: { [field in Field]?: CurrencyAmount }
  parsedAmount: CurrencyAmount | undefined
  v2Trade: Trade | undefined,
  inputError?: string
} {
  const { account, chainId } = useActiveWeb3React()
  const swapState = useSwapState()
  const {
    independentField,
    typedValue,
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
    recipient
  } = swapState
  
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
    interoperable ? (inputCurrencyInteroperable ?? inputCurrency) : inputCurrency ?? undefined,
    interoperable ? (outputCurrencyInteroperable ?? outputCurrency) : outputCurrency ?? undefined
  ])

  const isExactIn: boolean = independentField === Field.INPUT

  const parsedAmount = tryParseAmount(typedValue,
    (isExactIn ?
      inputCurrencyInteroperable ?? inputCurrency :
      outputCurrencyInteroperable ?? outputCurrency)
    ?? undefined
  )

  const bestTradeExactIn = useTradeExactIn(
    (isExactIn ? parsedAmount : undefined),
    (outputCurrencyInteroperable ?? outputCurrency) ?? undefined
  )
  const bestTradeExactOut = useTradeExactOut(
    (inputCurrencyInteroperable ?? inputCurrency) ?? undefined,
    (!isExactIn ? parsedAmount : undefined)
  )

  const v2Trade = isExactIn ? bestTradeExactIn : bestTradeExactOut

  console.log('***************************************')
  console.log('interoperable: ', interoperable)
  console.log('inputCurrency: ', inputCurrency)
  console.log('outputCurrency: ', outputCurrency)
  console.log('inputCurrencyInteroperable: ', inputCurrencyInteroperable)
  console.log('outputCurrencyInteroperable: ', outputCurrencyInteroperable)
  console.log('isExactIn: ', isExactIn)
  console.log('parsedAmount: ', parsedAmount)
  console.log('bestTradeExactIn: ', bestTradeExactIn)
  console.log('bestTradeExactOut: ', bestTradeExactOut)
  console.log('v2Trade: ', v2Trade)
  console.log('***************************************')

  const currencyBalances = {
    [Field.INPUT]: relevantTokenBalances[0],
    [Field.OUTPUT]: relevantTokenBalances[1]
  }
  const currencies: { [field in Field]?: Currency } = {
    [Field.INPUT]: interoperable ? (inputCurrencyInteroperable ?? inputCurrency) : inputCurrency ?? undefined,
    [Field.OUTPUT]: interoperable ? (outputCurrencyInteroperable ?? outputCurrency) : outputCurrency ?? undefined
  }

  const originalCurrencyBalances = {
    [Field.INPUT]: originalRelevantTokenBalances[0],
    [Field.OUTPUT]: originalRelevantTokenBalances[1]
  }
  const originalCurrencies: { [field in Field]?: Currency } = {
    [Field.INPUT]: inputCurrency ?? undefined,
    [Field.OUTPUT]: outputCurrency ?? undefined
  }

  let inputError: string | undefined
  if (!account) {
    inputError = 'Connect Wallet'
  }

  if (!parsedAmount) {
    inputError = inputError ?? 'Enter an amount'
  }

  if (!originalCurrencies[Field.INPUT] || !originalCurrencies[Field.OUTPUT]) {
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
    slippageAdjustedAmounts
      ? slippageAdjustedAmounts[Field.INPUT]
      : null
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
    inputError,
  }
}

function parseCurrencyFromURLParameter(urlParam: any, chainId: ChainId | undefined): string {
  const defaultCurrency = chainId ? (USD[chainId]?.address ?? 'ETH') : 'ETH'

  if (typeof urlParam === 'string') {
    const valid = isAddress(urlParam)
    if (valid) return valid
    if (urlParam.toUpperCase() === 'ETH') return 'ETH'
    if (valid === false) return defaultCurrency
  }
  return defaultCurrency ?? ''
}

function parseTokenAmountURLParameter(urlParam: any): string {
  return typeof urlParam === 'string' && !isNaN(parseFloat(urlParam)) ? urlParam : ''
}

function parseIndependentFieldURLParameter(urlParam: any): Field {
  return typeof urlParam === 'string' && urlParam.toLowerCase() === 'output' ? Field.OUTPUT : Field.INPUT
}

const ENS_NAME_REGEX = /^[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)?$/
const ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/
function validatedRecipient(recipient: any): string | null {
  if (typeof recipient !== 'string') return null
  const address = isAddress(recipient)
  if (address) return address
  if (ENS_NAME_REGEX.test(recipient)) return recipient
  if (ADDRESS_REGEX.test(recipient)) return recipient
  return null
}

export function queryParametersToSwapState(parsedQs: ParsedQs, chainId: ChainId | undefined): SwapState {
  let inputCurrency = parseCurrencyFromURLParameter(parsedQs.inputCurrency, chainId)
  let outputCurrency = parseCurrencyFromURLParameter(parsedQs.outputCurrency, chainId)
  if (inputCurrency === outputCurrency) {
    if (typeof parsedQs.outputCurrency === 'string') {
      inputCurrency = ''
    } else {
      outputCurrency = ''
    }
  }

  const recipient = validatedRecipient(parsedQs.recipient)

  return {
    [Field.INPUT]: {
      currencyId: inputCurrency
    },
    [Field.OUTPUT]: {
      currencyId: outputCurrency
    },
    typedValue: parseTokenAmountURLParameter(parsedQs.exactAmount),
    independentField: parseIndependentFieldURLParameter(parsedQs.exactField),
    recipient
  }
}

// updates the swap state to use the defaults for a given network
export function useDefaultsFromURLSearch():
  | { inputCurrencyId: string | undefined; outputCurrencyId: string | undefined }
  | undefined {
  const { chainId } = useActiveWeb3React()
  const dispatch = useDispatch<AppDispatch>()
  const parsedQs = useParsedQueryString()
  const [result, setResult] = useState<
    { inputCurrencyId: string | undefined; outputCurrencyId: string | undefined } | undefined
  >()

  useEffect(() => {
    if (!chainId) return
    const parsed = queryParametersToSwapState(parsedQs, chainId)

    dispatch(
      replaceSwapState({
        typedValue: parsed.typedValue,
        field: parsed.independentField,
        inputCurrencyId: parsed[Field.INPUT].currencyId,
        outputCurrencyId: parsed[Field.OUTPUT].currencyId,
        recipient: parsed.recipient
      })
    )

    setResult({ inputCurrencyId: parsed[Field.INPUT].currencyId, outputCurrencyId: parsed[Field.OUTPUT].currencyId })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, chainId])

  return result
}
