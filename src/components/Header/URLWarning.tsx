import React, { useContext } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { AlertTriangle, X } from 'react-feather'
import { useURLWarningToggle, useURLWarningVisible } from '../../state/user/hooks'
import { isMobile } from 'react-device-detect'

const PhishAlert = styled.div<{ isActive: any }>`
  width: 100%;
  padding: 6px 6px;
  background-color: ${({ theme }) => theme.blue1};
  color: white;
  font-size: 11px;
  justify-content: space-between;
  align-items: center;
  display: ${({ isActive }) => (isActive ? 'flex' : 'none')};

  &.classic { font-size: 9px; }
`

export const StyledClose = styled(X)`
  :hover {
    cursor: pointer;
  }
`

export default function URLWarning() {
  const toggleURLWarning = useURLWarningToggle()
  const showURLWarning = useURLWarningVisible()
  const theme = useContext(ThemeContext)

  return isMobile ? (
    <PhishAlert isActive={showURLWarning} className={theme.name}>
      <div style={{ display: 'flex' }}>
        <AlertTriangle style={{ marginRight: 6 }} size={12} /> Make sure the URL is
        <code style={{ padding: '0 4px', display: 'inline', fontWeight: 'bold' }}>app.materiadex.com</code>
      </div>
      <StyledClose size={12} onClick={toggleURLWarning} />
    </PhishAlert>
  ) : window.location.hostname === 'app.materiadex.com' ? (
    <PhishAlert isActive={showURLWarning} className={theme.name}>
      <div style={{ display: 'flex' }}>
        <AlertTriangle style={{ marginRight: 6 }} size={12} /> Always make sure the URL is
        <code style={{ padding: '0 4px', display: 'inline', fontWeight: 'bold' }}>app.materiadex.com</code> - bookmark it
        to be safe.
      </div>
      <StyledClose size={12} onClick={toggleURLWarning} />
    </PhishAlert>
  ) : null
}
