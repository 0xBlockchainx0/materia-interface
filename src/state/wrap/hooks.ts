import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useActiveWeb3React } from '../../hooks'
import { AppDispatch, AppState } from '../index'
import { Field, typeInput } from './actions'
import { Currency, CurrencyAmount, ETHER, JSBI, Token, TokenAmount, Trade } from '@materia-dex/sdk'
import { parseUnits } from '@ethersproject/units'
import { useCurrency } from '../../hooks/Tokens'


export function useWrapState(): AppState['wrap'] {
  return useSelector<AppState, AppState['wrap']>(state => state.wrap)
}

export function useDerivedWrapInfo(): {
  parsedAmount: CurrencyAmount | undefined
  error?: string
} {
  const { account, chainId } = useActiveWeb3React()
  const {
    independentField,
    typedValue,
    [Field.INPUT]: { currencyId: inputCurrencyId },
  } = useWrapState()

  const inputCurrency = useCurrency(inputCurrencyId)

  const parsedAmount = tryParseAmount(typedValue, (inputCurrency) ?? undefined)
  let inputError: string | undefined

  if (!parsedAmount) {
    inputError = inputError ?? 'Enter an amount'
  }

  let error: string | undefined
  if (!account) {
    error = 'Connect Wallet'
  }

  return { parsedAmount, error }
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

export function useWrapActionHandlers(): {
  onUserInput: (field: Field, typedValue: string) => void
} {
  const dispatch = useDispatch<AppDispatch>()

  const onUserInput = useCallback(
    (field: Field, typedValue: string) => {
      dispatch(typeInput({ field, typedValue }))
    },
    [dispatch]
  )

  return {
    onUserInput
  }
}
