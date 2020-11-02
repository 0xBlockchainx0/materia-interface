import React from 'react'
import { Price } from '@uniswap/sdk'
import { useContext } from 'react'
import { Repeat } from 'react-feather'
import { Text } from 'rebass'
import styled, { ThemeContext } from 'styled-components'
import { StyledBalanceMaxMini } from './styleds'
import { TYPE } from '../../theme'

interface TradePriceProps {
  price?: Price
  showInverted: boolean
  setShowInverted: (showInverted: boolean) => void
}

const PriceLabel = styled.div`
  display: flex;
  justify-content: center;
  margin: 0 auto;
`

export default function TradePrice({ price, showInverted, setShowInverted }: TradePriceProps) {
  const theme = useContext(ThemeContext)

  const formattedPrice = showInverted ? price?.toSignificant(6) : price?.invert()?.toSignificant(6)

  const show = Boolean(price?.baseCurrency && price?.quoteCurrency)
  const label = showInverted
    ? `${price?.quoteCurrency?.symbol} per ${price?.baseCurrency?.symbol}`
    : `${price?.baseCurrency?.symbol} per ${price?.quoteCurrency?.symbol}`

  const tradePrice = (formattedPrice ?? '-') + ' ' + label

  return (
    <Text
      fontWeight={500}
      fontSize={14}
      color={theme.text2}
      style={{ justifyContent: 'center', alignItems: 'center' }}
      // style={{ justifyContent: 'center', alignItems: 'center', display: 'flex' }}
    >
      {show ? (
        <>
          <PriceLabel>
            <TYPE.body color={theme.blue2} fontWeight={500} fontSize={14}>Price</TYPE.body>
          </PriceLabel>
          <div>
            {tradePrice}
            {/* <StyledBalanceMaxMini onClick={() => setShowInverted(!showInverted)}>
              <Repeat size={14} />
            </StyledBalanceMaxMini> */}
          </div>
        </>
      ) : (
          '-'
        )}
    </Text>
  )
}
