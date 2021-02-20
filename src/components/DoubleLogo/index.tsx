import { Currency } from '@materia-dex/sdk'
import React from 'react'
import styled from 'styled-components'
import CurrencyLogo from '../CurrencyLogo'

const Wrapper = styled.div<{ margin: boolean; sizeraw: number }>`
  position: relative;
  display: flex;
  flex-direction: row;
  margin-right: ${({ sizeraw, margin }) => margin && (sizeraw / 3 + 8).toString() + 'px'};
  &.liquidity-mining-double-token { display: grid; grid-template-columns: 36px 36px; float: right; }
`

interface DoubleCurrencyLogoProps {
  radius?: boolean
  margin?: boolean
  size?: number
  currency0?: Currency
  currency1?: Currency,
  cssClassName?: string
}

const HigherLogo = styled(CurrencyLogo)`
  z-index: 2;
`
const CoveredLogo = styled(CurrencyLogo) <{ sizeraw: number }>`
  position: absolute;
  left: ${({ sizeraw }) => '-' + (sizeraw / 2).toString() + 'px'} !important;
`

export default function DoubleCurrencyLogo({
  currency0,
  currency1,
  size = 16,
  margin = false,
  radius = false,
  cssClassName = ''
}: DoubleCurrencyLogoProps) {
  return (
    <Wrapper sizeraw={size} margin={margin} className={cssClassName}>
      {currency0 && <HigherLogo radius={radius} currency={currency0} size={size.toString() + 'px'} />}
      {currency1 && <CoveredLogo radius={radius} currency={currency1} size={size.toString() + 'px'} sizeraw={size} />}
    </Wrapper>
  )
}
