import React, { useContext } from 'react'
import { ChainId } from '@materia-dex/sdk'
import { Text } from 'rebass'
import styled, { ThemeContext } from 'styled-components'
import { useActiveWeb3React } from '../../hooks'
import { useDarkModeManager } from '../../state/user/hooks'
import { useETHBalances } from '../../state/wallet/hooks'
import { TransparentCard } from '../Card'
import Settings from '../Settings'
import Menu from '../Menu'
import Web3Status from '../Web3Status'
import Clock from 'react-live-clock';
import { Moon, Sun, Clock as TimeIcon } from 'react-feather'
import { 
  FooterControls,
  FooterElement,
  FooterElementClock,
  FooterElementWrap, 
  AccountElement, 
  HideSmall,
  HideExtraSmall,
  IconButton } from '../../theme' 

const StyledButton = styled.button`
  border: none;
  background-color: rgba(0, 0, 0, 0);
  color: ${({ theme }) => theme.text1};
  :focus {
    outline: none;
  }
  display: flex;
  align-items: center;
  justify-content: center;
  :hover {
    cursor: pointer;
  }
`











const NetworkCard = styled(TransparentCard)`
  border-radius: 12px;
  padding: 8px 12px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin: 0;
    margin-right: 0.5rem;
    width: initial;
    overflow: hidden;
    text-overflow: ellipsis;
    flex-shrink: 1;
  `};
`

const NETWORK_LABELS: { [chainId in ChainId]?: string } = {
  [ChainId.RINKEBY]: 'Rinkeby',
  [ChainId.ROPSTEN]: 'Ropsten',
  [ChainId.GÖRLI]: 'Görli',
  [ChainId.KOVAN]: 'Kovan'
}

export default function Footer() {
  const { account, chainId } = useActiveWeb3React()  
  const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? '']
  const [darkMode, toggleDarkMode] = useDarkModeManager()
  const theme = useContext(ThemeContext)

  return (
    <FooterControls className={theme.name}>
      <FooterElementClock>
        <div className="ml20">
          <TimeIcon className={`footer-icon ${theme.name}`}/> <Clock format={'HH:mm:ss'} ticking={true} />
        </div>
      </FooterElementClock>
      <FooterElement>
        <AccountElement active={!!account} style={{ pointerEvents: 'auto' }}>
          {account && userEthBalance ? (
            <HideExtraSmall style={{ flexShrink: 0 }} pl="0.75rem" pr="0.5rem" fontWeight={500}>
              {userEthBalance?.toSignificant(4)} ETH
            </HideExtraSmall>
          ) : null}
          <Web3Status />
        </AccountElement>
        <HideSmall>
          {chainId && NETWORK_LABELS[chainId] && (
            <NetworkCard title={NETWORK_LABELS[chainId]}>{NETWORK_LABELS[chainId]}</NetworkCard>
          )}
        </HideSmall>
      </FooterElement>
      <FooterElementWrap className={`mr20 ${theme.name}`}>
        <IconButton className={`theme-icon ${theme.name}`} onClick={toggleDarkMode}>
            {darkMode ? <Sun className={`footer-icon ${theme.name}`}/> : <Moon className={`footer-icon ${theme.name}`}/>}
        </IconButton>
        <Menu />
        <Settings />
      </FooterElementWrap>
    </FooterControls>
  )
}
