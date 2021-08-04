import React, { useState, useContext } from 'react'
import { X } from 'react-feather'
import Modal from '../Modal'
import { AutoColumn, ColumnCenter } from '../Column'
import styled, { ThemeContext } from 'styled-components'
import { DataCard } from '../earn/styled'
import { 
  TYPE, 
  ExternalLink, 
  CustomLightSpinner, 
  MainOperationButton,
  SimpleTextParagraph, 
  IconButton,
  ModalContentWrapper } from '../../theme'
import { useClaimCallback, useUserUnclaimedAmount, useUserHasAvailableClaim } from '../../state/claim/hooks'
import { images } from '../../theme/images'

import AddressInputPanel from '../AddressInputPanel'
import useENS from '../../hooks/useENS'
import { useActiveWeb3React } from '../../hooks'
import { isAddress } from 'ethers/lib/utils'
import { useIsTransactionPending } from '../../state/transactions/hooks'
import { TokenAmount } from '@materia-dex/sdk'
import { getEtherscanLink, shortenAddress } from '../../utils'


export default function AddressClaimModal({ isOpen, onDismiss }: { isOpen: boolean; onDismiss: () => void }) {
  const { chainId } = useActiveWeb3React()

  // state for smart contract input
  const [typed, setTyped] = useState('')
  function handleRecipientType(val: string) {
    setTyped(val)
  }

  // monitor for third party recipient of claim
  const { address: parsedAddress } = useENS(typed)

  // used for UI loading states
  const [attempting, setAttempting] = useState<boolean>(false)

  // monitor the status of the claim from contracts and txns
  const { claimCallback } = useClaimCallback(parsedAddress)
  const unclaimedAmount: TokenAmount | undefined = useUserUnclaimedAmount(parsedAddress)

  // check if the user has something available
  const hasAvailableClaim = useUserHasAvailableClaim(parsedAddress)

  const [hash, setHash] = useState<string | undefined>()

  // monitor the status of the claim from contracts and txns
  const claimPending = useIsTransactionPending(hash ?? '')
  const claimConfirmed = hash && !claimPending

  // use the hash to monitor this txn

  function onClaim() {
    setAttempting(true)
    claimCallback()
      .then(hash => {
        setHash(hash)
      })
      // reset modal and log error
      .catch(error => {
        setAttempting(false)
        console.log(error)
      })
  }

  function wrappedOnDismiss() {
    setAttempting(false)
    setHash(undefined)
    setTyped('')
    onDismiss()
  }
  const theme = useContext(ThemeContext)
  return (
    <Modal isOpen={isOpen} onDismiss={wrappedOnDismiss} maxHeight={90}>
      {/* <Confetti start={Boolean(isOpen && claimConfirmed && attempting)} /> */}
      <ModalContentWrapper className={((attempting || claimConfirmed) ? 'claming' : '')}>   
        <div className="modal-content-wrapper-inner-container">   
          {!attempting && (
            <>
              <h6>Claim GIL Token</h6>
              <IconButton className={ `modal-close-icon ${theme.name}` } onClick={wrappedOnDismiss}>
                <X/>
              </IconButton>
              <div className="evidence-text font25">{unclaimedAmount?.toFixed(0, { groupSeparator: ',' } ?? '-')} GIL</div>
              <div>
                <SimpleTextParagraph>
                  Enter an address to trigger a GIL claim. If the address has any claimable GIL it will be sent to them on
                  submission.
                </SimpleTextParagraph>
                <AddressInputPanel value={typed} onChange={handleRecipientType} alignedToLeft={true}/>
                {parsedAddress && !hasAvailableClaim && ( <TYPE.error error={true}>Address has no available claim</TYPE.error> )}
                <div className="text-centered">
                  <MainOperationButton disabled={!isAddress(parsedAddress ?? '') || !hasAvailableClaim} onClick={onClaim} className={ `mt20 ${theme.name}` }>
                    Claim GIL
                  </MainOperationButton>
                </div>                
              </div>
            </>
          )}
          {(attempting || claimConfirmed) && (
            <>
              <IconButton className={ `modal-close-icon ${theme.name}` } onClick={wrappedOnDismiss}>
                <X/>
              </IconButton>
              <div className="text-centered pt40 pb40">
                {!claimConfirmed ? ( <CustomLightSpinner src={images.loader.circle} alt="loader" size={'90px'} className={ `mb40 ${theme.name}` }/> ) : ( <></> )}
                <div>{claimConfirmed ? 'Claimed' : 'Claiming'}</div>
                {claimConfirmed && (<img src={images.icons.gil} className="claimedIcon"/>)}
                {!claimConfirmed && (
                  <div className="mt20 evidence-text error">
                    {unclaimedAmount?.toFixed(0, { groupSeparator: ',' } ?? '-')} GIL
                  </div>                  
                )}
                {parsedAddress && (
                  <div className="mt20 evidence-text">
                    for {shortenAddress(parsedAddress)}
                  </div>
                )}
                {attempting && !hash && (
                  <div className="mt20 evidence-text">Confirm this transaction in your wallet</div>
                )}
                {attempting && hash && !claimConfirmed && chainId && hash && (
                  <div className="mt20">
                    <ExternalLink href={getEtherscanLink(chainId, hash, 'transaction')}>
                      View transaction on Etherscan
                    </ExternalLink>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </ModalContentWrapper>
    </Modal>
  )
}
