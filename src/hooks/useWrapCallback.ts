import { Currency, currencyEquals, ETHER, IETH, JSBI, Token } from '@materia-dex/sdk'
import { useMemo } from 'react'
import { ETHEREUM_OBJECT_ID } from '../constants'
import { tryParseAmount } from '../state/swap/hooks'
import { useTransactionAdder } from '../state/transactions/hooks'
import { useCurrencyBalance } from '../state/wallet/hooks'
import { useActiveWeb3React } from './index'
import { useIETHContract } from './useContract'
import useGetEthItemInteroperable from './useGetEthItemInteroperable'

export enum WrapType {
  NOT_APPLICABLE,
  WRAP,
  UNWRAP
}

const NOT_APPLICABLE = { wrapType: WrapType.NOT_APPLICABLE }
/**
 * Given the selected input and output currency, return a wrap callback
 * @param inputCurrency the selected input currency
 * @param outputCurrency the selected output currency
 * @param typedValue the user input value
 */
export default function useWrapCallback(
  inputCurrency: Currency | undefined,
  outputCurrency: Currency | undefined,
  typedValue: string | undefined
): {
  wrapType: WrapType;
  execute?: undefined | (() => Promise<void>);
  inputError?: string
} {
  const { chainId, account } = useActiveWeb3React()
  const balance = useCurrencyBalance(account ?? undefined, inputCurrency)

  const isETHWrap = (inputCurrency && outputCurrency) && (
    inputCurrency === ETHER && currencyEquals(IETH[chainId ?? 1], outputCurrency)
    || (currencyEquals(IETH[chainId ?? 1], inputCurrency) && outputCurrency === ETHER)
  )

  const inputCurrencyAddress = !(inputCurrency instanceof Token) || isETHWrap ? undefined : inputCurrency.address
  const outputCurrencyAddress = !(outputCurrency instanceof Token) || isETHWrap ? undefined : outputCurrency.address

  const inputCurrencyInteroperable = useGetEthItemInteroperable(inputCurrencyAddress)
  const outputCurrencyInteroperable = useGetEthItemInteroperable(outputCurrencyAddress)

  const inputCurrencyIsEthItem = !inputCurrencyInteroperable && outputCurrencyInteroperable
  const outputCurrencyIsEthItem = inputCurrencyInteroperable && !outputCurrencyInteroperable

  const isEthItemWrap = (inputCurrency && outputCurrency) && !isETHWrap && (
    (inputCurrencyIsEthItem && inputCurrencyAddress === outputCurrencyInteroperable)
    || (outputCurrencyIsEthItem && inputCurrencyInteroperable === outputCurrencyAddress)
  )
  
  const inputAmount = useMemo(() => tryParseAmount(typedValue, inputCurrency), [inputCurrency, typedValue])

  const iethContract = useIETHContract()
  const addTransaction = useTransactionAdder()

  return useMemo(() => {
    if (!chainId || !inputCurrency || !outputCurrency) return NOT_APPLICABLE
    if (isETHWrap && !iethContract) return NOT_APPLICABLE

    const sufficientBalance = inputAmount && balance && !balance.lessThan(inputAmount)

    if (isETHWrap && iethContract) {
      if (inputCurrency === ETHER && currencyEquals(IETH[chainId], outputCurrency)) {
        return {
          wrapType: WrapType.WRAP,
          execute:
            sufficientBalance && inputAmount
              ? async () => {
                try {
                  const txReceipt = await iethContract.mintETH({ value: `0x${inputAmount.raw.toString(16)}` })
                  addTransaction(txReceipt, { summary: `Wrap ${inputAmount.toSignificant(6)} ETH to IETH` })
                } catch (error) {
                  console.error('Could not deposit', error)
                }
              }
              : undefined,
          inputError: sufficientBalance ? undefined : 'Insufficient ETH balance'
        }
      }
      else if (currencyEquals(IETH[chainId], inputCurrency) && outputCurrency === ETHER) {
        return {
          wrapType: WrapType.UNWRAP,
          execute:
            sufficientBalance && inputAmount
              ? async () => {
                try {
                  const objectId = JSBI.BigInt(ETHEREUM_OBJECT_ID)
                  const txReceipt = await iethContract.burn(`0x${objectId.toString(16)}`, `0x${inputAmount.raw.toString(16)}`)
                  addTransaction(txReceipt, { summary: `Unwrap ${inputAmount.toSignificant(6)} IETH to ETH` })
                } catch (error) {
                  console.error('Could not withdraw', error)
                }
              }
              : undefined,
          inputError: sufficientBalance ? undefined : 'Insufficient IETH balance'
        }
      }
      else {
        return NOT_APPLICABLE
      }
    }
    else if (isEthItemWrap) {
      if (!inputCurrencyIsEthItem && outputCurrencyIsEthItem) {
        return {
          wrapType: WrapType.WRAP,
          execute: async () => {
            console.log('*** EthItem WRAP ***')
          },
          inputError: undefined
        }
      }
      else if (inputCurrencyIsEthItem && !outputCurrencyIsEthItem) {
        return {
          wrapType: WrapType.UNWRAP,
          execute: async () => {
            console.log('*** EthItem UNWRAP ***')
          },
          inputError: undefined
        }
      }
      else {
        return NOT_APPLICABLE
      }
    }

    return NOT_APPLICABLE
  }, [iethContract, chainId, inputCurrency, outputCurrency, inputAmount, balance, addTransaction])
}
