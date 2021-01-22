import React, { useCallback, useContext, useState } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { GridContainer, InventoryItemContainer, IconButton, ActionButton } from '../../theme'
import { ButtonMateriaPrimary } from '../Button'
import { RowBetween } from '../Row'
import { AutoColumn } from '../Column'
import { Text } from 'rebass'
import { Input as NumericalInput } from '../NumericalInput'
import { Currency, ETHER, Token } from '@materia-dex/sdk'
import { useActiveWeb3React } from '../../hooks'
import { Field } from '../../state/wrap/actions'
import { useWrapActionHandlers, useWrapState } from '../../state/wrap/hooks'
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import { unwrappedToken } from '../../utils/wrappedCurrency'
import { ChevronUp, ChevronDown, ExternalLink } from 'react-feather'

export const FixedHeightRow = styled(RowBetween)`
  height: auto;
`

interface InventoryItemProps {
  token: Token
  tokenName: string
  tokenSymbol: string
  tokenAddress: string | null,
  tokenType?: string | null,
  balance?: string | null,
  wrapped?: boolean,
  onCurrencySelect: (currency: Currency) => void
}

export default function InventoryItem({
  token,
  tokenName,
  tokenSymbol,
  tokenType,
  tokenAddress,
  balance,
  wrapped = false,
  onCurrencySelect
}: InventoryItemProps) {
  const theme = useContext(ThemeContext)
  const [showMore, setShowMore] = useState(false)
  const [isERC20, setIsERC20] = useState(true)
  // const [isERC721, setIsERC721] = useState(false)
  // const [isERC1155, setIsERC1155] = useState(false)

  const { account } = useActiveWeb3React()
  const { onUserInput } = useWrapActionHandlers()
  const handleMaxButton = useCallback(() => {
    onUserInput(Field.INPUT, balance ?? '0.0')
  },
    [onUserInput, balance]
  )

  const handleNumericalInput = useCallback(
    (value: string) => {
      onUserInput(Field.INPUT, value)
    },
    [onUserInput]
  )

  // const {
  //   parsedAmount,
  // } = useDerivedWrapInfo()
  const { independentField, typedValue } = useWrapState()
  
  // const parsedAmounts = {
  //   [Field.INPUT]: independentField === Field.INPUT ? parsedAmount : balance,
  // }

  const formattedAmounts = {
    [independentField]: typedValue
  }

  const options = [
    'ERC20', 'ERC721', 'ERC1155'
  ];
  const defaultOption = options[1];

  const onSelect = useCallback(
    (value) => {
      switch (value.value) {
        case 'ERC20':
          setIsERC20(true)
          // setIsERC721(false)
          // setIsERC1155(false)
          break
        // case 'ERC721':
        //   setIsERC20(false)
        //   setIsERC721(true)
        //   setIsERC1155(false)
        //   break
        // case 'ERC1155':
        //   setIsERC20(false)
        //   setIsERC721(false)
        //   setIsERC1155(true)
        //   break
      }
    },
    // [setIsERC20, setIsERC721, setIsERC1155]
    [setIsERC20]
  )

  const onTokenSelection = useCallback(
    (token) => {
      let currency = ETHER

      if (token.symbol != 'ETH') {
        currency = unwrappedToken(token)
      }
      
      onCurrencySelect(currency)
    },
    [onCurrencySelect]
  )

  return (
    <InventoryItemContainer className={theme.name}>
      <GridContainer>
        <div>
          <div>{tokenName} ({tokenSymbol})</div>
          <div className="balanceRow">
              <div>Balance:</div>
              <div>{balance}</div>
              {tokenType
              && (
                <span className="tokenType">
                  <span>{tokenType}</span>
                </span>
              )}
          </div>
        </div>
        <div className="margin-auto">
          <IconButton className={ `${theme.name}` } onClick={() => { setShowMore(!showMore) }}>              
              {showMore ? ( <ChevronUp/> ) : ( <ChevronDown/> )}
          </IconButton>
          <IconButton className={theme.name} onClick={() => { onTokenSelection(token) }}>              
              <ExternalLink/>
          </IconButton>           
        </div>
      </GridContainer>

      {showMore && (
        <AutoColumn>
          <Text fontSize={10} fontWeight={500} style={{ marginBottom: '10px' }}>{tokenAddress}</Text>
          <FixedHeightRow>
            <>
              <NumericalInput
                className="token-amount-input"
                fontSize={'16px'}
                value={formattedAmounts[Field.INPUT]}
                onUserInput={val => {
                  handleNumericalInput(val)
                }}
              />
              {account && token && (
                <ActionButton className={theme.name} onClick={handleMaxButton}>MAX</ActionButton>
              )}
            </>
          </FixedHeightRow>
          {tokenAddress !== '' && (
            <div className="wrapASBlock">
              <div>Wrap as</div>
              <div><Dropdown options={options} onChange={onSelect} value={defaultOption} /></div>
              <div className="clearfix"></div>
            </div>
          )}
          <RowBetween marginTop="10px">
            {isERC20 && (
              <ButtonMateriaPrimary style={{ width: 'inherit', marginRight: '10px' }}>Approve</ButtonMateriaPrimary>
            )}
            <ButtonMateriaPrimary style={{ width: 'inherit' }}>Wrap</ButtonMateriaPrimary>
          </RowBetween>
        </AutoColumn>
      )}
    </InventoryItemContainer>
  )
}
