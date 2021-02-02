import React, { useContext, useCallback } from 'react'
import { ThemeContext } from 'styled-components'
import useENS from '../../hooks/useENS'
import { useActiveWeb3React } from '../../hooks'
import { ExternalLink, TYPE } from '../../theme'
import { AutoColumn } from '../Column'
import { RowBetween } from '../Row'
import { getEtherscanLink } from '../../utils'
import { InputPanel, ContainerRow, Input } from '../../theme'

export default function AddressInputPanel({
  id,
  value,
  onChange
}: {
  id?: string
  // the typed string value
  value: string
  // triggers whenever the typed value changes
  onChange: (value: string) => void
}) {
  const { chainId } = useActiveWeb3React()
  const theme = useContext(ThemeContext)

  const { address, loading, name } = useENS(value)

  const handleInput = useCallback(
    event => {
      const input = event.target.value
      const withoutSpaces = input.replace(/\s+/g, '')
      onChange(withoutSpaces)
    },
    [onChange]
  )

  const error = Boolean(value.length > 0 && !loading && !address)

  return (
    <InputPanel id={id}>
      <ContainerRow error={error} className={theme.name}>
        <div className={ `input-container ${theme.name}` }>
          {address && chainId && (
            <ExternalLink href={getEtherscanLink(chainId, name ?? address, 'address')}>(View on Etherscan)</ExternalLink>
          )}
          <label>Recipient</label>
          <Input
              className={ `recipient-address-input ${theme.name}` }
              type="text"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              placeholder="Wallet Address or ENS name"
              error={error}
              pattern="^(0x[a-fA-F0-9]{40})$"
              onChange={handleInput}
              value={value}
          />
        </div>
      </ContainerRow>
    </InputPanel>
  )
}
