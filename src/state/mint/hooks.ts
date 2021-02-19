import { Currency, CurrencyAmount, ETHER, IETH, JSBI, Pair, Percent, Price, TokenAmount } from '@materia-dex/sdk'
import { useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { PairState, usePair } from '../../data/Reserves'
import { useTotalSupply } from '../../data/TotalSupply'

import { useActiveWeb3React } from '../../hooks'
import { useCurrency } from '../../hooks/Tokens'
import useGetEthItemInteroperable from '../../hooks/useGetEthItemInteroperable'
import { wrappedCurrency, wrappedCurrencyAmount } from '../../utils/wrappedCurrency'
import { AppDispatch, AppState } from '../index'
import { tryParseAmount, trySaferParseAmount, trySaferParseAmountIncludingZeroValues } from '../swap/hooks'
import { useCurrencyBalances } from '../wallet/hooks'
import { Field, typeInput } from './actions'

const ZERO = JSBI.BigInt(0)

export function useMintState(): AppState['mint'] {
  return useSelector<AppState, AppState['mint']>(state => state.mint)
}

export function useDerivedMintInfo(
  currencyA: Currency | undefined,
  currencyB: Currency | undefined,
  interoperable: boolean | false
): {
  dependentField: Field
  currencies: { [field in Field]?: Currency }
  pair?: Pair | null
  pairState: PairState
  currencyBalances: { [field in Field]?: CurrencyAmount }
  parsedAmounts: { [field in Field]?: CurrencyAmount }
  price?: Price
  noLiquidity?: boolean
  liquidityMinted?: TokenAmount
  poolTokenPercentage?: Percent
  error?: string
} {
  const { account, chainId } = useActiveWeb3React()

  const { independentField, typedValue, otherTypedValue } = useMintState()

  const dependentField = independentField === Field.CURRENCY_A ? Field.CURRENCY_B : Field.CURRENCY_A

  // tokens
  const currencies: { [field in Field]?: Currency } = useMemo(
    () => ({
      [Field.CURRENCY_A]: currencyA ?? undefined,
      [Field.CURRENCY_B]: currencyB ?? undefined
    }),
    [currencyA, currencyB]
  )

  // wrapped currencies
  const wrappedCurrencyA = wrappedCurrency(currencyA, chainId)
  const wrappedCurrencyB = wrappedCurrency(currencyB, chainId)

  // interoperables
  const currencyAInteroperableAddress = useGetEthItemInteroperable(wrappedCurrencyA?.address)
  const currencyBInteroperableAddress = useGetEthItemInteroperable(wrappedCurrencyB?.address)

  let currencyAInteroperable: Currency | undefined = useCurrency(currencyAInteroperableAddress) ?? undefined
  let currencyBInteroperable: Currency | undefined = useCurrency(currencyBInteroperableAddress) ?? undefined

  currencyAInteroperable = currencyA === ETHER ? IETH[chainId ?? 1] : currencyAInteroperable
  currencyBInteroperable = currencyB === ETHER ? IETH[chainId ?? 1] : currencyBInteroperable

  const [interoperablePairState, interoperablePair] = usePair(currencyAInteroperable ?? currencies[Field.CURRENCY_A], currencyBInteroperable ?? currencies[Field.CURRENCY_B])
  const [originalPairState, originalPair] = usePair(currencies[Field.CURRENCY_A], currencies[Field.CURRENCY_B])

  // pair
  const [pairState, pair] = interoperable
    ? [interoperablePairState, interoperablePair]
    : [originalPairState, originalPair]

  const totalSupply = useTotalSupply(pair?.liquidityToken)

  const noLiquidity: boolean = pairState === PairState.NOT_EXISTS || Boolean(totalSupply && JSBI.equal(totalSupply.raw, ZERO))

  // balances
  const balances = useCurrencyBalances(account ?? undefined, [
    currencies[Field.CURRENCY_A],
    currencies[Field.CURRENCY_B]
  ])
  const currencyBalances: { [field in Field]?: CurrencyAmount } = {
    [Field.CURRENCY_A]: balances[0],
    [Field.CURRENCY_B]: balances[1]
  }

  // amounts
  const indipendentAmountField = interoperable
    ? ((independentField === Field.CURRENCY_A ? currencyAInteroperable : currencyBInteroperable) ?? currencies[independentField])
    : currencies[independentField]
  // const independentAmount: CurrencyAmount | undefined = tryParseAmount(typedValue, currencies[independentField])
  const independentAmount: CurrencyAmount | undefined = trySaferParseAmount(
    typedValue,
    indipendentAmountField,
    (independentField === Field.CURRENCY_A ? currencyAInteroperable : currencyBInteroperable)?.decimals ?? indipendentAmountField?.decimals
  )
  const dependentAmount: CurrencyAmount | undefined = useMemo(() => {
    if (noLiquidity) {
      // if (otherTypedValue && currencies[dependentField]) {
      //   return tryParseAmount(otherTypedValue, currencies[dependentField])
      // }
      if (!interoperable) {
        if (currencies[dependentField]) {
          return trySaferParseAmountIncludingZeroValues(
            (otherTypedValue == '' ? '0' : otherTypedValue) ?? '0',
            currencies[dependentField],
            (dependentField === Field.CURRENCY_B ? currencyBInteroperable : currencyAInteroperable)?.decimals ?? currencies[dependentField]?.decimals
          )
        }
      }
      else {
        if (otherTypedValue && currencies[dependentField]) {
          return tryParseAmount(otherTypedValue, currencies[dependentField])
        }
      }
      return undefined
    } else if (independentAmount) {
      // we wrap the currencies just to get the price in terms of the other token
      const wrappedIndependentAmount = wrappedCurrencyAmount(independentAmount, chainId)
      // const [tokenA, tokenB] = [wrappedCurrency(currencyA, chainId), wrappedCurrency(currencyB, chainId)]
      const [tokenA, tokenB] = [wrappedCurrency(interoperable ? currencyAInteroperable ?? currencyA : currencyA, chainId), wrappedCurrency(interoperable ? currencyBInteroperable ?? currencyB : currencyB, chainId)]
      if (tokenA && tokenB && wrappedIndependentAmount && pair && interoperable) {
        const isEmptyPair = JSBI.equal(pair.reserve0.raw, ZERO) || JSBI.equal(pair.reserve1.raw, ZERO)
        // const dependentCurrency = dependentField === Field.CURRENCY_B ? currencyB : currencyA
        const dependentCurrency = dependentField === Field.CURRENCY_B ? (interoperable ? currencyBInteroperable ?? currencyB : currencyB) : (interoperable ? currencyAInteroperable ?? currencyA : currencyA)
        const dependentTokenAmount = 
          dependentField === Field.CURRENCY_B
            ? isEmptyPair ? new TokenAmount(tokenA, ZERO) : pair.priceOf(tokenA).quote(wrappedIndependentAmount)
            : isEmptyPair ? new TokenAmount(tokenB, ZERO) : pair.priceOf(tokenB).quote(wrappedIndependentAmount)
        return dependentCurrency === ETHER ? CurrencyAmount.ether(dependentTokenAmount.raw) : dependentTokenAmount
      }
      return undefined
    } else {
      return undefined
    }
  }, [noLiquidity, otherTypedValue, currencies, dependentField, independentAmount, currencyA, currencyAInteroperable, chainId, currencyB, currencyBInteroperable, pair, interoperable])

  // console.log('*********************************')
  // console.log('interoperable: ', interoperable)
  // console.log('indipendentAmountField: ', indipendentAmountField)
  // console.log('independentField: ', independentField)
  // console.log('dependentField: ', dependentField)
  // console.log('independentAmount: ', independentAmount)
  // console.log('dependentAmount: ', dependentAmount)
  // console.log('*********************************')

  const parsedAmounts: { [field in Field]: CurrencyAmount | undefined } = {
    [Field.CURRENCY_A]: independentField === Field.CURRENCY_A ? independentAmount : dependentAmount,
    [Field.CURRENCY_B]: independentField === Field.CURRENCY_A ? dependentAmount : independentAmount
  }

  const price = useMemo(() => {
    if (noLiquidity) {
      const { [Field.CURRENCY_A]: currencyAAmount, [Field.CURRENCY_B]: currencyBAmount } = parsedAmounts
      if (currencyAAmount && currencyBAmount) {
        return new Price(currencyAAmount.currency, currencyBAmount.currency, currencyAAmount.raw, currencyBAmount.raw)
      }
      return undefined
    } else {
      const wrappedCurrencyA = wrappedCurrency(currencyA, chainId)
      return pair && wrappedCurrencyA ? pair.priceOf(wrappedCurrencyA) : undefined
    }
  }, [chainId, currencyA, noLiquidity, pair, parsedAmounts])

  // liquidity minted
  const liquidityMinted = useMemo(() => {
    const { [Field.CURRENCY_A]: currencyAAmount, [Field.CURRENCY_B]: currencyBAmount } = parsedAmounts
    const [tokenAmountA, tokenAmountB] = [
      wrappedCurrencyAmount(currencyAAmount, chainId),
      wrappedCurrencyAmount(currencyBAmount, chainId)
    ]
    if (pair && totalSupply && tokenAmountA && tokenAmountB && interoperable) {
      if (JSBI.equal(pair.reserve0.raw, ZERO) || JSBI.equal(pair.reserve1.raw, ZERO)) {
        return undefined
      }
      else {
        return pair.getLiquidityMinted(totalSupply, tokenAmountA, tokenAmountB)
      }
    } else {
      return undefined
    }
  }, [parsedAmounts, chainId, pair, totalSupply, interoperable])

  const poolTokenPercentage = useMemo(() => {
    if (liquidityMinted && totalSupply) {
      return new Percent(liquidityMinted.raw, totalSupply.add(liquidityMinted).raw)
    } else {
      return undefined
    }
  }, [liquidityMinted, totalSupply])

  let error: string | undefined
  if (!account) {
    error = 'Connect Wallet'
  }

  if (pairState === PairState.INVALID) {
    error = error ?? 'Invalid pair'
  }

  if (!parsedAmounts[Field.CURRENCY_A] || !parsedAmounts[Field.CURRENCY_B]) {
    error = error ?? 'Enter an amount'
  }

  const { [Field.CURRENCY_A]: currencyAAmount, [Field.CURRENCY_B]: currencyBAmount } = parsedAmounts

  if (currencyAAmount && currencyBalances?.[Field.CURRENCY_A]?.lessThan(currencyAAmount)) {
    error = 'Insufficient ' + currencies[Field.CURRENCY_A]?.symbol + ' balance'
  }

  if (currencyBAmount && currencyBalances?.[Field.CURRENCY_B]?.lessThan(currencyBAmount)) {
    error = 'Insufficient ' + currencies[Field.CURRENCY_B]?.symbol + ' balance'
  }

  // console.log('*********************************')
  // console.log('CurrencyA: ', currencyA)
  // console.log('CurrencyB: ', currencyB)
  // console.log('CurrencyA ETH: ', currencyA === ETHER)
  // console.log('CurrencyB ETH: ', currencyB === ETHER)
  // console.log('currencyAInteroperableAddress: ', currencyAInteroperableAddress)
  // console.log('currencyBInteroperableAddress: ', currencyBInteroperableAddress)
  // console.log('pair: ', pair)
  // console.log('pairState: ', pairState)
  // console.log('*********************************')

  return {
    dependentField,
    currencies,
    pair,
    pairState,
    currencyBalances,
    parsedAmounts,
    price,
    noLiquidity,
    liquidityMinted,
    poolTokenPercentage,
    error
  }
}

export function useMintActionHandlers(
  noLiquidity: boolean | undefined
): {
  onFieldAInput: (typedValue: string) => void
  onFieldBInput: (typedValue: string) => void
} {
  const dispatch = useDispatch<AppDispatch>()

  const onFieldAInput = useCallback(
    (typedValue: string) => {
      dispatch(typeInput({ field: Field.CURRENCY_A, typedValue, noLiquidity: noLiquidity === true }))
    },
    [dispatch, noLiquidity]
  )
  const onFieldBInput = useCallback(
    (typedValue: string) => {
      dispatch(typeInput({ field: Field.CURRENCY_B, typedValue, noLiquidity: noLiquidity === true }))
    },
    [dispatch, noLiquidity]
  )

  return {
    onFieldAInput,
    onFieldBInput
  }
}
