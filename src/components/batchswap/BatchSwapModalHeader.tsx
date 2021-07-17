import React, { useContext } from 'react'
import { ArrowDown } from 'react-feather'
import { Text } from 'rebass'
import { ThemeContext } from 'styled-components'
import { AutoColumn } from '../Column'
import CurrencyLogo from '../CurrencyLogo'
import { RowBetween, RowFixed } from '../Row'
import { TruncatedText } from './styleds'
import { TokenInParameter, TokenOutParameter } from '../../hooks/useBatchSwapCallback'
import { unwrappedToken } from '../../utils/wrappedCurrency'

export default function BatchSwapModalHeader({
  input,
  outputs
}: {
  input: TokenInParameter
  outputs: TokenOutParameter[]
}) {
  const theme = useContext(ThemeContext)
  const currencyInput = input.token ? unwrappedToken(input.token) : undefined

  return (
    <AutoColumn gap={'md'} style={{ marginTop: '20px' }}>
      <RowBetween align="flex-end">
        <RowFixed gap={'0px'}>
          <CurrencyLogo currency={currencyInput} size={'24px'} style={{ marginRight: '12px' }} />
          <TruncatedText fontSize={24} fontWeight={500} color={''}>
            {input.amount?.toSignificant(6)}
          </TruncatedText>
        </RowFixed>
        <RowFixed gap={'0px'}>
          <Text fontSize={24} fontWeight={500} style={{ marginLeft: '10px' }}>
            {currencyInput?.symbol}
          </Text>
        </RowFixed>
      </RowBetween>

      {outputs.map(output => (
        <>
          <RowFixed>
            <ArrowDown size="16" color={theme.text2} style={{ marginLeft: '4px', minWidth: '16px' }} />
          </RowFixed>
          <RowBetween align="flex-end">
            <RowFixed gap={'0px'}>
              <CurrencyLogo
                currency={output.token && unwrappedToken(output.token)}
                size={'24px'}
                style={{ marginRight: '12px' }}
              />
              <TruncatedText fontSize={24} fontWeight={500} color={''}>
                {`${output.percentage}%`}
              </TruncatedText>
            </RowFixed>
            <RowFixed gap={'0px'}>
              <Text fontSize={24} fontWeight={500} style={{ marginLeft: '10px' }}>
                {(output.token && unwrappedToken(output.token))?.symbol}
              </Text>
            </RowFixed>
          </RowBetween>
        </>
      ))}
    </AutoColumn>
  )
}
