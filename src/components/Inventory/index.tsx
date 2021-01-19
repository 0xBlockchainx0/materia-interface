import { Currency, CurrencyAmount, JSBI, TokenAmount } from '@materia-dex/sdk';
import React, { useContext } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { useUserTokens } from '../../state/wallet/hooks';
import { TYPE, SectionTitle } from '../../theme';
import InventoryItem from './InventoryItem'
import { Scrollbars } from 'react-custom-scrollbars';


const InventoryContainer = styled.div`
  @media (max-width: 1350px) {
      display: none;
  }
  margin-right: 1rem;
  padding-top: 0.5rem;
  overflow-y: auto;
  max-height: 550px;
  overflow: hidden;
  `

const InventoryTitle = styled.div`
  margin-bottom: 10px;
`
/* const SectionTitle = styled.h6`
  
  font-weight:500;
  font-size:15px;
  border-bottom: solid 1px;
  position: relative;
  display:inline-block;
  padding: 0px 5px 4px 10px;
  margin: 0px 0px 10px 0px;
  :before {
    content: " ";
    display: block;
    width: 5px;
    height: 5px;
    border-radius: 5px;
    color: theme.sectionTitle;
    background-color: ${({ theme }) => theme.sectionTitle};
    position:absolute;
    bottom: -3px;
    left:0px;
  }
  :after {
    content: " ";
    display: block;
    width: 5px;
    height: 5px;
    border-radius: 5px;
    color: theme.sectionTitle;
    background-color: ${({ theme }) => theme.sectionTitle};
    position:absolute;
    bottom: -3px;
    right:0px;
  }
` */


interface InventoryProps {
  onCurrencySelect: (currency: Currency) => void
}

export default function Inventory({
  onCurrencySelect
}: InventoryProps) {
  const theme = useContext(ThemeContext)
  const userTokens = useUserTokens()

  return (
    <InventoryContainer>
      <SectionTitle className={theme.name}>Inventory</SectionTitle>
      <Scrollbars autoHeight autoHeightMin={500} autoHide>
      {
        userTokens && userTokens.length > 0 ? (
          userTokens.map((userToken: any) => {
            if (userToken && userToken.token) {
              return (<InventoryItem onCurrencySelect={onCurrencySelect} token={userToken.token} key={userToken.token.symbol} tokenName={userToken.token.name} tokenSymbol={userToken.token.symbol} tokenType={''} balance={userToken.toExact(4)} wrapped={false} tokenAddress={userToken.token.address} />)
            }
            else {
              return (<InventoryItem onCurrencySelect={onCurrencySelect} token={userToken.currency} key={userToken.currency.symbol} tokenName={userToken.currency.name ?? ''} tokenSymbol={userToken.currency.symbol ?? ''} tokenType={''} balance={userToken.toExact(4)} wrapped={false} tokenAddress={userToken.currency.address ?? ''}/>)
            }
          })
        )
          :
          (<TYPE.body color={theme.text1} fontWeight={400} fontSize={12}>No items in your inventory</TYPE.body>)
      }
      </Scrollbars>
    </InventoryContainer>
  )
}