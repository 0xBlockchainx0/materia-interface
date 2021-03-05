import React, { useContext } from 'react'
import { ThemeContext } from 'styled-components'
import { ToggleButton, ToggleButtonElement } from '../../theme'

export interface ToggleProps {
  id?: string
  isActive: boolean
  toggle: () => void
}

export default function Toggle({ id, isActive, toggle }: ToggleProps) {
  const theme = useContext(ThemeContext)
  return (
    <ToggleButton id={id} className={theme.name} isActive={isActive} onClick={toggle}>
      <ToggleButtonElement className={`on ${(isActive ? 'active' : '')} ${theme.name}`} isActive={isActive} isOnSwitch={true}>On</ToggleButtonElement>
      <ToggleButtonElement className={`off ${(!isActive ? 'active' : '')} ${theme.name}`} isActive={!isActive} isOnSwitch={false}>Off</ToggleButtonElement>
    </ToggleButton>
  )
}
