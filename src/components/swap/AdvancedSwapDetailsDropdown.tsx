import React from 'react'
import styled from 'styled-components'
import { useLastTruthy } from '../../hooks/useLast'
import { AdvancedSwapDetails, AdvancedSwapDetailsProps } from './AdvancedSwapDetails'

const AdvancedDetailsFooter = styled.div<{ show: boolean }>` 
  padding-bottom: ${({ show }) => show ? '10px' : ''};
  padding-top: ${({ show }) => show ? '10px' : ''};
  width: 100%;
  color: ${({ theme }) => theme.text2};
  background-color: ${({ theme }) => theme.advancedBG};
  z-index: -1;
  border: ${({ show }) => (show ? '1px solid #1e9de3' : '')};
  transform: ${({ show }) => (show ? 'translateY(0%)' : 'translateY(-100%)')};
  transition: transform 300ms ease-in-out;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden; 
  display: ${({ show }) => (show ? 'block' : 'none')};

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
