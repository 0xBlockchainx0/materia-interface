import React, { useContext } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { darken, lighten } from 'polished'
import { RowBetween } from '../Row'
import { ChevronDown } from 'react-feather'
import { Button as RebassButton, ButtonProps } from 'rebass/styled-components'
import { MainOperationButton } from '../../theme'

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
  background-color: ${({ theme }) => theme.primary1};  
  border: 1px solid ${({ theme }) => theme.cyan1};
  color: white;
  &:focus {
    box-shadow: 0 0 0 1pt ${({ theme }) => darken(0.05, theme.primary1)};
    background-color: ${({ theme }) => darken(0.05, theme.primary1)};
  }
  &:hover {
    background-color: ${({ theme }) => darken(0.05, theme.primary1)};
  }
  &:disabled {
    background-color: ${({ theme, altDisabledStyle }) => (altDisabledStyle ? theme.primary1 : theme.bg3)};
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
  background-color: ${({ theme }) => theme.bg8};
  border: 2px solid ${({ theme }) => theme.cyan1};
  padding: 5px 10px;
  border-radius: 35px;
  padding: 5px 15px;
  border-radius: 15px;
  &:focus {
    box-shadow: none;
    background-color: ${({ theme }) => theme.bg8};
    border: 2px solid ${({ theme }) => theme.cyan1};
  }
  &:hover {
    background-color: ${({ theme }) => theme.bg8};
    border: 2px solid ${({ theme }) => theme.cyan1};
  }
  &:active {
    box-shadow: none;
    background-color: r${({ theme }) => theme.bg8};
    border: 2px solid ${({ theme }) => theme.cyan1};
  }
  :disabled {
    opacity: 0.4;
    :hover {
      cursor: auto;
      background-color: ${({ theme }) => theme.bg8};
      border: 2px solid ${({ theme }) => theme.cyan1};
      box-shadow: none;
      outline: none;
    }
  }
`

export const ButtonMateriaPrimary = styled(ButtonPrimary)`
  width: auto;
  background-color: linear-gradient(90deg, ${({ theme }) => theme.buttonMateriaPrimaryBackgroundFirstColor}, ${({ theme }) => theme.buttonMateriaPrimaryBackgroundSecondColor});
  border: 1px solid ${({ theme }) => theme.buttonMateriaPrimaryBorderColor};
  color: ${({ theme }) => theme.buttonMateriaPrimaryTextColor};
  padding: 0.2rem 1.5rem;
  border-radius: 3px;
  transition: all 0.3s ease;
  &:hover:enabled{
    text-shadow: 0px 0px 2px 0px #111111; 
    background-color: linear-gradient(90deg, ${({ theme }) => theme.buttonMateriaPrimaryBackgroundHoverFirstColor}, ${({ theme }) => theme.buttonMateriaPrimaryBackgroundHoverSecondColor});
    border-color: ${({ theme }) => theme.buttonMateriaPrimaryHoverBorderColor};
    box-shadow: 0px 0px 6px 0px #b0deff;
  }
  &:disabled {
    background-color: linear-gradient(90deg, ${({ theme }) => theme.buttonMateriaPrimaryBackgroundFirstColor}, ${({ theme }) => theme.buttonMateriaPrimaryBackgroundSecondColor});
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
border: 1px solid ${({ theme }) => theme.primary4};
color: ${({ theme }) => theme.primary1};
background-color: transparent;
  font-size: small;
  border-radius: 35px;
  padding: ${({ padding }) => (padding ? padding : '10px')};

  &:focus {
    box-shadow: 0 0 0 1pt ${({ theme }) => theme.primary4};
    border: 1px solid ${({ theme }) => theme.primary3};
  }
  &:hover {
    border: 1px solid ${({ theme }) => theme.primary3};
  }
  &:active {
    box-shadow: 0 0 0 1pt ${({ theme }) => theme.primary4};
    border: 1px solid ${({ theme }) => theme.primary3};
  }
  &:disabled {
    cursor: auto;
    box-shadow: none;
    border: 1px solid transparent;
    outline: none;
    opacity: 50%;
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

  &:hover, &:focus, &:active { text-decoration: underline; }
  &:disabled { opacity: 50%; cursor: auto; }
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
  width: auto;
  background-color: linear-gradient(90deg, ${({ theme }) => lighten(0.5, theme.green1)}, ${({ theme }) => theme.green1});
  border: 1px solid ${({ theme }) => theme.buttonMateriaErrorBorderColor};
  color: ${({ theme }) => theme.buttonMateriaPrimaryTextColor};
  padding: 0.2rem 1.5rem;
  border-radius: 3px;
  transition: all 0.3s ease;
  &:hover:enabled{
    text-shadow: 0px 0px 2px 0px #111111; 
    background-color: linear-gradient(90deg, ${({ theme }) => lighten(0.5, theme.green1)}, ${({ theme }) => theme.green1});
    border-color: ${({ theme }) => theme.buttonMateriaErrorHoverBorderColor};
    box-shadow: 0px 0px 6px 0px #b0deff;
  }
  &:disabled {
    background-color: linear-gradient(90deg, ${({ theme }) => lighten(0.5, theme.green1)}, ${({ theme }) => theme.green1});
    opacity: ${({ altDisabledStyle }) => (altDisabledStyle ? '0.7' : '1')};
    border-radius: 3px;
  }
  background-color: ${({ theme }) => theme.green1};
  border: 1px solid ${({ theme }) => theme.green1};
  &:focus {
    box-shadow: 0 0 0 1pt ${({ theme }) => darken(0.05, theme.green1)};
    background-color: ${({ theme }) => darken(0.05, theme.green1)};
  }
  &:hover {
    background-color: ${({ theme }) => darken(0.05, theme.green1)};
  }
  &:active {
    box-shadow: 0 0 0 1pt ${({ theme }) => darken(0.1, theme.green1)};
    background-color: ${({ theme }) => darken(0.1, theme.green1)};
  }
  &:disabled {
    opacity: 50%;
    cursor: auto;
    box-shadow: none;
    background-color: ${({ theme }) => theme.green1};
    border: 1px solid ${({ theme }) => theme.green1};
  }
`

const ButtonErrorStyle = styled(Base)`
  width: auto;
  background-color: linear-gradient(90deg, ${({ theme }) => theme.buttonMateriaErrorBackgroundFirstColor}, ${({ theme }) => theme.buttonMateriaErrorBackgroundSecondColor});
  border: 1px solid ${({ theme }) => theme.buttonMateriaErrorBorderColor};
  color: ${({ theme }) => theme.buttonMateriaPrimaryTextColor};
  padding: 0.2rem 1.5rem;
  border-radius: 3px;
  transition: all 0.3s ease;
  &:hover:enabled{
    text-shadow: 0px 0px 2px 0px #111111; 
    background-color: linear-gradient(90deg, ${({ theme }) => theme.buttonMateriaErrorBackgroundHoverFirstColor}, ${({ theme }) => theme.buttonMateriaErrorBackgroundHoverSecondColor});
    border-color: ${({ theme }) => theme.buttonMateriaErrorHoverBorderColor};
    box-shadow: 0px 0px 6px 0px #b0deff;
  }
  &:disabled {
    background-color: linear-gradient(90deg, ${({ theme }) => theme.buttonMateriaErrorBackgroundFirstColor}, ${({ theme }) => theme.buttonMateriaErrorBackgroundSecondColor});
    opacity: ${({ altDisabledStyle }) => (altDisabledStyle ? '0.7' : '1')};
    border-radius: 3px;
  }
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

const ButtonMateriaConfirmedStyle = styled(ButtonConfirmedStyle)`

`

const ButtonMateriaErrorStyle = styled(ButtonErrorStyle)`
  z-index:2;
`

export function ButtonConfirmed({  
  confirmed,
  altDisabledStyle,
  ...rest
}: { confirmed?: boolean; altDisabledStyle?: boolean } & ButtonProps) {
  const theme = useContext(ThemeContext)
  if (confirmed) {
    return <ButtonConfirmedStyle {...rest} />
  } else {
    return <ButtonPrimary {...rest} altDisabledStyle={altDisabledStyle} />
  }
}

export function ButtonError({ error, ...rest }: { error?: boolean } & ButtonProps) {
  const theme = useContext(ThemeContext)
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
  const theme = useContext(ThemeContext)
  if (!hide) {
    if (confirmed) {
      return <ButtonMateriaConfirmedStyle {...rest} />
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
  useCustomProperties,
  isExpertModeActive,
  ...rest
}: { hide?: boolean; showSwap?: boolean, error?: boolean, useCustomProperties?: boolean, isExpertModeActive?: boolean } & ButtonProps) {
  const theme = useContext(ThemeContext)
  if (!hide || showSwap) {
    var className = theme.name + ' ' + (useCustomProperties ? 'use-custom-properties' : '' ) + ' ' + (isExpertModeActive ? 'expert-mode' : ' ')
    console.log('theme.name => ' + theme.name);
    console.log('useCustomProperties => ' + useCustomProperties);
    console.log('isExpertModeActive => ' + isExpertModeActive);
    console.log('className => ' + className);
    console.log('showSwap => ' + showSwap);
    console.log('hide => ' + hide);
    if (error) {      
      return <MainOperationButton {...rest} className={className}/>
    } else {
      if (showSwap) {
        return <MainOperationButton {...rest} className={className}/>
      }
      else {
        return <MainOperationButton {...rest} className={className}/>
      }
    }
  }
  else {
    return <></>
  }
}

export function ButtonDropdown({ disabled = false, children, ...rest }: { disabled?: boolean } & ButtonProps) {
  const theme = useContext(ThemeContext)
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
  const theme = useContext(ThemeContext)
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
  const theme = useContext(ThemeContext)
  if (!active) {
    return <ButtonWhite {...rest} />
  } else {
    return <ButtonPrimary {...rest} />
  }
}
