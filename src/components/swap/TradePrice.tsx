import React, { useCallback, useState } from 'react'
import { Price } from '@uniswap/sdk'
import { useContext } from 'react'
import { Repeat } from 'react-feather'
import { Text } from 'rebass'
import styled, { ThemeContext } from 'styled-components'
import { StyledBalanceMaxMini } from './styleds'
import { TYPE } from '../../theme'
import QuestionHelper from '../QuestionHelper'

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

const AutoUnWrap = styled.div`
  display: flex;
  justify-content: center;
  margin: 0 auto;
  margin-bottom: 2rem
`


export default function TradePrice({ price, showInverted, setShowInverted }: TradePriceProps) {
  const theme = useContext(ThemeContext)

  const formattedPrice = showInverted ? price?.toSignificant(6) : price?.invert()?.toSignificant(6)

  const show = Boolean(price?.baseCurrency && price?.quoteCurrency)
  const label = showInverted
    ? `${price?.quoteCurrency?.symbol} per ${price?.baseCurrency?.symbol}`
    : `${price?.baseCurrency?.symbol} per ${price?.quoteCurrency?.symbol}`

  const tradePrice = (formattedPrice ?? '-') + ' ' + label

  const [wrapValue, setWrap] = useState(false)
  const toggleWrap = useCallback(() => setWrap(uc => !uc), [])

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
          <AutoUnWrap>
          <input
                  type="checkbox"
                  className="wrap-checkbox"
                  checked={wrapValue}
                  onChange={toggleWrap}
                />{' '}
                 Auto Un-Wrap <QuestionHelper text="Your transaction will automatically unwrap the ethItem into your desired currency." />
          </AutoUnWrap>
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
