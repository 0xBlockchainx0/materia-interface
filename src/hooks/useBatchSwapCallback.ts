import { BigNumber } from '@ethersproject/bignumber'
import { Contract } from '@ethersproject/contracts'
import { Token, CurrencyAmount } from '@materia-dex/sdk'
import { useMemo } from 'react'
import { getBatchSwapperContract } from '../utils'
import { useActiveWeb3React } from './index'
import useTransactionDeadline from './useTransactionDeadline'

// function batchSwap(TokenIn calldata tokenIn, TokenOut[] calldata tokensOut, Settings calldata settings) external
// function batchSwapItem(TokenIn calldata tokenIn, TokenOut[] calldata tokensOut, Settings calldata settings) external
// function batchSwapEth(TokenOut[] calldata tokensOut, Settings calldata settings) external payable

/** 
struct TokenIn {
  address token
  uint256 amount
  uint256 approveMax
  Signature signature
}

struct Signature {
  uint8 v
  bytes32 r
  bytes32 s
}

struct TokenOut {
  address asInteroperable
  uint256 millesimals
  uint256 amountMin
  bool unwrap
}

struct Settings {
  address factory
  address bridgeToken
  address erc20Wrapper
  uint deadline
  address to
}
**/

export enum BatchSwapCallbackState {
  INVALID,
  LOADING,
  VALID
}

export interface TokenInParameter {
  token: Token | undefined,
  amount: CurrencyAmount | undefined,
  permit: { v: number; r: string; s: string; } | undefined
}

export interface TokenOutParameter {
  token: Token | undefined,
  percentage: number | undefined,
  amount: CurrencyAmount | undefined,
}

interface BatchSwapParameters {
  methodName: string
  args: (string | string[])[]
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

function useBatchSwapCallArguments(
  input: TokenInParameter | undefined,
  outputs: TokenOutParameter[] | undefined,
): BatchSwapCall[] {
  const { account, chainId, library } = useActiveWeb3React()
  const deadline = useTransactionDeadline()
  const recipient = account
  const contract: Contract | null = (!library || !account || !chainId) ? null : getBatchSwapperContract(chainId, library, account)

  return useMemo(() => {
    const batchSwapMethods: BatchSwapParameters[] = []

    if (!input || !outputs || !recipient || !library || !account || !chainId || !deadline || !contract) return []

    const tokenIn = [
      input.token?.address,
      input.amount,
      input.amount,
      [
        input.permit?.v ?? '0',
        input.permit?.r ?? '0',
        input.permit?.s ?? '0',
      ]
    ]
    const tokenOuts = outputs?.map(x => [
      x.token?.address, // asInteroperable
      ((x.percentage ?? 0) * 10), // millesimals
      x.amount, // amountMin
      true  // amountMin
    ])

    return batchSwapMethods.map(parameters => ({
      parameters: parameters,
      contract: contract
    }))
  }, [account, contract, chainId, deadline, library, recipient])
}

export function useBatchSwapCallback(): void {
  const { account, chainId, library } = useActiveWeb3React()
}
