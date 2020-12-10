import React from 'react'
import styled from 'styled-components'
import { useLastTruthy } from '../../hooks/useLast'
import { AdvancedSwapDetails, AdvancedSwapDetailsProps } from './AdvancedSwapDetails'

const AdvancedDetailsFooter = styled.div<{ show: boolean }>` 
padding-bottom: ${({ show }) => show ? '10px' : ''};
padding-top: ${({ show }) => show ? '10px' : ''};
display: ${({ show }) => (show ? 'block' : 'none')};
color: ${({ theme }) => theme.text2};
background-color: ${({ theme }) => theme.advancedBG};
border: ${({ show }) => (show ? '1px solid #1e9de3' : '')};
transform: ${({ show }) => (show ? 'translateY(0%)' : 'translateY(-100%)')};
width: 100%;
z-index: -1;
transition: transform 300ms ease-in-out;

  ${({ theme }) => theme.advancedDetailsFooter}

  @media (max-width: 600px) {
    padding-left: -2rem !important;
  }
`

export default function AdvancedSwapDetailsDropdown({ trade, ...rest }: AdvancedSwapDetailsProps) {
  const lastTrade = useLastTruthy(trade)
  const booleanTrade = Boolean(trade);

  return (
    <AdvancedDetailsFooter show={booleanTrade}>
      <AdvancedSwapDetails {...rest} trade={trade ?? lastTrade ?? undefined} />
    </AdvancedDetailsFooter>
  )
}
