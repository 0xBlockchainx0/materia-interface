import { CurrencyAmount, JSBI, Trade } from '@materia-dex/sdk'
import React, { useCallback, useContext, useEffect, useState, useMemo } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { AutoColumn } from '../../components/Column'
import CurrencyInputPanel from '../../components/CurrencyInputPanel'
import AdvancedSwapDetailsDropdown from '../../components/swap/AdvancedSwapDetailsDropdown'
import { BottomGrouping, SwapCallbackError, Wrapper } from '../../components/swap/styleds'
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
  SmallOperationButton,
  BatchSwapButtonsContainer,
  OperationButton,
  MainOperationButton
} from '../../theme'
import { maxAmountSpend } from '../../utils/maxAmountSpend'
import Inventory from '../../components/Inventory'
import { Link, Plus } from 'react-feather'
import { Minus } from 'react-feather'
import BatchSwapOutput from '../../components/BatchSwapOutput'
import typedKeys from '../../utils/typesKeys'
import { ApprovalState, useApproveCallbackFromBatchSwapTrade } from '../../hooks/useApproveCallback'
import { wrappedCurrency } from '../../utils/wrappedCurrency'
import { useExpertModeManager, useIsClassicMode, useUserSlippageTolerance } from '../../state/user/hooks'
import { AutoRow, RowCenter } from '../../components/Row'
import { ButtonMateriaConfirmed, ButtonMateriaError } from '../../components/Button'
import Loader from '../../components/Loader'
import { useActiveWeb3React } from '../../hooks'
import useSound from 'use-sound'
import { computeTradePriceBreakdown, warningSeverity } from '../../utils/prices'
import { useWalletModalToggle } from '../../state/application/hooks'
import { BATCH_SWAPPER_ADDRESS, ZERO_ADDRESS } from '../../constants'
import useCheckIsEthItem from '../../hooks/useCheckIsEthItem'
import { useEthItemContract } from '../../hooks/useContract'
import { Contract } from 'ethers'
import useTransactionDeadline from '../../hooks/useTransactionDeadline'
import { splitSignature } from 'ethers/lib/utils'

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
  const { account, chainId, library } = useActiveWeb3React()

  const { [Field.INPUT]: typedField } = useBatchSwapState()
  const typedValue = typedField.typedValue
  const {
    currencies,
    originalCurrencyBalances,
    parsedAmount,
    originalCurrencies,
    v2Trade: trade,
    inputError: batchSwapInputError
  } = useDerivedBatchSwapInfo(Field.OUTPUT_1, true)

  const [signatureData, setSignatureData] = useState<{ v: number; r: string; s: string } | null>(null)

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
      setSignatureData(null)
    },
    [onCurrencySelection, setSignatureData]
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

  const [allowedSlippage] = useUserSlippageTolerance()

  const [approval, approveCallback] = useApproveCallbackFromBatchSwapTrade(
    trade,
    wrappedCurrency(originalCurrencies[Field.INPUT], chainId) ?? undefined,
    allowedSlippage
  )

  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)

  const tokenInput = useMemo(() => wrappedCurrency(originalCurrencies[Field.INPUT], chainId), [
    originalCurrencies,
    chainId
  ])

  const isEthItemInput = useCheckIsEthItem(tokenInput?.address ?? ZERO_ADDRESS)?.ethItem ?? false
  const ethItemContract: Contract | null = useEthItemContract(isEthItemInput ? tokenInput?.address : undefined)

  async function onAttemptToApprove() {
    if (!isEthItemInput) {
      return approveCallback()
    }

    if (!ethItemContract || !tokenInput || !library || !chainId) throw new Error('missing dependencies')

    const inputAmount = parsedAmounts[Field.INPUT]

    if (!inputAmount) throw new Error('missing input amount')

    // try to gather a signature for permission
    const nonce = await ethItemContract.permitNonce(account)

    const EIP712Domain = [
      { name: 'name', type: 'string' },
      { name: 'version', type: 'string' },
      { name: 'chainId', type: 'uint256' },
      { name: 'verifyingContract', type: 'address' }
    ]
    const domain = {
      name: 'Item',
      version: '1',
      chainId: chainId,
      verifyingContract: tokenInput.address
    }
    const Permit = [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
      { name: 'value', type: 'uint256' },
      { name: 'nonce', type: 'uint256' }
    ]
    const message = {
      owner: account,
      spender: BATCH_SWAPPER_ADDRESS[chainId],
      value: inputAmount.raw.toString(),
      nonce: nonce.toHexString()
    }
    const data = JSON.stringify({
      types: {
        EIP712Domain,
        Permit
      },
      domain,
      primaryType: 'Permit',
      message
    })

    library
      .send('eth_signTypedData_v4', [account, data])
      .then(splitSignature)
      .then(signature => {
        setSignatureData({
          v: signature.v,
          r: signature.r,
          s: signature.s
        })
      })
      .catch(error => {
        // for all errors other than 4001 (EIP-1193 user rejected request), fall back to manual approve
        if (error?.code !== 4001) {
          approveCallback()
        }
      })
  }

  useEffect(() => {
    if (approval === ApprovalState.PENDING) {
      setApprovalSubmitted(true)
    }
  }, [approval, approvalSubmitted])

  const [{ showConfirm, tradeToConfirm, batchSwapErrorMessage, attemptingTxn, txHash }, setBatchSwapState] = useState<{
    showConfirm: boolean
    tradeToConfirm: Trade | undefined
    attemptingTxn: boolean
    batchSwapErrorMessage: string | undefined
    txHash: string | undefined
  }>({
    showConfirm: false,
    tradeToConfirm: undefined,
    attemptingTxn: false,
    batchSwapErrorMessage: undefined,
    txHash: undefined
  })

  const handleBatchSwap = useCallback(() => {}, [])

  const [isExpertMode] = useExpertModeManager()
  const [isShown, setIsShown] = useState(false)

  const alarm = require('../../assets/audio/FF7CursorMove.mp3')
  const [play, { stop }] = useSound(alarm)
  const classicMode = useIsClassicMode()

  const isValid = !batchSwapInputError
  const { priceImpactWithoutFee } = computeTradePriceBreakdown(trade)
  const priceImpactSeverity = warningSeverity(priceImpactWithoutFee)

  const toggleWalletModal = useWalletModalToggle()

  const route = trade?.route
  const userHasSpecifiedInputOutput = Boolean(
    currencies[Field.INPUT] && parsedAmounts[Field.INPUT]?.greaterThan(JSBI.BigInt(0))
  )
  const noRoute = !route

  const showApproveFlow =
    !batchSwapInputError &&
    (approval === ApprovalState.NOT_APPROVED ||
      approval === ApprovalState.PENDING ||
      (approvalSubmitted && approval === ApprovalState.APPROVED)) &&
    !(priceImpactSeverity > 3 && !isExpertMode)

  const { error: swapCallbackError } = { error: null }

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
                <BottomGrouping>
                  <BatchSwapButtonsContainer className={isExpertMode && batchSwapErrorMessage ? 'has-error' : ''}>
                    {!account ? (
                      <OperationButton
                        onClick={toggleWalletModal}
                        className={`connect-wallet-button ${theme.name}`}
                        label="Connect Wallet"
                      >
                        <Link />
                      </OperationButton>
                    ) : noRoute && userHasSpecifiedInputOutput ? (
                      <MainOperationButton className={theme.name} disabled={true}>
                        Insufficient liquidity for this trade
                      </MainOperationButton>
                    ) : showApproveFlow && signatureData === null ? (
                      <RowCenter>
                        <ButtonMateriaConfirmed
                          onClick={onAttemptToApprove}
                          disabled={
                            approval !== ApprovalState.NOT_APPROVED || approvalSubmitted || signatureData !== null
                          }
                          hide={approval !== ApprovalState.NOT_APPROVED}
                          altDisabledStyle={approval === ApprovalState.PENDING} // show solid button while waiting
                          confirmed={approval === ApprovalState.APPROVED || signatureData !== null}
                        >
                          {approval === ApprovalState.PENDING ? (
                            <AutoRow gap="6px" justify="center">
                              Approving <Loader stroke="white" />
                            </AutoRow>
                          ) : (approvalSubmitted && approval === ApprovalState.APPROVED) || signatureData !== null ? (
                            'Approved'
                          ) : (
                            'Approve ' + originalCurrencies[Field.INPUT]?.symbol
                          )}
                        </ButtonMateriaConfirmed>
                        <ButtonMateriaError
                          onClick={() => {
                            if (isExpertMode) {
                              handleBatchSwap()
                            } else {
                              setBatchSwapState({
                                tradeToConfirm: trade,
                                attemptingTxn: false,
                                batchSwapErrorMessage: undefined,
                                showConfirm: true,
                                txHash: undefined
                              })
                            }
                          }}
                          id="batch-swap-button"
                          disabled={
                            !isValid ||
                            approval !== ApprovalState.APPROVED ||
                            (priceImpactSeverity > 3 && !isExpertMode)
                          }
                          hide={
                            !isValid ||
                            approval !== ApprovalState.APPROVED ||
                            (priceImpactSeverity > 3 && !isExpertMode)
                          }
                          error={isValid && priceImpactSeverity > 2}
                          showSwap={
                            !(
                              !isValid ||
                              approval !== ApprovalState.APPROVED ||
                              (priceImpactSeverity > 3 && !isExpertMode)
                            )
                          }
                          useCustomProperties={priceImpactSeverity > 3 ? true : false}
                          isExpertModeActive={isExpertMode}
                          onMouseEnter={() => {
                            setIsShown(true)
                            if (classicMode) {
                              play()
                            }
                          }}
                          onMouseLeave={() => {
                            setIsShown(false)
                            if (classicMode) {
                              stop()
                            }
                          }}
                        >
                          {priceImpactSeverity > 3 && !isExpertMode
                            ? `Price Impact High`
                            : `Swap ${priceImpactSeverity > 2 ? 'Anyway' : ''}`}
                        </ButtonMateriaError>
                      </RowCenter>
                    ) : (
                      <>
                        {isExpertMode && batchSwapErrorMessage ? (
                          <SwapCallbackError error={batchSwapErrorMessage} />
                        ) : null}
                        <ButtonMateriaError
                          onClick={() => {
                            if (isExpertMode) {
                              handleBatchSwap()
                            } else {
                              setBatchSwapState({
                                tradeToConfirm: trade,
                                attemptingTxn: false,
                                batchSwapErrorMessage: undefined,
                                showConfirm: true,
                                txHash: undefined
                              })
                            }
                          }}
                          id="batch-swap-button"
                          disabled={!isValid || (priceImpactSeverity > 3 && !isExpertMode) || !!swapCallbackError}
                          error={isValid && priceImpactSeverity > 2 && !swapCallbackError}
                          showSwap={!(!isValid || (priceImpactSeverity > 3 && !isExpertMode) || !!swapCallbackError)}
                          useCustomProperties={priceImpactSeverity > 3 ? true : false}
                          isExpertModeActive={isExpertMode}
                          onMouseEnter={() => {
                            setIsShown(true)
                            if (classicMode) {
                              play()
                            }
                          }}
                          onMouseLeave={() => {
                            setIsShown(false)
                            if (classicMode) {
                              stop()
                            }
                          }}
                        >
                          {batchSwapInputError
                            ? batchSwapInputError
                            : priceImpactSeverity > 3 && !isExpertMode
                            ? `Price Impact Too High`
                            : `Swap ${priceImpactSeverity > 2 ? 'Anyway' : ''}`}
                        </ButtonMateriaError>
                      </>
                    )}
                  </BatchSwapButtonsContainer>
                </BottomGrouping>
              </div>
            </PageItemsContainer>
          </PageGridContainer>
        </Wrapper>
      </AppBody>
    </>
  )
}
