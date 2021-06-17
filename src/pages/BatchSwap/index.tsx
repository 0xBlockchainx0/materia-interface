import { CurrencyAmount } from '@materia-dex/sdk'
import React, { useCallback, useContext, useState } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { AutoColumn } from '../../components/Column'
import CurrencyInputPanel from '../../components/CurrencyInputPanel'
import AdvancedSwapDetailsDropdown from '../../components/swap/AdvancedSwapDetailsDropdown'
import { Wrapper } from '../../components/swap/styleds'
import { useActiveWeb3React } from '../../hooks'
import { Field } from '../../state/swap/actions'
import {
  useDerivedSwapInfo,
  useSwapActionHandlers,
  useSwapState
} from '../../state/swap/hooks'
import { useUserSlippageTolerance } from '../../state/user/hooks'
import AppBody from '../AppBody'
import {
  PageGridContainer,
  PageItemsContainer,
  TabsBar,
  TabLinkItem,
  PageContentContainer,
  ActionButton,
  OperationButton
} from '../../theme'
import { maxAmountSpend } from '../../utils/maxAmountSpend'
import Inventory from '../../components/Inventory'
import { Plus } from 'react-feather'

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

export const AddOutputButton = styled(OperationButton)`
  margin: auto 20% !important;
`

export default function BatchSwap() {
  const { chainId } = useActiveWeb3React()
  const theme = useContext(ThemeContext)
  
  // get custom setting values for user
  const [allowedSlippage] = useUserSlippageTolerance()

  // swap state
  const { independentField, typedValue } = useSwapState()
  const { v2Trade, originalCurrencyBalances, parsedAmount, originalCurrencies } = useDerivedSwapInfo(true)

  const trade = v2Trade
  const parsedAmounts = {
    [Field.INPUT]: independentField === Field.INPUT ? parsedAmount : trade?.inputAmount,
    [Field.OUTPUT]: independentField === Field.OUTPUT ? parsedAmount : trade?.outputAmount
  }

  const { onCurrencySelection, onUserInput } = useSwapActionHandlers()
  const dependentField: Field = independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT

  const handleTypeInput = useCallback(
    (value: string) => {
      onUserInput(Field.INPUT, value)
    },
    [onUserInput]
  )
  const handleTypeOutput = useCallback(
    (value: string) => {
      onUserInput(Field.OUTPUT, value)
    },
    [onUserInput]
  )

  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: parsedAmounts[dependentField]?.toSignificant(6) ?? ''
  }

  const maxAmountInput: CurrencyAmount | undefined = maxAmountSpend(originalCurrencyBalances[Field.INPUT])
  const atMaxAmountInput = Boolean(maxAmountInput && parsedAmounts[Field.INPUT]?.equalTo(maxAmountInput))

  const handleInputSelect = useCallback(
    inputCurrency => {
      onCurrencySelection(Field.INPUT, inputCurrency)
    },
    [onCurrencySelection]
  )

  const handleMaxInput = useCallback(() => {
    maxAmountInput && onUserInput(Field.INPUT, maxAmountInput.toExact())
  }, [maxAmountInput, onUserInput])

  const handleOutputSelect = useCallback(outputCurrency => onCurrencySelection(Field.OUTPUT, outputCurrency), [
    onCurrencySelection
  ])

  const [showMore, setShowMore] = useState(false)

  const initialCurrenciesOutputs = [
    <>
      <CurrencyInputPanel
        value={formattedAmounts[Field.OUTPUT]}
        onUserInput={handleTypeOutput}
        label={independentField === Field.INPUT && trade ? 'To (estimated)' : 'To'}
        showMaxButton={false}
        currency={originalCurrencies[Field.OUTPUT]}
        onCurrencySelect={handleOutputSelect}
        otherCurrency={originalCurrencies[Field.INPUT]}
        smallTokenImage={true}
        percentage={true}
        id="batch-swap-currency-output"
      />
      {trade && <AdvancedSwapDetailsDropdown trade={trade} originalCurrencies={originalCurrencies} />}
    </>
  ]
  const [currenciesOutputs, setCurrenciesOutputs] = useState(initialCurrenciesOutputs)
  const onAddOutputToken = () => {
    setCurrenciesOutputs(
      currenciesOutputs.concat([
        <>
          <CurrencyInputPanel
            value={formattedAmounts[Field.OUTPUT]}
            onUserInput={handleTypeOutput}
            label={independentField === Field.INPUT && trade ? 'To (estimated)' : 'To'}
            showMaxButton={false}
            currency={originalCurrencies[Field.OUTPUT]}
            onCurrencySelect={handleOutputSelect}
            otherCurrency={originalCurrencies[Field.INPUT]}
            smallTokenImage={true}
            percentage={true}
            id="batch-swap-currency-output"
          />
          {trade && <AdvancedSwapDetailsDropdown trade={trade} originalCurrencies={originalCurrencies} />}
        </>
      ])
    )
    console.log(currenciesOutputs)
  }

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
                <Inventory onCurrencySelect={handleOutputSelect} />
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
                        label={independentField === Field.OUTPUT && trade ? 'From (estimated)' : 'From'}
                        value={formattedAmounts[Field.INPUT]}
                        showMaxButton={!atMaxAmountInput}
                        currency={originalCurrencies[Field.INPUT]}
                        onUserInput={handleTypeInput}
                        onMax={handleMaxInput}
                        onCurrencySelect={handleInputSelect}
                        otherCurrency={originalCurrencies[Field.OUTPUT]}
                        smallTokenImage={true}
                        percentage={false}
                        id="batch-swap-currency-input"
                      />
                    </AutoColumn>
                  </div>
                  <div>
                    <AutoColumn gap={'lg'}>
                      {currenciesOutputs.map(output => output)}
                      <AddOutputButton
                        id="add-recipient-button"
                        onClick={() => onAddOutputToken()}
                        className={`add-output-token-batch-swap ${theme.name}`}
                        label="Add a token"
                      >
                        <Plus />
                      </AddOutputButton>
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
