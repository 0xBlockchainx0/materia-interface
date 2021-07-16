import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import { save, load } from 'redux-localstorage-simple'

import application from './application/reducer'
import { updateVersion } from './global/actions'
import user from './user/reducer'
import transactions from './transactions/reducer'
import swap from './swap/reducer'
import batchswap from './batchswap/reducer'
import mint from './mint/reducer'
import lists from './lists/reducer'
import burn from './burn/reducer'
import multicall from './multicall/reducer'
import wrap from './wrap/reducer'

const PERSISTED_KEYS: string[] = ['user', 'transactions', 'lists']

const store = configureStore({
  reducer: {
    application,
    user,
    transactions,
    swap,
    batchswap,
    mint,
    burn,
    multicall,
    lists,
    wrap
  },
  middleware: [...getDefaultMiddleware({
    thunk: false,
    serializableCheck: {
      ignoredActions: [
        'application/updateBlockNumber',
        'user/addSerializedToken',
        'batchswap/selectCurrency',
        'batchswap/typeInput',
        'multicall/fetchingMulticallResults',
        'multicall/updateMulticallResults',
        'multicall/addMulticallListeners',
        'multicall/removeMulticallListeners',
        'transactions/addTransaction',
        'transactions/checkedTransaction',
        'application/setOpenModal'
      ],
      ignoredActionPaths: [
        'payload.currency',
        'batchswap.INPUT.currency',
        'batchswap.OUTPUT.currency',
        'batchswap.OUTPUT_1.currency',
        'batchswap.OUTPUT_2.currency',
        'batchswap.OUTPUT_3.currency',
        'batchswap.OUTPUT_4.currency',
        'batchswap.OUTPUT_5.currency',
        'batchswap.OUTPUT_6.currency',
        'batchswap.OUTPUT_7.currency',
        'batchswap.OUTPUT_8.currency',
        'batchswap.OUTPUT_9.currency',
        'batchswap.OUTPUT_10.currency'
      ],
      ignoredPaths: [],
    },
  }), save({ states: PERSISTED_KEYS })],
  preloadedState: load({ states: PERSISTED_KEYS })
})

store.dispatch(updateVersion())

export default store

export type AppState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
