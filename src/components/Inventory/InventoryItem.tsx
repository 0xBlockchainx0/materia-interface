import React from 'react'
import styled from 'styled-components'
import listItemBackground from '../../assets/images/list-item.png'

const Item = styled.div`
  width: 100%;
  background: url(${listItemBackground}) no-repeat;
  background-size: cover;
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
    0px 24px 32px rgba(0, 0, 0, 0.01);
`

export default function InventoryItem() {
  return (
    <Item>
      CIAO
    </Item>
  )
}
