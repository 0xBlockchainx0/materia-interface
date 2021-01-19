import { BigNumber } from '@ethersproject/bignumber'
import { Contract } from '@ethersproject/contracts'
import { JSBI, Percent, Router, SwapParameters, Trade, TradeType } from '@materia-dex/sdk'
import { useMemo } from 'react'
import { BIPS_BASE, INITIAL_ALLOWED_SLIPPAGE, ZERO_ADDRESS } from '../constants'
import { useTransactionAdder } from '../state/transactions/hooks'
import { calculateGasMargin, getEthItemCollectionContract, getOrchestratorContract, isAddress, shortenAddress } from '../utils'
import isZero from '../utils/isZero'
import { useActiveWeb3React } from './index'
import useTransactionDeadline from './useTransactionDeadline'
import useENS from './useENS'
import useCheckIsEthItem from './useCheckIsEthItem'

export enum SwapCallbackState {
  INVALID,
  LOADING,
  VALID
}

interface SwapCall {
  contract: Contract
  parameters: SwapParameters
}

interface SuccessfulCall {
  call: SwapCall
  gasEstimate: BigNumber
}

interface FailedCall {
  call: SwapCall
  error: Error
}

type EstimatedSwapCall = SuccessfulCall | FailedCall

/**
 * Returns the swap calls that can be used to make the trade
 * @param trade trade to execute
 * @param allowedSlippage user allowed slippage
 * @param recipientAddressOrName
 */
function useSwapCallArguments(
  trade: Trade | undefined, // trade to execute, required
  originalTrade: Trade | undefined, // trade to execute (without interoperable), required
  allowedSlippage: number = INITIAL_ALLOWED_SLIPPAGE, // in bips
  recipientAddressOrName: string | null, // the ENS name or address of the recipient of the trade, or null if swap should be returned to sender
): SwapCall[] {
  const { account, chainId, library } = useActiveWeb3React()
  const { address: recipientAddress } = useENS(recipientAddressOrName)
  const recipient = recipientAddressOrName === null ? account : recipientAddress
  const deadline = useTransactionDeadline()
  const contract: Contract | null = (!library || !account || !chainId) ? null : getOrchestratorContract(chainId, library, account)
  const tokenAddressA = originalTrade?.route.path[0]?.address ?? ZERO_ADDRESS
  const tokenAIsEthItem = useCheckIsEthItem(tokenAddressA)
  const isEthItem: boolean = tokenAIsEthItem?.ethItem
  const ethItemCollection: string = tokenAIsEthItem?.collection
  const ethItemObjectId: JSBI = JSBI.BigInt(tokenAIsEthItem?.itemId ?? 0)
  const collectionContract: Contract | null =
    (!library || !account || !chainId || !isEthItem)
      ? null
      : getEthItemCollectionContract(chainId, ethItemCollection, library, account)
  
  // console.log('*********************************')
  // console.log('isEthItem: ', isEthItem)
  // console.log('ethItemCollection: ', ethItemCollection)
  // console.log('ethItemObjectId: ', ethItemObjectId?.toString() ?? "0")
  // console.log('tokenAddressA: ', tokenAddressA)
  // console.log('*********************************')

  return useMemo(() => {
    const swapMethods = []

    if (!originalTrade || !recipient || !library || !account || !chainId || !deadline) return []
    if (!contract) { return [] }

    swapMethods.push(
      Router.swapCallParameters(originalTrade, {
        feeOnTransfer: false,
        allowedSlippage: new Percent(JSBI.BigInt(allowedSlippage), BIPS_BASE),
        recipient,
        deadline: deadline.toNumber()
      }, isEthItem, ethItemObjectId?.toString() ?? "0")
    )

    if (isEthItem) {
      if (!collectionContract) { return [] }

      return swapMethods.map(parameters => ({
        parameters: parameters,
        contract: collectionContract
      }))
    }

    return swapMethods.map(parameters => ({
      parameters: parameters,
      contract: contract
    }))
  }, [account, allowedSlippage, chainId, deadline, library, recipient, originalTrade])
}

// returns a function that will execute a swap, if the parameters are all valid
// and the user has approved the slippage adjusted input amount for the trade
export function useSwapCallback(
  trade: Trade | undefined, // trade to execute, required
  originalTrade: Trade | undefined, // trade to execute (without interoperable), required
  allowedSlippage: number = INITIAL_ALLOWED_SLIPPAGE, // in bips
  recipientAddressOrName: string | null // the ENS name or address of the recipient of the trade, or null if swap should be returned to sender
): { state: SwapCallbackState; callback: null | (() => Promise<string>); error: string | null } {
  const { account, chainId, library } = useActiveWeb3React()

  const swapCalls = useSwapCallArguments(trade, originalTrade, allowedSlippage, recipientAddressOrName)
  const addTransaction = useTransactionAdder()

  const { address: recipientAddress } = useENS(recipientAddressOrName)
  const recipient = recipientAddressOrName === null ? account : recipientAddress

  // console.log('*********************************')
  // console.log('swapCalls: ', swapCalls)
  // console.log('*********************************')

  return useMemo(() => {
    if (!trade || !originalTrade || !library || !account || !chainId) {
      return { state: SwapCallbackState.INVALID, callback: null, error: 'Missing dependencies' }
    }
    if (!recipient) {
      if (recipientAddressOrName !== null) {
        return { state: SwapCallbackState.INVALID, callback: null, error: 'Invalid recipient' }
      } else {
        return { state: SwapCallbackState.LOADING, callback: null, error: null }
      }
    }

    return {
      state: SwapCallbackState.VALID,
      callback: async function onSwap(): Promise<string> {
        const estimatedCalls: EstimatedSwapCall[] = await Promise.all(
          swapCalls.map(call => {
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
                      case 'UniswapV2Router: INSUFFICIENT_OUTPUT_AMOUNT':
                      case 'UniswapV2Router: EXCESSIVE_INPUT_AMOUNT':
                        errorMessage =
                          'This transaction will not succeed either due to price movement or fee on transfer. Try increasing your slippage tolerance.'
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

        console.log('*********************************')
        console.log('successfulEstimation: ', successfulEstimation)
        console.log('*********************************')

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
            const inputSymbol = originalTrade.inputAmount.currency.symbol
            const outputSymbol = originalTrade.outputAmount.currency.symbol
            // const inputSymbol = trade.inputAmount.currency.symbol
            // const outputSymbol = trade.outputAmount.currency.symbol
            const inputAmount = trade.inputAmount.toSignificant(3)
            const outputAmount = trade.outputAmount.toSignificant(3)

            const base = `Swap ${inputAmount} ${inputSymbol} for ${outputAmount} ${outputSymbol}`
            const withRecipient =
              recipient === account
                ? base
                : `${base} to ${recipientAddressOrName && isAddress(recipientAddressOrName)
                  ? shortenAddress(recipientAddressOrName)
                  : recipientAddressOrName
                }`

            const withVersion = withRecipient

            addTransaction(response, {
              summary: withVersion
            })

            return response.hash
          })
          .catch((error: any) => {
            // if the user rejected the tx, pass this along
            if (error?.code === 4001) {
              throw new Error('Transaction rejected.')
            } else {
              // otherwise, the error was unexpected and we need to convey that
              console.error(`Swap failed`, error, methodName, args, value)
              throw new Error(`Swap failed: ${error.message}`)
            }
          })
      },
      error: null
    }
  }, [trade, originalTrade, library, account, chainId, recipient, recipientAddressOrName, swapCalls, addTransaction])
}
