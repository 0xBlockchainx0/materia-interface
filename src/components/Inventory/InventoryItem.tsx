import React, { useContext } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { TYPE } from '../../theme'
import { ButtonMateriaPrimary } from '../Button'

const Item = styled.div`
  padding: 1rem;
  padding-right: 0.25rem;
  margin-bottom: 0.15rem;
  width: 100%;
  height: 15%;
  ${({ theme }) => theme.backgroundContainer2}
  background-size: cover;
`

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 70% auto;
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
          <ButtonMateriaPrimary>
            {/* <TYPE.body color={theme.text1} fontWeight={500} fontSize={14}> */}
            {
              wrapped
                ? 'UN-WRAP'
                : 'WRAP'
            }
            {/* </TYPE.body> */}
          </ButtonMateriaPrimary>
        </ButtonColumn>
      </GridContainer>
    </Item>
  )
}
