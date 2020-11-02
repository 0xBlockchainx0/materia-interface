import React, { useContext } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { TYPE } from '../../theme'

const Item = styled.div`
  padding: 1rem;
  margin-bottom: 0.15rem;
  width: 100%;
  height: 15%;
  background-color: rgba(0, 27, 49, 0.5);
  background-size: cover;
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
    0px 24px 32px rgba(0, 0, 0, 0.01);
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

interface InventoryItemProps {
  tokenName: string
  tokenSymbol: string
  tokenType?: string | null,
  balance?: string | null,
  wrapped?: boolean
}

export default function InventoryItem({
  tokenName,
  tokenSymbol,
  tokenType,
  balance = "0",
  wrapped = false
}: InventoryItemProps) {
  const theme = useContext(ThemeContext)

  return (
    <Item>
      <GridContainer>
        <div>
          <TYPE.body color={theme.text1} fontWeight={500} fontSize={18}>{tokenName} ({tokenSymbol})</TYPE.body>
          <BalanceRow>
            <TYPE.body color={theme.blue2} fontWeight={500} fontSize={16}>Balance:</TYPE.body>
            <BalanceText>
              <TYPE.body color={theme.text1} fontWeight={500} fontSize={16}>{balance}</TYPE.body>
            </BalanceText>
            {tokenType
              && (
                <TokenType>
                  <TYPE.body color={theme.cyan1} fontWeight={500} fontSize={16}>{tokenType}</TYPE.body>
                </TokenType>
              )}
          </BalanceRow>
        </div>
        <ButtonColumn>
          <TYPE.body color={theme.text1} fontWeight={500} fontSize={14}>
            {
              wrapped
                ? 'UN-WRAP'
                : 'WRAP'
            }
          </TYPE.body>
        </ButtonColumn>
      </GridContainer>
    </Item>
  )
}
