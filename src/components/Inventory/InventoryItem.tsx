import React, { useCallback, useContext, useState } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { InventoryGridContainer, InventoryItemContainer, IconButton } from '../../theme'
import { RowBetween } from '../Row'
import { AutoColumn } from '../Column'
import { Text } from 'rebass'
import { ExternalLink as Link } from '../../theme'
import { Currency, ETHER, Token } from '@materia-dex/sdk'
import { useActiveWeb3React } from '../../hooks'
import { Field } from '../../state/wrap/actions'
import { useWrapActionHandlers, useWrapState } from '../../state/wrap/hooks'
import 'react-dropdown/style.css';
import { unwrappedToken } from '../../utils/wrappedCurrency'
import { ChevronUp, ChevronDown, Disc, ExternalLink } from 'react-feather'
import useAddTokenToMetamask from '../../hooks/useAddTokenToMetamask'
import { getEtherscanLink } from '../../utils'
import MetamaskIcon from '../../assets/images/metamask.svg'

export const FixedHeightRow = styled(RowBetween)`
  height: auto;
`

interface InventoryItemProps {
  token: Token
  tokenName: string
  tokenSymbol: string
  tokenAddress: string | null,
  tokenType?: string | null,
  balance?: string | null,
  wrapped?: boolean,
  onCurrencySelect: (currency: Currency) => void
}

export default function InventoryItem({
  token,
  tokenName,
  tokenSymbol,
  tokenType,
  tokenAddress,
  balance,
  wrapped = false,
  onCurrencySelect
}: InventoryItemProps) {
  const theme = useContext(ThemeContext)
  const [showMore, setShowMore] = useState(false)
  const [isERC20, setIsERC20] = useState(true)
  // const [isERC721, setIsERC721] = useState(false)
  // const [isERC1155, setIsERC1155] = useState(false)

  const { account, library, chainId } = useActiveWeb3React()
  const { onUserInput } = useWrapActionHandlers()
  const handleMaxButton = useCallback(() => {
    onUserInput(Field.INPUT, balance ?? '0.0')
  },
    [onUserInput, balance]
  )

  const handleNumericalInput = useCallback(
    (value: string) => {
      onUserInput(Field.INPUT, value)
    },
    [onUserInput]
  )

  // const {
  //   parsedAmount,
  // } = useDerivedWrapInfo()
  const { independentField, typedValue } = useWrapState()

  // const parsedAmounts = {
  //   [Field.INPUT]: independentField === Field.INPUT ? parsedAmount : balance,
  // }

  const formattedAmounts = {
    [independentField]: typedValue
  }

  const options = [
    'ERC20', 'ERC721', 'ERC1155'
  ];
  const defaultOption = options[1];

  const onSelect = useCallback(
    (value) => {
      switch (value.value) {
        case 'ERC20':
          setIsERC20(true)
          // setIsERC721(false)
          // setIsERC1155(false)
          break
        // case 'ERC721':
        //   setIsERC20(false)
        //   setIsERC721(true)
        //   setIsERC1155(false)
        //   break
        // case 'ERC1155':
        //   setIsERC20(false)
        //   setIsERC721(false)
        //   setIsERC1155(true)
        //   break
      }
    },
    // [setIsERC20, setIsERC721, setIsERC1155]
    [setIsERC20]
  )

  const onTokenSelection = useCallback(
    (token) => {
      let currency = ETHER

      if (token.symbol != 'ETH') {
        currency = unwrappedToken(token)
      }

      onCurrencySelect(currency)
    },
    [onCurrencySelect]
  )

  const { addToken, } = useAddTokenToMetamask(undefined, token)

  return (
    <InventoryItemContainer className={theme.name}>
      <InventoryGridContainer>
        <div>
          <div>{tokenName} ({tokenSymbol})</div>
          <div className="balanceRow">
            <div>Balance:</div>
            <div>{balance}</div>
            {tokenType
              && (
                <span className="tokenType">
                  <span>{tokenType}</span>
                </span>
              )}
          </div>
        </div>
        <div className="margin-pull-right">
          <IconButton className={theme.name} onClick={() => { onTokenSelection(token) }}>
            <ExternalLink />
          </IconButton>
          {token.symbol != 'ETH' && library?.provider?.isMetaMask && (
            <IconButton className={`metamask ${theme.name}`} onClick={addToken}>
              <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                width="29.048px" height="27.282px" viewBox="0 0 29.048 27.282" enable-background="new 0 0 29.048 27.282">
                <polygon fill="none" stroke="currentColor" points="10.822,4.142 1.901,0.813 0.517,4.977 1.451,9.458 0.858,9.898 1.737,10.568 
	1.066,11.095 1.945,11.897 1.396,12.293 2.66,13.776 0.748,19.729 2.528,25.806 8.756,24.091 9.965,25.08 12.415,26.782 
	16.622,26.782 19.083,25.08 20.292,24.091 26.52,25.806 28.311,19.729 26.377,13.776 27.652,12.293 27.102,11.897 27.981,11.095 
	27.3,10.568 28.179,9.898 27.596,9.458 28.531,4.977 27.135,0.813 18.226,4.142 "/>
                <polygon fill="#FFFFFF" fill-opacity="0" points="9.174,17.259 11.371,16.259 12.272,18.17 " />
                <g>
                  <polygon fill="#FFFFFF" fill-opacity="0" points="16.776,18.17 17.688,16.259 19.885,17.259 	" />
                </g>
                <g>
                  <polygon fill="none" stroke="currentColor" points="27.596,9.458 28.531,4.977 27.135,0.813 16.567,8.657 20.631,12.095 26.377,13.776 
		27.652,12.293 27.102,11.897 27.981,11.095 27.3,10.568 28.179,9.898 	"/>
                </g>
                <g>
                  <polygon fill="none" stroke="currentColor" points="0.517,4.977 1.451,9.458 0.858,9.898 1.737,10.568 1.066,11.095 1.945,11.897 
		1.396,12.293 2.66,13.776 8.405,12.095 12.47,8.657 1.901,0.813 	"/>
                </g>
                <polygon fill="#FFFFFF" fill-opacity="0" points="16.864,24.706 16.567,22.278 16.04,21.916 12.997,21.916 12.47,22.278 12.195,24.706 " />
              </svg>
            </IconButton>
          )}
          {token.symbol != 'ETH' && (
            <IconButton className={`${theme.name}`} onClick={() => { setShowMore(!showMore) }}>
              {showMore ? (<ChevronUp />) : (<ChevronDown />)}
            </IconButton>
          )}
        </div>
      </InventoryGridContainer>

      {showMore && (
        <AutoColumn>
          <div className="addressRow">
            <div>Address:</div>
            <Link href={getEtherscanLink(chainId ?? 1, tokenAddress ?? '', 'token')}>
              <Text className={` token-address ${theme.name}`}>
                {tokenAddress && tokenAddress.slice(0, 6) + '...' + tokenAddress?.slice(38, 42)}
              </Text>
            </Link>
          </div>
          <div className="decimalsRow">
            <div>Decimals:</div>
            <Text className={` token-decimals ${theme.name}`}>
              {token && token?.decimals}
            </Text>
          </div>
          {/* <FixedHeightRow>
            <>
              <NumericalInput
                className="token-amount-input"
                fontSize={'16px'}
                value={formattedAmounts[Field.INPUT]}
                onUserInput={val => {
                  handleNumericalInput(val)
                }}
              />
              {account && token && (
                <ActionButton className={theme.name} onClick={handleMaxButton}>MAX</ActionButton>
              )}
            </>
          </FixedHeightRow>
          {tokenAddress !== '' && (
            <div className="wrapASBlock">
              <div>Wrap as</div>
              <div><Dropdown options={options} onChange={onSelect} value={defaultOption} /></div>
              <div className="clearfix"></div>
            </div>
          )}
          <RowBetween marginTop="10px">
            {isERC20 && (
              <ButtonMateriaPrimary style={{ width: 'inherit', marginRight: '10px' }}>Approve</ButtonMateriaPrimary>
            )}
            <ButtonMateriaPrimary style={{ width: 'inherit' }}>Wrap</ButtonMateriaPrimary>
          </RowBetween> */}
        </AutoColumn>
      )}
    </InventoryItemContainer>
  )
}
