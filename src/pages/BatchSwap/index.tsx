import { CurrencyAmount } from '@materia-dex/sdk'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { AutoColumn } from '../../components/Column'
import CurrencyInputPanel from '../../components/CurrencyInputPanel'
import AdvancedSwapDetailsDropdown from '../../components/swap/AdvancedSwapDetailsDropdown'
import { Wrapper } from '../../components/swap/styleds'
import { Field } from '../../state/batchswap/actions'
import { useDerivedBatchSwapInfo, useBatchSwapActionHandlers, useBatchSwapState } from '../../state/batchswap/hooks'
import AppBody from '../AppBody'
import {
  PageGridContainer,
  PageItemsContainer,
  TabsBar,
  TabLinkItem,
  PageContentContainer,
  ActionButton,
  SmallOperationButton
} from '../../theme'
import { maxAmountSpend } from '../../utils/maxAmountSpend'
import Inventory from '../../components/Inventory'
import { Plus } from 'react-feather'
import { Minus } from 'react-feather'
import BatchSwapOutput from '../../components/BatchSwapOutput'
import typedKeys from '../../utils/typesKeys'

export const ButtonBgItem = styled.img`
  height: 3ch;
  margin: 0px 5px;
`

export const Center = styled.div`
  display: flex;
  margin: 0 auto;
  justify-content: center;
  padding-top: 5px;
  padding-bottom: 5px;
`

export const AddOutputButton = styled(SmallOperationButton)`
  margin: 0 1.5rem 0 1.5rem !important;
`

export const RemoveOutputButton = styled(SmallOperationButton)`
  margin: 0 1.5rem 0 1.5rem !important;
`

export const OutputButtonContainer = styled.div`
  margin: auto;
`

export const BatchSwapDetails = styled(AdvancedSwapDetailsDropdown)`
  display: contents !important;
`

export default function BatchSwap() {
  const MIN_BATCH_SWAP_OUTPUTS = 1
  const MAX_BATCH_SWAP_OUTPUTS = 10

  const theme = useContext(ThemeContext)

  // swap state
  const { [Field.INPUT]: typedField } = useBatchSwapState()
  const typedValue = typedField.typedValue
  const { originalCurrencyBalances, parsedAmount, originalCurrencies } = useDerivedBatchSwapInfo(Field.OUTPUT_1, true)

  const parsedAmounts = {
    [Field.INPUT]: parsedAmount
  }

  const formattedAmounts = {
    [Field.INPUT]: typedValue
  }

  const maxAmountInput: CurrencyAmount | undefined = maxAmountSpend(originalCurrencyBalances[Field.INPUT])
  const atMaxAmountInput = Boolean(maxAmountInput && parsedAmounts[Field.INPUT]?.equalTo(maxAmountInput))

  const { onCurrencySelection, onCurrencyRemoval, onUserInput } = useBatchSwapActionHandlers()

  const handleTypeInput = useCallback(
    (value: string) => {
      onUserInput(Field.INPUT, value)
    },
    [onUserInput]
  )

  const handleInputSelect = useCallback(
    inputCurrency => {
      onCurrencySelection(Field.INPUT, Field.OUTPUT_1, inputCurrency)
    },
    [onCurrencySelection]
  )

  const handleMaxInput = useCallback(() => {
    maxAmountInput && onUserInput(Field.INPUT, maxAmountInput.toExact())
  }, [maxAmountInput, onUserInput])

  const [currentOutputs, setCurrentOutputs] = useState([Field.OUTPUT_1])

  const handleAddOutputToken = useCallback(() => {
    if (currentOutputs.length < MAX_BATCH_SWAP_OUTPUTS) {
      const key = `OUTPUT_${currentOutputs.length + 1}`
      const field = typedKeys(Field).find(x => x === key)

      if (field) {
        setCurrentOutputs([...currentOutputs, Field[field]])
      }
    }
  }, [currentOutputs, setCurrentOutputs])

  const handleRemoveOutputToken = useCallback(() => {
    if (currentOutputs.length > MIN_BATCH_SWAP_OUTPUTS) {
      const outputs = [...currentOutputs]
      const removed = outputs.pop()

      setCurrentOutputs(outputs)

      if (removed) {
        onCurrencyRemoval(removed)
      }
    }
  }, [currentOutputs, setCurrentOutputs, onCurrencyRemoval])

  const [showMore, setShowMore] = useState(false)

  const [addOutputTokenDisabled, setAddOutputTokenDisabled] = useState(false)
  const [removeOutputTokenDisabled, setRemoveOutputTokenDisabled] = useState(false)

  useEffect(() => {
    const outputs = currentOutputs.length

    setRemoveOutputTokenDisabled(outputs <= MIN_BATCH_SWAP_OUTPUTS)
    setAddOutputTokenDisabled(outputs >= MAX_BATCH_SWAP_OUTPUTS)
  }, [currentOutputs, setAddOutputTokenDisabled, setRemoveOutputTokenDisabled])

  return (
    <>
      <AppBody>
        <Wrapper id="batch-swap-page">
          <PageGridContainer className="batch-swap">
            <div className={`left-column batch-swap ${theme.name}`}>
              <div className="collapsable-title">
                <div className="pull-right">
                  <ActionButton
                    className={theme.name}
                    onClick={() => {
                      setShowMore(!showMore)
                    }}
                  >
                    {showMore ? 'Hide Inventory' : 'View Inventory'}
                  </ActionButton>
                </div>
                <div className="clear-fix"></div>
              </div>
              <div className={`collapsable-item ${showMore ? 'opened' : 'collapsed'}`}>
                <Inventory onCurrencySelect={handleInputSelect} />
              </div>
            </div>
            <PageItemsContainer className={theme.name}>
              <TabsBar className={theme.name}>
                <TabLinkItem
                  id={`batch-swap`}
                  to={'/batch-swap'}
                  className={`tabLinkItem ${theme.name}`}
                  isActive={(match, { pathname }) => Boolean(match) || pathname.startsWith('/batch-swap')}
                >
                  <span>Batch SWAP</span> {/* <BatchSwapIcon/> */}{' '}
                </TabLinkItem>
                <TabLinkItem
                  id={`classic-swap`}
                  to={'/swap'}
                  className={`tabLinkItem ${theme.name}`}
                  isActive={(match, { pathname }) => Boolean(match) || pathname.startsWith('/swap')}
                >
                  <span>Classic SWAP</span> {/* <ClassicSwapIcon/> */}{' '}
                </TabLinkItem>
              </TabsBar>
              <div className="clear-fix">
                <PageContentContainer className={`two ${theme.name}`}>
                  <div>
                    <AutoColumn gap={'lg'}>
                      <CurrencyInputPanel
                        label={'From'}
                        value={formattedAmounts[Field.INPUT]}
                        showMaxButton={!atMaxAmountInput}
                        currency={originalCurrencies[Field.INPUT]}
                        onUserInput={handleTypeInput}
                        onMax={handleMaxInput}
                        onCurrencySelect={handleInputSelect}
                        otherCurrency={originalCurrencies[Field.OUTPUT]}
                        smallTokenImage={false}
                        percentage={false}
                        id="batch-swap-currency-input"
                      />
                    </AutoColumn>
                  </div>
                  <div>
                    <AutoColumn gap={'lg'}>
                      {currentOutputs.map((output, index) => (
                        <BatchSwapOutput key={index} outputField={output} />
                      ))}
                      <OutputButtonContainer>
                        <AddOutputButton
                          id="add-output-token-batch-swap"
                          onClick={() => handleAddOutputToken()}
                          className={`add-output-token-batch-swap ${theme.name}`}
                          label="Add a token"
                          disabled={addOutputTokenDisabled}
                        >
                          <Plus />
                        </AddOutputButton>
                        <RemoveOutputButton
                          id="remove-output-token-batch-swap"
                          onClick={() => handleRemoveOutputToken()}
                          className={`remove-output-token-batch-swap ${theme.name}`}
                          label="Remove a token"
                          disabled={removeOutputTokenDisabled}
                        >
                          <Minus />
                        </RemoveOutputButton>
                      </OutputButtonContainer>
                    </AutoColumn>
                  </div>
                </PageContentContainer>
              </div>
            </PageItemsContainer>
          </PageGridContainer>
        </Wrapper>
      </AppBody>
    </>
  )
}
