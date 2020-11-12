import React from 'react'
import styled from 'styled-components'
import { darken, lighten } from 'polished'

import { RowBetween } from '../Row'
import { ChevronDown } from 'react-feather'
import { Button as RebassButton, ButtonProps } from 'rebass/styled-components'
import swapButtonBg from '../../assets/images/button-background.png'

const Base = styled(RebassButton) <{
  padding?: string
  width?: string
  borderRadius?: string
  altDisabledStyle?: boolean
}>`
  padding: ${({ padding }) => (padding ? padding : '18px')};
  width: ${({ width }) => (width ? width : '100%')};
  font-weight: 500;
  text-align: center;
  border-radius: 12px;
  border-radius: ${({ borderRadius }) => borderRadius && borderRadius};
  outline: none;
  border: 1px solid transparent;
  color: white;
  text-decoration: none;
  display: flex;
  justify-content: center;
  flex-wrap: nowrap;
  align-items: center;
  cursor: pointer;
  position: relative;
  z-index: 1;
  &:disabled {
    cursor: auto;
  }

  > * {
    user-select: none;
  }
`

export const ButtonPrimary = styled(Base)`
  background-color: rgb(0,0,0,0.5);
  border: 2px solid ${({ theme }) => theme.cyan1};
  color: white;
  padding: 5px 10px;
  border-radius: 35px;
  &:focus {
    box-shadow: 0 0 0 1pt ${({ theme }) => darken(0.05, theme.cyan1)};
    background-color: ${({ theme }) => darken(0.05, theme.bg6)};
  }
  &:hover {
    background-color: ${({ theme }) => darken(0.05, theme.bg6)};
  }
  &:active {
    box-shadow: 0 0 0 1pt ${({ theme }) => darken(0.1, theme.bg6)};
    background-color: ${({ theme }) => darken(0.1, theme.bg6)};
  }
  &:disabled {
    background-color: ${({ theme, altDisabledStyle }) => (altDisabledStyle ? theme.bg6 : theme.bg6)};
    color: ${({ theme, altDisabledStyle }) => (altDisabledStyle ? 'white' : theme.text3)};
    cursor: auto;
    box-shadow: none;
    border: 1px solid transparent;
    outline: none;
    opacity: ${({ altDisabledStyle }) => (altDisabledStyle ? '0.7' : '1')};
  }
`

export const ButtonLight = styled(Base)`
  background-color: ${({ theme }) => theme.primary5};
  color: ${({ theme }) => theme.primaryText1};
  font-size: 16px;
  font-weight: 500;
  &:focus {
    box-shadow: 0 0 0 1pt ${({ theme, disabled }) => !disabled && darken(0.03, theme.primary5)};
    background-color: ${({ theme, disabled }) => !disabled && darken(0.03, theme.primary5)};
  }
  &:hover {
    background-color: ${({ theme, disabled }) => !disabled && darken(0.03, theme.primary5)};
  }
  &:active {
    box-shadow: 0 0 0 1pt ${({ theme, disabled }) => !disabled && darken(0.05, theme.primary5)};
    background-color: ${({ theme, disabled }) => !disabled && darken(0.05, theme.primary5)};
  }
  :disabled {
    opacity: 0.4;
    :hover {
      cursor: auto;
      background-color: ${({ theme }) => theme.primary5};
      box-shadow: none;
      border: 1px solid transparent;
      outline: none;
    }
  }
`

export const ButtonMateriaLight = styled(ButtonLight)`
  width: auto;
  color: ${({ theme }) => theme.text1};
  background-color: rgb(0, 0, 0, 0.5);
  border: 2px solid ${({ theme }) => theme.cyan1};
  padding: 5px 10px;
  border-radius: 35px;
  text-transform: uppercase;
  &:focus {
    box-shadow: none;
    background-color: rgb(0, 0, 0, 0.5);
    border: 2px solid ${({ theme }) => theme.cyan1};
  }
  &:hover {
    background-color: rgb(0, 0, 0, 0.5);
    border: 2px solid ${({ theme }) => theme.cyan1};
  }
  &:active {
    box-shadow: none;
    background-color: rgb(0, 0, 0, 0.5);
    border: 2px solid ${({ theme }) => theme.cyan1};
  }
  :disabled {
    opacity: 0.4;
    :hover {
      cursor: auto;
      background-color: rgb(0, 0, 0, 0.5);
      border: 2px solid ${({ theme }) => theme.cyan1};
      box-shadow: none;
      outline: none;
    }
  }
`

export const ButtonMateriaPrimary = styled(ButtonPrimary)`
  width: auto;
  background-color: rgb(0, 0, 0, 0.5);
  border: 2px solid ${({ theme }) => theme.cyan1};
  color: ${({ theme }) => theme.text1};
  padding: 5px 10px;
  border-radius: 35px;
  text-transform: uppercase;
  &:focus {
    box-shadow: none;
    background-color: rgb(0, 0, 0, 0.5);
    border: 2px solid ${({ theme }) => theme.cyan1};
  }
  &:hover {
    background-color: rgb(0, 0, 0, 0.5);
    border: 2px solid ${({ theme }) => theme.cyan1};
  }
  &:active {
    box-shadow: none;
    background-color: rgb(0, 0, 0, 0.5);
    border: 2px solid ${({ theme }) => theme.cyan1};
  }
  &:disabled {
    background-color: rgb(0, 0, 0, 0.5);
    border: 2px solid ${({ theme }) => theme.cyan1};
    color: ${({ theme }) => theme.text1};
    cursor: auto;
    box-shadow: none;
    outline: none;
    opacity: ${({ altDisabledStyle }) => (altDisabledStyle ? '0.7' : '1')};
  }
`

export const ButtonGray = styled(Base)`
  background-color: ${({ theme }) => theme.bg3};
  color: ${({ theme }) => theme.text2};
  font-size: 16px;
  font-weight: 500;
  &:focus {
    box-shadow: 0 0 0 1pt ${({ theme, disabled }) => !disabled && darken(0.05, theme.bg2)};
    background-color: ${({ theme, disabled }) => !disabled && darken(0.05, theme.bg2)};
  }
  &:hover {
    background-color: ${({ theme, disabled }) => !disabled && darken(0.05, theme.bg2)};
  }
  &:active {
    box-shadow: 0 0 0 1pt ${({ theme, disabled }) => !disabled && darken(0.1, theme.bg2)};
    background-color: ${({ theme, disabled }) => !disabled && darken(0.1, theme.bg2)};
  }
`

export const ButtonSecondary = styled(Base)`
  border: 2px solid ${({ theme }) => theme.cyan1};
  color: white;
  background-color: transparent;
  font-size: 18px;
  border-radius: 35px;
  padding: ${({ padding }) => (padding ? padding : '10px')};

  &:focus {
    box-shadow: 0 0 0 1pt ${({ theme }) => darken(0.05, theme.cyan1)};
    background-color: ${({ theme }) => darken(0.05, theme.bg6)};
  }
  &:hover {
    background-color: ${({ theme }) => darken(0.05, theme.bg6)};
  }
  &:active {
    box-shadow: 0 0 0 1pt ${({ theme }) => darken(0.1, theme.bg6)};
    background-color: ${({ theme }) => darken(0.1, theme.bg6)};
  }
  &:disabled {
    background-color: ${({ theme, altDisabledStyle }) => (altDisabledStyle ? theme.bg6 : theme.bg6)};
    color: ${({ theme, altDisabledStyle }) => (altDisabledStyle ? 'white' : theme.text3)};
    cursor: auto;
    box-shadow: none;
    border: 1px solid transparent;
    outline: none;
    opacity: ${({ altDisabledStyle }) => (altDisabledStyle ? '0.7' : '1')};
  }
`

export const ButtonPink = styled(Base)`
  background-color: ${({ theme }) => theme.primary1};
  color: white;

  &:focus {
    box-shadow: 0 0 0 1pt ${({ theme }) => darken(0.05, theme.primary1)};
    background-color: ${({ theme }) => darken(0.05, theme.primary1)};
  }
  &:hover {
    background-color: ${({ theme }) => darken(0.05, theme.primary1)};
  }
  &:active {
    box-shadow: 0 0 0 1pt ${({ theme }) => darken(0.1, theme.primary1)};
    background-color: ${({ theme }) => darken(0.1, theme.primary1)};
  }
  &:disabled {
    background-color: ${({ theme }) => theme.primary1};
    opacity: 50%;
    cursor: auto;
  }
`

export const ButtonOutlined = styled(Base)`
  border: 1px solid ${({ theme }) => theme.cyan1};
  border-radius: 0px !important;

  background-color: transparent;
  color: ${({ theme }) => theme.text1};

  &:focus {
    box-shadow: 0 0 0 1px ${({ theme }) => theme.cyan2};
  }
  &:hover {
    box-shadow: 0 0 0 1px ${({ theme }) => theme.cyan2};
  }
  &:active {
    box-shadow: 0 0 0 1px ${({ theme }) => theme.cyan2};
  }
  &:disabled {
    opacity: 50%;
    cursor: auto;
  }
`

export const ButtonEmpty = styled(Base)`
  background-color: transparent;
  color: ${({ theme }) => theme.primary1};
  display: flex;
  justify-content: center;
  align-items: center;

  &:focus {
    text-decoration: underline;
  }
  &:hover {
    text-decoration: underline;
  }
  &:active {
    text-decoration: underline;
  }
  &:disabled {
    opacity: 50%;
    cursor: auto;
  }
`

export const ButtonWhite = styled(Base)`
  border: 1px solid #edeef2;
  background-color: ${({ theme }) => theme.bg1};
  color: black;

  &:focus {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    box-shadow: 0 0 0 1pt ${darken(0.05, '#edeef2')};
  }
  &:hover {
    box-shadow: 0 0 0 1pt ${darken(0.1, '#edeef2')};
  }
  &:active {
    box-shadow: 0 0 0 1pt ${darken(0.1, '#edeef2')};
  }
  &:disabled {
    opacity: 50%;
    cursor: auto;
  }
`

const ButtonConfirmedStyle = styled(Base)`
  background-color: ${({ theme }) => lighten(0.5, theme.green1)};
  color: ${({ theme }) => theme.green1};
  border: 1px solid ${({ theme }) => theme.green1};

  &:disabled {
    opacity: 50%;
    cursor: auto;
  }
`

const ButtonErrorStyle = styled(Base)`
  background-color: ${({ theme }) => theme.red1};
  border: 1px solid ${({ theme }) => theme.red1};

  &:focus {
    box-shadow: 0 0 0 1pt ${({ theme }) => darken(0.05, theme.red1)};
    background-color: ${({ theme }) => darken(0.05, theme.red1)};
  }
  &:hover {
    background-color: ${({ theme }) => darken(0.05, theme.red1)};
  }
  &:active {
    box-shadow: 0 0 0 1pt ${({ theme }) => darken(0.1, theme.red1)};
    background-color: ${({ theme }) => darken(0.1, theme.red1)};
  }
  &:disabled {
    opacity: 50%;
    cursor: auto;
    box-shadow: none;
    background-color: ${({ theme }) => theme.red1};
    border: 1px solid ${({ theme }) => theme.red1};
  }
`

const ButtonMateriaErrorStyle = styled(ButtonErrorStyle)`
  width: auto;
  padding: 5px 10px;
  border-radius: 35px;
`

export const SwapButton = styled(ButtonMateriaPrimary)`
  height: 3ch !important;
  width: 4rem;
  border: none;
  font-size: small;
  border-radius: unset;
  background-color: transparent;
  background-image: url(${swapButtonBg});
  background-repeat: no-repeat;
  background-size: 100% 100%;
  // padding: 18px;
  &:focus {
    background-color: transparent;
    border: none;
  }
  &:hover {
    background-color: transparent;
    border: none;
  }
  &:active {
    background-color: transparent;
    border: none;
  }
  &:disabled {
    background-color: transparent;
    border: none;
  }
  & > div {
    display: none;
  }
`;

export function ButtonConfirmed({
  confirmed,
  altDisabledStyle,
  ...rest
}: { confirmed?: boolean; altDisabledStyle?: boolean } & ButtonProps) {
  if (confirmed) {
    return <ButtonConfirmedStyle {...rest} />
  } else {
    return <ButtonPrimary {...rest} altDisabledStyle={altDisabledStyle} />
  }
}

export function ButtonError({ error, ...rest }: { error?: boolean } & ButtonProps) {
  if (error) {
    return <ButtonErrorStyle {...rest} />
  } else {
    return <ButtonPrimary {...rest} />
  }
}

export function ButtonMateriaConfirmed({
  hide,
  confirmed,
  altDisabledStyle,
  ...rest
}: { hide?: boolean; confirmed?: boolean; altDisabledStyle?: boolean } & ButtonProps) {
  if (!hide) {
    if (confirmed) {
      return <ButtonConfirmedStyle {...rest} />
    } else {
      return <ButtonMateriaPrimary {...rest} altDisabledStyle={altDisabledStyle} />
    }
  }
  else {
    return <></>
  }
}

export function ButtonMateriaError({
  hide,
  showSwap,
  error,
  ...rest
}: { hide?: boolean; showSwap?: boolean, error?: boolean } & ButtonProps) {
  if (!hide || showSwap) {
    if (error) {
      return <ButtonMateriaErrorStyle {...rest} />
    } else {
      if (showSwap) {
        return <SwapButton {...rest} />
      }
      else {
        return <ButtonMateriaPrimary {...rest} />
      }
    }
  }
  else {
    return <></>
  }
}

export function ButtonDropdown({ disabled = false, children, ...rest }: { disabled?: boolean } & ButtonProps) {
  return (
    <ButtonPrimary {...rest} disabled={disabled}>
      <RowBetween>
        <div style={{ display: 'flex', alignItems: 'center' }}>{children}</div>
        <ChevronDown size={24} />
      </RowBetween>
    </ButtonPrimary>
  )
}

export function ButtonDropdownLight({ disabled = false, children, ...rest }: { disabled?: boolean } & ButtonProps) {
  return (
    <ButtonOutlined {...rest} disabled={disabled}>
      <RowBetween>
        <div style={{ display: 'flex', alignItems: 'center' }}>{children}</div>
        <ChevronDown size={24} />
      </RowBetween>
    </ButtonOutlined>
  )
}

export function ButtonRadio({ active, ...rest }: { active?: boolean } & ButtonProps) {
  if (!active) {
    return <ButtonWhite {...rest} />
  } else {
    return <ButtonPrimary {...rest} />
  }
}
