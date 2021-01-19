import { CurrencyAmount, JSBI, Token, Trade } from '@materia-dex/sdk'
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useIsClassicMode } from '../../state/user/hooks'
import { ArrowDown, ArrowRightCircle } from 'react-feather'
import ReactGA from 'react-ga'
import { Text } from 'rebass'
import { NavLink, RouteComponentProps } from 'react-router-dom'
import styled, { ThemeContext } from 'styled-components'
import AddressInputPanel from '../../components/AddressInputPanel'
import { ButtonMateriaLight, ButtonMateriaPrimary, ButtonMateriaConfirmed, ButtonMateriaError } from '../../components/Button'
import Card, { SwapGreyCard } from '../../components/Card'
import Column, { AutoColumn } from '../../components/Column'
import ConfirmSwapModal from '../../components/swap/ConfirmSwapModal'
import CurrencyInputPanel from '../../components/CurrencyInputPanel'
import { AutoRow, RowBetween, RowCenter } from '../../components/Row'
import AdvancedSwapDetailsDropdown from '../../components/swap/AdvancedSwapDetailsDropdown'

import confirmPriceImpactWithoutFee from '../../components/swap/confirmPriceImpactWithoutFee'
import { ArrowWrapper, BottomGrouping, SwapCallbackError, Wrapper } from '../../components/swap/styleds'
import TradePrice from '../../components/swap/TradePrice'
import TokenWarningModal from '../../components/TokenWarningModal'
import ProgressSteps from '../../components/ProgressSteps'

import { INITIAL_ALLOWED_SLIPPAGE } from '../../constants'

import { useActiveWeb3React } from '../../hooks'
import { useCurrency } from '../../hooks/Tokens'
import { ApprovalState, useApproveCallbackFromTrade } from '../../hooks/useApproveCallback'
import useENSAddress from '../../hooks/useENSAddress'
import { useSwapCallback } from '../../hooks/useSwapCallback'

import useWrapCallback, { WrapType } from '../../hooks/useWrapCallback'
import { useToggleSettingsMenu, useWalletModalToggle } from '../../state/application/hooks'
import { Field } from '../../state/swap/actions'
import {
  useDefaultsFromURLSearch,
  useDerivedSwapInfo,
  useSwapActionHandlers,
  useSwapState
} from '../../state/swap/hooks'
import { useExpertModeManager, useUserSlippageTolerance } from '../../state/user/hooks'
import { LinkStyledButton, TYPE, SwapMenu, SwapMenuItem, StyledNavLink } from '../../theme'
import { maxAmountSpend } from '../../utils/maxAmountSpend'
import { computeTradePriceBreakdown, warningSeverity } from '../../utils/prices'
import AppBody, { ButtonBgItem } from '../AppBody'
import { ClickableText } from '../Pool/styleds'
import Loader from '../../components/Loader'
import Inventory from '../../components/Inventory'
import { darken, linearGradient } from 'polished'
import FFCursor from '../../assets/images/FF7Cursor.png'
import useSound from 'use-sound'

const SwapGridContainer = styled.div`
  display: grid;
  grid-template-columns: 30px 30% auto;
  @media (min-width: 601px) and (max-width: 1350px) {
    grid-template-columns: 50px auto !important;
  }
  @media (max-width: 600px) {
    grid-template-columns: auto !important;
  }
`

const SwapCurrencyContainer = styled.div`
  @media (min-width: 1050px) {
    display: grid;
    grid-template-columns: 37.5% 25% 37.5%;
  }
`

const SwapPageContainer = styled.div`
  padding: 1rem 0.5rem 1rem 0.5rem;
  min-height: 580px;
  ${({ theme }) => theme.backgroundContainer}
`
/*const activeClassName = 'ACTIVE'
 const StyledNavLink = styled(NavLink).attrs({
  activeClassName
})`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: left;
  border-radius: 3rem;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.text2};
  font-size: 1rem;
  width: fit-content;
  margin: 0 12px;
  font-weight: 500;

  &.${activeClassName} {
    // border-radius: 12px;
    font-weight: 600;
    color: ${({ theme }) => theme.cyan1};
  }

  :hover,
  :focus {
    color: ${({ theme }) => darken(0.1, theme.cyan1)};
  }
` */

const TradePriceContainer = styled.div`
  margin-top: auto;
`

const TradeCard = styled(Card)`
  display: flex;
  justify-content: center
`

const SwapButton = styled.div`
  justify-content: center;
  display: flex;
  padding: 1rem 0rem;
  width:auto;
`

const InventoryColumn = styled.div`
padding: 0.5rem 0rem 1rem 1rem;
border-radius: 2px 2px 0px 0px;
font-size: smaller;
min-height: 580px;
${({ theme }) => theme.backgroundContainer}
@media (max-width: 1350px) { display: none; }
`
const ItemColumn = styled.div`
  width: 0px;
  @media (min-width: 601px) and (max-width: 1350px) { /*display: none;*/ }
  @media (max-width: 600px) { display: none; }
`

export const Center = styled.div`
  display: flex;
  margin: 0 auto;
  justify-content: center;
  padding-top: 5px;
  padding-bottom: 5px;
`

export const FooterInfo = styled.div`
  display: flex;
  margin: 0 auto;
  font-size: small;
  z-index: 99;
`

export const FFCursorImg = styled.img`
  position: absolute;
  margin: 12px 0px 0px -250px;
  z-index: 999;
  `
export default function Swap() {
  const loadedUrlParams = useDefaultsFromURLSearch()

  // token warning stuff
  const [loadedInputCurrency, loadedOutputCurrency] = [
    useCurrency(loadedUrlParams?.inputCurrencyId),
    useCurrency(loadedUrlParams?.outputCurrencyId)
  ]
  const [dismissTokenWarning, setDismissTokenWarning] = useState<boolean>(false)
  const urlLoadedTokens: Token[] = useMemo(
    () => [loadedInputCurrency, loadedOutputCurrency]?.filter((c): c is Token => c instanceof Token) ?? [],
    [loadedInputCurrency, loadedOutputCurrency]
  )
  const handleConfirmTokenWarning = useCallback(() => {
    setDismissTokenWarning(true)
  }, [])

  const { account } = useActiveWeb3React()
  const theme = useContext(ThemeContext)

  // toggle wallet when disconnected
  const toggleWalletModal = useWalletModalToggle()

  // for expert mode
  const toggleSettings = useToggleSettingsMenu()
  const [isExpertMode] = useExpertModeManager()

  // get custom setting values for user
  const [allowedSlippage] = useUserSlippageTolerance()

  // swap state
  const { independentField, typedValue, recipient } = useSwapState()
  const {
    v2Trade,
    v2TradeWithoutInteroperable,
    currencyBalances,
    parsedAmount,
    currencies,
    inputError: swapInputError
  } = useDerivedSwapInfo()
  const { wrapType, execute: onWrap, inputError: wrapInputError } = useWrapCallback(
    currencies[Field.INPUT],
    currencies[Field.OUTPUT],
    typedValue
  )
  const showWrap: boolean = wrapType !== WrapType.NOT_APPLICABLE
  const { address: recipientAddress } = useENSAddress(recipient)

  const trade = showWrap ? undefined : v2Trade
  const tradeWithoutInteroperable = showWrap ? undefined : v2TradeWithoutInteroperable
  const defaultTrade = showWrap ? undefined : v2Trade

  const parsedAmounts = showWrap
    ? {
      [Field.INPUT]: parsedAmount,
      [Field.OUTPUT]: parsedAmount
    }
    : {
      [Field.INPUT]: independentField === Field.INPUT ? parsedAmount : trade?.inputAmount,
      [Field.OUTPUT]: independentField === Field.OUTPUT ? parsedAmount : trade?.outputAmount
    }

  const { onSwitchTokens, onCurrencySelection, onUserInput, onChangeRecipient } = useSwapActionHandlers()
  const isValid = !swapInputError
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

  // modal and loading
  const [{ showConfirm, tradeToConfirm, swapErrorMessage, attemptingTxn, txHash }, setSwapState] = useState<{
    showConfirm: boolean
    tradeToConfirm: Trade | undefined
    attemptingTxn: boolean
    swapErrorMessage: string | undefined
    txHash: string | undefined
  }>({
    showConfirm: false,
    tradeToConfirm: undefined,
    attemptingTxn: false,
    swapErrorMessage: undefined,
    txHash: undefined
  })

  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: showWrap
      ? parsedAmounts[independentField]?.toExact() ?? ''
      : parsedAmounts[dependentField]?.toSignificant(6) ?? ''
  }

  const route = trade?.route
  const userHasSpecifiedInputOutput = Boolean(
    currencies[Field.INPUT] && currencies[Field.OUTPUT] && parsedAmounts[independentField]?.greaterThan(JSBI.BigInt(0))
  )
  const noRoute = !route

  // check whether the user has approved the router on the input token
  // const [approval, approveCallback] = useApproveCallbackFromTrade(trade, allowedSlippage)
  const [approval, approveCallback] = useApproveCallbackFromTrade(tradeWithoutInteroperable, allowedSlippage)

  // check if user has gone through approval process, used to show two step buttons, reset on token change
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)

  // mark when a user has submitted an approval, reset onTokenSelection for input field
  useEffect(() => {
    if (approval === ApprovalState.PENDING) {
      setApprovalSubmitted(true)
    }
  }, [approval, approvalSubmitted])

  const maxAmountInput: CurrencyAmount | undefined = maxAmountSpend(currencyBalances[Field.INPUT])
  const atMaxAmountInput = Boolean(maxAmountInput && parsedAmounts[Field.INPUT]?.equalTo(maxAmountInput))

  // the callback to execute the swap
  const { callback: swapCallback, error: swapCallbackError } = useSwapCallback(trade, tradeWithoutInteroperable, allowedSlippage, recipient)

  const { priceImpactWithoutFee } = computeTradePriceBreakdown(trade)

  const handleSwap = useCallback(() => {
    if (priceImpactWithoutFee && !confirmPriceImpactWithoutFee(priceImpactWithoutFee)) {
      return
    }
    if (!swapCallback) {
      return
    }
    setSwapState({ attemptingTxn: true, tradeToConfirm, showConfirm, swapErrorMessage: undefined, txHash: undefined })
    swapCallback()
      .then(hash => {
        setSwapState({ attemptingTxn: false, tradeToConfirm, showConfirm, swapErrorMessage: undefined, txHash: hash })

        ReactGA.event({
          category: 'Swap',
          action:
            recipient === null
              ? 'Swap w/o Send'
              : (recipientAddress ?? recipient) === account
                ? 'Swap w/o Send + recipient'
                : 'Swap w/ Send',
          label: [
            trade?.inputAmount?.currency?.symbol,
            trade?.outputAmount?.currency?.symbol,
            v2Trade
          ].join('/')
        })
      })
      .catch(error => {
        setSwapState({
          attemptingTxn: false,
          tradeToConfirm,
          showConfirm,
          swapErrorMessage: error.message,
          txHash: undefined
        })
      })
  }, [tradeToConfirm, account, priceImpactWithoutFee, recipient, recipientAddress, showConfirm, swapCallback, trade])

  // errors
  const [showInverted, setShowInverted] = useState<boolean>(false)

  // warnings on slippage
  const priceImpactSeverity = warningSeverity(priceImpactWithoutFee)

  // show approve flow when: no error on inputs, not approved or pending, or approved in current session
  // never show if price impact is above threshold in non expert mode
  const showApproveFlow =
    !swapInputError &&
    (approval === ApprovalState.NOT_APPROVED ||
      approval === ApprovalState.PENDING ||
      (approvalSubmitted && approval === ApprovalState.APPROVED)) &&
    !(priceImpactSeverity > 3 && !isExpertMode)

  const handleConfirmDismiss = useCallback(() => {
    setSwapState({ showConfirm: false, tradeToConfirm, attemptingTxn, swapErrorMessage, txHash })
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onUserInput(Field.INPUT, '')
    }
  }, [attemptingTxn, onUserInput, swapErrorMessage, tradeToConfirm, txHash])

  const handleAcceptChanges = useCallback(() => {
    setSwapState({ tradeToConfirm: trade, swapErrorMessage, txHash, attemptingTxn, showConfirm })
  }, [attemptingTxn, showConfirm, swapErrorMessage, trade, txHash])

  const handleInputSelect = useCallback(
    inputCurrency => {
      setApprovalSubmitted(false) // reset 2 step UI for approvals
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

  const [isShown, setIsShown] = useState(false)

  const alarm = require("../../assets/audio/FF7CursorMove.mp3")
  const [play, { stop }] = useSound(alarm)
  const classicMode = useIsClassicMode()

  return (
    <>
      {/* <TokenWarningModal
        isOpen={urlLoadedTokens.length > 0 && !dismissTokenWarning}
        tokens={urlLoadedTokens}
        onConfirm={handleConfirmTokenWarning}
      /> */}
      <TokenWarningModal
        isOpen={false}
        tokens={urlLoadedTokens}
        onConfirm={handleConfirmTokenWarning}
      />
      <AppBody>
        <Wrapper id="swap-page">
          <ConfirmSwapModal
            isOpen={showConfirm}
            trade={trade}
            originalTrade={tradeToConfirm}
            onAcceptChanges={handleAcceptChanges}
            attemptingTxn={attemptingTxn}
            txHash={txHash}
            recipient={recipient}
            allowedSlippage={allowedSlippage}
            onConfirm={handleSwap}
            swapErrorMessage={swapErrorMessage}
            onDismiss={handleConfirmDismiss}
          />
          <SwapGridContainer>
            <ItemColumn></ItemColumn>
            <InventoryColumn>
              <Inventory onCurrencySelect={handleOutputSelect} />
            </InventoryColumn>
            <SwapPageContainer>
              <SwapMenu className={theme.name}>

                {/* <SwapMenuItem active={true}>
                  <TYPE.body color={theme.text1} fontWeight={500} fontSize={14}>Classic SWAP</TYPE.body>
                </SwapMenuItem>
                <SwapMenuItem>
                  <TYPE.body color={theme.text1} fontWeight={500} fontSize={14}>Batch SWAP (coming soon)</TYPE.body>
                </SwapMenuItem> */}

                <StyledNavLink id={`classic-swap`} to={'/swap'} 
                  className={ `${theme.name}` }
                  isActive={(match, { pathname }) => Boolean(match) || pathname.startsWith('/swap') }
                  style={{ textShadow: '1px 1px #053472' }}>Classic SWAP</StyledNavLink>

                <StyledNavLink id={`batch-swap`} to={'/batch-swap'} 
                  className={ `disabled ${theme.name}` }
                  //isActive={(match, { pathname }) => Boolean(match) || pathname.startsWith('/batchswap') }
                  style={{ textShadow: '1px 1px #053472' }}>Batch SWAP (coming soon)</StyledNavLink>
              </SwapMenu>
              <div>
                <SwapCurrencyContainer>
                  <div>
                    <AutoColumn gap={'lg'}>
                      <CurrencyInputPanel
                        label={independentField === Field.OUTPUT && !showWrap && trade ? 'From (estimated)' : 'From'}
                        value={formattedAmounts[Field.INPUT]}
                        showMaxButton={!atMaxAmountInput}
                        currency={currencies[Field.INPUT]}
                        onUserInput={handleTypeInput}
                        onMax={handleMaxInput}
                        onCurrencySelect={handleInputSelect}
                        otherCurrency={currencies[Field.OUTPUT]}
                        id="swap-currency-input"
                      />
                    </AutoColumn>
                  </div>
                  <TradePriceContainer>
                    <AutoColumn justify="space-between">
                      <AutoRow justify={isExpertMode ? 'space-between' : 'center'} style={{ padding: '0 1rem' }}>
                        <ArrowWrapper clickable>
                          <ArrowRightCircle
                            size="16"
                            onClick={() => {
                              setApprovalSubmitted(false) // reset 2 step UI for approvals
                              onSwitchTokens()
                            }}
                            color={currencies[Field.INPUT] && currencies[Field.OUTPUT] ? theme.primary1 : theme.text2}
                          />
                        </ArrowWrapper>
                        {recipient === null && !showWrap && isExpertMode ? (
                          <LinkStyledButton id="add-recipient-button" onClick={() => onChangeRecipient('')}>
                            + Add a send (optional)
                          </LinkStyledButton>
                        ) : null}
                      </AutoRow>
                    </AutoColumn>
                    {showWrap ? null : (
                      <TradeCard padding={'.25rem .75rem 0 .75rem'} borderRadius={'20px'}>
                        <AutoColumn gap="4px">
                          {Boolean(trade) && (
                            <RowBetween align="center">
                              <TradePrice
                                price={trade?.executionPrice}
                                showInverted={showInverted}
                                setShowInverted={setShowInverted}
                              />
                            </RowBetween>
                          )}
                          {allowedSlippage !== INITIAL_ALLOWED_SLIPPAGE && (
                            <RowBetween align="center">
                              <ClickableText fontWeight={500} fontSize={14} color={theme.text2} onClick={toggleSettings}>
                                Slippage Tolerance
                              </ClickableText>
                              <ClickableText fontWeight={500} fontSize={14} color={theme.text2} onClick={toggleSettings}>
                                {allowedSlippage / 100}%
                              </ClickableText>
                            </RowBetween>
                          )}
                        </AutoColumn>
                      </TradeCard>
                    )}
                  </TradePriceContainer>
                  <div>
                    <AutoColumn gap={'lg'}>
                      <CurrencyInputPanel
                        value={formattedAmounts[Field.OUTPUT]}
                        onUserInput={handleTypeOutput}
                        label={independentField === Field.INPUT && !showWrap && trade ? 'To (estimated)' : 'To'}
                        showMaxButton={false}
                        currency={currencies[Field.OUTPUT]}
                        onCurrencySelect={handleOutputSelect}
                        otherCurrency={currencies[Field.INPUT]}
                        id="swap-currency-output"
                      />

                      {recipient !== null && !showWrap ? (
                        <>
                          <AutoRow justify="space-between" style={{ padding: '0 1rem' }}>
                            <ArrowWrapper clickable={false}>
                              <ArrowDown size="16" color={theme.text2} />
                            </ArrowWrapper>
                            <LinkStyledButton id="remove-recipient-button" onClick={() => onChangeRecipient(null)}>
                              - Remove send
                          </LinkStyledButton>
                          </AutoRow>
                          <AddressInputPanel id="recipient" value={recipient} onChange={onChangeRecipient} />
                        </>
                      ) : null}
                    </AutoColumn>
                  </div>
                </SwapCurrencyContainer>
                <BottomGrouping>
                  <SwapButton>
                    {!account ? (
                      <ButtonMateriaLight onClick={toggleWalletModal}>Connect Wallet</ButtonMateriaLight>
                    ) : showWrap ? (
                      <ButtonMateriaPrimary disabled={Boolean(wrapInputError)} onClick={onWrap}>
                        {wrapInputError ??
                          (wrapType === WrapType.WRAP ? 'Wrap' : wrapType === WrapType.UNWRAP ? 'Unwrap' : null)}
                      </ButtonMateriaPrimary>
                    ) : noRoute && userHasSpecifiedInputOutput ? (
                      <SwapGreyCard style={{ textAlign: 'center' }}>
                        <TYPE.body color={theme.text1} fontSize={20} fontWeight={500}>Insufficient liquidity for this trade</TYPE.body>
                      </SwapGreyCard>
                    ) : showApproveFlow ? (
                      <RowCenter>
                        <ButtonMateriaConfirmed
                          onClick={approveCallback}
                          disabled={approval !== ApprovalState.NOT_APPROVED || approvalSubmitted}
                          hide={approval !== ApprovalState.NOT_APPROVED || approvalSubmitted}
                          width="48%"
                          altDisabledStyle={approval === ApprovalState.PENDING} // show solid button while waiting
                          confirmed={approval === ApprovalState.APPROVED}
                        >
                          {approval === ApprovalState.PENDING ? (
                            <AutoRow gap="6px" justify="center">
                              Approving <Loader stroke="white" />
                            </AutoRow>
                          ) : approvalSubmitted && approval === ApprovalState.APPROVED ? (
                            'Approved'
                          ) : (
                                'Approve ' + currencies[Field.INPUT]?.symbol
                              )}
                        </ButtonMateriaConfirmed>
                        <ButtonMateriaError
                          onClick={() => {
                            if (isExpertMode) {
                              handleSwap()
                            } else {
                              setSwapState({
                                tradeToConfirm: trade,
                                attemptingTxn: false,
                                swapErrorMessage: undefined,
                                showConfirm: true,
                                txHash: undefined
                              })
                            }
                          }}
                          width="48%"
                          id="swap-button"
                          disabled={!isValid || approval !== ApprovalState.APPROVED || (priceImpactSeverity > 3 && !isExpertMode)}
                          hide={!isValid || approval !== ApprovalState.APPROVED || (priceImpactSeverity > 3 && !isExpertMode)}
                          error={isValid && priceImpactSeverity > 2}
                          showSwap={!(!isValid || approval !== ApprovalState.APPROVED || (priceImpactSeverity > 3 && !isExpertMode))}
                          onMouseEnter={() => { setIsShown(true); if (classicMode) { play() } }}
                          onMouseLeave={() => { setIsShown(false); if (classicMode) { stop() } }}
                        >
                          {isShown && classicMode && (
                            <FFCursorImg src={FFCursor} />
                          )}
                          <Text fontSize={16} fontWeight={500}>
                            {priceImpactSeverity > 3 && !isExpertMode
                              ? `Price Impact High`
                              : `Swap${priceImpactSeverity > 2 ? ' Anyway' : ''}`}
                          </Text>
                        </ButtonMateriaError>
                      </RowCenter>
                    ) : (
                              <ButtonMateriaError
                                onClick={() => {
                                  if (isExpertMode) {
                                    handleSwap()
                                  } else {
                                    setSwapState({
                                      tradeToConfirm: trade,
                                      attemptingTxn: false,
                                      swapErrorMessage: undefined,
                                      showConfirm: true,
                                      txHash: undefined
                                    })
                                  }
                                }}
                                id="swap-button"
                                disabled={!isValid || (priceImpactSeverity > 3 && !isExpertMode) || !!swapCallbackError}
                                error={isValid && priceImpactSeverity > 2 && !swapCallbackError}
                                showSwap={!(!isValid || (priceImpactSeverity > 3 && !isExpertMode) || !!swapCallbackError)}
                                onMouseEnter={() => { setIsShown(true); if (classicMode) { play() } }}
                                onMouseLeave={() => { setIsShown(false); if (classicMode) { stop() } }}
                              >
                                {isShown && classicMode && (
                                  <FFCursorImg src={FFCursor} />
                                )}
                                <Text fontSize={20} fontWeight={500}>
                                  {swapInputError
                                    ? swapInputError
                                    : priceImpactSeverity > 3 && !isExpertMode
                                      ? `Price Impact Too High`
                                      : `Swap${priceImpactSeverity > 2 ? ' Anyway' : ''}`}
                                </Text>
                              </ButtonMateriaError>
                            )}
                    {showApproveFlow && (
                      <Column style={{ marginTop: '1rem' }}>
                        <ProgressSteps steps={[approval === ApprovalState.APPROVED]} />
                      </Column>
                    )}
                    {isExpertMode && swapErrorMessage ? <SwapCallbackError error={swapErrorMessage} /> : null}
                  </SwapButton>
                </BottomGrouping>
              </div>
              <AdvancedSwapDetailsDropdown trade={trade} />
            </SwapPageContainer>
          </SwapGridContainer>
        </Wrapper>
        <FooterInfo>
          <div className="swapCaption">Select two token. Press "Swap" button to swap.</div>
        </FooterInfo>
      </AppBody>
    </>
  )
}
