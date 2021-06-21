import { createReducer } from '@reduxjs/toolkit'
import { X } from 'react-feather'
import { Field, replaceBatchSwapState, selectCurrency, typeInput } from './actions'

export interface BatchSwapOutput {
  readonly currencyId: string | undefined
}

export interface BatchSwapState {
  readonly independentField: Field
  readonly typedValue: string
  readonly [Field.INPUT]: {
    readonly currencyId: string | undefined
  }
  readonly [Field.OUTPUTS]: Array<BatchSwapOutput>
  // the typed recipient address or ENS name, or null if swap should go to sender
  readonly recipient: string | null
}

const initialState: BatchSwapState = {
  independentField: Field.INPUT,
  typedValue: '',
  [Field.INPUT]: {
    currencyId: ''
  },
  [Field.OUTPUTS]: [{
    currencyId: ''
  }],
  recipient: null
}

export default createReducer<BatchSwapState>(initialState, builder =>
  builder
    .addCase(
      replaceBatchSwapState,
      (state, { payload: { typedValue, recipient, inputCurrencyId, outputCurrencyIds } }) => {
        const outputCurrencies = outputCurrencyIds?.map((currencyId: string) => ({ currencyId: currencyId } as BatchSwapOutput))

        return {
          [Field.INPUT]: {
            currencyId: inputCurrencyId
          },
          [Field.OUTPUTS]: outputCurrencies ? outputCurrencies : [],
          independentField: Field.INPUT,
          typedValue: typedValue,
          recipient
        }
      }
    )
    .addCase(selectCurrency, (state, { payload: { currencyId, field, itemId } }) => {
      let fieldValue = undefined

      if (field === Field.INPUT) {
        fieldValue = { currencyId: currencyId }
      }
      else if (field === Field.OUTPUTS && state[Field.OUTPUTS][itemId]) {
        state[Field.OUTPUTS][itemId].currencyId = currencyId
        fieldValue = state[Field.OUTPUTS]
      }
      else if (field === Field.OUTPUTS && !state[Field.OUTPUTS][itemId]) {
        state[Field.OUTPUTS].push({ currencyId: currencyId })
        fieldValue = state[Field.OUTPUTS]
      }

      return {
        ...state,
        [field]: fieldValue
      }
    })
    .addCase(typeInput, (state, { payload: { typedValue } }) => {
      return {
        ...state,
        independentField: Field.INPUT,
        typedValue
      }
    })
)
