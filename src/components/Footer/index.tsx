import React, {  } from 'react'
import styled from 'styled-components'

const FooterFrame = styled.div`
  display: grid;
  font-size: 9px;
  max-width:500px;
  grid-template-columns: 1fr 120px;
  align-items: center;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  width: 100%;
  bottom: 0;
  position: fixed;
  padding: 1rem;
  z-index: 2;
`

export default function Footer() {

  return (
    <FooterFrame>Use at your own risk! This is an R&D project in its early stage [Beta]. 
        Before using Materia related functions, be sure to read the documentation and Smart Contracts code. 
        Mateeria is a fork of Uniswap, so be sure about how Uniswap DeFi protocol works too: 
        Ethhub Uniswap Guide | Uniswap Returns Guide | Advanced Uniswap Guide
    </FooterFrame>
  )
}
