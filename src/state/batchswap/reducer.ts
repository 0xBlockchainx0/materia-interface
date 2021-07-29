import { Currency, CurrencyAmount } from '@materia-dex/sdk'
import { createReducer } from '@reduxjs/toolkit'
import {
  Field,
  selectCurrency,
  clearCurrency,
  typeInput,
  setInitialState,
  setAmountMin,
  resetBatchSwapOutputs,
  setHasTrade
} from './actions'

export interface BatchSwapField {
  readonly currency: Currency | undefined
  readonly currencyAmountMin: CurrencyAmount | undefined
  readonly currencyId: string | undefined
  readonly interoperable: string | undefined
  readonly typedValue: string
  readonly trade: boolean
}
export interface BatchSwapState {
  readonly independentField: Field
  readonly typedValue: string
  readonly [Field.INPUT]: BatchSwapField
  readonly [Field.OUTPUT]: BatchSwapField
  readonly [Field.OUTPUT_1]: BatchSwapField
  readonly [Field.OUTPUT_2]: BatchSwapField
  readonly [Field.OUTPUT_3]: BatchSwapField
  readonly [Field.OUTPUT_4]: BatchSwapField
  readonly [Field.OUTPUT_5]: BatchSwapField
  readonly [Field.OUTPUT_6]: BatchSwapField
  readonly [Field.OUTPUT_7]: BatchSwapField
  readonly [Field.OUTPUT_8]: BatchSwapField
  readonly [Field.OUTPUT_9]: BatchSwapField
  readonly [Field.OUTPUT_10]: BatchSwapField
  // the typed recipient address or ENS name, or null if swap should go to sender
  readonly recipient: string | null
}

const initialInputFieldState: BatchSwapField = {
  currency: undefined,
  currencyAmountMin: undefined,
  currencyId: '',
  interoperable: undefined,
  typedValue: '',
  trade: false
}

const initialOutputFieldState: BatchSwapField = {
  currency: undefined,
  currencyAmountMin: undefined,
  currencyId: '',
  interoperable: undefined,
  typedValue: '0',
  trade: false
}

const initialState: BatchSwapState = {
  independentField: Field.INPUT,
  typedValue: '',
  [Field.INPUT]: { ...initialInputFieldState },
  [Field.OUTPUT]: { ...initialOutputFieldState },
  [Field.OUTPUT_1]: { ...initialOutputFieldState },
  [Field.OUTPUT_2]: { ...initialOutputFieldState },
  [Field.OUTPUT_3]: { ...initialOutputFieldState },
  [Field.OUTPUT_4]: { ...initialOutputFieldState },
  [Field.OUTPUT_5]: { ...initialOutputFieldState },
  [Field.OUTPUT_6]: { ...initialOutputFieldState },
  [Field.OUTPUT_7]: { ...initialOutputFieldState },
  [Field.OUTPUT_8]: { ...initialOutputFieldState },
  [Field.OUTPUT_9]: { ...initialOutputFieldState },
  [Field.OUTPUT_10]: { ...initialOutputFieldState },
  recipient: null
}

export default createReducer<BatchSwapState>(initialState, builder =>
  builder
    .addCase(selectCurrency, (state, { payload: { currencyId, field, otherField, interoperable, currency } }) => {
      if (currencyId === state[otherField].currencyId) {
        // the case where we have to swap the order
        return {
          ...state,
          independentField: Field.INPUT,
          [field]: {
            ...state[field],
            currencyId: currencyId,
            currency: currency,
            interoperable: interoperable
          },
          [otherField]: {
            ...state[otherField]
          }
        }
      } else {
        // the normal case
        return {
          ...state,
          [field]: {
            ...state[field],
            currencyId: currencyId,
            currency: currency,
            interoperable: interoperable
          }
        }
      }
    })
    .addCase(clearCurrency, (state, { payload: { field } }) => {
      return {
        ...state,
        independentField: Field.INPUT,
        [field]: field === Field.INPUT ? { ...initialInputFieldState } : { ...initialOutputFieldState }
      }
    })
    .addCase(typeInput, (state, { payload: { field, typedValue } }) => {
      return {
        ...state,
        independentField: Field.INPUT,
        [field]: {
          ...state[field],
          typedValue: typedValue
        }
      }
    })
    .addCase(setInitialState, (state, { payload: { inputCurrency, inputCurrencyId } }) => {
      return {
        ...initialState,
        [Field.INPUT]: {
          ...initialInputFieldState,
          currency: inputCurrency,
          currencyId: inputCurrencyId
        }
      }
    })
    .addCase(setAmountMin, (state, { payload: { field, amount } }) => {
      return {
        ...state,
        [field]: {
          ...state[field],
          currencyAmountMin: amount
        }
      }
    })
    .addCase(resetBatchSwapOutputs, (state, { payload: { } }) => {
      return {
        ...state,
        [Field.OUTPUT]: { ...initialOutputFieldState },
        [Field.OUTPUT_1]: { ...initialOutputFieldState },
        [Field.OUTPUT_2]: { ...initialOutputFieldState },
        [Field.OUTPUT_3]: { ...initialOutputFieldState },
        [Field.OUTPUT_5]: { ...initialOutputFieldState },
        [Field.OUTPUT_6]: { ...initialOutputFieldState },
        [Field.OUTPUT_7]: { ...initialOutputFieldState },
        [Field.OUTPUT_8]: { ...initialOutputFieldState },
        [Field.OUTPUT_9]: { ...initialOutputFieldState },
        [Field.OUTPUT_10]: { ...initialOutputFieldState }
      }
    })
    .addCase(setHasTrade, (state, { payload: { field, trade } }) => {
      return {
        ...state,
        [field]: {
          ...state[field],
          trade: trade
        }
      }
    })
)
