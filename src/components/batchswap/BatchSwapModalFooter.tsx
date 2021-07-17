import React from 'react'
import styled from 'styled-components'
import { ButtonMateriaError } from '../Button'
import { BatchSwapCallbackError } from './styleds'

export const ModalFooterButtonGroup = styled.div`
  margin-top: 3rem;
`

export default function BatchSwapModalFooter({
  onConfirm,
  batchSwapErrorMessage,
  disabledConfirm
}: {
  onConfirm: () => void
  batchSwapErrorMessage: string | undefined
  disabledConfirm: boolean
}) {
  return (
    <>
      <ModalFooterButtonGroup className="text-centered">
        <ButtonMateriaError
          onClick={onConfirm}
          disabled={disabledConfirm}
          error={!!batchSwapErrorMessage}
          id="confirm-batch-swap"
        >
          {'Confirm Batch Swap'}
        </ButtonMateriaError>
        {batchSwapErrorMessage ? <BatchSwapCallbackError error={batchSwapErrorMessage} /> : null}
      </ModalFooterButtonGroup>
    </>
  )
}
