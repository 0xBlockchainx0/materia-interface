import React from 'react'
import styled from 'styled-components'
import { darken, lighten } from 'polished'

import { RowBetween } from '../Row'
import { ChevronDown } from 'react-feather'
import { Button as RebassButton, ButtonProps } from 'rebass/styled-components'

const Base = styled(RebassButton)<{
  padding?: string
  width?: string
  borderRadius?: string
  altDisabledStyle?: boolean
}>`
  padding: ${({ padding }) => (padding ? padding : '15px')};
  width: ${({ width }) => (width ? width : '100%')};
  font-weight: 800;
  text-align: center;
  outline: none;

  text-shadow: 2px 2px #212421,
             1px 1px #212021;
  font-family: Verdana, sans-serif;
  margin: 5px 0;

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
    background-color: ${({ theme, altDisabledStyle }) => (altDisabledStyle ? theme.primary1 : theme.bg3)};
    color: ${({ theme, altDisabledStyle }) => (altDisabledStyle ? 'white' : theme.text3)};
    cursor: auto;
    box-shadow: none;
    border: 1px solid transparent;
    outline: none;
    opacity: ${({ altDisabledStyle }) => (altDisabledStyle ? '0.7' : '1')};
  }

  border: solid 1px #424542;
  box-shadow: 1px 1px #e7dfe7,
              -1px -1px #e7dfe7,
              1px -1px #e7dfe7,
              -1px 1px #e7dfe7,
              0 -2px #9c9a9c,
              -2px 0 #7b757b,
              0 2px #424542;

background: #700e9c;
background: -moz-linear-gradient(top,  #700e9c 0%, #6c1237 100%);
background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#700e9c), color-stop(100%,#6c1237));
background: -webkit-linear-gradient(top,  #700e9c 0%,#6c1237 100%);
background: -o-linear-gradient(top,  #700e9c 0%,#6c1237 100%);
background: -ms-linear-gradient(top,  #700e9c 0%,#6c1237 100%);
background: linear-gradient(to bottom,  #700e9c 0%,#6c1237 100%);
filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#700e9c', endColorstr='#6c1237',GradientType=0 );


-webkit-border-radius: 7px;
-moz-border-radius: 7px;
border-radius: 10px;
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
      outline: none;
    }
  }

  border: solid 1px #424542;
  box-shadow: 1px 1px #e7dfe7,
              -1px -1px #e7dfe7,
              1px -1px #e7dfe7,
              -1px 1px #e7dfe7,
              0 -2px #9c9a9c,
              -2px 0 #7b757b,
              0 2px #424542;

background: #700e9c;
background: -moz-linear-gradient(top,  #700e9c 0%, #6c1237 100%);
background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#700e9c), color-stop(100%,#6c1237));
background: -webkit-linear-gradient(top,  #700e9c 0%,#6c1237 100%);
background: -o-linear-gradient(top,  #700e9c 0%,#6c1237 100%);
background: -ms-linear-gradient(top,  #700e9c 0%,#6c1237 100%);
background: linear-gradient(to bottom,  #700e9c 0%,#6c1237 100%);
filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#700e9c', endColorstr='#6c1237',GradientType=0 );


-webkit-border-radius: 7px;
-moz-border-radius: 7px;
border-radius: 10px;
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
  font-size: 16px;
  border-radius: 12px;
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
    opacity: 50%;
    cursor: auto;
  }
  a:hover {
    text-decoration: none;
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

  border: solid 1px #424542;
  box-shadow: 1px 1px #e7dfe7,
              -1px -1px #e7dfe7,
              1px -1px #e7dfe7,
              -1px 1px #e7dfe7,
              0 -2px #9c9a9c,
              -2px 0 #7b757b,
              0 2px #424542;

background: #700e9c;
background: -moz-linear-gradient(top,  #700e9c 0%, #6c1237 100%);
background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#700e9c), color-stop(100%,#6c1237));
background: -webkit-linear-gradient(top,  #700e9c 0%,#6c1237 100%);
background: -o-linear-gradient(top,  #700e9c 0%,#6c1237 100%);
background: -ms-linear-gradient(top,  #700e9c 0%,#6c1237 100%);
background: linear-gradient(to bottom,  #700e9c 0%,#6c1237 100%);
filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#700e9c', endColorstr='#6c1237',GradientType=0 );


-webkit-border-radius: 7px;
-moz-border-radius: 7px;
border-radius: 10px;
`

export const ButtonOutlined = styled(Base)`
  border: 1px solid ${({ theme }) => theme.bg2};
  background-color: transparent;
  color: ${({ theme }) => theme.text1};

  &:focus {
    box-shadow: 0 0 0 1px ${({ theme }) => theme.bg4};
  }
  &:hover {
    box-shadow: 0 0 0 1px ${({ theme }) => theme.bg4};
  }
  &:active {
    box-shadow: 0 0 0 1px ${({ theme }) => theme.bg4};
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
border: solid 1px #424542;
  box-shadow: 1px 1px #e7dfe7,
              -1px -1px #e7dfe7,
              1px -1px #e7dfe7,
              -1px 1px #e7dfe7,
              0 -2px #9c9a9c,
              -2px 0 #7b757b,
              0 2px #424542;

background: #700e9c;
background: -moz-linear-gradient(top,  #700e9c 0%, #6c1237 100%);
background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#700e9c), color-stop(100%,#6c1237));
background: -webkit-linear-gradient(top,  #700e9c 0%,#6c1237 100%);
background: -o-linear-gradient(top,  #700e9c 0%,#6c1237 100%);
background: -ms-linear-gradient(top,  #700e9c 0%,#6c1237 100%);
background: linear-gradient(to bottom,  #700e9c 0%,#6c1237 100%);
filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#700e9c', endColorstr='#6c1237',GradientType=0 );


-webkit-border-radius: 7px;
-moz-border-radius: 7px;
border-radius: 10px;
`

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
