import { useMemo } from 'react'
import useUSD from './useUSD'

/**
 * Return the pool pair after validating currencies
 */
export default function usePoolCurrencies(
  currencyIdA: string | undefined,
  currencyIdB: string | undefined
): { poolCurrencyIdA: string | undefined; poolCurrencyIdB: string | undefined; } {
  const usdAddress = useUSD()?.address ?? undefined

  return useMemo(() => {
    if (!usdAddress) return { poolCurrencyIdA: 'ETH', poolCurrencyIdB: undefined }
    if (!currencyIdA && !currencyIdB) return { poolCurrencyIdA: usdAddress, poolCurrencyIdB: undefined }
    if (currencyIdA != usdAddress && currencyIdB != usdAddress) return { poolCurrencyIdA: usdAddress, poolCurrencyIdB: currencyIdB }
    if (currencyIdA != usdAddress && currencyIdB == usdAddress) return { poolCurrencyIdA: usdAddress, poolCurrencyIdB: currencyIdA }
    if (currencyIdA == usdAddress && currencyIdB == usdAddress) return { poolCurrencyIdA: currencyIdA, poolCurrencyIdB: 'ETH' }

    return { poolCurrencyIdA: currencyIdA, poolCurrencyIdB: currencyIdB }
  }, [usdAddress, currencyIdA, currencyIdB])
}