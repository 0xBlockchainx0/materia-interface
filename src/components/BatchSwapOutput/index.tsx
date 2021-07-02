import React, { useCallback } from 'react'
import styled from 'styled-components'
import { AutoColumn } from '../Column'
import CurrencyInputPanel from '../CurrencyInputPanel'
import { Field } from '../../state/batchswap/actions'
import { useDerivedBatchSwapInfo, useBatchSwapState, useBatchSwapActionHandlers } from '../../state/batchswap/hooks'

export const Center = styled.div`
  display: flex;
  margin: 0 auto;
  justify-content: center;
  padding-top: 5px;
  padding-bottom: 5px;
`

interface BatchSwapOutputProps {
  outputField: Field
}

export default function BatchSwapOutput({ outputField }: BatchSwapOutputProps) {
  // batch swap state
  const { independentField, typedValue, recipient } = useBatchSwapState()
  const {
    v2Trade,
    originalCurrencyBalances,
    parsedAmount,
    currencies,
    originalCurrencies,
  } = useDerivedBatchSwapInfo(outputField, true)

  const trade = v2Trade

  const parsedAmounts = {
    [Field.INPUT]: independentField === Field.INPUT ? parsedAmount : trade?.inputAmount,
    [outputField]: independentField === outputField ? parsedAmount : trade?.outputAmount
  }

  const { onCurrencySelection, onUserInput } = useBatchSwapActionHandlers()
  const dependentField: Field = independentField === Field.INPUT ? outputField : Field.INPUT

  const handleTypeOutput = useCallback(
    (value: string) => {
      onUserInput(outputField, value)
    },
    [onUserInput]
  )

  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: parsedAmounts[dependentField]?.toSignificant(6) ?? ''
  }

  const handleOutputSelect = useCallback(
    outputCurrency => onCurrencySelection(outputField, Field.INPUT, outputCurrency),
    [onCurrencySelection]
  )

  return (
    <AutoColumn gap={'lg'}>
      <CurrencyInputPanel
        value={formattedAmounts[outputField]}
        onUserInput={handleTypeOutput}
        label={'To'}
        showMaxButton={false}
        currency={originalCurrencies[outputField]}
        onCurrencySelect={handleOutputSelect}
        otherCurrency={originalCurrencies[Field.INPUT]}
        smallTokenImage={true}
        percentage={true}
        id="swap-currency-output"
      />
      {/* <div className={`advanced-swap-details-container ${theme.name}`}>
          <AdvancedSwapDetailsDropdown trade={trade} originalCurrencies={originalCurrencies} />
        </div> */}
    </AutoColumn>
  )
}
