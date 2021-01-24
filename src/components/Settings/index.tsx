import React, { useContext, useRef, useState } from 'react'
import { Settings, X } from 'react-feather'
import { Text } from 'rebass'
import styled, { ThemeContext } from 'styled-components'
import { useOnClickOutside } from '../../hooks/useOnClickOutside'
import { ApplicationModal } from '../../state/application/actions'
import { useModalOpen, useToggleSettingsMenu } from '../../state/application/hooks'
import {
  // useDarkModeManager,
  useExpertModeManager,
  useUserTransactionTTL,
  useUserSlippageTolerance,
  useClassicModeManager
} from '../../state/user/hooks'
import { 
  SecondaryPanelBoxContainer,
  SecondaryPanelBoxContainerExtraDecorator,
  ModalContentWrapper,
  IconButton,
  EvidencedTextParagraph,
  MainOperationButton
} from '../../theme'
import { ButtonError } from '../Button'
import { AutoColumn } from '../Column'
import Modal from '../Modal'
import QuestionHelper from '../QuestionHelper'
import { RowBetween, RowFixed } from '../Row'
import Toggle from '../Toggle'
import TransactionSettings from '../TransactionSettings'

const StyledMenuText = styled.b`
  :hover { cursor: pointer; }
  margin-top: -0.3rem;
`

const StyledMenuButton = styled.button`
  position: relative;
  width: 100%;
  height: 100%;
  border: none;
  background-color: transparent;
  margin: 0;
  padding: 0;
  height: 35px;

  padding: 0.15rem 0.5rem;
  border-radius: 0.5rem;

  :hover,
  :focus {
    cursor: pointer;
    outline: none;
  }

  svg {
    margin-top: 2px;
  }
`

const StyledMenu = styled.div`
  margin-left: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  border: none;
  text-align: left;
`



export default function SettingsTab() {
  const node = useRef<HTMLDivElement>()
  const open = useModalOpen(ApplicationModal.SETTINGS)
  const toggle = useToggleSettingsMenu()

  const theme = useContext(ThemeContext)
  const [userSlippageTolerance, setUserslippageTolerance] = useUserSlippageTolerance()

  const [ttl, setTtl] = useUserTransactionTTL()

  const [expertMode, toggleExpertMode] = useExpertModeManager()

  const [classicMode, toggleClassicMode] = useClassicModeManager()

  // show confirmation view before turning on
  const [showConfirmation, setShowConfirmation] = useState(false)

  useOnClickOutside(node, open ? toggle : undefined)

  return (
    // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/30451
    <StyledMenu ref={node as any}>
      <Modal isOpen={showConfirmation} onDismiss={() => setShowConfirmation(false)} maxHeight={100}>
        <ModalContentWrapper>
          <div>
            <h6 className="with-content-divisor">Are you sure?</h6>
            <IconButton className={ `modal-close-icon ${theme.name}` } onClick={() => setShowConfirmation(false)}>
              <X/>
            </IconButton>
            <AutoColumn gap="lg" style={{ padding: '0 2rem' }}>
              <EvidencedTextParagraph>
                Expert mode turns off the confirm transaction prompt and allows high slippage trades that often result
                in bad rates and lost funds.
                <br/><br/>
                ONLY USE THIS MODE IF YOU KNOW WHAT YOU ARE DOING.
              </EvidencedTextParagraph>
              <MainOperationButton 
                  id="confirm-expert-mode"
                  className={ `use-custom-properties expert-mode ${theme.name}` } 
                  onClick={() => {
                  if (window.prompt(`Please type the word "confirm" to enable expert mode.`) === 'confirm') {
                    toggleExpertMode()
                    setShowConfirmation(false)
                  }
                }}>Turn On Expert Mode</MainOperationButton>
            </AutoColumn>
          </div>
        </ModalContentWrapper>
      </Modal>
      <StyledMenuButton onClick={toggle} id="open-settings-dialog-button">
        <Settings size={15} stroke={theme.text1} />
        {/*
        {expertMode ? (
          <EmojiWrapper>
            <span role="img" aria-label="wizard-icon">
              🧙
            </span>
          </EmojiWrapper>
        ) : null}
        */}
      </StyledMenuButton>
      <StyledMenuText onClick={toggle}>Settings</StyledMenuText>
      {open && (
        <SecondaryPanelBoxContainer className={ `settings-menu-panel ${theme.name}` }>
          <SecondaryPanelBoxContainerExtraDecorator className={ `top ${theme.name}` }/>
          <div className="inner-content">
            <AutoColumn gap="md" style={{ padding: '1rem' }}>
              <div className="sectionHeader">Transaction Settings</div>
              <TransactionSettings rawSlippage={userSlippageTolerance} setRawSlippage={setUserslippageTolerance} deadline={ttl} setDeadline={setTtl} />
              <div className="sectionHeader">Interface Settings</div>
              <RowBetween>
                <RowFixed>
                  <div className="sectionOption">Toggle Expert Mode</div>
                  <QuestionHelper text="Bypasses confirmation modals and allows high slippage trades. Use at your own risk." />
                </RowFixed>
                <Toggle
                  id="toggle-expert-mode-button"
                  isActive={expertMode}
                  toggle={ expertMode ? () => { toggleExpertMode(); setShowConfirmation(false); } : () => { toggle(); setShowConfirmation(true); } } />
              </RowBetween>
              <RowBetween>
                <RowFixed>
                  <div className="sectionOption">Toggle Classic Mode</div>
                </RowFixed>
                <Toggle isActive={classicMode} toggle={toggleClassicMode} />
              </RowBetween> 
            </AutoColumn>
          </div>
          <SecondaryPanelBoxContainerExtraDecorator className={ `bottom ${theme.name}` }/>  
        </SecondaryPanelBoxContainer>
      )}
    </StyledMenu>
  )
}
