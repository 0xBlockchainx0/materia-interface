import { BLOCKED_PRICE_IMPACT_NON_EXPERT } from '../constants'
import { Currency, CurrencyAmount, Fraction, JSBI, Pair, Percent, TokenAmount, Trade } from '@materia-dex/sdk'
import { ALLOWED_PRICE_IMPACT_HIGH, ALLOWED_PRICE_IMPACT_LOW, ALLOWED_PRICE_IMPACT_MEDIUM } from '../constants'
import { Field } from '../state/swap/actions'
import { basisPointsToPercent } from './index'
import { usePairContract } from '../hooks/useContract'
import { useSingleCallResult } from '../state/multicall/hooks'

const BASE_FEE = new Percent(JSBI.BigInt(30), JSBI.BigInt(10000))
const ONE_HUNDRED_PERCENT = new Percent(JSBI.BigInt(10000), JSBI.BigInt(10000))
const INPUT_FRACTION_AFTER_FEE = ONE_HUNDRED_PERCENT.subtract(BASE_FEE)

// prendi valore dai contratti e fai * 10 per convertirlo in BasePoint unit
// dalla pair chiama swapFee per recuperare la fee della pair

// computes price breakdown for the trade
export function computeTradePriceBreakdown(
  trade?: Trade
): { priceImpactWithoutFee?: Percent; realizedLPFee?: CurrencyAmount } {
  // // get the address of each pair in route
  // const pairAddresses: string[] | undefined = !trade
  //   ? undefined
  //   : trade.route.pairs.map((pair) => pair.liquidityToken.address)
  
  // console.log('*********************************')
  // console.log('pairAddresses: ', pairAddresses)
  // console.log('trade.route: ', trade?.route)
  // console.log('*********************************')

  // // get dynamic fees for each pair in route
  // // swapFee is multiplied by 10 to convert in BasePoint notation
  // const swapFees = !pairAddresses
  // ? undefined
  // : pairAddresses.map((address) => {
  //   try {
  //     const contract = usePairContract(address)

  //     console.log('*********************************')
  //     console.log('contract: ', contract)
  //     console.log('*********************************')
  //   }
  //   catch (error) {
  //     console.log('*********************************')
  //     console.log('error: ', error)
  //     console.log('*********************************')
  //   }
    
  //   return ""
  //   // // const pairSwapFee = contract?.swapFee() * 10 ?? BASE_FEE
  //   // const pairSwapFee: any = useSingleCallResult(contract, 'swapFee')

  //   // console.log('*********************************')
  //   // console.log('address: ', address)
  //   // console.log('contract: ', contract)
  //   // console.log('pairSwapFee: ', pairSwapFee)
  //   // console.log('*********************************')
    
  //   // // return { [address]: pairSwapFee  } 
  //   // return { [address]: BASE_FEE  } 
  // })

  // for each hop in our trade, take away the x*y=k price impact from 0.3% fees
  // e.g. for 3 tokens/2 hops: 1 - ((1 - .03) * (1 - .03))
  const realizedLPFee = !trade
    ? undefined
    : ONE_HUNDRED_PERCENT.subtract(
      trade.route.pairs.reduce<Fraction>(
        (currentFee: Fraction): Fraction => currentFee.multiply(INPUT_FRACTION_AFTER_FEE),
        ONE_HUNDRED_PERCENT
      )
    )

  // remove lp fees from price impact
  const priceImpactWithoutFeeFraction = trade && realizedLPFee ? trade.priceImpact.subtract(realizedLPFee) : undefined

  // the x*y=k impact
  const priceImpactWithoutFeePercent = priceImpactWithoutFeeFraction
    ? new Percent(priceImpactWithoutFeeFraction?.numerator, priceImpactWithoutFeeFraction?.denominator)
    : undefined

  // the amount of the input that accrues to LPs
  const realizedLPFeeAmount =
    realizedLPFee &&
    trade &&
    (trade.inputAmount instanceof TokenAmount
      ? new TokenAmount(trade.inputAmount.token, realizedLPFee.multiply(trade.inputAmount.raw).quotient)
      : CurrencyAmount.ether(realizedLPFee.multiply(trade.inputAmount.raw).quotient))

  return { priceImpactWithoutFee: priceImpactWithoutFeePercent, realizedLPFee: realizedLPFeeAmount }
}

// computes the minimum amount out and maximum amount in for a trade given a user specified allowed slippage in bips
export function computeSlippageAdjustedAmounts(
  trade: Trade | undefined,
  allowedSlippage: number
): { [field in Field]?: CurrencyAmount } {
  const pct = basisPointsToPercent(allowedSlippage)
  return {
    [Field.INPUT]: trade?.maximumAmountIn(pct),
    [Field.OUTPUT]: trade?.minimumAmountOut(pct)
  }
}

export function warningSeverity(priceImpact: Percent | undefined): 0 | 1 | 2 | 3 | 4 {
  if (!priceImpact?.lessThan(BLOCKED_PRICE_IMPACT_NON_EXPERT)) return 4
  if (!priceImpact?.lessThan(ALLOWED_PRICE_IMPACT_HIGH)) return 3
  if (!priceImpact?.lessThan(ALLOWED_PRICE_IMPACT_MEDIUM)) return 2
  if (!priceImpact?.lessThan(ALLOWED_PRICE_IMPACT_LOW)) return 1
  return 0
}

export function formatExecutionPrice(
  trade?: Trade,
  originalCurrencies?: { [field in Field]?: Currency },
  inverted?: boolean): string {
  if (!trade || !originalCurrencies) {
    return ''
  }
  return inverted
    ? `${trade.executionPrice.invert().toSignificant(6)} ${originalCurrencies[Field.INPUT]?.symbol} / ${originalCurrencies[Field.OUTPUT]?.symbol
    }`
    : `${trade.executionPrice.toSignificant(6)} ${originalCurrencies[Field.OUTPUT]?.symbol} / ${originalCurrencies[Field.INPUT]?.symbol
    }`
}
