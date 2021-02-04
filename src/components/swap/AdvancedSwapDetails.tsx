import { Currency, Trade, TradeType } from '@materia-dex/sdk'
import React, { useContext } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { Field } from '../../state/swap/actions'
import { useUserSlippageTolerance } from '../../state/user/hooks'
import { InfoLink } from '../../theme'
import { computeSlippageAdjustedAmounts, computeTradePriceBreakdown } from '../../utils/prices'
import { AutoColumn } from '../Column'
import QuestionHelper from '../QuestionHelper'
import { RowBetween, RowFixed } from '../Row'
import FormattedPriceImpact from './FormattedPriceImpact'



function TradeSummary({ trade, originalCurrencies, allowedSlippage }: { 
  trade: Trade;
  originalCurrencies: { [field in Field]?: Currency }
  allowedSlippage: number 
}) {
  const theme = useContext(ThemeContext)
  const { priceImpactWithoutFee, realizedLPFee } = computeTradePriceBreakdown(trade)
  const isExactIn = trade.tradeType === TradeType.EXACT_INPUT
  const slippageAdjustedAmounts = computeSlippageAdjustedAmounts(trade, allowedSlippage)

  return (
    <>
      
      <AutoColumn style={{ padding: '0 20px' }}>       
        <RowBetween className="pt10">
          <RowFixed>
            <div className="advaced-swap-details label">
              {isExactIn ? 'Minimum received' : 'Maximum sold'}
            </div>
            <QuestionHelper text="Your transaction will revert if there is a large, unfavorable price movement before it is confirmed." />
          </RowFixed>
          <RowFixed>
            <div className="advaced-swap-details value">
              {isExactIn
                ? `${slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(4)} ${originalCurrencies[Field.OUTPUT]?.symbol}` ??
                  '-'
                : `${slippageAdjustedAmounts[Field.INPUT]?.toSignificant(4)} ${originalCurrencies[Field.INPUT]?.symbol}` ??
                  '-'}
            </div>
          </RowFixed>
        </RowBetween>
        <RowBetween className="pt10">
          <RowFixed>
            <div className="advaced-swap-details label">Price Impact</div>
            <QuestionHelper text="The difference between the market price and estimated price due to trade size." />
          </RowFixed>
          <FormattedPriceImpact priceImpact={priceImpactWithoutFee} />
        </RowBetween>
        <RowBetween className="pt10 pb10">
          <RowFixed>
            <div className="advaced-swap-details label">Liquidity Provider Fee</div>
            <QuestionHelper text="A portion of each trade (0.30%) goes to liquidity providers as a protocol incentive." />
          </RowFixed>
          <div className="advaced-swap-details value">
            {realizedLPFee ? `${realizedLPFee.toSignificant(4)} ${originalCurrencies[Field.INPUT]?.symbol}` : '-'}
          </div>
        </RowBetween>
      </AutoColumn>
    </>
  )
}

export interface AdvancedSwapDetailsProps {
  trade?: Trade
  originalCurrencies: { [field in Field]?: Currency }
}

export function AdvancedSwapDetails({ trade, originalCurrencies }: AdvancedSwapDetailsProps) {
  const [allowedSlippage] = useUserSlippageTolerance()
  const theme = useContext(ThemeContext)
  // const showRoute = Boolean(trade && trade.route.path.length > 2)

  return (
    <AutoColumn gap="md">
      {trade && (
        <>
          <TradeSummary trade={trade} originalCurrencies={originalCurrencies} allowedSlippage={allowedSlippage} />
          {/* {showRoute && (
            <>
              <SectionBreak />
              <AutoColumn style={{ padding: '0 24px' }}>
                <RowFixed>
                  <TYPE.black fontSize={14} fontWeight={400} color={theme.text2}>
                    Route
                  </TYPE.black>
                  <QuestionHelper text="Routing through these tokens resulted in the best price for your trade." />
                </RowFixed>
                <SwapRoute trade={trade} />
              </AutoColumn>
            </>
          )} */}
          <AutoColumn style={{ padding: '0 24px' }}>
            <InfoLink 
                className={theme.name}
                href={'https://info.materiadex.com/pair/' + trade.route.pairs[0].liquidityToken.address} 
                target="_blank">
              View pair analytics
            </InfoLink>
          </AutoColumn>
        </>
      )}
    </AutoColumn>
  )
}
