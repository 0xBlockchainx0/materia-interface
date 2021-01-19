import React, { useMemo } from 'react'
import sky from '../assets/images/sky.png'
import skyWhite from '../assets/images/sky-white.png'
import { NavLink } from 'react-router-dom'
import styled, {
  ThemeProvider as StyledComponentsThemeProvider,
  createGlobalStyle,
  css,
  DefaultTheme
} from 'styled-components'
import { useIsClassicMode, useIsDarkMode } from '../state/user/hooks'
import { Text, TextProps } from 'rebass'
import { Colors } from './styled'
import tokenbackgroundDark from '../assets/images/token-background.png'
import tokenbackgroundLight from '../assets/images/token-background-light.png'
import tokenbackgroundClassic from '../assets/images/token-background-classic.png'
import swapButtonBgDark from '../assets/images/button-background.png'
import swapButtonBgLight from '../assets/images/button-background-light.png'

export * from './components'

const MEDIA_WIDTHS = {
  upToExtraSmall: 500,
  upToSmall: 720,
  upToMedium: 960,
  upToLarge: 1280
}

const mediaWidthTemplates: { [width in keyof typeof MEDIA_WIDTHS]: typeof css } = Object.keys(MEDIA_WIDTHS).reduce(
  (accumulator, size) => {
    ; (accumulator as any)[size] = (a: any, b: any, c: any) => css`
      @media (max-width: ${(MEDIA_WIDTHS as any)[size]}px) {
        ${css(a, b, c)}
      }
    `
    return accumulator
  },
  {}
) as any

const white = '#FFFFFF'
const black = '#000000'

export function colors(darkMode: boolean, classicMode: boolean): Colors {
  return {
    // base
    white,
    black,
    placeholderColor: classicMode ? '#000000' : darkMode ? '#FFFFFF' : '#000000',

    // text
    text1: classicMode ? '#FFFFFF' : darkMode ? '#FFFFFF' : '#000000',
    text2: classicMode ? '#C3C5CB' : darkMode ? '#C3C5CB' : '#565A69',
    text3: classicMode ? '#6C7284' : darkMode ? '#6C7284' : '#888D9B',
    text4: classicMode ? '#565A69' : darkMode ? '#565A69' : '#C3C5CB',
    text5: classicMode ? '#2C2F36' : darkMode ? '#2C2F36' : '#EDEEF2',

    // backgrounds / greys
    bg1: classicMode ? '#212429' : darkMode ? '#212429' : '#FFFFFF',
    bg2: classicMode ? '#001835' : darkMode ? '#001835' : '#F7F8FA',
    bg3: classicMode ? '#40444F' : darkMode ? '#40444F' : '#EDEEF2',
    bg4: classicMode ? '#565A69' : darkMode ? '#565A69' : '#CED0D9',
    bg5: classicMode ? '#6C7284' : darkMode ? '#6C7284' : '#888D9B',
    bg6: classicMode ? '#1a1a1a' : darkMode ? "#1a1a1a" : "#1a1a1a",
    bg7: classicMode ? '#002852' : darkMode ? "#002852" : "#002852",
    bg8: classicMode ? 'rgb(0, 0, 0, 0.5)' : darkMode ? "rgb(0, 0, 0, 0.8)" : "rgb(255, 255, 255, 0.5)",

    //specialty colors
    modalBG: classicMode ? 'rgba(0,0,0,.425)' : darkMode ? 'rgba(0,0,0,.425)' : 'rgba(0,0,0,0.3)',
    advancedBG: classicMode ? 'rgba(0,0,0,0.1)' : darkMode ? 'rgba(0,0,0,0.1)' : 'rgba(239,241,244)',

    //border
    border1: classicMode ? '#1e9de3' : darkMode ? '#1e9de3' : '#9cd0f5',

    //primary colors
    primary1: classicMode ? '#2172E5' : darkMode ? '#2172E5' : '#ff007a',
    primary2: classicMode ? '#3680E7' : darkMode ? '#3680E7' : '#FF8CC3',
    primary3: classicMode ? '#4D8FEA' : darkMode ? '#4D8FEA' : '#FF99C9',
    primary4: classicMode ? '#376bad70' : darkMode ? '#376bad70' : '#F6DDE8',
    primary5: classicMode ? '#153d6f70' : darkMode ? '#153d6f70' : '#FDEAF1',

    // color text
    primaryText1: classicMode ? '#6da8ff' : darkMode ? '#6da8ff' : '#ff007a',

    // secondary colors
    secondary1: classicMode ? '#2172E5' : darkMode ? '#2172E5' : '#ff007a',
    secondary2: classicMode ? '#17000b26' : darkMode ? '#17000b26' : '#F6DDE8',
    secondary3: classicMode ? '#17000b26' : darkMode ? '#17000b26' : '#FDEAF1',

    // custom
    buttonMateriaPrimaryBackgroundFirstColor: classicMode ? 'rgba(1, 0, 6, 0.8)' : darkMode ? 'rgba(1, 0, 6, 0.8)' : 'rgba(1, 0, 6, 0.8)',
    buttonMateriaPrimaryBackgroundSecondColor: classicMode ? 'rgba(0, 23, 67, 0.5)' : darkMode ? 'rgba(0, 23, 67, 0.5)' : 'rgba(0, 23, 67, 0.5)',
    buttonMateriaPrimaryBackgroundHoverFirstColor: classicMode ? 'rgba(28, 155, 224, 0.8)' : darkMode ? 'rgba(28, 155, 224, 0.8)' : 'rgba(28, 155, 224, 0.8)',
    buttonMateriaPrimaryBackgroundHoverSecondColor: classicMode ? 'rgba(28, 155, 224, 0.8)' : darkMode ? 'rgba(28, 155, 224, 0.8)' : 'rgba(28, 155, 224, 0.8)',
    buttonMateriaPrimaryBorderColor: classicMode ? '#054fa4' : darkMode ? '#054fa4' : '#054fa4',
    buttonMateriaPrimaryHoverBorderColor: classicMode ? '#26aff3' : darkMode ? '#26aff3' : '#26aff3',
    buttonMateriaPrimaryTextColor: classicMode ? '#ffffff' : darkMode ? '#ffffff' : '#ffffff',
    buttonMateriaErrorBackgroundFirstColor: classicMode ? 'rgba(251, 62, 73, 0.8)' : darkMode ? 'rgba(251, 62, 73, 0.8)' : 'rgba(251, 62, 73, 0.8)',
    buttonMateriaErrorBackgroundSecondColor: classicMode ? 'rgba(226, 9, 22, 0.8)' : darkMode ? 'rgba(226, 9, 22, 0.8)' : 'rgba(226, 9, 22, 0.8)',
    buttonMateriaErrorBackgroundHoverFirstColor: classicMode ? 'rgba(247, 97, 106, 0.8)' : darkMode ? 'rgba(247, 97, 106, 0.8)' : 'rgba(247, 97, 106, 0.8)',
    buttonMateriaErrorBackgroundHoverSecondColor: classicMode ? 'rgba(247, 44, 56, 0.8)' : darkMode ? 'rgba(247, 44, 56, 0.8)' : 'rgba(247, 44, 56, 0.8)',
    buttonMateriaErrorBorderColor: classicMode ? '#e43843' : darkMode ? '#e43843' : '#e43843',
    buttonMateriaErrorHoverBorderColor: classicMode ? '#f9c4c7' : darkMode ? '#f9c4c7' : '#f9c4c7',

    // other
    red1: '#FF6871',
    red2: '#F82D3A',
    green1: '#27AE60',
    yellow1: '#FFE270',
    yellow2: '#F3841E',
    blue1: '#2172E5',
    blue2: '#1671BB',
    cyan1: '#2f9ab8',
    cyan2: '#1992d3',
    grey: '#999999',
    transparent: 'transparent',
    
    // dont wanna forget these blue yet
    // blue4: darkMode ? '#153d6f70' : '#C4D9F8',
    // blue5: darkMode ? '#153d6f70' : '#EBF4FF',
  }
}

export function theme(darkMode: boolean, classicMode: boolean): DefaultTheme {
  return {
    ...colors(darkMode, classicMode),

    name: classicMode ? 'classic' : darkMode ? 'dark' : 'light',

    grids: {
      sm: 8,
      md: 12,
      lg: 24
    },

    //shadows
    shadow1: darkMode ? '#000' : '#2F80ED',

    // media queries
    mediaWidth: mediaWidthTemplates,

    // css snippets
    flexColumnNoWrap: css`
      display: flex;
      flex-flow: column nowrap;
    `,
    flexRowNoWrap: css`
      display: flex;
      flex-flow: row nowrap;
    `,

    bodyBackground: 
    classicMode ?
    css`
      background: linear-gradient(rgba(0,0,0,.9), rgba(0,0,0,.9));
    `:
    darkMode ? css`
      background: linear-gradient(rgba(0,0,0,.1), rgba(0,0,0,.1)), url(${sky}) no-repeat fixed top;
    `:
      css`
      background: linear-gradient(rgba(255,255,255,.1), rgba(255,255,255,.1)), url(${skyWhite}) no-repeat fixed top;
    `,

    bodyWrapperBackground:
      classicMode ?
        css`
    border: solid 1px #424542;
    box-shadow: 1px 1px #e7dfe7, -1px -1px #e7dfe7, 1px -1px #e7dfe7, -1px 1px #e7dfe7, 0 -2px #9c9a9c, -2px 0 #7b757b,
      0 2px #424542;
    background: #04009d;
    background: -moz-linear-gradient(top, #04009d 0%, #06004d 100%);
    background: -webkit-gradient(linear, left top, left bottom, color-stop(0%, #04009d), color-stop(100%, #06004d));
    background: -webkit-linear-gradient(top, #04009d 0%, #06004d 100%);
    background: -o-linear-gradient(top, #04009d 0%, #06004d 100%);
    background: -ms-linear-gradient(top, #04009d 0%, #06004d 100%);
    background: linear-gradient(to bottom, #04009d 0%, #06004d 100%);
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#04009d', endColorstr='#06004d',GradientType=0 );
  `:
        darkMode ? css`
        background: linear-gradient(-45deg, rgba(12,20,38, 0.9), rgba(25,101,208, 0.6)); 
        filter: progid:DXImageTransform.Microsoft.gradient(startColorstr="#0c1426",endColorstr="#1965d0",GradientType=1);    `
          :
          css`
    background: rgb(156,208,245, 0.7);
    background: -moz-linear-gradient(168deg, rgba(156,208,245,1) 0%, rgba(156,208,245,1) 100%);
    background: -webkit-linear-gradient(168deg, rgba(156,208,245,1) 0%, rgba(156,208,245,1) 100%);
    background: linear-gradient(168deg, rgba(156,208,245,1) 0%, rgba(156,208,245,1) 100%);
    `,

    styledBoxBorder: 
    classicMode ?
    css`
      border: 0px;
    `:
    darkMode ? css`
      border: 1px solid #1e9de3;
    `:
      css`
      border: 1px solid #9cd0f5;
    `,

    backgroundContainer: 
    classicMode ?
    css`
    border: solid 1px #424542;
    border-radius: 7px;
    box-shadow: 1px 1px #e7dfe7, -1px -1px #e7dfe7, 1px -1px #e7dfe7, -1px 1px #e7dfe7, 0 -2px #9c9a9c, -2px 0 #7b757b,
      0 2px #424542;
    background: #04009d;
    background: -moz-linear-gradient(top, #04009d 0%, #06004d 100%);
    background: -webkit-gradient(linear, left top, left bottom, color-stop(0%, #04009d), color-stop(100%, #06004d));
    background: -webkit-linear-gradient(top, #04009d 0%, #06004d 100%);
    background: -o-linear-gradient(top, #04009d 0%, #06004d 100%);
    background: -ms-linear-gradient(top, #04009d 0%, #06004d 100%);
    background: linear-gradient(to bottom, #04009d 0%, #06004d 100%);
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#04009d', endColorstr='#06004d',GradientType=0 );
    `:
    darkMode ? css`
    background: linear-gradient(180deg, rgba(35, 102, 180, 0.8), rgba(14, 22, 42, 0.4));
    `:
      css`
        background: linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 100%);
    `,

    backgroundContainer2: 
    classicMode ? css`
    background: linear-gradient(180deg, rgba(0, 27, 49, 0.5) 0%, rgba(0, 27, 49, 0.5) 100%);
    `:
    darkMode ? css`
    background: linear-gradient(90deg, rgba(0, 27, 49, 0.3) 0%, rgba(0, 27, 49, 0.5) 100%);
    `:
      css`
        background: linear-gradient(180deg, rgba(211,221,250) 0%, rgba(211,221,250) 100%);
    `,
    backgroundContainer3: 
    classicMode ? css`
    background: linear-gradient(180deg, rgba(0,77,161,1) 0%, rgba(5,30,64,1) 100%);
    `:
    darkMode ? css`
    background: linear-gradient(180deg, rgba(0,77,161,1) 0%, rgba(5,30,64,1) 100%);
    `:
      css`
        background: linear-gradient(180deg, rgba(239,241,244) 0%, rgba(239,241,244) 100%);
    `,
    tokenBackground: 
    classicMode ? 
    'url(' + tokenbackgroundClassic + ') no-repeat' :
    darkMode ? 'url(' + tokenbackgroundDark + ') no-repeat' : 'url(' + tokenbackgroundLight + ') no-repeat',

    swapButtonBg: 
    darkMode ?
      css`background-image:url(${swapButtonBgDark})` :
      css`background-image:url(${swapButtonBgLight})`,

    swapButtonSrc: darkMode ? swapButtonBgDark : swapButtonBgLight,

    advancedDetailsFooter: classicMode ? css`
    border: solid 1px #424542;
    box-shadow: 1px 1px #e7dfe7, -1px -1px #e7dfe7, 1px -1px #e7dfe7, -1px 1px #e7dfe7, 0 -2px #9c9a9c, -2px 0 #7b757b,
      0 2px #424542;
    padding: 1rem;
    background: #700e9c;
    background: -moz-linear-gradient(top, #700e9c 0%, #6c1237 100%);
    background: -webkit-gradient(linear, left top, left bottom, color-stop(0%, #700e9c), color-stop(100%, #6c1237));
    background: -webkit-linear-gradient(top, #700e9c 0%, #6c1237 100%);
    background: -o-linear-gradient(top, #700e9c 0%, #6c1237 100%);
    background: -ms-linear-gradient(top, #700e9c 0%, #6c1237 100%);
    background: linear-gradient(to bottom, #700e9c 0%, #6c1237 100%);
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#700e9c', endColorstr='#6c1237',GradientType=0 );
    border-radius: 7px;
    `
    :css`
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden; 
    `
  }
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const darkMode = useIsDarkMode()
  const classicMode = useIsClassicMode()

  const themeObject = useMemo(() => theme(darkMode, classicMode), [darkMode, classicMode])

  return <StyledComponentsThemeProvider theme={themeObject}>{children}</StyledComponentsThemeProvider>
}

const TextWrapper = styled(Text) <{ color: keyof Colors }>`
  color: ${({ color, theme }) => (theme as any)[color]};
`
export const TYPE = {
  main(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'text2'} {...props} />
  },
  link(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'primary1'} {...props} />
  },
  black(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'text1'} {...props} />
  },
  white(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'text1'} {...props} />
  },
  body(props: TextProps) {
    return <TextWrapper fontWeight={400} fontSize={16} color={'text1'} {...props} />
  },
  largeHeader(props: TextProps) {
    return <TextWrapper fontWeight={600} fontSize={24} {...props} />
  },
  mediumHeader(props: TextProps) {
    return <TextWrapper fontWeight={500} fontSize={20} {...props} />
  },
  subHeader(props: TextProps) {
    return <TextWrapper fontWeight={400} fontSize={14} {...props} />
  },
  small(props: TextProps) {
    return <TextWrapper fontWeight={500} fontSize={11} {...props} />
  },
  blue(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'primary1'} {...props} />
  },
  yellow(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'yellow1'} {...props} />
  },
  darkGray(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'text3'} {...props} />
  },
  gray(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'bg3'} {...props} />
  },
  italic(props: TextProps) {
    return <TextWrapper fontWeight={500} fontSize={12} fontStyle={'italic'} color={'text2'} {...props} />
  },
  error({ error, ...props }: { error: boolean } & TextProps) {
    return <TextWrapper fontWeight={500} color={error ? 'red1' : 'text2'} {...props} />
  }
}

export const FixedGlobalStyle = createGlobalStyle`
html, input, textarea, button { font-family: 'Inter', sans-serif; font-display: fallback; }
@supports (font-variation-settings: normal) {
  html, input, textarea, button {
    font-family: 'Inter var', sans-serif;
  }
}

html, body { margin: 0; padding: 0; }
a { color: ${colors(false, false).blue1}; }
* { box-sizing: border-box; }
button { user-select: none; }

html {
  font-size: 16px;
  font-variant: none;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  font-feature-settings: 'ss01' on, 'ss02' on, 'cv01' on, 'cv03' on;  
}

.wrapASBlock { margin: 5px 0px 5px 0px }
.wrapASBlock div.clearfix { clear: both; }
.wrapASBlock > div { float: left; }
.wrapASBlock > div + div { float: right; }
.wrapASBlock > div:first-child { padding-top: 10px }

.swapCaption { text-align: center; margin-top: 20px; width: 100%; text-shadow: 1px 1px #111111; }

`
export const ThemedGlobalStyle = createGlobalStyle`
html {
  color: ${({ theme }) => theme.text1};
  background-color: ${({ theme }) => theme.bg2};
}

body {
  min-height: 100vh;
  background-position: 0 -30vh;
  ${({ theme }) => theme.bodyBackground}
  background-blend-mode: luminosity;
  /* also change the blend mode to what suits you, from darken, to other many options as you deem fit */
  background-size: cover;
}

::placeholder { color: ${({ theme }) => theme.placeholderColor}; }
::-webkit-search-decoration { -webkit-appearance: none; }
::-webkit-outer-spin-button, ::-webkit-inner-spin-button { -webkit-appearance: none; }

.margin-auto { margin: auto; }
`
export const FeatureTitle = styled.h2`
  writing-mode: vertical-rl;
  text-orientation: mixed;
  padding:0px;
  margin:0px;
  position: absolute;
  top: 0px;
  left: -20px;
  text-transform: capitalize;
  display: inline-block;
  z-index: 10;
  font-weight: 400;
  padding-top: 15px;
  padding-bottom: 170px;
  overflow: hidden;

  &.dark { color: #9ed9ff; text-shadow: 1px 1px 2px #0f3f73;  }
  &.light { color: #000000; }
  &.classic { color: #FFFFFF; }
  
  &.dark:before, &.light:before {    
    content: "";
    height: 220%;
    display: block;
    left: -29px;
    top: -15px;
    position: relative;
    width: 1px;
    background: linear-gradient(90deg,rgba(129,205,243,0) 0,#81cdf3 25%,#81cdf3 75%,rgba(129,205,243,0));
  }

  &.dark:after, &.light:after {
    content: "";
    height: 370%;
    display: block;
    left: 20px;
    position: relative;
    width: 20px;
    bottom: 115%;
    z-index: -1;
    background: radial-gradient(ellipse at left,#0d95ff 0,rgba(13,149,255,0) 50%);
  }
  
  @media (max-width: 600px) { display: none; }
`
export const SectionTitle = styled.h6 `
  &.dark {
    color: #ffffff;
    padding: 7px 32% 7px 10px;
    background: linear-gradient(to right, rgb(15, 63, 115) 50%, rgba(149, 225, 255, 0) 100%);
    border-left: 1px solid #95e1ff;
    box-shadow: -5px 0 5px -3px #95e1ff;
  }

  &.light {
    color: #000000;
    padding: 7px 32% 7px 10px;
    background: transparent;
    border-left: none;
  }

  &.dark:before {
    content: " ";
    display: block;
    width: 100.5%;
    height: 1px;
    position: absolute;
    top: 0px;
    left: 0px;
    background: linear-gradient(to right, #95e1ff 0%, rgba(15,63,115,0));
  }

  &.dark:after {
    content: " ";
    display: block;
    width: 100%;
    height: 1px;
    position: absolute;
    bottom: -1px;
    left: 0px;
    background: linear-gradient(to right, #95e1ff 0%, rgba(15,63,115,0));
  }

  font-weight: 400;
  font-size: 15px;
  position: relative;
  display: inline-block;
  margin: 0px 0px 10px 0px;
  text-transform: uppercase;
`
export const InventoryItemContainer = styled.div`
  padding: 1rem; 
  margin-bottom: 0.15rem;
  width: 100%;
  height: auto;
  background-size: cover;
  position: relative;
  font-weight: 500;
  font-size: 15px;
  color: ${({ theme }) => theme.text1};

  &.dark {
    background: linear-gradient(90deg, rgba(0,27,49,0.0) 0%, rgba(0,27,49,0.5) 100%);
    text-shadow: 1px 1px #000;
  }

  &.dark:after {
    content: " ";
    display: block;
    position: absolute;
    width: 1px;
    height: 94%;
    top: 3%;
    left: 1px;
    background-color: #95e1ff;
  }

  &.light {
    background: linear-gradient(180deg, rgba(211,221,250) 0%, rgba(211,221,250) 100%);
  }

  &.classic {
    background: linear-gradient(180deg, rgba(0, 27, 49, 0.5) 0%, rgba(0, 27, 49, 0.5) 100%);
  }

  & .balanceRow {
    display: inline-flex;
    margin: 5px 0px;
    font-size: 12px;
  }

  & .balanceRow > div:first-child {
    margin-right: 5px;
  }

  &.dark .balanceRow > div:first-child {
    color: #95e1ff;
  }

  &.light .balanceRow > div:first-child,
  &.classic .balanceRow > div:first-child, {
    color: #1671BB;
  }

  & .tokenType {
    margin: 5px 0px 5px 10px;
    display: inline-block;
  }
`
export const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 80% auto;
`
export const InventoryItemIcon = styled.div`
  width: 8px;
  height: 8px;
  border: solid 1px;
  rotate: 45deg;

  &.dark { background-color: #2172e5; border-color: #53ade6; box-shadow: 1px 0px 4px #95e1ff; }
  &.light { border-color: #FF6871; }
  &.classic {}
`
export const SwapMenu = styled.div`
  display: table;
  width: 100%;
  margin-bottom: 10px;

  &.dark { }
  &.light {}
  &.classic {}

  &.dark:before, &.light:before {    
    content: "";
    width: 100%;
    display: block;
    left: 0;
    position: relative;
    height: 1px;
    bottom: -43px;
    background: linear-gradient(90deg,rgba(129,205,243,0) 0,#81cdf3 25%, #81cdf3 75%, rgba(129,205,243,0));
  }
  
  &.dark:after, &.light:after {
    content: "";
    width: 100%;
    display: block;
    left: 0;
    position: relative;
    height: 44px;
    bottom: 0px;
    z-index: -1;
    background: radial-gradient(ellipse at bottom,#0d95ff 0,rgba(13,149,255,0) 60%);
    @media (max-width: 375px) { height: 50px; }
  }

  & > a { display: block; float: left; }
`
export const SwapMenuItem = styled.div<{ active?: boolean }>`
  padding-right: 1rem;
  opacity: ${({ active }) => (active ? '1' : '0.4')};
`
export const StyledNavLinkActiveClassName = 'active'
export const StyledNavLink = styled(NavLink).attrs({ StyledNavLinkActiveClassName })`
  display: flex;
  flex-flow: row nowrap;
  align-items: left;
  //border-radius: 3rem;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  font-size: 1rem;
  width: fit-content;
  margin: 0 12px;
  font-weight: 500;

  &.dark { color: #95e1ff; }
  &.light { color: #565A69 }
  &.classic { color: #C3C5CB; }

  &.${StyledNavLinkActiveClassName} { font-weight: 600; }

  &.dark.${StyledNavLinkActiveClassName} { color: #95e1ff; }
  &.light.${StyledNavLinkActiveClassName} { color: #2f9ab8; }
  &.classic.${StyledNavLinkActiveClassName} { color: #2f9ab8; }

  &.dark:hover, &.dark:focus { color: #e6f2f7; }
  &.light:hover, &.light:focus { }
  &.classic:hover, &.classic:focus { }

  &.dark.disabled, &.light.disabled, &.classic.disabled { opacity: 0.5; color: #C3C5CB; }

  &.dark.disabled:hover, &.dark.disabled:focus,
  &.light.disabled:hover, &.light.disabled:focus,
  &.classic.disabled:hover, &.classic.disabled:focus { opacity: 0.7; }
`
export const CurrencyFormPanel = styled.div<{ hideInput?: boolean }>`
  display: flex;
  flex-flow: column nowrap;
  position: relative;
  //border-radius: ${({ hideInput }) => (hideInput ? '8px' : '20px')};
  z-index: 1;

  & > .itemsContainer { 
    border-radius: ${({ hideInput }) => (hideInput ? '8px' : '20px')};
    // border: 1px solid ${({ theme }) => theme.bg2};
    // background-color: ${({ theme }) => theme.bg1};
  }

  & > .itemsContainer .labelRow {
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    color: ${({ theme }) => theme.text1};
    font-size: 0.75rem;
    line-height: 1rem;
    padding: 0.75rem 1rem 0 1rem;    
  }

  & > .itemsContainer .labelRow span:hover { cursor: pointer; }

  & > .itemsContainer .label { font-weight: 400; font-size: 14px; display: inline; }
  & > .itemsContainer .label.link { cursor: pointer; }

  &.dark > .itemsContainer .label { color: #95e1ff; text-shadow: 1px 1px #000; }
  &.light > .itemsContainer .label { text-shadow: 1px 1px #053472; }
  &.classic > .itemsContainer .label {}
`
export const SettingsMenuFlyout = styled.span`
  min-width: 20.125rem;
  display: flex;
  flex-direction: column;
  font-size: 1rem;
  position: absolute;
  top: -21rem;
  right: 1rem;
  z-index: 100;
  
  &.dark {
    background-color: rgba(0, 24, 53, 0.8);
    box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),0px 24px 32px rgba(0, 0, 0, 0.01);
    border-radius: 5px;
    border: solid 1px #2f9ab8;
  }
  &.light {
    background-color: rgba(247, 248, 250, 0.8);
  }
  &.classic {
    background-color: rgba(0,24, 53, 0.8);
  }

  ${({ theme }) => theme.mediaWidth.upToExtraSmall` min-width: 18.125rem; right: -46px; `};
  ${({ theme }) => theme.mediaWidth.upToMedium` min-width: 18.125rem; top: -22rem; right: 2rem; @media (max-width: 960px) { top: -19.5rem; } `};

  & .sectionHeader { font-weight: 400; font-size: 14px; }
  & .sectionOption { font-weight: 400; font-size: 14px; }

  &.dark .sectionOption { color: #C3C5CB; }
  &.light .sectionOption { color: #565A69; }
  &.classic .sectionOption { color: #C3C5CB; }
`
const SettingsMenuOptionBase = styled.button`
  align-items: center;
  height: 2rem;
  border-radius: 2rem;
  width: auto;
  min-width: 3.5rem;
  outline: none;
  background-color: transparent;
  border: solid 1px;

  &:hover, &:focus {}

  &.dark { border-color: #2f9ab8; color: #ffffff; }
  &.light {}
  &.classic {}

  &.dark:hover, &.dark:focus { border-color: #95e1ff; background-color: #1a1a1a; }

  &.light:hover, &.light:focus { background-color: #1a1a1a; }
  &.classic:hover, &.classic:focus { background-color: #1a1a1a; }
`

export const SettingsMenuOption = styled(SettingsMenuOptionBase)<{ active: boolean }>`
  margin-right: 8px;

  &.dark { background-color: ${({ active, theme }) => active && theme.bg6}; }

  &.light {}
  &.classic {}
`
export const SettingsMenuCustomOption = styled(SettingsMenuOptionBase)<{ active?: boolean; warning?: boolean }>`
  height: 2rem;
  position: relative;
  padding: 0 0.75rem;
  flex: 1;
  border: ${({ theme, active, warning }) => active && `1px solid ${warning ? theme.red1 : theme.primary1}`};  
  :hover {
    border: ${({ theme, active, warning }) => active && `1px solid ${warning ? theme.red1 : theme.primary1 }`};
  }

  & input { 
    width: 80%; 
    height: 100%; 
    border: none; 
    background-color: transparent;
    outline: none; 
    text-align: right; 
  }

  &.dark input { color: #ffffff; }
`
export const SettingsMenuCustomOptionInput = styled.input`
  color: ${({ theme, color }) => (color === 'red' ? theme.red1 : theme.text1)};
`
export const ToggleButton = styled(SettingsMenuOptionBase)<{ isActive?: boolean; activeElement?: boolean }>`
  width: fit-content;
  cursor: pointer;
  outline: none;
  padding: 0;  

  &.dark { background: ${({ theme }) => theme.bg6}; }

  &.light {}
  &.classic {}
`
export const ToggleButtonElement = styled.span<{ isActive?: boolean; isOnSwitch?: boolean }>`
  border-radius: 2rem;
  padding: 0.35rem 0.6rem;
  background: ${({ theme, isActive, isOnSwitch }) => (isActive ? (isOnSwitch ? theme.bg7 : theme.text4) : 'none')};
  font-weight: 400;
  :hover {
    user-select: ${({ isOnSwitch }) => (isOnSwitch ? 'none' : 'initial')};
    
  }

  &.dark { 
    color: #ffffff;
    background: ${({ theme, isActive, isOnSwitch }) => (isActive ? (isOnSwitch ? '#002852' : '#565A69') : 'none')};
  }
  &.light {
    background: ${({ theme, isActive, isOnSwitch }) => (isActive ? (isOnSwitch ? '#002852' : '#C3C5CB') : 'none')};
  }
  &.classic {
    background: ${({ theme, isActive, isOnSwitch }) => (isActive ? (isOnSwitch ? '#002852' : '#565A69') : 'none')};
  }

  &.dark:hover {
    background: ${({ theme, isActive, isOnSwitch }) => (isActive ? (isOnSwitch ? '#002852' : '#565A69') : 'none')}
    color: ${({ theme, isActive, isOnSwitch }) => (isActive ? (isOnSwitch ? '' : '#C3C5CB') : theme.text3)};
  }

  &.light:hover {
    background: ${({ theme, isActive, isOnSwitch }) => (isActive ? (isOnSwitch ? '#002852' : '#565A69') : 'none')}
    color: ${({ theme, isActive, isOnSwitch }) => (isActive ? (isOnSwitch ? '' : '#565A69') : theme.text3)};
  }

  &.classic:hover {
    background: ${({ theme, isActive, isOnSwitch }) => (isActive ? (isOnSwitch ? '#002852' : '#565A69') : 'none')}
    color: ${({ theme, isActive, isOnSwitch }) => (isActive ? (isOnSwitch ? '' : '#C3C5CB') : theme.text3)};
  }
`