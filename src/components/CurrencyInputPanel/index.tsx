import { Currency, ETHER, Pair, Token } from '@materia-dex/sdk'
import React, { useState, useContext, useCallback } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { useCurrencyBalance } from '../../state/wallet/hooks'
import CurrencySearchModal from '../SearchModal/CurrencySearchModal'
import CurrencyLogo from '../CurrencyLogo'
import DoubleCurrencyLogo from '../DoubleLogo'
import { RowBetween } from '../Row'
import { CurrencyFormPanel, ActionButton, DropDownButton, Erc20Badge, EthItemBadge } from '../../theme'
import { Input as NumericalInput } from '../NumericalInput'
import { ReactComponent as DropDown } from '../../assets/images/dropdown.svg'

import { useActiveWeb3React } from '../../hooks'
import { useTranslation } from 'react-i18next'
import useCheckIsEthItem from '../../hooks/useCheckIsEthItem'
import { ZERO_ADDRESS } from '../../constants'

const InputRow = styled.div<{ selected: boolean }>`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  padding: ${({ selected }) => (selected ? '0.75rem 0.5rem 0.75rem 1rem' : '0.75rem 0.75rem 0.75rem 1rem')};
`
const Aligner = styled.span`
  display: flex;
  align-items: center;
  justify-content: space-between;
`
// const tokenBackground = styled.var`${({ theme }) => theme.tokenBackground}`

const TokenImage = styled.div<{ showBackground: boolean }>`
  background: ${props => props.showBackground ? ({ theme }) => theme.tokenBackground : 'unset'}    
  background-size: contain;
  height: 300px;
  width: 300px;
  background-position: ${({ theme }) => (theme.name == 'classic' ? '' : '-5px')} center!important;
  /*display: table-cell;*/
  margin: 0 auto;
  vertical-align: middle;
  @media (max-width: 1050px) { padding: 2rem !important; }
  @media (max-width: 450px) { padding: 1rem !important; margin-top: -2.5rem; }

  &.single { padding-top: 12.5%; }
  &.single.default { padding-top: 30%; }
  &.single.default > img { margin-top: 0; }
  &.single.remove-liquidity > img { margin-top: 0px; }
`

const TokenImageContainer = styled.div`
  float: none;
  margin: 0 auto;
`

const StyledDropDown = styled(DropDown) <{ selected: boolean }>`
  margin: 0 0.25rem 0 0.5rem;
  height: 35%;

  & path { stroke-width: 1.5px; }

  &.dark path, &.classic path { stroke: ${({ selected, theme }) => (selected ? theme.text1 : theme.white)}; }
  &.light path { stroke: ${({ selected, theme }) => (selected ? theme.black : theme.black)}; }
`

const StyledTokenName = styled.span<{ active?: boolean }>`
  ${({ active }) => (active ? '  margin: 0 0.25rem 0 0.75rem;' : '  margin: 0 0.25rem 0 0.25rem;')}
  font-size:  ${({ active }) => (active ? '20px' : '16px')};
  color: ${({ theme }) => theme.text1};

  &.classic { 
    font-size:  ${({ active }) => (active ? '16px' : '12px')};
    text-shadow: 1px 1px 1px ${({ theme }) => theme.black};
  }
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
  customBalanceText?: string,
  fatherPage?: string
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
  customBalanceText,
  fatherPage
}: CurrencyInputPanelProps) {
  const { t } = useTranslation()

  const [modalOpen, setModalOpen] = useState(false)
  const { account } = useActiveWeb3React()
  const selectedCurrencyBalance = useCurrencyBalance(account ?? undefined, currency ?? undefined)
  const theme = useContext(ThemeContext)

  const handleDismissSearch = useCallback(() => { setModalOpen(false) }, [setModalOpen])
  const customFatherPageCssClass = (fatherPage ? fatherPage : 'default')

  const ethItem = useCheckIsEthItem((currency instanceof Token ? currency?.address : undefined) ?? ZERO_ADDRESS)?.ethItem ?? undefined
  const showErc20Badge = currency !== ETHER && (ethItem !== undefined && ethItem === false) && pair === null
  const showEthItemBadge = currency !== ETHER && (ethItem !== undefined && ethItem === true) && pair === null

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
                {account && currency && showMaxButton && label !== 'To' && ( <ActionButton className={theme.name} onClick={onMax}>MAX</ActionButton> )}
                {currency && showErc20Badge && ( <Erc20Badge className={`${theme.name} ml5`}>ERC20</Erc20Badge> )}
                {currency && showEthItemBadge && ( <EthItemBadge className={`${theme.name} ml5`}>ITEM</EthItemBadge> )}
              </>
            )}
            <DropDownButton className={ `open-currency-select-button ${theme.name}` } selected={!!currency} onClick={() => { if (!disableCurrencySelect) { setModalOpen(true)  } }} >
              <Aligner>
                {pair ? (
                  <StyledTokenName className={`pair-name-container ${theme.name}`}>
                    {pair?.token0.symbol}:{pair?.token1.symbol}
                  </StyledTokenName>
                ) : (
                    <StyledTokenName className={`token-symbol-container ${theme.name}`} active={Boolean(currency && currency.symbol)}>
                      {(currency && currency.symbol && currency.symbol.length > 20
                        ? currency.symbol.slice(0, 4) +
                        '...' +
                        currency.symbol.slice(currency.symbol.length - 5, currency.symbol.length)
                        : currency?.symbol) || t('selectToken')}
                    </StyledTokenName>
                  )}
                {!disableCurrencySelect && <StyledDropDown className={ `${theme.name}` } selected={!!currency} />}
              </Aligner>
            </DropDownButton>
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
        <TokenImage showBackground={true} className={(!pair ? 'single' : '') + ' ' + customFatherPageCssClass}>
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
