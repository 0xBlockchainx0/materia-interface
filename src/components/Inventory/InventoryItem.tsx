import React, { useCallback, useContext, useState } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { TYPE } from '../../theme'
import { ButtonMateriaPrimary, ButtonEmpty, ButtonPrimary } from '../Button'
import { RowBetween, RowFixed } from '../Row'
import { AutoColumn } from '../Column'
import { Text } from 'rebass'
import { ChevronDown, ChevronUp } from 'react-feather'
import { Input as NumericalInput } from '../NumericalInput'
import { Currency, CurrencyAmount, ETHER, JSBI, Token, TokenAmount } from '@uniswap/sdk'
import { useActiveWeb3React } from '../../hooks'
import { useSwapActionHandlers } from '../../state/swap/hooks'
import { Field } from '../../state/wrap/actions'
import { useDerivedWrapInfo, useWrapActionHandlers, useWrapState } from '../../state/wrap/hooks'
import CurrencyInputPanel from '../CurrencyInputPanel'
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';


const Item = styled.div`
  padding: 1rem;
  margin-bottom: 0.15rem;
  width: 100%;
  height: auto;
  ${({ theme }) => theme.backgroundContainer2}
  background-size: cover;
`

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 80% auto;
`

const ButtonColumn = styled.div`
  margin: auto;
`

const TokenType = styled.span`
  margin-left: 10px;
  // color: ${({ theme }) => theme.cyan1}
`

const BalanceRow = styled.div`
  display: inline-flex;
`

const BalanceText = styled.div`
margin-left: 5px;
`

export const FixedHeightRow = styled(RowBetween)`
  height: auto;
`

const StyledBalanceMax = styled.button`
  height: 28px;
  background-color: ${({ theme }) => theme.primary5};
  border: 1px solid ${({ theme }) => theme.primary5};
  border-radius: 0.5rem;
  font-size: 0.875rem;

  font-weight: 500;
  cursor: pointer;
  margin-right: 0.5rem;
  color: ${({ theme }) => theme.cyan1};
  :hover {
    border: 1px solid ${({ theme }) => theme.cyan2};
  }
  :focus {
    border: 1px solid ${({ theme }) => theme.cyan2};
    outline: none;
  }

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    margin-right: 0.5rem;
  `};
`

interface InventoryItemProps {
  token: Token
  tokenName: string
  tokenSymbol: string
  tokenAddress: string | null,
  tokenType?: string | null,
  balance?: string | null,
  wrapped?: boolean,
}

export default function InventoryItem({
  token,
  tokenName,
  tokenSymbol,
  tokenType,
  tokenAddress,
  balance,
  wrapped = false,
}: InventoryItemProps) {
  const theme = useContext(ThemeContext)
  const [showMore, setShowMore] = useState(false)
  const [isERC20, setIsERC20] = useState(true)
  const [isERC721, setIsERC721] = useState(false)
  const [isERC1155, setIsERC1155] = useState(false)

  const { account } = useActiveWeb3React()
  const { onUserInput } = useWrapActionHandlers()
  const handleMaxButton = useCallback(() => {
    onUserInput(Field.INPUT, balance ?? '0.0')
  },
    [onUserInput]
  )

  const handleNumericalInput = useCallback(
    (value: string) => {
      onUserInput(Field.INPUT, value)
    },
    [onUserInput]
  )

  const {
    parsedAmount,
    error,
  } = useDerivedWrapInfo()
  const { independentField, typedValue } = useWrapState()
  const parsedAmounts = {
    [Field.INPUT]: independentField === Field.INPUT ? parsedAmount : balance,
  }

  const formattedAmounts = {
    [independentField]: typedValue
  }

  const options = [
    'ERC20', 'ERC721', 'ERC1155'
  ];
  const defaultOption = options[1];

  const onSelect = useCallback(
    (value) => {
      console.log(value)
      switch (value.value) {
        case 'ERC20':
          setIsERC20(true)
          setIsERC721(false)
          setIsERC1155(false)
          break
        case 'ERC721':
          setIsERC20(false)
          setIsERC721(true)
          setIsERC1155(false)
          break
        case 'ERC1155':
          setIsERC20(false)
          setIsERC721(false)
          setIsERC1155(true)
          break
      }
    },
    [setIsERC20, setIsERC721, setIsERC1155]
  )

  return (
    <Item>
      <GridContainer>
        <div>
          <TYPE.body color={theme.text1} fontWeight={500} fontSize={15}>{tokenName} ({tokenSymbol})</TYPE.body>
          <BalanceRow>
            <TYPE.body color={theme.blue2} fontWeight={500} fontSize={12}>Balance:</TYPE.body>
            <BalanceText>
              <TYPE.body color={theme.text1} fontWeight={500} fontSize={12}>{balance}</TYPE.body>
            </BalanceText>
            {tokenType
              && (
                <TokenType>
                  <TYPE.body color={theme.cyan1} fontWeight={500} fontSize={15}>{tokenType}</TYPE.body>
                </TokenType>
              )}
          </BalanceRow>
        </div>
        <ButtonColumn>
          <ButtonEmpty
            padding="6px 8px"
            borderRadius="12px"
            width="fit-content"
            onClick={() => { setShowMore(!showMore) }}
          >
            {showMore ? (
              <>
                {' '}
                <ChevronUp size="20" style={{ marginLeft: '10px' }} />
              </>
            ) : (
                <>
                  <ChevronDown size="20" style={{ marginLeft: '10px' }} />
                </>
              )}
          </ButtonEmpty>
        </ButtonColumn>
      </GridContainer>

      {showMore && (
        <AutoColumn>
          <Text fontSize={10} fontWeight={500}>
            {tokenAddress}
          </Text>
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
                <StyledBalanceMax onClick={handleMaxButton}>MAX</StyledBalanceMax>
              )}
            </>
          </FixedHeightRow>
          {tokenAddress!=='' &&(
            <>
          Wrap as <Dropdown options={options} onChange={onSelect} value={defaultOption} />
          </>
          )}
          <RowBetween marginTop="10px">
            {isERC20 && (
            <ButtonPrimary
              padding="8px"
              borderRadius="8px"
              width="48%"
            >
              Approve
              </ButtonPrimary>
              )}
            <ButtonPrimary
              padding="8px"
              borderRadius="8px"
              width="48%"
            >
              Wrap
              </ButtonPrimary>
          </RowBetween>
        </AutoColumn>
      )}
    </Item>
  )
}
