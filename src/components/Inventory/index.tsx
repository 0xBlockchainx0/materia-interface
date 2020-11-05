import { JSBI } from '@uniswap/sdk';
import React, { useContext } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { useAllTokenList } from '../../state/lists/hooks';
import { useUserTokens } from '../../state/wallet/hooks';
import { TYPE } from '../../theme';
import InventoryItem from './InventoryItem'

const InventoryContainer = styled.div`
  margin-right: 1rem;
  padding-top: 0.5rem;
  overflow-y: auto;
  max-height: 530px;
`

export default function Inventory() {
  const theme = useContext(ThemeContext)
  const userTokens = useUserTokens()
  
  return (
    <InventoryContainer>
      {
        userTokens && userTokens.length > 0 ? (
          userTokens.map((userToken: any) => {
            return (<InventoryItem key={userToken.token.symbol} tokenName={userToken.token.name} tokenSymbol={userToken.token.symbol} tokenType={''} balance={userToken.toSignificant(4)} wrapped={false} />)
          })
        )
          :
          (<TYPE.body color={theme.text1} fontWeight={400} fontSize={16}>No tokens present in your inventory</TYPE.body>)
      }
    </InventoryContainer>
  )
}