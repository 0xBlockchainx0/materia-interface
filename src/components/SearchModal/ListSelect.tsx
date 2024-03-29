import React, { memo, useCallback, useMemo, useRef, useState, useContext } from 'react'
import { ArrowLeft, X } from 'react-feather'
import ReactGA from 'react-ga'
import { usePopper } from 'react-popper'
import { useDispatch, useSelector } from 'react-redux'
import { Text } from 'rebass'
import styled, { ThemeContext } from 'styled-components'
import { ReactComponent as DropDown } from '../../assets/images/dropdown.svg'
import { useFetchListCallback } from '../../hooks/useFetchListCallback'
import { useOnClickOutside } from '../../hooks/useOnClickOutside'

import useToggle from '../../hooks/useToggle'
import { AppDispatch, AppState } from '../../state'
import { acceptListUpdate, removeList, selectList } from '../../state/lists/actions'
import { useSelectedListUrl } from '../../state/lists/hooks'
import listVersionLabel from '../../utils/listVersionLabel'
import { parseENSAddress } from '../../utils/parseENSAddress'
import uriToHttp from '../../utils/uriToHttp'
import { ButtonMateriaPrimary, ButtonOutlined, ButtonSecondary } from '../Button'

import Column from '../Column'
import ListLogo from '../ListLogo'
import QuestionHelper from '../QuestionHelper'
import Row, { RowBetween } from '../Row'
import { Separator, SeparatorDark } from './styleds'

import {
  DynamicGrid, 
  ContainerRow, 
  SearchInput,
  CloseIcon, 
  IconButton,
  ExternalLink, 
  LinkStyledButton,
  ActionButton,
  MainOperationButton,
  PaddedColumn, TYPE
 } from '../../theme' 

const UnpaddedLinkStyledButton = styled(LinkStyledButton)`
  padding: 0;
  font-size: 1rem;
  opacity: ${({ disabled }) => (disabled ? '0.4' : '1')};
`

const PopoverContainer = styled.div<{ show: boolean }>`
  z-index: 100;
  visibility: ${props => (props.show ? 'visible' : 'hidden')};
  opacity: ${props => (props.show ? 1 : 0)};
  transition: visibility 150ms linear, opacity 150ms linear;
  background: ${({ theme }) => theme.bg2};
  border: 1px solid ${({ theme }) => theme.bg3};
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
    0px 24px 32px rgba(0, 0, 0, 0.01);
  color: ${({ theme }) => theme.text2};
  border-radius: 0.5rem;
  padding: 1rem;
  display: grid;
  grid-template-rows: 1fr;
  grid-gap: 8px;
  font-size: 1rem;
  text-align: left;
`

const StyledMenu = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  border: none;
`

const StyledListUrlText = styled.div`
  max-width: 160px;
  opacity: 0.6;
  margin-right: 0.5rem;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
`

function ListOrigin({ listUrl }: { listUrl: string }) {
  const ensName = useMemo(() => parseENSAddress(listUrl)?.ensName, [listUrl])
  const host = useMemo(() => {
    if (ensName) return undefined
    const lowerListUrl = listUrl.toLowerCase()
    if (lowerListUrl.startsWith('ipfs://') || lowerListUrl.startsWith('ipns://')) {
      return listUrl
    }
    try {
      const url = new URL(listUrl)
      return url.host
    } catch (error) {
      return undefined
    }
  }, [listUrl, ensName])
  return <>{ensName ?? host}</>
}

function listUrlRowHTMLId(listUrl: string) {
  return `list-row-${listUrl.replace(/\./g, '-')}`
}

const ListRow = memo(function ListRow({ listUrl, onBack }: { listUrl: string; onBack: () => void }) {
  const listsByUrl = useSelector<AppState, AppState['lists']['byUrl']>(state => state.lists.byUrl)
  const selectedListUrl = useSelectedListUrl()
  const dispatch = useDispatch<AppDispatch>()
  const { current: list, pendingUpdate: pending } = listsByUrl[listUrl]

  const isSelected = listUrl === selectedListUrl

  const [open, toggle] = useToggle(false)
  const node = useRef<HTMLDivElement>()
  const [referenceElement, setReferenceElement] = useState<HTMLDivElement>()
  const [popperElement, setPopperElement] = useState<HTMLDivElement>()

  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: 'auto',
    strategy: 'fixed',
    modifiers: [{ name: 'offset', options: { offset: [8, 8] } }]
  })

  useOnClickOutside(node, open ? toggle : undefined)

  const selectThisList = useCallback(() => {
    if (isSelected) return
    ReactGA.event({
      category: 'Lists',
      action: 'Select List',
      label: listUrl
    })

    dispatch(selectList(listUrl))
    onBack()
  }, [dispatch, isSelected, listUrl, onBack])

  const handleAcceptListUpdate = useCallback(() => {
    if (!pending) return
    ReactGA.event({
      category: 'Lists',
      action: 'Update List from List Select',
      label: listUrl
    })
    dispatch(acceptListUpdate(listUrl))
  }, [dispatch, listUrl, pending])

  const handleRemoveList = useCallback(() => {
    ReactGA.event({
      category: 'Lists',
      action: 'Start Remove List',
      label: listUrl
    })
    if (window.prompt(`Please confirm you would like to remove this list by typing REMOVE`) === `REMOVE`) {
      ReactGA.event({
        category: 'Lists',
        action: 'Confirm Remove List',
        label: listUrl
      })
      dispatch(removeList(listUrl))
    }
  }, [dispatch, listUrl])

  const theme = useContext(ThemeContext)

  if (!list) return null 

  return (
    <Row key={listUrl} align="center" padding="16px" id={listUrlRowHTMLId(listUrl)}>
      {list.logoURI ? (
        <ListLogo style={{ marginRight: '1rem' }} logoURI={list.logoURI} alt={`${list.name} list logo`} />
      ) : (
        <div style={{ width: '24px', height: '24px', marginRight: '1rem' }} />
      )}
      <Column style={{ flex: '1' }}>
        <Row>
          <div className={`token-list-item-text ${theme.name}`}>{list.name}</div>          
        </Row>
        <Row style={{ marginTop: '4px' }}>
          <StyledListUrlText title={listUrl} className={`token-list-item-text ${theme.name}`}>
            <ListOrigin listUrl={listUrl} />
          </StyledListUrlText>
        </Row>
      </Column>
      <StyledMenu ref={node as any}>
        <ActionButton
          className={`mr10 ${theme.name}`}
          onClick={toggle}
          ref={setReferenceElement}
        >
          <DropDown />
        </ActionButton>

        {open && (
          <PopoverContainer show={true} ref={setPopperElement as any} style={styles.popper} {...attributes.popper}>
            <div>{list && listVersionLabel(list.version)}</div>
            <SeparatorDark />
            <ExternalLink href={`https://tokenlists.org/token-list?url=${listUrl}`}>View list</ExternalLink>
            <UnpaddedLinkStyledButton onClick={handleRemoveList} disabled={Object.keys(listsByUrl).length === 1}>
              Remove list
            </UnpaddedLinkStyledButton>
            {pending && (
              <UnpaddedLinkStyledButton onClick={handleAcceptListUpdate}>Update list</UnpaddedLinkStyledButton>
            )}
          </PopoverContainer>
        )}
      </StyledMenu>
      {isSelected ? (
        <MainOperationButton disabled={true} className={ `select-button ${theme.name}` }>Selected</MainOperationButton>
      ) : (
        <MainOperationButton className={ `select-button ${theme.name}` } onClick={selectThisList}>Select</MainOperationButton>
      )}
    </Row>
  )
})

const ListContainer = styled.div`
  flex: 1;
  overflow: auto;

  @media (max-width: 1050px) { 
    max-height: 300px;
  }
`

export function ListSelect({ onDismiss, onBack }: { onDismiss: () => void; onBack: () => void }) {
  const [listUrlInput, setListUrlInput] = useState<string>('')

  const dispatch = useDispatch<AppDispatch>()
  const lists = useSelector<AppState, AppState['lists']['byUrl']>(state => state.lists.byUrl)
  const adding = Boolean(lists[listUrlInput]?.loadingRequestId)
  const [addError, setAddError] = useState<string | null>(null)

  const handleInput = useCallback(e => {
    setListUrlInput(e.target.value)
    setAddError(null)
  }, [])
  const fetchList = useFetchListCallback()

  const handleAddList = useCallback(() => {
    if (adding) return
    setAddError(null)
    fetchList(listUrlInput)
      .then(() => {
        setListUrlInput('')
        ReactGA.event({
          category: 'Lists',
          action: 'Add List',
          label: listUrlInput
        })
      })
      .catch(error => {
        ReactGA.event({
          category: 'Lists',
          action: 'Add List Failed',
          label: listUrlInput
        })
        setAddError(error.message)
        dispatch(removeList(listUrlInput))
      })
  }, [adding, dispatch, fetchList, listUrlInput])

  const validUrl: boolean = useMemo(() => {
    return uriToHttp(listUrlInput).length > 0 || Boolean(parseENSAddress(listUrlInput))
  }, [listUrlInput])

  const handleEnterKey = useCallback(
    e => {
      if (validUrl && e.key === 'Enter') {
        handleAddList()
      }
    },
    [handleAddList, validUrl]
  )

  const sortedLists = useMemo(() => {
    const listUrls = Object.keys(lists)
    return listUrls
      .filter(listUrl => {
        return Boolean(lists[listUrl].current)
      })
      .sort((u1, u2) => {
        const { current: l1 } = lists[u1]
        const { current: l2 } = lists[u2]
        if (l1 && l2) {
          return l1.name.toLowerCase() < l2.name.toLowerCase()
            ? -1
            : l1.name.toLowerCase() === l2.name.toLowerCase()
            ? 0
            : 1
        }
        if (l1) return -1
        if (l2) return 1
        return 0
      })
  }, [lists])

  const theme = useContext(ThemeContext)

  return (
    <Column style={{ width: '100%', flex: '1 1' }}>
      <DynamicGrid columns={3} className={ `mt20 mb20 ${theme.name}` }>
        <div className="text-left">
          <IconButton className={ `ml20 ${theme.name}` } onClick={onBack}>
            <ArrowLeft/>
          </IconButton>
        </div>
        <div className="text-centered title">Manage Lists</div>
        <div className="text-right">
          <IconButton className={ `mr10 ${theme.name}` } onClick={onDismiss}>
            <X/>
          </IconButton>
        </div>
      </DynamicGrid>
      <Separator />

      <div className="mt20 add-token-list-container">
        <h6>
          Add a list
          <QuestionHelper text="Token lists are an open specification for lists of ERC20 tokens. You can use any token list by entering its URL below. Beware that third party token lists can contain fake or malicious ERC20 tokens." />
        </h6>
        <DynamicGrid className={theme.name} columns={2} columnsDefinitions={[{value: 15, location: 2}]}>
          <ContainerRow className={ `search-token-container ${theme.name}` }>
            <SearchInput
                type="text"
                id="list-add-input"
                placeholder="https:// or ipfs:// or ENS name"
                value={listUrlInput}
                onChange={handleInput}
                onKeyDown={handleEnterKey}  
                className={theme.name}              
              />          
          </ContainerRow>
          <div>
            <ActionButton className={ `ml10 ${theme.name}` } onClick={handleAddList} disabled={!validUrl}>Add</ActionButton>
          </div>
        </DynamicGrid>
        <div className="clear-fix"></div>
        {addError ? (
          <TYPE.error title={addError} style={{ textOverflow: 'ellipsis', overflow: 'hidden' }} error>
            {addError}
          </TYPE.error>
        ) : null}
      </div>
      <Separator className={ `mb20 ${theme.name}` }/>
      <ListContainer>
        {sortedLists.map(listUrl => (
          <ListRow key={listUrl} listUrl={listUrl} onBack={onBack} />
        ))}
      </ListContainer>
      <Separator className={ `mt20 mb20 ${theme.name}` }/>

      <div style={{ padding: '16px', textAlign: 'center' }}>
        <ExternalLink href="https://tokenlists.org">Browse lists</ExternalLink>
      </div>
    </Column>
  )
}
