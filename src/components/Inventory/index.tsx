import React from 'react'
import styled from 'styled-components'
import InventoryItem from './InventoryItem'

const InventoryContainer = styled.div`
  margin-right: 1rem;
  padding-top: 0.5rem;
  overflow-y: auto;
  max-height: 530px;
`

export default function Inventory() {
  const tokens = [
    { tokenName: 'Ethereum', tokenSymbol: 'ETH', tokenType: null, balance: '3.2351', wrapped: false },
    { tokenName: 'DFOHub', tokenSymbol: 'BUIDL', tokenType: 'ERC1155', balance: '100', wrapped: false },
    { tokenName: 'Unifi', tokenSymbol: 'UNIFI', tokenType: 'ERC1155', balance: '3,500.4989', wrapped: false },
    { tokenName: 'mEthereum', tokenSymbol: 'mETH', tokenType: 'ETHITEM', balance: '15', wrapped: true },
    { tokenName: 'Magician Cat', tokenSymbol: 'MagCat', tokenType: 'ETHITEM', balance: '5', wrapped: true },
  ]

  return (
    <InventoryContainer>
      {tokens.map((token) => {
        return (<InventoryItem key={token.tokenSymbol} tokenName={token.tokenName} tokenSymbol={token.tokenSymbol} tokenType={token.tokenType} balance={token.balance} wrapped={token.wrapped} />)
      })}
    </InventoryContainer>
  )
}