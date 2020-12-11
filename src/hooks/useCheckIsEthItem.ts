import { Currency } from '@materia-dex/sdk'
import { Contract } from 'ethers'
import { useMemo } from 'react'
import { ZERO_ADDRESS } from '../constants'
import { Result, useSingleCallResult } from '../state/multicall/hooks'
import { getProxyContract } from '../utils'
import { wrappedCurrency } from '../utils/wrappedCurrency'
import { useActiveWeb3React } from './index'

/**
 * Return an object with EthItem infos if token is an EthItem
 */
export default function useCheckIsEthItem(currency: Currency | null | undefined): Result | undefined {
  const { account, chainId, library } = useActiveWeb3React()
  const contract: Contract | null = (!library || !account || !chainId) ? null : getProxyContract(chainId, library, account)
  const tokenAddress = currency ? (wrappedCurrency(currency, chainId)?.address ?? ZERO_ADDRESS) : ZERO_ADDRESS
  // const { result: checkIsEthItem } = tokenAddress && tokenAddress != ZERO_ADDRESS ? useSingleCallResult(contract, 'isEthItem', [tokenAddress]) : { result: null}

  // console.log("tokenAddress: ", tokenAddress)
  // console.log("******************************")

  // return checkIsEthItem
  return undefined
}