import { Currency, Trade, TradeType } from '@materia-dex/sdk'
import React, { useContext } from 'react'
import { ThemeContext } from 'styled-components'
import { Field } from '../../state/batchswap/actions'
import { useUserSlippageTolerance } from '../../state/user/hooks'
import { InfoLink } from '../../theme'
import { computeBatchSwapSlippageAdjustedAmounts, computeTradePriceBreakdown } from '../../utils/prices'
import { AutoColumn } from '../Column'
import QuestionHelper from '../QuestionHelper'
import { RowBetween, RowFixed } from '../Row'
import FormattedPriceImpact from '../swap/FormattedPriceImpact'

function TradeSummary({
  trade,
  originalCurrencies,
  allowedSlippage,
  outputField
}: {
  trade: Trade
  originalCurrencies: { [field in Field]?: Currency }
  allowedSlippage: number
  outputField: Field
}) {
  const theme = useContext(ThemeContext)
  const { priceImpactWithoutFee, realizedLPFee } = computeTradePriceBreakdown(trade)
  const isExactIn = trade.tradeType === TradeType.EXACT_INPUT
  const slippageAdjustedAmounts = computeBatchSwapSlippageAdjustedAmounts(trade, allowedSlippage, outputField)

  return (
    <>
      <AutoColumn style={{ padding: '0 0.5rem' }}>
        <RowBetween className="pt10">
          <RowFixed>
            <div className="advaced-swap-details label">{isExactIn ? 'Minimum received' : 'Maximum sold'}</div>
            <QuestionHelper text="Your transaction will revert if there is a large, unfavorable price movement before it is confirmed." />
          </RowFixed>
          <RowFixed>
            <div className="advaced-swap-details value">
              {isExactIn
                ? `${slippageAdjustedAmounts[outputField]?.toSignificant(4)} ${
                    originalCurrencies[outputField]?.symbol
                  }` ?? '-'
                : `${slippageAdjustedAmounts[Field.INPUT]?.toSignificant(4)} ${
                    originalCurrencies[Field.INPUT]?.symbol
                  }` ?? '-'}
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

export interface AdvancedBatchSwapDetailsProps {
  trade?: Trade
  originalCurrencies: { [field in Field]?: Currency }
  outputField: Field,
  infoLink?: string
}

export function AdvancedBatchSwapDetails({ trade, originalCurrencies, outputField, infoLink = "https://info.materiadex.com/pair" }: AdvancedBatchSwapDetailsProps) {
  const [allowedSlippage] = useUserSlippageTolerance()
  const theme = useContext(ThemeContext)

  return (
    <AutoColumn gap="md">
      {trade && (
        <>
          <TradeSummary
            trade={trade}
            originalCurrencies={originalCurrencies}
            allowedSlippage={allowedSlippage}
            outputField={outputField}
          />
          <AutoColumn style={{ padding: '0 24px' }}>
            <InfoLink
              className={theme.name}
              href={`${infoLink}/${trade.route.pairs[0].liquidityToken.address}`}
              target="_blank"
            >
              View pair analytics
            </InfoLink>
          </AutoColumn>
        </>
      )}
    </AutoColumn>
  )
}
