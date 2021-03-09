import React, { useMemo } from 'react'
import styled from 'styled-components'
import { Currency, ETHER, Token } from '@materia-dex/sdk'
import EthereumLogo from '../../assets/images/ethereum-logo.png'
import useHttpLocations from '../../hooks/useHttpLocations'
import { WrappedTokenInfo } from '../../state/lists/hooks'
import Logo from '../Logo'

export const getTokenLogoURL = (address: string) =>
  `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${address}/logo.png`

const StyledEthereumLogo = styled.img<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  display: block;
  margin-left: auto;
  margin-right: auto;  
`
const StyledLogo = styled(Logo)<{ size: string, radius: boolean }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  display: block;
  margin-left: auto;
  margin-right: auto;
  border-radius: ${({ radius }) => radius ? '15px' : 'unset'};
`
export default function CurrencyLogo({
  currency,
  size = '24px',
  style,
  radius
}: {
  currency?: Currency
  size?: string
  style?: React.CSSProperties,
  radius?: boolean
}) {
  const uriLocations = useHttpLocations(currency instanceof WrappedTokenInfo ? currency.logoURI : undefined)

  const srcs: string[] = useMemo(() => {
    if (currency === ETHER) return []

    if (currency instanceof Token) {
      if (currency instanceof WrappedTokenInfo) {
        return [...uriLocations, getTokenLogoURL(currency.address)]
      }

      return [getTokenLogoURL(currency.address)]
    }
    return []
  }, [currency, uriLocations])

  if (currency === ETHER) {
    return <StyledEthereumLogo src={EthereumLogo} size={size} style={style} className="ethereumLogo" />
  }

  return <StyledLogo size={size} radius={radius ?? false} srcs={srcs} alt={`${currency?.symbol ?? 'token'} logo`} style={style} className="tokenLogo"/>
}
