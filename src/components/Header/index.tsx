import React from 'react'
import { NavLink } from 'react-router-dom'
import { darken } from 'polished'

import styled from 'styled-components'

import Logo from '../../assets/images/materia-logo-light.png'
import LogoDark from '../../assets/images/materia-logo.png'
import { useClassicModeManager, useDarkModeManager } from '../../state/user/hooks'
import { ExternalLink } from '../../theme'

import Row, { RowFixed } from '../Row'
import { MATERIA_DFO_ADDRESS } from '../../constants'

const HeaderFrame = styled.div`
  display: grid;
  grid-template-columns: 1fr 120px;
  align-items: center;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  width: 100%;
  top: 0;
  position: relative;
  border-bottom: 1px solid rgba(0, 0, 0, 0.0);
  padding: 1rem;
  z-index: 1;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    grid-template-columns: 1fr;
    padding: 0 1rem;
    width: calc(100%);
    position: relative;
  `};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
        padding: 0.5rem 1rem;
  `}
`


const HeaderRow = styled(RowFixed)`
  ${({ theme }) => theme.mediaWidth.upToMedium`
   width: 100%;
  `};
`

const HeaderLinks = styled(Row)`
  justify-content: center;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding: 1rem 0 1rem 1rem;
    justify-content: flex-end;
`};
`

const Title = styled.a`
  display: flex;
  align-items: center;
  pointer-events: auto;
  justify-self: flex-start;
  margin-right: 12px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    justify-self: center;
  `};
  :hover {
    cursor: pointer;
  }
`

const MateriaIcon = styled.div`
  transition: transform 0.3s ease;
  :hover {
    // transform: rotate(-5deg);
  }
`

const activeClassName = 'ACTIVE'

const StyledNavLink = styled(NavLink).attrs({
  activeClassName
})`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: left;
  border-radius: 3rem;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.text2};
  font-size: 1rem;
  width: fit-content;
  margin: 0 12px;
  font-weight: 500;

  &.${activeClassName} {
    // border-radius: 12px;
    font-weight: 600;
    color: ${({ theme }) => theme.cyan1};
  }

  :hover,
  :focus { color: ${({ theme }) => darken(0.1, theme.cyan1)}; }
`

const StyledExternalLink = styled(ExternalLink).attrs({
  activeClassName
})<{ isActive?: boolean }>`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: left;
  border-radius: 3rem;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.text2};
  font-size: 1rem;
  width: fit-content;
  margin: 0 12px;
  font-weight: 500;

  &.${activeClassName} {
    // border-radius: 12px;
    font-weight: 600;
    color: ${({ theme }) => theme.cyan2};
  }

  :hover,
  :focus {
    color: ${({ theme }) => darken(0.1, theme.cyan2)};
  }

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
      display: none;
`}
`

export default function Header() {
  const [isDark] = useDarkModeManager()
  const [isClassic] = useClassicModeManager()

  return (
    <HeaderFrame>
      <HeaderRow>
        <Title href=".">
          <MateriaIcon>
            <img width={'100px'} src={isDark||isClassic ? LogoDark : Logo} alt="logo" />
          </MateriaIcon>
        </Title>
        <HeaderLinks>
          <StyledNavLink id={`swap-nav-link`} to={'/swap'}>
            Swap
          </StyledNavLink>
          <StyledNavLink
            id={`pool-nav-link`}
            to={'/add'}
            isActive={(match, { pathname }) =>
              Boolean(match) ||
              pathname.startsWith('/add') ||
              pathname.startsWith('/remove') ||
              pathname.startsWith('/create') ||
              pathname.startsWith('/find')
            }
          >
            Pool
          </StyledNavLink>
          <StyledNavLink id={`stake-nav-link`} to={'/lm'}>
            LM
          </StyledNavLink>
          <StyledExternalLink id={`stake-nav-link`} href={'https://dapp.dfohub.com/?addr='+ MATERIA_DFO_ADDRESS}>
            Governance <span style={{ fontSize: '11px' }}>↗</span> 
          </StyledExternalLink>
          <StyledExternalLink id={`stake-nav-link`} href={'https://www.dfohub.com'}>
            DFO <span style={{ fontSize: '11px' }}>↗</span> 
          </StyledExternalLink>
          <StyledExternalLink id={`stake-nav-link`} href={'https://ethitem.com'}>
            EthItem <span style={{ fontSize: '11px' }}>↗</span> 
          </StyledExternalLink>
        </HeaderLinks>
      </HeaderRow>
    </HeaderFrame>
  )
}
