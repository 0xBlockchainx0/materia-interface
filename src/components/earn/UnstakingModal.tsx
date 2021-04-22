import React, { useState, useContext } from 'react'
import Modal from '../Modal'
import { X } from 'react-feather'
import { AutoColumn } from '../Column'
import styled, { ThemeContext } from 'styled-components'
import { RowBetween } from '../Row'
import { 
  TYPE, 
  SimpleModalContentWrapper,
  IconButton,
  DynamicGrid
} from '../../theme'
import { ButtonMateriaError } from '../Button'
import { StakingInfo } from '../../state/stake/hooks'
import { useStakingContract } from '../../hooks/useContract'
import { SubmittedView, LoadingView } from '../ModalViews'
import { TransactionResponse } from '@ethersproject/providers'
import { useTransactionAdder } from '../../state/transactions/hooks'
import FormattedCurrencyAmount from '../FormattedCurrencyAmount'
import { useActiveWeb3React } from '../../hooks'

const ContentWrapper = styled(AutoColumn)`
  width: 100%;
  padding: 1rem;
`

interface StakingModalProps {
  isOpen: boolean
  onDismiss: () => void
  stakingInfo: StakingInfo
}

export default function UnstakingModal({ isOpen, onDismiss, stakingInfo }: StakingModalProps) {
  const { account } = useActiveWeb3React()

  // monitor call to help UI loading state
  const addTransaction = useTransactionAdder()
  const [hash, setHash] = useState<string | undefined>()
  const [attempting, setAttempting] = useState(false)

  function wrappedOndismiss() {
    setHash(undefined)
    setAttempting(false)
    onDismiss()
  }

  const stakingContract = useStakingContract(stakingInfo.stakingRewardAddress)

  async function onWithdraw() {
    if (stakingContract && stakingInfo?.stakedAmount) {
      setAttempting(true)
      await stakingContract
        .exit({ gasLimit: 300000 })
        .then((response: TransactionResponse) => {
          addTransaction(response, {
            summary: `Withdraw deposited liquidity`
          })
          setHash(response.hash)
        })
        .catch((error: any) => {
          setAttempting(false)
          console.log(error)
        })
    }
  }

  let error: string | undefined
  if (!account) {
    error = 'Connect Wallet'
  }
  if (!stakingInfo?.stakedAmount) {
    error = error ?? 'Enter an amount'
  }

  const theme = useContext(ThemeContext)

  return (
    <Modal isOpen={isOpen} onDismiss={wrappedOndismiss} maxHeight={90}>
      <SimpleModalContentWrapper>
        {!attempting && !hash && (
          <>
            <h6>Withdraw</h6>
            <IconButton className={ `modal-close-icon ${theme.name}` } onClick={wrappedOndismiss}>
              <X/>
            </IconButton>
            {stakingInfo?.stakedAmount && (
              <AutoColumn justify="center" gap="md">
                <TYPE.body fontWeight={600} fontSize={36}>
                  {<FormattedCurrencyAmount currencyAmount={stakingInfo.stakedAmount} />}
                </TYPE.body>
                <TYPE.body>Deposited liquidity</TYPE.body>
              </AutoColumn>
            )}
            {stakingInfo?.earnedAmount && (
              <AutoColumn justify="center" gap="md">
                <TYPE.body fontWeight={600} fontSize={36}>
                  {<FormattedCurrencyAmount currencyAmount={stakingInfo?.earnedAmount} />}
                </TYPE.body>
                <TYPE.body>Unclaimed GIL</TYPE.body>
              </AutoColumn>
            )}
            <TYPE.subHeader style={{ textAlign: 'center' }}>
              When you withdraw, your GIL is claimed and your liquidity is removed from the mining pool.
            </TYPE.subHeader>
            <DynamicGrid columns={1} className="mt20">
              <div className="text-centered">
                <ButtonMateriaError 
                  width={'fit-content'} disabled={!!error} error={!!error && !!stakingInfo?.stakedAmount} 
                  onClick={onWithdraw}>
                  {error ?? 'Withdraw & Claim'}
                </ButtonMateriaError>
              </div>
            </DynamicGrid>            
          </>
        )}
        {attempting && !hash && (
          <LoadingView onDismiss={wrappedOndismiss}>
            <AutoColumn gap="12px" justify={'center'}>
              <TYPE.body fontSize={20}>Withdrawing {stakingInfo?.stakedAmount?.toSignificant(4)} MP</TYPE.body>
              <TYPE.body fontSize={20}>Claiming {stakingInfo?.earnedAmount?.toSignificant(4)} GIL</TYPE.body>
            </AutoColumn>
          </LoadingView>
        )}
        {hash && (
          <SubmittedView onDismiss={wrappedOndismiss} hash={hash}>
            <AutoColumn gap="12px" justify={'center'}>
              <TYPE.largeHeader>Transaction Submitted</TYPE.largeHeader>
              <TYPE.body fontSize={20}>Withdrew MP!</TYPE.body>
              <TYPE.body fontSize={20}>Claimed GIL!</TYPE.body>
            </AutoColumn>
          </SubmittedView>
        )}
      </SimpleModalContentWrapper>
    </Modal>
  )
}
