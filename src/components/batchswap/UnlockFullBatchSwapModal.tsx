import React, { useCallback, useContext } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { IconButton } from '../../theme'
import Modal from '../Modal'
import { Wrapper } from './styleds'
import { X } from 'react-feather'
import { MIN_GIL_UNLOCK_FULL_BATCHSWAP_TEXT } from '../../constants'
import { images } from '../../theme/images'
import { AutoRow } from '../Row'

const ModalTitle = styled.div`
  margin-top: 0.5rem;
`

const GilLogo = styled.img`
  max-width: 10rem;
`

export default function UnlockFullBatchSwapModal({ isOpen, onDismiss }: { isOpen: boolean; onDismiss: () => void }) {
  const theme = useContext(ThemeContext)
  const modalContent = useCallback(() => {
    return (
      <>
        <ModalTitle>
          <h6>{'Unlock Full Batch Swap'}</h6>
        </ModalTitle>
        <IconButton className={`modal-close-icon ${theme.name}`} onClick={onDismiss}>
          <X />
        </IconButton>
        <div className="modal-content-wrapper">
          <AutoRow style={{ marginTop: '20px', justifyContent: 'space-between' }}>
            To unlock the full functionality of Batch Swap you need to own at least {MIN_GIL_UNLOCK_FULL_BATCHSWAP_TEXT}{' '}
            GILs. IGILs are valid too!
          </AutoRow>
          <AutoRow style={{ marginTop: '20px', justifyContent: 'center' }}>
            <GilLogo src={images.icons.gil} className="gilIcon" />
          </AutoRow>
        </div>
      </>
    )
  }, [onDismiss, theme])

  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} minHeight={false} maxHeight={90}>
      <Wrapper>{modalContent()}</Wrapper>
    </Modal>
  )
}
