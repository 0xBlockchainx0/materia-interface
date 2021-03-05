import { createAction } from '@reduxjs/toolkit'

export enum Field {
  INPUT = 'INPUT',
}

export const typeInput = createAction<{ field: Field; typedValue: string }>('wrap/typeInputWrap')
