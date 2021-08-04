import { BigNumber } from '@ethersproject/bignumber'
import { Contract } from '@ethersproject/contracts'
import { Token, CurrencyAmount, Currency, ETHER, IETH } from '@materia-dex/sdk'
import { WETH } from '@uniswap/sdk'
import { useMemo } from 'react'
import {
  UNISWAP_V2_FACTORY_ADDRESS,
  UNISWAP_V2_INIT_CODE_HASH,
  UNISWAP_V2_BRIDGE_TOKEN,
  ZERO_ADDRESS,
  ZERO_HEX
} from '../constants'
import { useTransactionAdder } from '../state/transactions/hooks'
import { calculateGasMargin, getDexBatchSwapperContract } from '../utils'
import isZero from '../utils/isZero'
import { useActiveWeb3React } from './index'
import useCheckIsEthItem from './useCheckIsEthItem'
import useTransactionDeadline from './useTransactionDeadline'

export enum BatchSwapCallbackState {
  INVALID,
  LOADING,
  VALID
}

export interface TokenInParameter {
  currency: Currency | undefined
  token: Token | undefined
  amount: CurrencyAmount | undefined
  permit: { v: number; r: string; s: string } | null
}

export interface TokenOutParameter {
  currency: Currency | undefined
  currencyAmountMin: CurrencyAmount | undefined
  token: Token | undefined
  interoperable: string | undefined
  percentage: number | undefined
  amount: CurrencyAmount | undefined
}

interface BatchSwapParameters {
  methodName: string
  args: any | any[]
  value: string
}

interface BatchSwapCall {
  contract: Contract
  parameters: BatchSwapParameters
}

interface SuccessfulCall {
  call: BatchSwapCall
  gasEstimate: BigNumber
}

interface FailedCall {
  call: BatchSwapCall
  error: Error
}

type EstimatedSwapCall = SuccessfulCall | FailedCall

function useUniswapBatchSwapCallArguments(
  input: TokenInParameter | undefined,
  outputs: TokenOutParameter[] | undefined
): BatchSwapCall[] {
  const { account, chainId, library } = useActiveWeb3React()
  const deadline = useTransactionDeadline()
  const recipient = account
  const inputIsEth = input?.currency == ETHER
  const contract: Contract | null =
    !library || !account || !chainId ? null : getDexBatchSwapperContract(chainId, library, account)

  return useMemo(() => {
    const batchSwapMethods: BatchSwapParameters[] = []

    if (!input || !outputs || !recipient || !library || !account || !chainId || !deadline || !contract) return []

    // ETH
    // function batchSwapEth(TokenOut[] calldata tokensOut, Settings calldata settings) external payable returns(uint[] memory amountsOut)
    if (inputIsEth) {
      const tokenOuts = outputs?.map(x => [
        x.token?.address == IETH[chainId].address ? ZERO_ADDRESS : x.token?.address,
        (x.percentage ?? 0) * 10,
        `0x${x.currencyAmountMin ? x.currencyAmountMin.raw.toString(16) : '0'}`
      ])

      const settings = [
        UNISWAP_V2_FACTORY_ADDRESS[chainId],
        UNISWAP_V2_INIT_CODE_HASH,
        UNISWAP_V2_BRIDGE_TOKEN[chainId],
        WETH[chainId].address,
        deadline,
        recipient
      ]

      const methodName = 'batchSwapEth'
      const value = `0x${input.amount ? input.amount.raw.toString(16) : '0'}`

      batchSwapMethods.push({
        methodName: methodName,
        args: [tokenOuts, settings],
        value: value
      })
    }
    // ERC20
    // function batchSwap(TokenIn calldata tokenIn, TokenOut[] calldata tokensOut, Settings calldata settings) external returns(uint[] memory amountsOut)
    else {
      const tokenIn = [input.token?.address, `0x${input.amount ? input.amount.raw.toString(16) : '0'}`]

      const tokenOuts = outputs?.map(x => [
        x.token?.address == IETH[chainId].address ? ZERO_ADDRESS : x.token?.address,
        (x.percentage ?? 0) * 10,
        `0x${x.currencyAmountMin ? x.currencyAmountMin.raw.toString(16) : '0'}`
      ])

      const settings = [
        UNISWAP_V2_FACTORY_ADDRESS[chainId],
        UNISWAP_V2_INIT_CODE_HASH,
        UNISWAP_V2_BRIDGE_TOKEN[chainId],
        WETH[chainId].address,
        deadline,
        recipient
      ]

      const methodName = 'batchSwap'
      const value = ZERO_HEX

      batchSwapMethods.push({
        methodName: methodName,
        args: [tokenIn, tokenOuts, settings],
        value: value
      })
    }

    console.log('************************************')
    console.log('*** batchSwapMethodsUniswap: ', batchSwapMethods)

    return batchSwapMethods.map(parameters => ({
      parameters: parameters,
      contract: contract
    }))
  }, [input, outputs, recipient, library, account, chainId, deadline, contract, inputIsEth])
}

export function useUniswapBatchSwapCallback(
  input: TokenInParameter | undefined,
  outputs: TokenOutParameter[] | undefined
): { state: BatchSwapCallbackState; callback: null | (() => Promise<string>); error: string | null } {
  const { account, chainId, library } = useActiveWeb3React()

  const batchSwapCalls = useUniswapBatchSwapCallArguments(input, outputs)
  const addTransaction = useTransactionAdder()

  const recipient = account

  return useMemo(() => {
    if (!input || !outputs || !library || !account || !chainId) {
      return { state: BatchSwapCallbackState.INVALID, callback: null, error: 'Missing dependencies' }
    }

    if (!recipient) {
      return { state: BatchSwapCallbackState.LOADING, callback: null, error: null }
    }

    return {
      state: BatchSwapCallbackState.VALID,
      callback: async function onBatchSwap(): Promise<string> {
        const estimatedCalls: EstimatedSwapCall[] = await Promise.all(
          batchSwapCalls.map(call => {
            const {
              parameters: { methodName, args, value },
              contract
            } = call
            const options = !value || isZero(value) ? {} : { value }

            return contract.estimateGas[methodName](...args, options)
              .then(gasEstimate => {
                return {
                  call,
                  gasEstimate
                }
              })
              .catch(gasError => {
                console.log('Gas estimate failed, trying eth_call to extract error', call)

                return contract.callStatic[methodName](...args, options)
                  .then(result => {
                    console.log('Unexpected successful call after failed estimate gas', call, gasError, result)
                    return { call, error: new Error('Unexpected issue with estimating the gas. Please try again.') }
                  })
                  .catch(callError => {
                    console.log('Call threw error', call, callError)
                    let errorMessage: string
                    switch (callError.reason) {
                      case 'INSUFFICIENT_OUTPUT_AMOUNT':
                        errorMessage =
                          'This transaction will not succeed either due to price movement. Try increasing your slippage tolerance.'
                        break
                      default:
                        errorMessage = `The transaction cannot succeed due to error: ${callError.reason}. This is probably an issue with one of the tokens you are swapping.`
                    }
                    return { call, error: new Error(errorMessage) }
                  })
              })
          })
        )

        // a successful estimation is a bignumber gas estimate and the next call is also a bignumber gas estimate
        const successfulEstimation = estimatedCalls.find(
          (el, ix, list): el is SuccessfulCall =>
            'gasEstimate' in el && (ix === list.length - 1 || 'gasEstimate' in list[ix + 1])
        )

        if (!successfulEstimation) {
          const errorCalls = estimatedCalls.filter((call): call is FailedCall => 'error' in call)
          if (errorCalls.length > 0) {
            throw errorCalls[errorCalls.length - 1].error
          }

          throw new Error('Unexpected error. Please contact support: none of the calls threw an error')
        }

        const {
          call: {
            contract,
            parameters: { methodName, args, value }
          },
          gasEstimate
        } = successfulEstimation

        return contract[methodName](...args, {
          gasLimit: calculateGasMargin(gasEstimate),
          ...(value && !isZero(value) ? { value, from: account } : { from: account })
        })
          .then((response: any) => {
            const inputSymbol = input.currency == ETHER ? 'ETH' : input?.token?.symbol
            const outputInfos = outputs
              ?.map(x => `${x.currency == ETHER ? 'ETH' : x.token?.symbol} (${x.percentage}%)`)
              ?.join(', ')
            const inputAmount = input?.amount?.toSignificant(3)

            const base = `Batch Swap ${inputAmount} ${inputSymbol} for ${outputInfos}`

            addTransaction(response, {
              summary: base
            })

            return response.hash
          })
          .catch((error: any) => {
            // if the user rejected the tx, pass this along
            if (error?.code === 4001) {
              throw new Error('Transaction rejected.')
            } else {
              // otherwise, the error was unexpected and we need to convey that
              console.error(`Batch swap failed`, error, methodName, args, value)
              throw new Error(`Batch swap failed: ${error.message}`)
            }
          })
      },
      error: null
    }
  }, [input, outputs, library, account, chainId, recipient, batchSwapCalls, addTransaction])
}
