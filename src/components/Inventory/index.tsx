import { CurrencyAmount, JSBI, TokenAmount } from '@uniswap/sdk';
import React, { useContext } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { useUserTokens } from '../../state/wallet/hooks';
import { TYPE } from '../../theme';
import InventoryItem from './InventoryItem'

const InventoryContainer = styled.div`
  @media (max-width: 1350px) {
      display: none;
  }
  margin-right: 1rem;
  padding-top: 0.5rem;
  overflow-y: auto;
  max-height: 530px;
`

const InventoryTitle = styled.div`
  margin-bottom: 10px;
`

export default function Inventory() {
  const theme = useContext(ThemeContext)
  const userTokens = useUserTokens()

  return (
    <InventoryContainer>
      <InventoryTitle>
        <TYPE.body color={theme.text1} fontWeight={500} fontSize={15} >Inventory</TYPE.body>
      </InventoryTitle>
      {
        userTokens && userTokens.length > 0 ? (
          userTokens.map((userToken: any) => {
            if (userToken && userToken.token) {
              return (<InventoryItem key={userToken.token.symbol} tokenName={userToken.token.name} tokenSymbol={userToken.token.symbol} tokenType={''} balance={userToken.toExact(4)} wrapped={false} />)
            }
            else {
              return (<InventoryItem key={userToken.currency.symbol} tokenName={userToken.currency.name ?? ''} tokenSymbol={userToken.currency.symbol ?? ''} tokenType={''} balance={userToken.toExact(4)} wrapped={false} />)
            }
          })
        )
          :
          (<TYPE.body color={theme.text1} fontWeight={400} fontSize={12}>No tokens present in your inventory</TYPE.body>)
      }
    </InventoryContainer>
  )
}