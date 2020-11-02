import { Currency, Token } from '@uniswap/sdk'
import { USD } from '../constants/index'

export function currencyId(currency: Currency): string {
  if (currency === USD) return 'USD'
  if (currency instanceof Token) return currency.address
  throw new Error('invalid currency')
}
