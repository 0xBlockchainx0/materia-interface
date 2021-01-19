import { MaxUint256 } from '@ethersproject/constants'
import { TransactionResponse } from '@ethersproject/providers'
import { Trade, TokenAmount, CurrencyAmount, ETHER } from '@materia-dex/sdk'
import { useCallback, useMemo } from 'react'
import { ORCHESTRATOR_ADDRESS, USD, ZERO_ADDRESS } from '../constants'
import { useTokenAllowance } from '../data/Allowances'
import { Field } from '../state/swap/actions'
import { useTransactionAdder, useHasPendingApproval } from '../state/transactions/hooks'
import { computeSlippageAdjustedAmounts } from '../utils/prices'
import { calculateGasMargin } from '../utils'
import { useTokenContract } from './useContract'
import { useActiveWeb3React } from './index'
import useCheckIsEthItem from './useCheckIsEthItem'


export enum ApprovalState {
  UNKNOWN,
  NOT_APPROVED,
  PENDING,
  APPROVED
}

// returns a variable indicating the state of the approval and a function which approves if necessary or early returns
export function useApproveCallback(
  amountToApprove?: CurrencyAmount,
  spender?: string
): [ApprovalState, () => Promise<void>] {
  const { account, chainId } = useActiveWeb3React()
  const token = amountToApprove instanceof TokenAmount ? amountToApprove.token : undefined
  const currentAllowance = useTokenAllowance(token, account ?? undefined, spender)
  const pendingApproval = useHasPendingApproval(token?.address, spender)
  const ethItem = useCheckIsEthItem(token?.address ?? ZERO_ADDRESS)?.ethItem ?? false
  const isUSD = token?.address == USD[chainId ?? 1]?.address

  // check the current approval status
  const approvalState: ApprovalState = useMemo(() => {
    if (!amountToApprove || !spender) return ApprovalState.UNKNOWN
    if (amountToApprove.currency === ETHER) return ApprovalState.APPROVED
    if (ethItem && !isUSD) return ApprovalState.APPROVED
    // we might not have enough data to know whether or not we need to approve
    if (!currentAllowance) return ApprovalState.UNKNOWN

    // console.log('*********************************')
    // console.log('amountToApprove.currency: ', amountToApprove.currency)
    // console.log('amountToApprove.token: ', token)
    // console.log('amountToApprove: ', amountToApprove?.toSignificant(6))
    // console.log('currentAllowance: ', currentAllowance?.toSignificant(6))
    // console.log('currentAllowance.lessThan(amountToApprove): ', currentAllowance.lessThan(amountToApprove))
    // console.log('*********************************')

    // amountToApprove will be defined if currentAllowance is
    return currentAllowance.lessThan(amountToApprove)
      ? pendingApproval
        ? ApprovalState.PENDING
        : ApprovalState.NOT_APPROVED
      : ApprovalState.APPROVED
  }, [amountToApprove, currentAllowance, pendingApproval, spender])

  const tokenContract = useTokenContract(token?.address)
  const addTransaction = useTransactionAdder()

  const approve = useCallback(async (): Promise<void> => {
    if (approvalState !== ApprovalState.NOT_APPROVED) {
      console.error('approve was called unnecessarily')
      return
    }
    if (!token) {
      console.error('no token')
      return
    }

    if (!tokenContract) {
      console.error('tokenContract is null')
      return
    }

    if (!amountToApprove) {
      console.error('missing amount to approve')
      return
    }

    if (!spender) {
      console.error('no spender')
      return
    }

    let useExact = false
    const estimatedGas = await tokenContract.estimateGas.approve(spender, MaxUint256).catch(() => {
      // general fallback for tokens who restrict approval amounts
      useExact = true
      return tokenContract.estimateGas.approve(spender, amountToApprove.raw.toString())
    })

    return tokenContract
      .approve(spender, useExact ? amountToApprove.raw.toString() : MaxUint256, {
        gasLimit: calculateGasMargin(estimatedGas)
      })
      .then((response: TransactionResponse) => {
        addTransaction(response, {
          summary: 'Approve ' + amountToApprove.currency.symbol,
          approval: { tokenAddress: token.address, spender: spender }
        })
      })
      .catch((error: Error) => {
        console.debug('Failed to approve token', error)
        throw error
      })
  }, [approvalState, token, ethItem, tokenContract, amountToApprove, spender, addTransaction])


  // console.log('*********************************')
  // console.log('ethItem: ', ethItem)
  // console.log('isUSD: ', isUSD)
  // console.log('token: ', token?.address)
  // console.log('approvalState: ', approvalState)
  // console.log('spender: ', spender)
  // console.log('account: ', account)
  // console.log('*********************************')

  return [approvalState, approve]
}

// returns a variable indicating the state of the approval and a function which approves if necessary or early returns
export function useInteroperableApproveCallback(
  amountToApprove?: CurrencyAmount,
  interoperableAmountToApprove?: CurrencyAmount,
  spender?: string
): [ApprovalState, () => Promise<void>] {
  const { account, chainId } = useActiveWeb3React()
  const token = amountToApprove instanceof TokenAmount ? amountToApprove.token : undefined
  const currentAllowance = useTokenAllowance(token, account ?? undefined, spender)
  const pendingApproval = useHasPendingApproval(token?.address, spender)
  const ethItem = useCheckIsEthItem(token?.address ?? ZERO_ADDRESS)?.ethItem ?? false
  const isUSD = token?.address == USD[chainId ?? 1]?.address

  // check the current approval status
  const approvalState: ApprovalState = useMemo(() => {
    if (!amountToApprove || !interoperableAmountToApprove || !spender) return ApprovalState.UNKNOWN
    if (amountToApprove.currency === ETHER) return ApprovalState.APPROVED
    if (ethItem && !isUSD) return ApprovalState.APPROVED
    // we might not have enough data to know whether or not we need to approve
    if (!currentAllowance) return ApprovalState.UNKNOWN

    // console.log('*********************************')
    // console.log('amountToApprove.currency: ', amountToApprove.currency)
    // console.log('interoperableAmountToApprove.currency: ', interoperableAmountToApprove.currency)
    // console.log('amountToApprove.token: ', token)
    // console.log('amountToApprove: ', amountToApprove?.toSignificant(6))
    // console.log('interoperableAmountToApprove: ', interoperableAmountToApprove?.toSignificant(6))
    // console.log('currentAllowance: ', currentAllowance?.toSignificant(6))
    // console.log('currentAllowance.lessThan(amountToApprove): ', currentAllowance.lessThan(amountToApprove))
    // console.log('currentAllowance.lessThan(interoperableAmountToApprove): ', currentAllowance.lessThan(interoperableAmountToApprove))
    // console.log('*********************************')

    // interoperableAmountToApprove will be defined if currentAllowance is
    return currentAllowance.lessThan(interoperableAmountToApprove)
      ? pendingApproval
        ? ApprovalState.PENDING
        : ApprovalState.NOT_APPROVED
      : ApprovalState.APPROVED
  }, [amountToApprove, interoperableAmountToApprove, currentAllowance, pendingApproval, spender])

  const tokenContract = useTokenContract(token?.address)
  const addTransaction = useTransactionAdder()

  const approve = useCallback(async (): Promise<void> => {
    if (approvalState !== ApprovalState.NOT_APPROVED) {
      console.error('approve was called unnecessarily')
      return
    }
    if (!token) {
      console.error('no token')
      return
    }

    if (!tokenContract) {
      console.error('tokenContract is null')
      return
    }

    if (!amountToApprove) {
      console.error('missing amount to approve')
      return
    }

    if (!interoperableAmountToApprove) {
      console.error('missing interoperable amount to approve')
      return
    }

    if (!spender) {
      console.error('no spender')
      return
    }

    let useExact = false
    const estimatedGas = await tokenContract.estimateGas.approve(spender, MaxUint256).catch(() => {
      // general fallback for tokens who restrict approval amounts
      useExact = true
      return tokenContract.estimateGas.approve(spender, interoperableAmountToApprove.raw.toString())
    })

    return tokenContract
      .approve(spender, useExact ? interoperableAmountToApprove.raw.toString() : MaxUint256, {
        gasLimit: calculateGasMargin(estimatedGas)
      })
      .then((response: TransactionResponse) => {
        addTransaction(response, {
          summary: 'Approve ' + amountToApprove.currency.symbol,
          approval: { tokenAddress: token.address, spender: spender }
        })
      })
      .catch((error: Error) => {
        console.debug('Failed to approve token', error)
        throw error
      })
  }, [approvalState, token, ethItem, tokenContract, amountToApprove, interoperableAmountToApprove, spender, addTransaction])


  // console.log('*********************************')
  // console.log('ethItem: ', ethItem)
  // console.log('isUSD: ', isUSD)
  // console.log('token: ', token?.address)
  // console.log('approvalState: ', approvalState)
  // console.log('spender: ', spender)
  // console.log('account: ', account)
  // console.log('*********************************')

  return [approvalState, approve]
}

// wraps useApproveCallback in the context of a swap
export function useApproveCallbackFromTrade(trade?: Trade, allowedSlippage = 0) {
  const amountToApprove = useMemo(
    () => (trade ? computeSlippageAdjustedAmounts(trade, allowedSlippage)[Field.INPUT] : undefined),
    [trade, allowedSlippage]
  )
  return useApproveCallback(amountToApprove, ORCHESTRATOR_ADDRESS)
}

// wraps useInteroperableApproveCallback in the context of a swap
export function useInteroperableApproveCallbackFromTrade(originalTrade?: Trade, trade?: Trade, allowedSlippage = 0) {
  const amountToApprove = useMemo(
    () => (trade ? computeSlippageAdjustedAmounts(originalTrade, allowedSlippage)[Field.INPUT] : undefined),
    [originalTrade, allowedSlippage]
  )
  const interoperableAmountToApprove = useMemo(
    () => (trade ? computeSlippageAdjustedAmounts(trade, allowedSlippage)[Field.INPUT] : undefined),
    [trade, allowedSlippage]
  )
  return useInteroperableApproveCallback(amountToApprove, interoperableAmountToApprove, ORCHESTRATOR_ADDRESS)
}