import { Currency } from '@materia-dex/sdk'
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

export const selectCurrency = createAction<{ field: Field; otherField: Field; currencyId: string, interoperable?: string, currency: Currency }>('batchswap/selectCurrency')
export const clearCurrency  = createAction<{ field: Field; }>('batchswap/clearCurrency')
export const typeInput = createAction<{ field: Field; typedValue: string }>('batchswap/typeInput')