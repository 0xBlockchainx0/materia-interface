import { Currency, currencyEquals, ETHER, IETH, JSBI, Token } from '@materia-dex/sdk'
import { useMemo } from 'react'
import { ETHEREUM_OBJECT_ID } from '../constants'
import { tryParseAmount } from '../state/swap/hooks'
import { useTransactionAdder } from '../state/transactions/hooks'
import { useCurrencyBalance } from '../state/wallet/hooks'
import { useActiveWeb3React } from './index'
import { useERC20WrapperContract } from './useContract'
import useGetEthItemTokenInfo from './useGetEthItemTokenInfo'

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

  const inputCurrencyEthItemInfo = useGetEthItemTokenInfo(inputCurrencyAddress)
  const outputCurrencyEthItemInfo = useGetEthItemTokenInfo(outputCurrencyAddress)

  const inputCurrencyInteroperable = inputCurrencyEthItemInfo?.interoperable
  const outputCurrencyInteroperable = outputCurrencyEthItemInfo?.interoperable

  const inputCurrencyIsEthItem = inputCurrencyEthItemInfo?.ethItem ?? false
  const outputCurrencyIsEthItem = outputCurrencyEthItemInfo?.ethItem ?? false

  const isEthItemWrap = (inputCurrency && outputCurrency) && !isETHWrap && (
    (inputCurrencyIsEthItem && inputCurrencyAddress === outputCurrencyInteroperable)
    || (outputCurrencyIsEthItem && inputCurrencyInteroperable === outputCurrencyAddress)
  )

  const inputAmount = useMemo(() => tryParseAmount(typedValue, inputCurrency), [inputCurrency, typedValue])

  const erc20WrapperContract = useERC20WrapperContract()
  const addTransaction = useTransactionAdder()

  return useMemo(() => {
    if (!chainId || !inputCurrency || !outputCurrency || !erc20WrapperContract) return NOT_APPLICABLE

    const sufficientBalance = inputAmount && balance && !balance.lessThan(inputAmount)

    if (isETHWrap) {
      if (inputCurrency === ETHER && currencyEquals(IETH[chainId], outputCurrency)) {
        return {
          wrapType: WrapType.WRAP,
          execute:
            sufficientBalance && inputAmount
              ? async () => {
                try {
                  const txReceipt = await erc20WrapperContract.mintETH({ value: `0x${inputAmount.raw.toString(16)}` })
                  addTransaction(txReceipt, { summary: `Wrap ${inputAmount.toSignificant(6)} ETH to IETH` })
                } catch (error) {
                  console.error('mintETH failed: ', error)
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
                  const txReceipt = await erc20WrapperContract.burn(`0x${objectId.toString(16)}`, `0x${inputAmount.raw.toString(16)}`)
                  addTransaction(txReceipt, { summary: `Unwrap ${inputAmount.toSignificant(6)} IETH to ETH` })
                } catch (error) {
                  console.error('burn failed: ', error)
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
          execute:
            sufficientBalance && inputAmount
              ? async () => {
                try {
                  const txReceipt = await erc20WrapperContract.functions["mint(address,uint256)"](inputCurrencyAddress, `0x${inputAmount.raw.toString(16)}`)
                  addTransaction(txReceipt, { summary: `Wrap ${inputAmount.toSignificant(6)} ${inputCurrency.symbol} to ${outputCurrency.symbol}` })
                } catch (error) {
                  console.error('mint failed: ', error)
                }
              }
              : undefined,
          inputError: sufficientBalance ? undefined : `Insufficient ${inputCurrency.symbol} balance`
        }
      }
      else if (inputCurrencyIsEthItem && !outputCurrencyIsEthItem) {
        return {
          wrapType: WrapType.UNWRAP,
          execute:
            sufficientBalance && inputAmount
              ? async () => {
                try {
                  const objectId = inputCurrencyEthItemInfo?.rawObjectId ?? JSBI.BigInt(0)
                  const txReceipt = await erc20WrapperContract.burn(`0x${objectId.toString(16)}`, `0x${inputAmount.raw.toString(16)}`)

                  addTransaction(txReceipt, { summary: `Unwrap ${inputAmount.toSignificant(6)} ${inputCurrency.symbol} to ${outputCurrency.symbol}` })
                } catch (error) {
                  console.error('burn failed: ', error)
                }
              }
              : undefined,
          inputError: sufficientBalance ? undefined : `Insufficient ${inputCurrency.symbol} balance`
        }
      }
      else {
        return NOT_APPLICABLE
      }
    }

    return NOT_APPLICABLE
  }, [erc20WrapperContract, chainId, inputCurrency, outputCurrency, inputAmount, balance, addTransaction])
}
