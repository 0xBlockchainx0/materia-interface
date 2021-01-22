import { ChainId } from '@materia-dex/sdk'
import React from 'react'
import { Text } from 'rebass'

import styled from 'styled-components'

import { useActiveWeb3React } from '../../hooks'
import { useDarkModeManager } from '../../state/user/hooks'
import { useETHBalances } from '../../state/wallet/hooks'

import { TransparentCard } from '../Card'
import Settings from '../Settings'
import Menu from '../Menu'

import Web3Status from '../Web3Status'
import Clock from 'react-live-clock';
import { Moon, Sun, Clock as TimeIcon } from 'react-feather'

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

const FooterControls = styled.div`
  font-size: small;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-self: flex-end;
  max-width: 1200px;
  z-index:2;
  @media (max-width: 600px) {
     max-width: 90%;
  }
  @media (max-width: 1200px) {
    max-width: 90%;
 }
  width: 100%;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    flex-direction: row;
    justify-content: space-between;
    justify-self: center;
    width: 100%;
    max-width: 960px;
    padding: 0rem 0.5rem;
    position: fixed;
    bottom: 0px;
    left: 0px;
    width: 100%;
    z-index: 99;
    height: 72px;
    // border-radius: 12px 12px 0 0;
    ${({ theme }) => theme.backgroundContainer2}
  `};
`

const FooterElement = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  ${({ theme }) => theme.mediaWidth.upToMedium`
   flex-direction: row-reverse;
    align-items: center;
  `};
`

const FooterElementClock = styled.div`
  display: flex;
  width: 10%;
  align-items: center;
  gap: 8px;

  ${({ theme }) => theme.mediaWidth.upToMedium`
   flex-direction: row-reverse;
    align-items: center;
  `};

  @media (max-width: 960px) {
    display: none !important;
  }
`

const FooterElementWrap = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
`

const AccountElement = styled.div<{ active: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  white-space: nowrap;
  width: 100%;
`

const HideSmall = styled.span`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: none;
  `};
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

const BalanceText = styled(Text)`
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display: none;
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

  return (
    <FooterControls>
      <FooterElementClock>
        <TransparentCard>
          <TimeIcon size={15} style={{
            marginTop: '-1px',
            verticalAlign: 'middle',
            marginRight: '3px'
          }} /> <Clock format={'HH:mm:ss'} ticking={true} />
        </TransparentCard>
      </FooterElementClock>
      <FooterElement>
        <AccountElement active={!!account} style={{ pointerEvents: 'auto' }}>
          {account && userEthBalance ? (
            <BalanceText style={{ flexShrink: 0 }} pl="0.75rem" pr="0.5rem" fontWeight={500}>
              {userEthBalance?.toSignificant(4)} ETH
            </BalanceText>
          ) : null}
          <Web3Status />
        </AccountElement>
        <HideSmall>
          {chainId && NETWORK_LABELS[chainId] && (
            <NetworkCard title={NETWORK_LABELS[chainId]}>{NETWORK_LABELS[chainId]}</NetworkCard>
          )}
        </HideSmall>
      </FooterElement>
      <FooterElementWrap>
        <StyledButton type="button" onClick={toggleDarkMode}>
          {darkMode ? <Sun size={15} /> : <Moon size={15} />}
        </StyledButton>
        <Menu />
        <Settings />
      </FooterElementWrap>
    </FooterControls>
  )
}
