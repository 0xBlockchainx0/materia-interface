import React from 'react'
import styled from 'styled-components'
import { useLastTruthy } from '../../hooks/useLast'
import { AdvancedSwapDetails, AdvancedSwapDetailsProps } from './AdvancedSwapDetails'

const AdvancedDetailsFooter = styled.div<{ show: boolean }>`
  border: solid 1px #424542;
  box-shadow: 1px 1px #e7dfe7, -1px -1px #e7dfe7, 1px -1px #e7dfe7, -1px 1px #e7dfe7, 0 -2px #9c9a9c, -2px 0 #7b757b,
    0 2px #424542;
  width: 500px;
  padding: 1rem;

  background: #700e9c;
  background: -moz-linear-gradient(top, #700e9c 0%, #6c1237 100%);
  background: -webkit-gradient(linear, left top, left bottom, color-stop(0%, #700e9c), color-stop(100%, #6c1237));
  background: -webkit-linear-gradient(top, #700e9c 0%, #6c1237 100%);
  background: -o-linear-gradient(top, #700e9c 0%, #6c1237 100%);
  background: -ms-linear-gradient(top, #700e9c 0%, #6c1237 100%);
  background: linear-gradient(to bottom, #700e9c 0%, #6c1237 100%);
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#700e9c', endColorstr='#6c1237',GradientType=0 );

  -webkit-border-radius: 7px;
  -moz-border-radius: 7px;
  border-radius: 10px;

  padding-top: calc(16px + 2rem);
  padding-bottom: 20px;
  margin-top: -2rem;
  width: 100%;
  max-width: 400px;
  color: ${({ theme }) => theme.text2};
  z-index: -1;

  transform: ${({ show }) => (show ? 'translateY(0%)' : 'translateY(-100%)')};
  transition: transform 300ms ease-in-out;
`

export default function AdvancedSwapDetailsDropdown({ trade, ...rest }: AdvancedSwapDetailsProps) {
  const lastTrade = useLastTruthy(trade)

  return (
    <AdvancedDetailsFooter show={Boolean(trade)}>
      <AdvancedSwapDetails {...rest} trade={trade ?? lastTrade ?? undefined} />
    </AdvancedDetailsFooter>
  )
}
