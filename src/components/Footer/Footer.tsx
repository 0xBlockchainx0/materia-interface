import React from 'react'
import styled from 'styled-components'

const FooterContainer = styled.div`
  margin: 0 auto;
  margin-top: 3.5rem;
  padding: 1rem;
  color: white;
  transition: opacity 0.25s ease;
  color: ${({ theme }) => theme.text1};
  :hover {
    opacity: 1;
  }

  ${({ theme }) => theme.mediaWidth.upToMedium`
    display: none;
  `}
`

export default function Footer() {

  return (
    <FooterContainer>
      Use at your own risk! This is an R&amp;D project in its early stage [Beta] Before using Materia related functions, be sure to read the documentation and Smart Contracts code
    </FooterContainer>
  )
}
