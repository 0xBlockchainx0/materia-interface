import { Currency, Pair } from '@materia-dex/sdk'
import React, { useState, useContext, useCallback } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { darken } from 'polished'
import { useCurrencyBalance } from '../../state/wallet/hooks'
import CurrencySearchModal from '../SearchModal/CurrencySearchModal'
import CurrencyLogo from '../CurrencyLogo'
import DoubleCurrencyLogo from '../DoubleLogo'
import { RowBetween } from '../Row'
import { TYPE, CurrencyFormPanel } from '../../theme'
import { Input as NumericalInput } from '../NumericalInput'
import { ReactComponent as DropDown } from '../../assets/images/dropdown.svg'

import { useActiveWeb3React } from '../../hooks'
import { useTranslation } from 'react-i18next'

const InputRow = styled.div<{ selected: boolean }>`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  padding: ${({ selected }) => (selected ? '0.75rem 0.5rem 0.75rem 1rem' : '0.75rem 0.75rem 0.75rem 1rem')};
`

const CurrencySelect = styled.button<{ selected: boolean }>`
  align-items: center;
  height: 2.2rem;
  font-size: 20px;
  font-weight: 500;
  background-color: transparent;
  color: ${({ selected, theme }) => (selected ? theme.text1 : theme.white)};
  border-radius: 12px;
  // box-shadow: ${({ selected }) => (selected ? 'none' : '0px 6px 10px rgba(0, 0, 0, 0.075)')};
  outline: none;
  cursor: pointer;
  user-select: none;
  border: none;
  padding: 0 0.5rem;

  :focus,
  :hover {
    background-color: transparent;
  }
`

const Aligner = styled.span`
  display: flex;
  align-items: center;
  justify-content: space-between;
`
const tokenBackground = styled.var`${({ theme }) => theme.tokenBackground}`

const TokenImage = styled.div<{ showBackground: boolean }>`
  background: ${props => props.showBackground ? ({ theme }) => theme.tokenBackground : 'unset'}    
  background-size: contain;
  height: 300px;
  width: 300px;
  background-position: center;
  display: table-cell;
  vertical-align: middle;
  background-position: center;
  @media (max-width: 1050px) {
    padding: 2rem !important;
  }
  @media (max-width: 450px) {
    padding: 1rem !important;
    margin-top: -2.5rem;
  }
`

const TokenImageContainer = styled.div`
  float: none;
  margin: 0 auto;
`

const StyledDropDown = styled(DropDown) <{ selected: boolean }>`
  margin: 0 0.25rem 0 0.5rem;
  height: 35%;

  path {
    stroke: ${({ selected, theme }) => (selected ? theme.text1 : theme.white)};
    stroke-width: 1.5px;
  }
`

const StyledTokenName = styled.span<{ active?: boolean }>`
  ${({ active }) => (active ? '  margin: 0 0.25rem 0 0.75rem;' : '  margin: 0 0.25rem 0 0.25rem;')}
  font-size:  ${({ active }) => (active ? '20px' : '16px')};
  color: ${({ theme }) => theme.text1};
`

const StyledBalanceMax = styled.button`
  height: 28px;
  background-color: ${({ theme }) => theme.primary5};
  border: 1px solid ${({ theme }) => theme.primary5};
  border-radius: 3px;
  font-size: 0.875rem
  font-weight: 500;
  cursor: pointer;
  margin-right: 0.5rem;
  color: ${({ theme }) => theme.cyan1};
  :hover {
    text-shadow: 0px 0px 2px 0px #111111; 
    border-color: ${({ theme }) => theme.cyan2};
    box-shadow: 0px 0px 6px 0px #b0deff;
  }
  :focus {
    border-color: ${({ theme }) => theme.cyan2};
    outline: none;
  }

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    margin-right: 0.5rem;
  `};
`

interface CurrencyInputPanelProps {
  value: string
  onUserInput: (value: string) => void
  onMax?: () => void
  showMaxButton: boolean
  label?: string
  onCurrencySelect?: (currency: Currency) => void
  currency?: Currency | null
  disableCurrencySelect?: boolean
  hideBalance?: boolean
  pair?: Pair | null
  hideInput?: boolean
  otherCurrency?: Currency | null
  id: string
  showCommonBases?: boolean
  customBalanceText?: string
}

export default function CurrencyInputPanel({
  value,
  onUserInput,
  onMax,
  showMaxButton,
  label = 'Input',
  onCurrencySelect,
  currency,
  disableCurrencySelect = false,
  hideBalance = false,
  pair = null, // used for double token logo
  hideInput = false,
  otherCurrency,
  id,
  showCommonBases,
  customBalanceText
}: CurrencyInputPanelProps) {
  const { t } = useTranslation()

  const [modalOpen, setModalOpen] = useState(false)
  const { account } = useActiveWeb3React()
  const selectedCurrencyBalance = useCurrencyBalance(account ?? undefined, currency ?? undefined)
  const theme = useContext(ThemeContext)

  const handleDismissSearch = useCallback(() => { setModalOpen(false) }, [setModalOpen])

  return (
    <>
      <CurrencyFormPanel id={id} className={theme.name}>
        <div className="itemsContainer">
          {!hideInput && (
            <div className="labelRow">
              <RowBetween>
                <div className="label">{label}</div>
                {account && (
                  <div className="label link" onClick={onMax}>
                    {!hideBalance && !!currency && selectedCurrencyBalance ? (customBalanceText ?? 'Balance: ') + selectedCurrencyBalance?.toSignificant(6) : ' -'}
                  </div>
                )}
              </RowBetween>
            </div>
          )}
          <InputRow style={hideInput ? { padding: '0', borderRadius: '8px' } : {}} selected={disableCurrencySelect}>
            {!hideInput && (
              <>
                <NumericalInput className="token-amount-input" value={value} onUserInput={val => { onUserInput(val) }} />
                {account && currency && showMaxButton && label !== 'To' && ( <StyledBalanceMax onClick={onMax}>MAX</StyledBalanceMax> )}
              </>
            )}
            <CurrencySelect
              selected={!!currency}
              className="open-currency-select-button"
              onClick={() => {
                if (!disableCurrencySelect) {
                  setModalOpen(true)
                }
              }}
            >
              <Aligner>
                {pair ? (
                  <StyledTokenName className="pair-name-container">
                    {pair?.token0.symbol}:{pair?.token1.symbol}
                  </StyledTokenName>
                ) : (
                    <StyledTokenName className="token-symbol-container" active={Boolean(currency && currency.symbol)}>
                      {(currency && currency.symbol && currency.symbol.length > 20
                        ? currency.symbol.slice(0, 4) +
                        '...' +
                        currency.symbol.slice(currency.symbol.length - 5, currency.symbol.length)
                        : currency?.symbol) || t('selectToken')}
                    </StyledTokenName>
                  )}
                {!disableCurrencySelect && <StyledDropDown selected={!!currency} />}
              </Aligner>
            </CurrencySelect>
          </InputRow>
        </div>
        {!disableCurrencySelect && onCurrencySelect && (
          <CurrencySearchModal
            isOpen={modalOpen}
            onDismiss={handleDismissSearch}
            onCurrencySelect={onCurrencySelect}
            selectedCurrency={currency}
            otherSelectedCurrency={otherCurrency}
            showCommonBases={showCommonBases}
          />
        )}
      </CurrencyFormPanel>
      <TokenImageContainer>
        <TokenImage showBackground={true}>
          {pair ? (
            <DoubleCurrencyLogo currency0={pair.token0} currency1={pair.token1} size={110} margin={false} radius={true} />
          ) : currency ? (
            <CurrencyLogo currency={currency} size={'110px'} />
          ) : null}
        </TokenImage>
      </TokenImageContainer>
    </>
  )
}
