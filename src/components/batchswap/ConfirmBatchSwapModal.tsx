import { ETHER } from '@materia-dex/sdk'
import React, { useCallback } from 'react'
import { TokenInParameter, TokenOutParameter } from '../../hooks/useBatchSwapCallback'
import TransactionConfirmationModal, {
  ConfirmationModalContent,
  TransactionErrorContent
} from '../TransactionConfirmationModal'
import BatchSwapModalFooter from './BatchSwapModalFooter'
import BatchSwapModalHeader from './BatchSwapModalHeader'

export default function ConfirmBatchSwapModal({
  input,
  outputs,
  onConfirm,
  onDismiss,
  batchSwapErrorMessage,
  isOpen,
  attemptingTxn,
  txHash
}: {
  isOpen: boolean
  input: TokenInParameter | undefined
  outputs: TokenOutParameter[] | undefined
  attemptingTxn: boolean
  txHash: string | undefined
  onConfirm: () => void
  batchSwapErrorMessage: string | undefined
  onDismiss: () => void
}) {
  const modalHeader = useCallback(() => {
    return input && outputs ? <BatchSwapModalHeader input={input} outputs={outputs} /> : null
  }, [input, outputs])

  const modalBottom = useCallback(() => {
    return input && outputs ? (
      <BatchSwapModalFooter
        onConfirm={onConfirm}
        disabledConfirm={false}
        batchSwapErrorMessage={batchSwapErrorMessage}
      />
    ) : null
  }, [input, outputs, onConfirm, batchSwapErrorMessage])

  const inputSymbol = input?.currency == ETHER ? 'ETH' : input?.token?.symbol
  const outputInfos = outputs?.map(x => `${x.currency == ETHER ? 'ETH' : x.token?.symbol} (${x.percentage}%)`)?.join(', ')
  const inputAmount = input?.amount?.toSignificant(6)
  const pendingText = `Batch swapping ${inputAmount} ${inputSymbol} for ${outputInfos}`

  const confirmationContent = useCallback(
    () =>
      batchSwapErrorMessage ? (
        <TransactionErrorContent onDismiss={onDismiss} message={batchSwapErrorMessage} />
      ) : (
        <ConfirmationModalContent
          title="Confirm Batch Swap"
          onDismiss={onDismiss}
          topContent={modalHeader}
          bottomContent={modalBottom}
        />
      ),
    [onDismiss, modalBottom, modalHeader, batchSwapErrorMessage]
  )

  return (
    <TransactionConfirmationModal
      isOpen={isOpen}
      onDismiss={onDismiss}
      attemptingTxn={attemptingTxn}
      hash={txHash}
      content={confirmationContent}
      pendingText={pendingText}
      currencyToAdd={undefined}
    />
  )
}
