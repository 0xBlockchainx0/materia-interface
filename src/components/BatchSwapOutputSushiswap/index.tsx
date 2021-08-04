import React, { useCallback, useState } from 'react'
import { ThemeContext } from 'styled-components'
import { AutoColumn } from '../Column'
import CurrencyInputPanel from '../CurrencyInputPanel'
import { Field } from '../../state/batchswap-sushi/actions'
import { useDerivedBatchSwapInfo, useBatchSwapState, useBatchSwapActionHandlers } from '../../state/batchswap-sushi/hooks'
import AdvancedBatchSwapDetailsDropdown from '../batchswap/AdvancedBatchSwapDetailsDropdown'
import { useContext } from 'react'
import useGetEthItemInteroperable from '../../hooks/useGetEthItemInteroperable'
import { wrappedCurrency } from '../../utils/wrappedCurrency'
import { useActiveWeb3React } from '../../hooks'
import { ZERO_ADDRESS } from '../../constants'
import { useEffect } from 'react'
import { Currency } from '@materia-dex/sdk'

interface BatchSwapOutputSushiswapProps {
  outputField: Field
}

export default function BatchSwapOutputSushiswap({ outputField }: BatchSwapOutputSushiswapProps) {
  const theme = useContext(ThemeContext)
  const { chainId } = useActiveWeb3React()

  const { [outputField]: field } = useBatchSwapState()

  const typedValue = field.typedValue
  const currentAmountMin = field.currencyAmountMin
  const currentHasTrade = field.trade

  const { v2Trade: trade, originalCurrencies, outputAmountMin } = useDerivedBatchSwapInfo(outputField)

  const hasTrade = !!trade

  const [outputCurrency, setOutputCurrency] = useState<Currency | undefined>(undefined)
  const outputCurrencyId = wrappedCurrency(outputCurrency, chainId)?.address ?? ZERO_ADDRESS
  const interoperable = useGetEthItemInteroperable(outputCurrencyId)

  const { onCurrencySelection, onUserInput, onCurrencyAmountMin, onHasTrade } = useBatchSwapActionHandlers()

  const handleTypeOutput = useCallback(
    (value: string) => {
      onUserInput(outputField, value)
    },
    [onUserInput, outputField]
  )

  const formattedAmounts = {
    [outputField]: typedValue
  }

  const handleOutputSelect = useCallback(
    outputCurrency => {
      setOutputCurrency(outputCurrency)
    },
    [setOutputCurrency]
  )

  useEffect(() => {
    if (outputCurrency) {
      onCurrencySelection(outputField, Field.INPUT, outputCurrency, interoperable)
    }
  }, [interoperable, onCurrencySelection, outputCurrency, outputField, setOutputCurrency])

  useEffect(() => {
    const needUpdate =
      !outputAmountMin ||
      !currentAmountMin ||
      (outputAmountMin && currentAmountMin && !currentAmountMin.equalTo(outputAmountMin))

    if (needUpdate) {
      onCurrencyAmountMin(outputField, outputAmountMin)
    }
  }, [outputField, outputAmountMin, onCurrencyAmountMin, currentAmountMin])

  useEffect(() => {
    const needUpdate = hasTrade !== currentHasTrade

    if (needUpdate) {
      onHasTrade(outputField, hasTrade)
    }
  }, [outputField, hasTrade, currentHasTrade, onHasTrade])

  return (
    <AutoColumn gap={'sm'}>
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
        id="batch-swap-currency-output"
        badgeWidth={'25%'}
      />
      <div className={`advanced-batchswap-details-container ${theme.name}`}>
        <AdvancedBatchSwapDetailsDropdown
          trade={trade}
          originalCurrencies={originalCurrencies}
          outputField={outputField}
          infoLink={'https://analytics.sushi.com/pairs'}
        />
      </div>
    </AutoColumn>
  )
}
