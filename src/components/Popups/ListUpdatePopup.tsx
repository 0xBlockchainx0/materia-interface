import { diffTokenLists, TokenList } from '@uniswap/token-lists'
import React, { useCallback, useMemo, useContext } from 'react'
import ReactGA from 'react-ga'
import { useDispatch } from 'react-redux'
import styled, { ThemeContext } from 'styled-components'
import { AppDispatch } from '../../state'
import { useRemovePopup } from '../../state/application/hooks'
import { acceptListUpdate } from '../../state/lists/actions'
import { MainOperationButton } from '../../theme'
import listVersionLabel from '../../utils/listVersionLabel'

export const ChangesList = styled.ul`
  max-height: 400px;
  overflow: auto;
`

export default function ListUpdatePopup({
  popKey,
  listUrl,
  oldList,
  newList,
  auto
}: {
  popKey: string
  listUrl: string
  oldList: TokenList
  newList: TokenList
  auto: boolean
}) {
  const removePopup = useRemovePopup()
  const removeThisPopup = useCallback(() => removePopup(popKey), [popKey, removePopup])
  const dispatch = useDispatch<AppDispatch>()
  const theme = useContext(ThemeContext)

  const handleAcceptUpdate = useCallback(() => {
    if (auto) return
    ReactGA.event({
      category: 'Lists',
      action: 'Update List from Popup',
      label: listUrl
    })
    dispatch(acceptListUpdate(listUrl))
    removeThisPopup()
  }, [auto, dispatch, listUrl, removeThisPopup])

  const { added: tokensAdded, changed: tokensChanged, removed: tokensRemoved } = useMemo(() => {
    return diffTokenLists(oldList.tokens, newList.tokens)
  }, [newList.tokens, oldList.tokens])
  const numTokensChanged = useMemo(
    () =>
      Object.keys(tokensChanged).reduce((memo, chainId: any) => memo + Object.keys(tokensChanged[chainId]).length, 0),
    [tokensChanged]
  )

  return (
    <div className="list-update-popup">
        {auto ? (
          <h6>
             The token list &quot;{oldList.name}&quot; has been updated to{' '}
             <strong>{listVersionLabel(newList.version)}</strong>.
          </h6>
        ) : (
          <>
            <h6>
              An update is available for the token list &quot;{oldList.name}&quot; (
              {listVersionLabel(oldList.version)} to {listVersionLabel(newList.version)}).
            </h6>
            <ChangesList>
              {tokensAdded.length > 0 ? (
                <li>
                  {tokensAdded.map((token, i) => (
                    <React.Fragment key={`${token.chainId}-${token.address}`}>
                      <strong title={token.address}>{token.symbol}</strong>
                      {i === tokensAdded.length - 1 ? null : ', '}
                    </React.Fragment>
                  ))}{' '}
                  added
                </li>
              ) : null}
              {tokensRemoved.length > 0 ? (
                <li>
                  {tokensRemoved.map((token, i) => (
                    <React.Fragment key={`${token.chainId}-${token.address}`}>
                      <strong title={token.address}>{token.symbol}</strong>
                      {i === tokensRemoved.length - 1 ? null : ', '}
                    </React.Fragment>
                  ))}{' '}
                  removed
                </li>
              ) : null}
              {numTokensChanged > 0 ? <li>{numTokensChanged} tokens updated</li> : null}
            </ChangesList>
            <div className="popup-operations-container">
              <MainOperationButton onClick={handleAcceptUpdate} className={ `popup-button ${theme.name}` }>Accept update</MainOperationButton>
              <MainOperationButton onClick={removeThisPopup} className={ `popup-button ${theme.name} dismiss` }>Dismiss</MainOperationButton>
            </div>
          </>
        )}
      </div>
  )
}
