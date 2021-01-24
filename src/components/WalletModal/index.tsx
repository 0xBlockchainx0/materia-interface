import { AbstractConnector } from '@web3-react/abstract-connector'
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import React, { useEffect, useState, useContext } from 'react'
import { isMobile } from 'react-device-detect'
import ReactGA from 'react-ga'
import styled, { ThemeContext } from 'styled-components'
import MetamaskIcon from '../../assets/images/metamask.png'
import { X } from 'react-feather'
import { fortmatic, injected, portis } from '../../connectors'
import { OVERLAY_READY } from '../../connectors/Fortmatic'
import { SUPPORTED_WALLETS } from '../../constants'
import usePrevious from '../../hooks/usePrevious'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { ApplicationModal } from '../../state/application/actions'
import { useModalOpen, useWalletModalToggle } from '../../state/application/hooks'
import { IconButton, InfoBox, ModalCaption, WalletConnectorsContainer } from '../../theme'
import AccountDetails from '../AccountDetails'

import Modal from '../Modal'
import Option from './Option'
import PendingView from './PendingView'
import DocLink from '../../components/DocLink'

const Wrapper = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap}
  margin: 0;
  padding: 0;
  width: 100%;
`

const WALLET_VIEWS = {
  OPTIONS: 'options',
  OPTIONS_SECONDARY: 'options_secondary',
  ACCOUNT: 'account',
  PENDING: 'pending'
}

export default function WalletModal({
  pendingTransactions,
  confirmedTransactions,
  ENSName
}: {
  pendingTransactions: string[] // hashes of pending
  confirmedTransactions: string[] // hashes of confirmed
  ENSName?: string
}) {
  // important that these are destructed from the account-specific web3-react context
  const { active, account, connector, activate, error } = useWeb3React()

  const [walletView, setWalletView] = useState(WALLET_VIEWS.ACCOUNT)

  const [pendingWallet, setPendingWallet] = useState<AbstractConnector | undefined>()

  const [pendingError, setPendingError] = useState<boolean>()

  const walletModalOpen = useModalOpen(ApplicationModal.WALLET)
  const toggleWalletModal = useWalletModalToggle()

  const previousAccount = usePrevious(account)

  // close on connection, when logged out before
  useEffect(() => {
    if (account && !previousAccount && walletModalOpen) {
      toggleWalletModal()
    }
  }, [account, previousAccount, toggleWalletModal, walletModalOpen])

  // always reset to account view
  useEffect(() => {
    if (walletModalOpen) {
      setPendingError(false)
      setWalletView(WALLET_VIEWS.ACCOUNT)
    }
  }, [walletModalOpen])

  // close modal when a connection is successful
  const activePrevious = usePrevious(active)
  const connectorPrevious = usePrevious(connector)
  useEffect(() => {
    if (walletModalOpen && ((active && !activePrevious) || (connector && connector !== connectorPrevious && !error))) {
      setWalletView(WALLET_VIEWS.ACCOUNT)
    }
  }, [setWalletView, active, error, connector, walletModalOpen, activePrevious, connectorPrevious])

  const tryActivation = async (connector: AbstractConnector | undefined) => {
    let name = ''
    Object.keys(SUPPORTED_WALLETS).map(key => {
      if (connector === SUPPORTED_WALLETS[key].connector) {
        return (name = SUPPORTED_WALLETS[key].name)
      }
      return true
    })
    // log selected wallet
    ReactGA.event({
      category: 'Wallet',
      action: 'Change Wallet',
      label: name
    })
    setPendingWallet(connector) // set wallet for pending view
    setWalletView(WALLET_VIEWS.PENDING)

    // if the connector is walletconnect and the user has already tried to connect, manually reset the connector
    if (connector instanceof WalletConnectConnector && connector.walletConnectProvider?.wc?.uri) {
      connector.walletConnectProvider = undefined
    }

    connector &&
      activate(connector, undefined, true).catch(error => {
        if (error instanceof UnsupportedChainIdError) {
          activate(connector) // a little janky...can't use setError because the connector isn't set
        } else {
          setPendingError(true)
        }
      })
  }

  // close wallet modal if fortmatic modal is active
  useEffect(() => {
    fortmatic.on(OVERLAY_READY, () => {
      toggleWalletModal()
    })
  }, [toggleWalletModal])

  const [termAndConditionsAccepted, setTermAndConditionsAccepted] = useLocalStorage('termAndConditionsAccepted', false)
  const [warning, setWarning] = useState(false);
  const theme = useContext(ThemeContext)

  // get wallets user can switch too, depending on device/browser
  function getOptions(isAccepted: boolean) {
    const isMetamask = window.ethereum && window.ethereum.isMetaMask
    return Object.keys(SUPPORTED_WALLETS).map(key => {
      const option = SUPPORTED_WALLETS[key]
      // check for mobile options
      if (isMobile) {
        //disable portis on mobile for now
        if (option.connector === portis) {
          return null
        }

        if (!window.web3 && !window.ethereum && option.mobile) {
          
          return (
            <Option
              onClick={() => {
                if (isAccepted !== true) {
                  setWarning(true)
                  return
                }
                option.connector !== connector && !option.href && tryActivation(option.connector)
              }}
              id={`connect-${key}`}
              key={key}
              active={option.connector && option.connector === connector}
              color={option.color}
              link={option.href}
              header={option.name}
              subheader={null}
              icon={require('../../assets/images/' + option.iconName)}
            />
          )
        }
        return null
      }

      // overwrite injected when needed
      if (option.connector === injected) {
        // don't show injected if there's no injected provider
        if (!(window.web3 || window.ethereum)) {
          if (option.name === 'MetaMask') {
            return (
              <Option
                id={`connect-${key}`}
                key={key}
                color={'#E8831D'}
                header={'Install Metamask'}
                subheader={null}
                link={'https://metamask.io/'}
                icon={MetamaskIcon}
              />
            )
          } else {
            return null //dont want to return install twice
          }
        }
        // don't return metamask if injected provider isn't metamask
        else if (option.name === 'MetaMask' && !isMetamask) {
          return null
        }
        // likewise for generic
        else if (option.name === 'Injected' && isMetamask) {
          return null
        }
      }

      // return rest of options
      return (
        !isMobile &&
        !option.mobileOnly && (
          <Option
            id={`connect-${key}`}
            onClick={() => {

              if (termAndConditionsAccepted !== true) {
                setWarning(true)
                return
              }

              option.connector === connector
                ? setWalletView(WALLET_VIEWS.ACCOUNT)
                : !option.href && tryActivation(option.connector)
            }}
            key={key}
            active={option.connector === connector}
            color={option.color}
            link={option.href}
            header={option.name}
            subheader={null} //use option.descriptio to bring back multi-line
            icon={require('../../assets/images/' + option.iconName)}
          />
        )
      )
    })
  }

  function getModalContent() {
    if (error) {
      return (
        <>
          <IconButton className={ `modal-close-icon ${theme.name}` } onClick={toggleWalletModal}>
            <X />
          </IconButton>
          <h6>{error instanceof UnsupportedChainIdError ? 'Wrong Network' : 'Error connecting'}</h6>
          <div className="modal-content-wrapper">
            {error instanceof UnsupportedChainIdError ? (
              <div className="message error">Please connect to the appropriate Ethereum network.</div>
            ) : ( <div className="message">Error connecting. Try refreshing the page.</div> )}
          </div>
        </>
      )
    }
    if (account && walletView === WALLET_VIEWS.ACCOUNT) {
      return (
        <AccountDetails
          toggleWalletModal={toggleWalletModal}
          pendingTransactions={pendingTransactions}
          confirmedTransactions={confirmedTransactions}
          ENSName={ENSName}
          openOptions={() => setWalletView(WALLET_VIEWS.OPTIONS)}
        />
      )
    }
    return (
      <>
        <IconButton className={ `modal-close-icon ${theme.name}` } onClick={toggleWalletModal}>
          <X />
        </IconButton>
        <h6>          
          {walletView !== WALLET_VIEWS.ACCOUNT ? (
            <span onClick={() => { setPendingError(false); setWalletView(WALLET_VIEWS.ACCOUNT) }}>Back</span>
          ) : ( <span>Connect to a wallet</span> )}
        </h6> 
        <div className="modal-content-wrapper">
        <div className="connect-wallet-terms-and-conditions">
          <label>
            <input name="isGoing" type="checkbox" checked={termAndConditionsAccepted}
              onChange={(event) => {
                if (event.target.checked) {
                  setWarning(false)
                }
                setTermAndConditionsAccepted(event.target.checked)
              }} />
            I accept {'  '}
            <DocLink 
                title="ToS" 
                href={process.env.PUBLIC_URL + '/docs/terms_of_service.pdf'} 
                className={ `connect-wallet-modal ${theme.name}` } />
            {'  '} and {'  '} 
            <DocLink 
              title="Privacy Policy" 
              href={process.env.PUBLIC_URL + '/docs/privacy_policy.pdf'} 
              className={ `connect-wallet-modal ${theme.name}` } />
          </label>
        </div>
        {warning ? <InfoBox className={ `error ${theme.name}` }>Please accept terms and conditions first</InfoBox> : ''}
          {walletView === WALLET_VIEWS.PENDING ? (
            <PendingView connector={pendingWallet} error={pendingError} setPendingError={setPendingError} tryActivation={tryActivation} />
            ) : (
              <WalletConnectorsContainer>{getOptions(termAndConditionsAccepted)}</WalletConnectorsContainer>
            )}
          {walletView !== WALLET_VIEWS.PENDING && (
            <ModalCaption>
              <span>New to Ethereum? &nbsp;</span>{' '}
              <DocLink 
                title="Learn more about wallets" 
                href="https://ethereum.org/wallets/" 
                className={ `connect-wallet-modal ${theme.name}` } />
            </ModalCaption>
          )}
        </div>
      </>
    )
  }

  return (
    <Modal isOpen={walletModalOpen} onDismiss={toggleWalletModal} minHeight={false} maxHeight={90}>
      <Wrapper>{getModalContent()}</Wrapper>
    </Modal>
  )
}
