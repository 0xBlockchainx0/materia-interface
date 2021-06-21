import { createAction } from '@reduxjs/toolkit'

export enum Field {
  INPUT = 'INPUT',
  OUTPUT = 'OUTPUT',
  OUTPUTS = 'OUTPUTS'
}

export const selectCurrency = createAction<{ field: Field; currencyId: string, itemId: number }>('batchswap/selectCurrency')
export const typeInput = createAction<{ typedValue: string }>('batchswap/typeInput')
export const replaceBatchSwapState = createAction<{
  typedValue: string
  inputCurrencyId?: string
  outputCurrencyIds?: Array<string>
  itemId: number
  recipient: string | null
}>('batchswap/replaceBatchSwapState')