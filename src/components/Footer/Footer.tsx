import React, { useContext } from 'react'
import styled, { ThemeContext } from 'styled-components'

const FooterContainer = styled.div`
  margin: 0 auto;
  margin-top: 1rem;
  padding: 1rem;
  color: white;
  font-size: 10px;
  transition: opacity 0.25s ease;
  color: ${({ theme }) => theme.text1};
  :hover { opacity: 1; }
  float:right;
  max-width: 1200px;
  padding: 0px;
  margin-top: 0px;
  text-align: center;

  ${({ theme }) => theme.mediaWidth.upToMedium` display: none; `}
`

export default function Footer() {
  const theme = useContext(ThemeContext)
  return (
    <FooterContainer className={theme.name}>
      Use at your own risk! This is an R&amp;D project in its early stage [Beta] Before using Materia related functions, be sure to read the documentation and Smart Contracts code. This protocol is ruled by the Materia DFO a fully decentralized organization that operates 100% on-chain without the involvement of any legal entity. If you find a bug, please notify us on our <a href="https://github.com/materia-dex" target="_blank">Github</a>
    </FooterContainer>
  )
}
