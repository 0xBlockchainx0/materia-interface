import { createReducer } from '@reduxjs/toolkit'
import { Field, selectCurrency, typeInput } from './actions'

export interface BatchSwapState {
  readonly independentField: Field
  readonly typedValue: string
  readonly [Field.INPUT]: {
    readonly currencyId: string | undefined
  }
  readonly [Field.OUTPUT]: {
    readonly currencyId: string | undefined
  }
  readonly [Field.OUTPUT_1]: {
    readonly currencyId: string | undefined
  }
  readonly [Field.OUTPUT_2]: {
    readonly currencyId: string | undefined
  }
  readonly [Field.OUTPUT_3]: {
    readonly currencyId: string | undefined
  }
  readonly [Field.OUTPUT_4]: {
    readonly currencyId: string | undefined
  }
  readonly [Field.OUTPUT_5]: {
    readonly currencyId: string | undefined
  }
  readonly [Field.OUTPUT_6]: {
    readonly currencyId: string | undefined
  }
  readonly [Field.OUTPUT_7]: {
    readonly currencyId: string | undefined
  }
  readonly [Field.OUTPUT_8]: {
    readonly currencyId: string | undefined
  }
  readonly [Field.OUTPUT_9]: {
    readonly currencyId: string | undefined
  }
  readonly [Field.OUTPUT_10]: {
    readonly currencyId: string | undefined
  }
  // the typed recipient address or ENS name, or null if swap should go to sender
  readonly recipient: string | null
}

const initialState: BatchSwapState = {
  independentField: Field.INPUT,
  typedValue: '',
  [Field.INPUT]: {
    currencyId: ''
  },
  [Field.OUTPUT]: {
    currencyId: ''
  },
  [Field.OUTPUT_1]: {
    currencyId: ''
  },
  [Field.OUTPUT_2]: {
    currencyId: ''
  },
  [Field.OUTPUT_3]: {
    currencyId: ''
  },
  [Field.OUTPUT_4]: {
    currencyId: ''
  },
  [Field.OUTPUT_5]: {
    currencyId: ''
  },
  [Field.OUTPUT_6]: {
    currencyId: ''
  },
  [Field.OUTPUT_7]: {
    currencyId: ''
  },
  [Field.OUTPUT_8]: {
    currencyId: ''
  },
  [Field.OUTPUT_9]: {
    currencyId: ''
  },
  [Field.OUTPUT_10]: {
    currencyId: ''
  },
  recipient: null
}

export default createReducer<BatchSwapState>(initialState, builder =>
  builder
    .addCase(selectCurrency, (state, { payload: { currencyId, field, otherField } }) => {
      if (currencyId === state[otherField].currencyId) {
        // the case where we have to swap the order
        return {
          ...state,
          independentField: Field.INPUT,
          [field]: { currencyId: currencyId },
          [otherField]: { currencyId: state[field].currencyId }
        }
      } else {
        // the normal case
        return {
          ...state,
          [field]: { currencyId: currencyId }
        }
      }
    })
    .addCase(typeInput, (state, { payload: { field, typedValue } }) => {
      return {
        ...state,
        independentField: Field.INPUT,
        typedValue
      }
    })
)
