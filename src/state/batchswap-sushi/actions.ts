import { Currency, CurrencyAmount } from '@materia-dex/sdk'
import { createAction } from '@reduxjs/toolkit'

export enum Field {
  INPUT = 'INPUT',
  OUTPUT = 'OUTPUT',
  OUTPUT_1 = 'OUTPUT_1',
  OUTPUT_2 = 'OUTPUT_2',
  OUTPUT_3 = 'OUTPUT_3',
  OUTPUT_4 = 'OUTPUT_4',
  OUTPUT_5 = 'OUTPUT_5',
  OUTPUT_6 = 'OUTPUT_6',
  OUTPUT_7 = 'OUTPUT_7',
  OUTPUT_8 = 'OUTPUT_8',
  OUTPUT_9 = 'OUTPUT_9',
  OUTPUT_10 = 'OUTPUT_10'
}

export const selectCurrency = createAction<{
  field: Field
  otherField: Field
  currencyId: string
  interoperable?: string
  currency: Currency
}>('batchswapSushi/selectCurrency')
export const clearCurrency = createAction<{ field: Field }>('batchswapSushi/clearCurrency')
export const typeInput = createAction<{ field: Field; typedValue: string }>('batchswapSushi/typeInput')
export const setInitialState = createAction<{ inputCurrency?: Currency; inputCurrencyId?: string }>(
  'batchswapSushi/setInitialState'
)
export const setAmountMin = createAction<{ field: Field; amount?: CurrencyAmount }>('batchswapSushi/setAmountMin')
export const resetBatchSwapOutputs = createAction<{}>('batchswapSushi/resetBatchSwapOutputs')
export const setHasTrade = createAction<{ field: Field; trade: boolean }>('batchswapSushi/setHasTrade')
