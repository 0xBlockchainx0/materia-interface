import { createReducer } from '@reduxjs/toolkit'
import { Field, typeInput } from './actions'

export interface BurnState {
  readonly independentField: Field
  readonly typedValue: string
  readonly [Field.INPUT]: {
    readonly currencyId: string | undefined
  }
}

const initialState: BurnState = {
  independentField: Field.INPUT,
  typedValue: '0',
  [Field.INPUT]: {
    currencyId: ''
  }
}

export default createReducer<BurnState>(initialState, builder =>
  builder.addCase(typeInput, (state, { payload: { field, typedValue } }) => {
    return {
      ...state,
      independentField: field,
      typedValue
    }
  })
)
