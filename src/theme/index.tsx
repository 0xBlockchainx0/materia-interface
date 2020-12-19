import React, { useMemo } from 'react'
import sky from '../assets/images/sky.png'
import skyWhite from '../assets/images/sky-white.png'
import styled, {
  ThemeProvider as StyledComponentsThemeProvider,
  createGlobalStyle,
  css,
  DefaultTheme
} from 'styled-components'
import { useIsClassicMode, useIsDarkMode } from '../state/user/hooks'
import { Text, TextProps } from 'rebass'
import { Colors } from './styled'
import { GreyCard } from '../components/Card'
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

    // text
    text1: darkMode ? '#FFFFFF' : '#000000',
    text2: darkMode ? '#C3C5CB' : '#565A69',
    text3: darkMode ? '#6C7284' : '#888D9B',
    text4: darkMode ? '#565A69' : '#C3C5CB',
    text5: darkMode ? '#2C2F36' : '#EDEEF2',

    // backgrounds / greys
    bg1: darkMode ? '#212429' : '#FFFFFF',
    bg2: darkMode ? '#001835' : '#F7F8FA',
    bg3: darkMode ? '#40444F' : '#EDEEF2',
    bg4: darkMode ? '#565A69' : '#CED0D9',
    bg5: darkMode ? '#6C7284' : '#888D9B',
    bg6: darkMode ? "#1a1a1a" : "#1a1a1a",
    bg7: darkMode ? "#002852" : "#002852",
    bg8: darkMode ? "#010006" : "rgb(255, 255, 255, 0.5)",

    //specialty colors
    modalBG: darkMode ? 'rgba(0,0,0,.425)' : 'rgba(0,0,0,0.3)',
    advancedBG: darkMode ? 'rgba(0,0,0,0.1)' : 'rgba(239,241,244)',

    //border
    border1: darkMode ? '#1e9de3' : '#9cd0f5',

    //primary colors
    primary1: darkMode ? '#2172E5' : '#ff007a',
    primary2: darkMode ? '#3680E7' : '#FF8CC3',
    primary3: darkMode ? '#4D8FEA' : '#FF99C9',
    primary4: darkMode ? '#376bad70' : '#F6DDE8',
    primary5: darkMode ? '#153d6f70' : '#FDEAF1',

    // color text
    primaryText1: darkMode ? '#6da8ff' : '#ff007a',

    // secondary colors
    secondary1: darkMode ? '#2172E5' : '#ff007a',
    secondary2: darkMode ? '#17000b26' : '#F6DDE8',
    secondary3: darkMode ? '#17000b26' : '#FDEAF1',

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
    buttonMateriaPrimaryBackgroundFirstColor: 'rgba(1, 0, 6, 0.8)',
    buttonMateriaPrimaryBackgroundSecondColor: 'rgba(0, 23, 67, 0.5)',
    buttonMateriaPrimaryBackgroundHoverFirstColor: 'rgba(28, 155, 224, 0.8)',
    buttonMateriaPrimaryBackgroundHoverSecondColor: 'rgba(1, 43, 119, 0.5)',
    buttonMateriaPrimaryBorderColor: '#054fa4',
    buttonMateriaPrimaryHoverBorderColor: '#26aff3',
    buttonMateriaPrimaryTextColor: '#ffffff',
    buttonMateriaErrorBackgroundFirstColor: 'rgba(251, 62, 73, 0.8)',
    buttonMateriaErrorBackgroundSecondColor: 'rgba(226, 9, 22, 0.8)',
    buttonMateriaErrorBackgroundHoverFirstColor: 'rgba(247, 97, 106, 0.8)',
    buttonMateriaErrorBackgroundHoverSecondColor: 'rgba(247, 44, 56, 0.8)',
    buttonMateriaErrorBorderColor: '#e43843',
    buttonMateriaErrorHoverBorderColor: '#f9c4c7'

    // dont wanna forget these blue yet
    // blue4: darkMode ? '#153d6f70' : '#C4D9F8',
    // blue5: darkMode ? '#153d6f70' : '#EBF4FF',
  }
}

export function theme(darkMode: boolean, classicMode: boolean): DefaultTheme {
  return {
    ...colors(darkMode, classicMode),

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
        background: linear-gradient(-45deg, rgba(12,20,38, 0.8), rgba(25,101,208, 0.5)); 
        filter: progid:DXImageTransform.Microsoft.gradient(startColorstr="#0c1426",endColorstr="#1965d0",GradientType=1);    `
          :
          css`
    background: rgb(156,208,245, 0.7);
    background: -moz-linear-gradient(168deg, rgba(156,208,245,1) 0%, rgba(156,208,245,1) 100%);
    background: -webkit-linear-gradient(168deg, rgba(156,208,245,1) 0%, rgba(156,208,245,1) 100%);
    background: linear-gradient(168deg, rgba(156,208,245,1) 0%, rgba(156,208,245,1) 100%);
    `,

    styledBoxBorder: darkMode ? css`
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
    background: linear-gradient(180deg, rgba(35, 102, 180, 0.7), rgba(14, 22, 42, 0.2));
    `:
      css`
        background: linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 100%);
    `,

    backgroundContainer2: darkMode ? css`
    background: linear-gradient(180deg, rgba(0, 27, 49, 0.5) 0%, rgba(0, 27, 49, 0.5) 100%);
    `:
      css`
        background: linear-gradient(180deg, rgba(211,221,250) 0%, rgba(211,221,250) 100%);
    `,
    backgroundContainer3: darkMode ? css`
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
html, input, textarea, button {
  font-family: 'Inter', sans-serif;
  font-display: fallback;
}
@supports (font-variation-settings: normal) {
  html, input, textarea, button {
    font-family: 'Inter var', sans-serif;
  }
}

html,
body {
  margin: 0;
  padding: 0;
}

 a {
   color: ${colors(false, false).blue1}; 
 }

* {
  box-sizing: border-box;
}

button {
  user-select: none;
}

html {
  font-size: 16px;
  font-variant: none;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  font-feature-settings: 'ss01' on, 'ss02' on, 'cv01' on, 'cv03' on;  
}

/******** TokenSphereBox ******/
.wrap {
  position: relative;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  transform-style: preserve-3d;
  perspective: 1000px;
  animation: rotate 14s infinite linear;
}

@keyframes rotate {
  100% {
    transform: rotateY(360deg) rotateX(360deg);
  }
}
.c {
  position: absolute;
  width: 3px;
  height: 3px;
  border-radius: 50%;
  opacity: 0;
}

.c:nth-child(1) {
  animation: orbit1 14s infinite;
  animation-delay: 0.01s;
  background-color: #a6a6a6;
}

@keyframes orbit1 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-97deg) rotateY(47deg) translateX(100px) rotateZ(97deg);
  }
  80% {
    transform: rotateZ(-97deg) rotateY(47deg) translateX(100px) rotateZ(97deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-97deg) rotateY(47deg) translateX(300px) rotateZ(97deg);
  }
}
.c:nth-child(2) {
  animation: orbit2 14s infinite;
  animation-delay: 0.02s;
  background-color: #a6a6a6;
}

@keyframes orbit2 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-241deg) rotateY(141deg) translateX(100px) rotateZ(241deg);
  }
  80% {
    transform: rotateZ(-241deg) rotateY(141deg) translateX(100px) rotateZ(241deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-241deg) rotateY(141deg) translateX(300px) rotateZ(241deg);
  }
}
.c:nth-child(3) {
  animation: orbit3 14s infinite;
  animation-delay: 0.03s;
  background-color: #a5a6a6;
}

@keyframes orbit3 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-66deg) rotateY(227deg) translateX(100px) rotateZ(66deg);
  }
  80% {
    transform: rotateZ(-66deg) rotateY(227deg) translateX(100px) rotateZ(66deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-66deg) rotateY(227deg) translateX(300px) rotateZ(66deg);
  }
}
.c:nth-child(4) {
  animation: orbit4 14s infinite;
  animation-delay: 0.04s;
  background-color: #a5a6a6;
}

@keyframes orbit4 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-258deg) rotateY(114deg) translateX(100px) rotateZ(258deg);
  }
  80% {
    transform: rotateZ(-258deg) rotateY(114deg) translateX(100px) rotateZ(258deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-258deg) rotateY(114deg) translateX(300px) rotateZ(258deg);
  }
}
.c:nth-child(5) {
  animation: orbit5 14s infinite;
  animation-delay: 0.05s;
  background-color: #a5a6a6;
}

@keyframes orbit5 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-249deg) rotateY(122deg) translateX(100px) rotateZ(249deg);
  }
  80% {
    transform: rotateZ(-249deg) rotateY(122deg) translateX(100px) rotateZ(249deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-249deg) rotateY(122deg) translateX(300px) rotateZ(249deg);
  }
}
.c:nth-child(6) {
  animation: orbit6 14s infinite;
  animation-delay: 0.06s;
  background-color: #a5a6a6;
}

@keyframes orbit6 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-208deg) rotateY(34deg) translateX(100px) rotateZ(208deg);
  }
  80% {
    transform: rotateZ(-208deg) rotateY(34deg) translateX(100px) rotateZ(208deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-208deg) rotateY(34deg) translateX(300px) rotateZ(208deg);
  }
}
.c:nth-child(7) {
  animation: orbit7 14s infinite;
  animation-delay: 0.07s;
  background-color: #a5a6a7;
}

@keyframes orbit7 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-355deg) rotateY(337deg) translateX(100px) rotateZ(355deg);
  }
  80% {
    transform: rotateZ(-355deg) rotateY(337deg) translateX(100px) rotateZ(355deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-355deg) rotateY(337deg) translateX(300px) rotateZ(355deg);
  }
}
.c:nth-child(8) {
  animation: orbit8 14s infinite;
  animation-delay: 0.08s;
  background-color: #a5a6a7;
}

@keyframes orbit8 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-243deg) rotateY(76deg) translateX(100px) rotateZ(243deg);
  }
  80% {
    transform: rotateZ(-243deg) rotateY(76deg) translateX(100px) rotateZ(243deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-243deg) rotateY(76deg) translateX(300px) rotateZ(243deg);
  }
}
.c:nth-child(9) {
  animation: orbit9 14s infinite;
  animation-delay: 0.09s;
  background-color: #a5a6a7;
}

@keyframes orbit9 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-335deg) rotateY(134deg) translateX(100px) rotateZ(335deg);
  }
  80% {
    transform: rotateZ(-335deg) rotateY(134deg) translateX(100px) rotateZ(335deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-335deg) rotateY(134deg) translateX(300px) rotateZ(335deg);
  }
}
.c:nth-child(10) {
  animation: orbit10 14s infinite;
  animation-delay: 0.1s;
  background-color: #a5a6a7;
}

@keyframes orbit10 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-61deg) rotateY(159deg) translateX(100px) rotateZ(61deg);
  }
  80% {
    transform: rotateZ(-61deg) rotateY(159deg) translateX(100px) rotateZ(61deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-61deg) rotateY(159deg) translateX(300px) rotateZ(61deg);
  }
}
.c:nth-child(11) {
  animation: orbit11 14s infinite;
  animation-delay: 0.11s;
  background-color: #a4a6a7;
}

@keyframes orbit11 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-220deg) rotateY(102deg) translateX(100px) rotateZ(220deg);
  }
  80% {
    transform: rotateZ(-220deg) rotateY(102deg) translateX(100px) rotateZ(220deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-220deg) rotateY(102deg) translateX(300px) rotateZ(220deg);
  }
}
.c:nth-child(12) {
  animation: orbit12 14s infinite;
  animation-delay: 0.12s;
  background-color: #a4a6a7;
}

@keyframes orbit12 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-157deg) rotateY(66deg) translateX(100px) rotateZ(157deg);
  }
  80% {
    transform: rotateZ(-157deg) rotateY(66deg) translateX(100px) rotateZ(157deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-157deg) rotateY(66deg) translateX(300px) rotateZ(157deg);
  }
}
.c:nth-child(13) {
  animation: orbit13 14s infinite;
  animation-delay: 0.13s;
  background-color: #a4a6a7;
}

@keyframes orbit13 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-12deg) rotateY(192deg) translateX(100px) rotateZ(12deg);
  }
  80% {
    transform: rotateZ(-12deg) rotateY(192deg) translateX(100px) rotateZ(12deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-12deg) rotateY(192deg) translateX(300px) rotateZ(12deg);
  }
}
.c:nth-child(14) {
  animation: orbit14 14s infinite;
  animation-delay: 0.14s;
  background-color: #a4a6a7;
}

@keyframes orbit14 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-157deg) rotateY(275deg) translateX(100px) rotateZ(157deg);
  }
  80% {
    transform: rotateZ(-157deg) rotateY(275deg) translateX(100px) rotateZ(157deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-157deg) rotateY(275deg) translateX(300px) rotateZ(157deg);
  }
}
.c:nth-child(15) {
  animation: orbit15 14s infinite;
  animation-delay: 0.15s;
  background-color: #a4a6a8;
}

@keyframes orbit15 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-224deg) rotateY(352deg) translateX(100px) rotateZ(224deg);
  }
  80% {
    transform: rotateZ(-224deg) rotateY(352deg) translateX(100px) rotateZ(224deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-224deg) rotateY(352deg) translateX(300px) rotateZ(224deg);
  }
}
.c:nth-child(16) {
  animation: orbit16 14s infinite;
  animation-delay: 0.16s;
  background-color: #a4a6a8;
}

@keyframes orbit16 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-130deg) rotateY(284deg) translateX(100px) rotateZ(130deg);
  }
  80% {
    transform: rotateZ(-130deg) rotateY(284deg) translateX(100px) rotateZ(130deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-130deg) rotateY(284deg) translateX(300px) rotateZ(130deg);
  }
}
.c:nth-child(17) {
  animation: orbit17 14s infinite;
  animation-delay: 0.17s;
  background-color: #a4a6a8;
}

@keyframes orbit17 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-269deg) rotateY(232deg) translateX(100px) rotateZ(269deg);
  }
  80% {
    transform: rotateZ(-269deg) rotateY(232deg) translateX(100px) rotateZ(269deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-269deg) rotateY(232deg) translateX(300px) rotateZ(269deg);
  }
}
.c:nth-child(18) {
  animation: orbit18 14s infinite;
  animation-delay: 0.18s;
  background-color: #a4a6a8;
}

@keyframes orbit18 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-222deg) rotateY(202deg) translateX(100px) rotateZ(222deg);
  }
  80% {
    transform: rotateZ(-222deg) rotateY(202deg) translateX(100px) rotateZ(222deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-222deg) rotateY(202deg) translateX(300px) rotateZ(222deg);
  }
}
.c:nth-child(19) {
  animation: orbit19 14s infinite;
  animation-delay: 0.19s;
  background-color: #a3a6a8;
}

@keyframes orbit19 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-36deg) rotateY(217deg) translateX(100px) rotateZ(36deg);
  }
  80% {
    transform: rotateZ(-36deg) rotateY(217deg) translateX(100px) rotateZ(36deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-36deg) rotateY(217deg) translateX(300px) rotateZ(36deg);
  }
}
.c:nth-child(20) {
  animation: orbit20 14s infinite;
  animation-delay: 0.2s;
  background-color: #a3a6a8;
}

@keyframes orbit20 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-220deg) rotateY(166deg) translateX(100px) rotateZ(220deg);
  }
  80% {
    transform: rotateZ(-220deg) rotateY(166deg) translateX(100px) rotateZ(220deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-220deg) rotateY(166deg) translateX(300px) rotateZ(220deg);
  }
}
.c:nth-child(21) {
  animation: orbit21 14s infinite;
  animation-delay: 0.21s;
  background-color: #a3a6a8;
}

@keyframes orbit21 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-54deg) rotateY(265deg) translateX(100px) rotateZ(54deg);
  }
  80% {
    transform: rotateZ(-54deg) rotateY(265deg) translateX(100px) rotateZ(54deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-54deg) rotateY(265deg) translateX(300px) rotateZ(54deg);
  }
}
.c:nth-child(22) {
  animation: orbit22 14s infinite;
  animation-delay: 0.22s;
  background-color: #a3a6a8;
}

@keyframes orbit22 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-286deg) rotateY(193deg) translateX(100px) rotateZ(286deg);
  }
  80% {
    transform: rotateZ(-286deg) rotateY(193deg) translateX(100px) rotateZ(286deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-286deg) rotateY(193deg) translateX(300px) rotateZ(286deg);
  }
}
.c:nth-child(23) {
  animation: orbit23 14s infinite;
  animation-delay: 0.23s;
  background-color: #a3a6a8;
}

@keyframes orbit23 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-285deg) rotateY(322deg) translateX(100px) rotateZ(285deg);
  }
  80% {
    transform: rotateZ(-285deg) rotateY(322deg) translateX(100px) rotateZ(285deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-285deg) rotateY(322deg) translateX(300px) rotateZ(285deg);
  }
}
.c:nth-child(24) {
  animation: orbit24 14s infinite;
  animation-delay: 0.24s;
  background-color: #a3a6a9;
}

@keyframes orbit24 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-245deg) rotateY(273deg) translateX(100px) rotateZ(245deg);
  }
  80% {
    transform: rotateZ(-245deg) rotateY(273deg) translateX(100px) rotateZ(245deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-245deg) rotateY(273deg) translateX(300px) rotateZ(245deg);
  }
}
.c:nth-child(25) {
  animation: orbit25 14s infinite;
  animation-delay: 0.25s;
  background-color: #a3a6a9;
}

@keyframes orbit25 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-178deg) rotateY(162deg) translateX(100px) rotateZ(178deg);
  }
  80% {
    transform: rotateZ(-178deg) rotateY(162deg) translateX(100px) rotateZ(178deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-178deg) rotateY(162deg) translateX(300px) rotateZ(178deg);
  }
}
.c:nth-child(26) {
  animation: orbit26 14s infinite;
  animation-delay: 0.26s;
  background-color: #a3a6a9;
}

@keyframes orbit26 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-55deg) rotateY(202deg) translateX(100px) rotateZ(55deg);
  }
  80% {
    transform: rotateZ(-55deg) rotateY(202deg) translateX(100px) rotateZ(55deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-55deg) rotateY(202deg) translateX(300px) rotateZ(55deg);
  }
}
.c:nth-child(27) {
  animation: orbit27 14s infinite;
  animation-delay: 0.27s;
  background-color: #a3a6a9;
}

@keyframes orbit27 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-70deg) rotateY(40deg) translateX(100px) rotateZ(70deg);
  }
  80% {
    transform: rotateZ(-70deg) rotateY(40deg) translateX(100px) rotateZ(70deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-70deg) rotateY(40deg) translateX(300px) rotateZ(70deg);
  }
}
.c:nth-child(28) {
  animation: orbit28 14s infinite;
  animation-delay: 0.28s;
  background-color: #a2a6a9;
}

@keyframes orbit28 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-276deg) rotateY(322deg) translateX(100px) rotateZ(276deg);
  }
  80% {
    transform: rotateZ(-276deg) rotateY(322deg) translateX(100px) rotateZ(276deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-276deg) rotateY(322deg) translateX(300px) rotateZ(276deg);
  }
}
.c:nth-child(29) {
  animation: orbit29 14s infinite;
  animation-delay: 0.29s;
  background-color: #a2a6a9;
}

@keyframes orbit29 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-295deg) rotateY(139deg) translateX(100px) rotateZ(295deg);
  }
  80% {
    transform: rotateZ(-295deg) rotateY(139deg) translateX(100px) rotateZ(295deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-295deg) rotateY(139deg) translateX(300px) rotateZ(295deg);
  }
}
.c:nth-child(30) {
  animation: orbit30 14s infinite;
  animation-delay: 0.3s;
  background-color: #a2a6a9;
}

@keyframes orbit30 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-177deg) rotateY(139deg) translateX(100px) rotateZ(177deg);
  }
  80% {
    transform: rotateZ(-177deg) rotateY(139deg) translateX(100px) rotateZ(177deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-177deg) rotateY(139deg) translateX(300px) rotateZ(177deg);
  }
}
.c:nth-child(31) {
  animation: orbit31 14s infinite;
  animation-delay: 0.31s;
  background-color: #a2a6a9;
}

@keyframes orbit31 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-301deg) rotateY(114deg) translateX(100px) rotateZ(301deg);
  }
  80% {
    transform: rotateZ(-301deg) rotateY(114deg) translateX(100px) rotateZ(301deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-301deg) rotateY(114deg) translateX(300px) rotateZ(301deg);
  }
}
.c:nth-child(32) {
  animation: orbit32 14s infinite;
  animation-delay: 0.32s;
  background-color: #a2a6aa;
}

@keyframes orbit32 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-283deg) rotateY(261deg) translateX(100px) rotateZ(283deg);
  }
  80% {
    transform: rotateZ(-283deg) rotateY(261deg) translateX(100px) rotateZ(283deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-283deg) rotateY(261deg) translateX(300px) rotateZ(283deg);
  }
}
.c:nth-child(33) {
  animation: orbit33 14s infinite;
  animation-delay: 0.33s;
  background-color: #a2a6aa;
}

@keyframes orbit33 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-189deg) rotateY(173deg) translateX(100px) rotateZ(189deg);
  }
  80% {
    transform: rotateZ(-189deg) rotateY(173deg) translateX(100px) rotateZ(189deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-189deg) rotateY(173deg) translateX(300px) rotateZ(189deg);
  }
}
.c:nth-child(34) {
  animation: orbit34 14s infinite;
  animation-delay: 0.34s;
  background-color: #a2a6aa;
}

@keyframes orbit34 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-106deg) rotateY(163deg) translateX(100px) rotateZ(106deg);
  }
  80% {
    transform: rotateZ(-106deg) rotateY(163deg) translateX(100px) rotateZ(106deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-106deg) rotateY(163deg) translateX(300px) rotateZ(106deg);
  }
}
.c:nth-child(35) {
  animation: orbit35 14s infinite;
  animation-delay: 0.35s;
  background-color: #a2a6aa;
}

@keyframes orbit35 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-136deg) rotateY(188deg) translateX(100px) rotateZ(136deg);
  }
  80% {
    transform: rotateZ(-136deg) rotateY(188deg) translateX(100px) rotateZ(136deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-136deg) rotateY(188deg) translateX(300px) rotateZ(136deg);
  }
}
.c:nth-child(36) {
  animation: orbit36 14s infinite;
  animation-delay: 0.36s;
  background-color: #a1a6aa;
}

@keyframes orbit36 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-103deg) rotateY(82deg) translateX(100px) rotateZ(103deg);
  }
  80% {
    transform: rotateZ(-103deg) rotateY(82deg) translateX(100px) rotateZ(103deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-103deg) rotateY(82deg) translateX(300px) rotateZ(103deg);
  }
}
.c:nth-child(37) {
  animation: orbit37 14s infinite;
  animation-delay: 0.37s;
  background-color: #a1a6aa;
}

@keyframes orbit37 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-360deg) rotateY(112deg) translateX(100px) rotateZ(360deg);
  }
  80% {
    transform: rotateZ(-360deg) rotateY(112deg) translateX(100px) rotateZ(360deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-360deg) rotateY(112deg) translateX(300px) rotateZ(360deg);
  }
}
.c:nth-child(38) {
  animation: orbit38 14s infinite;
  animation-delay: 0.38s;
  background-color: #a1a6aa;
}

@keyframes orbit38 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-168deg) rotateY(76deg) translateX(100px) rotateZ(168deg);
  }
  80% {
    transform: rotateZ(-168deg) rotateY(76deg) translateX(100px) rotateZ(168deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-168deg) rotateY(76deg) translateX(300px) rotateZ(168deg);
  }
}
.c:nth-child(39) {
  animation: orbit39 14s infinite;
  animation-delay: 0.39s;
  background-color: #a1a6aa;
}

@keyframes orbit39 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-262deg) rotateY(107deg) translateX(100px) rotateZ(262deg);
  }
  80% {
    transform: rotateZ(-262deg) rotateY(107deg) translateX(100px) rotateZ(262deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-262deg) rotateY(107deg) translateX(300px) rotateZ(262deg);
  }
}
.c:nth-child(40) {
  animation: orbit40 14s infinite;
  animation-delay: 0.4s;
  background-color: #a1a6ab;
}

@keyframes orbit40 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-12deg) rotateY(109deg) translateX(100px) rotateZ(12deg);
  }
  80% {
    transform: rotateZ(-12deg) rotateY(109deg) translateX(100px) rotateZ(12deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-12deg) rotateY(109deg) translateX(300px) rotateZ(12deg);
  }
}
.c:nth-child(41) {
  animation: orbit41 14s infinite;
  animation-delay: 0.41s;
  background-color: #a1a6ab;
}

@keyframes orbit41 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-151deg) rotateY(350deg) translateX(100px) rotateZ(151deg);
  }
  80% {
    transform: rotateZ(-151deg) rotateY(350deg) translateX(100px) rotateZ(151deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-151deg) rotateY(350deg) translateX(300px) rotateZ(151deg);
  }
}
.c:nth-child(42) {
  animation: orbit42 14s infinite;
  animation-delay: 0.42s;
  background-color: #a1a6ab;
}

@keyframes orbit42 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-123deg) rotateY(159deg) translateX(100px) rotateZ(123deg);
  }
  80% {
    transform: rotateZ(-123deg) rotateY(159deg) translateX(100px) rotateZ(123deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-123deg) rotateY(159deg) translateX(300px) rotateZ(123deg);
  }
}
.c:nth-child(43) {
  animation: orbit43 14s infinite;
  animation-delay: 0.43s;
  background-color: #a1a6ab;
}

@keyframes orbit43 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-320deg) rotateY(106deg) translateX(100px) rotateZ(320deg);
  }
  80% {
    transform: rotateZ(-320deg) rotateY(106deg) translateX(100px) rotateZ(320deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-320deg) rotateY(106deg) translateX(300px) rotateZ(320deg);
  }
}
.c:nth-child(44) {
  animation: orbit44 14s infinite;
  animation-delay: 0.44s;
  background-color: #a1a6ab;
}

@keyframes orbit44 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-246deg) rotateY(332deg) translateX(100px) rotateZ(246deg);
  }
  80% {
    transform: rotateZ(-246deg) rotateY(332deg) translateX(100px) rotateZ(246deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-246deg) rotateY(332deg) translateX(300px) rotateZ(246deg);
  }
}
.c:nth-child(45) {
  animation: orbit45 14s infinite;
  animation-delay: 0.45s;
  background-color: #a0a6ab;
}

@keyframes orbit45 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-188deg) rotateY(217deg) translateX(100px) rotateZ(188deg);
  }
  80% {
    transform: rotateZ(-188deg) rotateY(217deg) translateX(100px) rotateZ(188deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-188deg) rotateY(217deg) translateX(300px) rotateZ(188deg);
  }
}
.c:nth-child(46) {
  animation: orbit46 14s infinite;
  animation-delay: 0.46s;
  background-color: #a0a6ab;
}

@keyframes orbit46 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-34deg) rotateY(59deg) translateX(100px) rotateZ(34deg);
  }
  80% {
    transform: rotateZ(-34deg) rotateY(59deg) translateX(100px) rotateZ(34deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-34deg) rotateY(59deg) translateX(300px) rotateZ(34deg);
  }
}
.c:nth-child(47) {
  animation: orbit47 14s infinite;
  animation-delay: 0.47s;
  background-color: #a0a6ab;
}

@keyframes orbit47 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-250deg) rotateY(334deg) translateX(100px) rotateZ(250deg);
  }
  80% {
    transform: rotateZ(-250deg) rotateY(334deg) translateX(100px) rotateZ(250deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-250deg) rotateY(334deg) translateX(300px) rotateZ(250deg);
  }
}
.c:nth-child(48) {
  animation: orbit48 14s infinite;
  animation-delay: 0.48s;
  background-color: #a0a6ab;
}

@keyframes orbit48 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-67deg) rotateY(266deg) translateX(100px) rotateZ(67deg);
  }
  80% {
    transform: rotateZ(-67deg) rotateY(266deg) translateX(100px) rotateZ(67deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-67deg) rotateY(266deg) translateX(300px) rotateZ(67deg);
  }
}
.c:nth-child(49) {
  animation: orbit49 14s infinite;
  animation-delay: 0.49s;
  background-color: #a0a6ac;
}

@keyframes orbit49 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-44deg) rotateY(337deg) translateX(100px) rotateZ(44deg);
  }
  80% {
    transform: rotateZ(-44deg) rotateY(337deg) translateX(100px) rotateZ(44deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-44deg) rotateY(337deg) translateX(300px) rotateZ(44deg);
  }
}
.c:nth-child(50) {
  animation: orbit50 14s infinite;
  animation-delay: 0.5s;
  background-color: #a0a6ac;
}

@keyframes orbit50 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-110deg) rotateY(210deg) translateX(100px) rotateZ(110deg);
  }
  80% {
    transform: rotateZ(-110deg) rotateY(210deg) translateX(100px) rotateZ(110deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-110deg) rotateY(210deg) translateX(300px) rotateZ(110deg);
  }
}
.c:nth-child(51) {
  animation: orbit51 14s infinite;
  animation-delay: 0.51s;
  background-color: #a0a6ac;
}

@keyframes orbit51 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-133deg) rotateY(203deg) translateX(100px) rotateZ(133deg);
  }
  80% {
    transform: rotateZ(-133deg) rotateY(203deg) translateX(100px) rotateZ(133deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-133deg) rotateY(203deg) translateX(300px) rotateZ(133deg);
  }
}
.c:nth-child(52) {
  animation: orbit52 14s infinite;
  animation-delay: 0.52s;
  background-color: #a0a6ac;
}

@keyframes orbit52 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-197deg) rotateY(221deg) translateX(100px) rotateZ(197deg);
  }
  80% {
    transform: rotateZ(-197deg) rotateY(221deg) translateX(100px) rotateZ(197deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-197deg) rotateY(221deg) translateX(300px) rotateZ(197deg);
  }
}
.c:nth-child(53) {
  animation: orbit53 14s infinite;
  animation-delay: 0.53s;
  background-color: #9fa6ac;
}

@keyframes orbit53 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-191deg) rotateY(118deg) translateX(100px) rotateZ(191deg);
  }
  80% {
    transform: rotateZ(-191deg) rotateY(118deg) translateX(100px) rotateZ(191deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-191deg) rotateY(118deg) translateX(300px) rotateZ(191deg);
  }
}
.c:nth-child(54) {
  animation: orbit54 14s infinite;
  animation-delay: 0.54s;
  background-color: #9fa6ac;
}

@keyframes orbit54 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-21deg) rotateY(336deg) translateX(100px) rotateZ(21deg);
  }
  80% {
    transform: rotateZ(-21deg) rotateY(336deg) translateX(100px) rotateZ(21deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-21deg) rotateY(336deg) translateX(300px) rotateZ(21deg);
  }
}
.c:nth-child(55) {
  animation: orbit55 14s infinite;
  animation-delay: 0.55s;
  background-color: #9fa6ac;
}

@keyframes orbit55 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-53deg) rotateY(217deg) translateX(100px) rotateZ(53deg);
  }
  80% {
    transform: rotateZ(-53deg) rotateY(217deg) translateX(100px) rotateZ(53deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-53deg) rotateY(217deg) translateX(300px) rotateZ(53deg);
  }
}
.c:nth-child(56) {
  animation: orbit56 14s infinite;
  animation-delay: 0.56s;
  background-color: #9fa6ac;
}

@keyframes orbit56 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-48deg) rotateY(12deg) translateX(100px) rotateZ(48deg);
  }
  80% {
    transform: rotateZ(-48deg) rotateY(12deg) translateX(100px) rotateZ(48deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-48deg) rotateY(12deg) translateX(300px) rotateZ(48deg);
  }
}
.c:nth-child(57) {
  animation: orbit57 14s infinite;
  animation-delay: 0.57s;
  background-color: #9fa6ad;
}

@keyframes orbit57 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-228deg) rotateY(44deg) translateX(100px) rotateZ(228deg);
  }
  80% {
    transform: rotateZ(-228deg) rotateY(44deg) translateX(100px) rotateZ(228deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-228deg) rotateY(44deg) translateX(300px) rotateZ(228deg);
  }
}
.c:nth-child(58) {
  animation: orbit58 14s infinite;
  animation-delay: 0.58s;
  background-color: #9fa6ad;
}

@keyframes orbit58 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-239deg) rotateY(42deg) translateX(100px) rotateZ(239deg);
  }
  80% {
    transform: rotateZ(-239deg) rotateY(42deg) translateX(100px) rotateZ(239deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-239deg) rotateY(42deg) translateX(300px) rotateZ(239deg);
  }
}
.c:nth-child(59) {
  animation: orbit59 14s infinite;
  animation-delay: 0.59s;
  background-color: #9fa6ad;
}

@keyframes orbit59 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-42deg) rotateY(260deg) translateX(100px) rotateZ(42deg);
  }
  80% {
    transform: rotateZ(-42deg) rotateY(260deg) translateX(100px) rotateZ(42deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-42deg) rotateY(260deg) translateX(300px) rotateZ(42deg);
  }
}
.c:nth-child(60) {
  animation: orbit60 14s infinite;
  animation-delay: 0.6s;
  background-color: #9fa6ad;
}

@keyframes orbit60 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-108deg) rotateY(11deg) translateX(100px) rotateZ(108deg);
  }
  80% {
    transform: rotateZ(-108deg) rotateY(11deg) translateX(100px) rotateZ(108deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-108deg) rotateY(11deg) translateX(300px) rotateZ(108deg);
  }
}
.c:nth-child(61) {
  animation: orbit61 14s infinite;
  animation-delay: 0.61s;
  background-color: #9ea6ad;
}

@keyframes orbit61 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-101deg) rotateY(218deg) translateX(100px) rotateZ(101deg);
  }
  80% {
    transform: rotateZ(-101deg) rotateY(218deg) translateX(100px) rotateZ(101deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-101deg) rotateY(218deg) translateX(300px) rotateZ(101deg);
  }
}
.c:nth-child(62) {
  animation: orbit62 14s infinite;
  animation-delay: 0.62s;
  background-color: #9ea6ad;
}

@keyframes orbit62 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-296deg) rotateY(317deg) translateX(100px) rotateZ(296deg);
  }
  80% {
    transform: rotateZ(-296deg) rotateY(317deg) translateX(100px) rotateZ(296deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-296deg) rotateY(317deg) translateX(300px) rotateZ(296deg);
  }
}
.c:nth-child(63) {
  animation: orbit63 14s infinite;
  animation-delay: 0.63s;
  background-color: #9ea6ad;
}

@keyframes orbit63 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-191deg) rotateY(102deg) translateX(100px) rotateZ(191deg);
  }
  80% {
    transform: rotateZ(-191deg) rotateY(102deg) translateX(100px) rotateZ(191deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-191deg) rotateY(102deg) translateX(300px) rotateZ(191deg);
  }
}
.c:nth-child(64) {
  animation: orbit64 14s infinite;
  animation-delay: 0.64s;
  background-color: #9ea6ad;
}

@keyframes orbit64 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-73deg) rotateY(94deg) translateX(100px) rotateZ(73deg);
  }
  80% {
    transform: rotateZ(-73deg) rotateY(94deg) translateX(100px) rotateZ(73deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-73deg) rotateY(94deg) translateX(300px) rotateZ(73deg);
  }
}
.c:nth-child(65) {
  animation: orbit65 14s infinite;
  animation-delay: 0.65s;
  background-color: #9ea6ad;
}

@keyframes orbit65 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-196deg) rotateY(33deg) translateX(100px) rotateZ(196deg);
  }
  80% {
    transform: rotateZ(-196deg) rotateY(33deg) translateX(100px) rotateZ(196deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-196deg) rotateY(33deg) translateX(300px) rotateZ(196deg);
  }
}
.c:nth-child(66) {
  animation: orbit66 14s infinite;
  animation-delay: 0.66s;
  background-color: #9ea6ae;
}

@keyframes orbit66 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-292deg) rotateY(261deg) translateX(100px) rotateZ(292deg);
  }
  80% {
    transform: rotateZ(-292deg) rotateY(261deg) translateX(100px) rotateZ(292deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-292deg) rotateY(261deg) translateX(300px) rotateZ(292deg);
  }
}
.c:nth-child(67) {
  animation: orbit67 14s infinite;
  animation-delay: 0.67s;
  background-color: #9ea6ae;
}

@keyframes orbit67 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-42deg) rotateY(35deg) translateX(100px) rotateZ(42deg);
  }
  80% {
    transform: rotateZ(-42deg) rotateY(35deg) translateX(100px) rotateZ(42deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-42deg) rotateY(35deg) translateX(300px) rotateZ(42deg);
  }
}
.c:nth-child(68) {
  animation: orbit68 14s infinite;
  animation-delay: 0.68s;
  background-color: #9ea6ae;
}

@keyframes orbit68 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-299deg) rotateY(108deg) translateX(100px) rotateZ(299deg);
  }
  80% {
    transform: rotateZ(-299deg) rotateY(108deg) translateX(100px) rotateZ(299deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-299deg) rotateY(108deg) translateX(300px) rotateZ(299deg);
  }
}
.c:nth-child(69) {
  animation: orbit69 14s infinite;
  animation-delay: 0.69s;
  background-color: #9ea6ae;
}

@keyframes orbit69 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-327deg) rotateY(18deg) translateX(100px) rotateZ(327deg);
  }
  80% {
    transform: rotateZ(-327deg) rotateY(18deg) translateX(100px) rotateZ(327deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-327deg) rotateY(18deg) translateX(300px) rotateZ(327deg);
  }
}
.c:nth-child(70) {
  animation: orbit70 14s infinite;
  animation-delay: 0.7s;
  background-color: #9da6ae;
}

@keyframes orbit70 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-117deg) rotateY(271deg) translateX(100px) rotateZ(117deg);
  }
  80% {
    transform: rotateZ(-117deg) rotateY(271deg) translateX(100px) rotateZ(117deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-117deg) rotateY(271deg) translateX(300px) rotateZ(117deg);
  }
}
.c:nth-child(71) {
  animation: orbit71 14s infinite;
  animation-delay: 0.71s;
  background-color: #9da6ae;
}

@keyframes orbit71 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-35deg) rotateY(55deg) translateX(100px) rotateZ(35deg);
  }
  80% {
    transform: rotateZ(-35deg) rotateY(55deg) translateX(100px) rotateZ(35deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-35deg) rotateY(55deg) translateX(300px) rotateZ(35deg);
  }
}
.c:nth-child(72) {
  animation: orbit72 14s infinite;
  animation-delay: 0.72s;
  background-color: #9da6ae;
}

@keyframes orbit72 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-146deg) rotateY(341deg) translateX(100px) rotateZ(146deg);
  }
  80% {
    transform: rotateZ(-146deg) rotateY(341deg) translateX(100px) rotateZ(146deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-146deg) rotateY(341deg) translateX(300px) rotateZ(146deg);
  }
}
.c:nth-child(73) {
  animation: orbit73 14s infinite;
  animation-delay: 0.73s;
  background-color: #9da6ae;
}

@keyframes orbit73 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-173deg) rotateY(61deg) translateX(100px) rotateZ(173deg);
  }
  80% {
    transform: rotateZ(-173deg) rotateY(61deg) translateX(100px) rotateZ(173deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-173deg) rotateY(61deg) translateX(300px) rotateZ(173deg);
  }
}
.c:nth-child(74) {
  animation: orbit74 14s infinite;
  animation-delay: 0.74s;
  background-color: #9da6af;
}

@keyframes orbit74 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-349deg) rotateY(145deg) translateX(100px) rotateZ(349deg);
  }
  80% {
    transform: rotateZ(-349deg) rotateY(145deg) translateX(100px) rotateZ(349deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-349deg) rotateY(145deg) translateX(300px) rotateZ(349deg);
  }
}
.c:nth-child(75) {
  animation: orbit75 14s infinite;
  animation-delay: 0.75s;
  background-color: #9da6af;
}

@keyframes orbit75 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-213deg) rotateY(143deg) translateX(100px) rotateZ(213deg);
  }
  80% {
    transform: rotateZ(-213deg) rotateY(143deg) translateX(100px) rotateZ(213deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-213deg) rotateY(143deg) translateX(300px) rotateZ(213deg);
  }
}
.c:nth-child(76) {
  animation: orbit76 14s infinite;
  animation-delay: 0.76s;
  background-color: #9da6af;
}

@keyframes orbit76 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-313deg) rotateY(347deg) translateX(100px) rotateZ(313deg);
  }
  80% {
    transform: rotateZ(-313deg) rotateY(347deg) translateX(100px) rotateZ(313deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-313deg) rotateY(347deg) translateX(300px) rotateZ(313deg);
  }
}
.c:nth-child(77) {
  animation: orbit77 14s infinite;
  animation-delay: 0.77s;
  background-color: #9da6af;
}

@keyframes orbit77 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-15deg) rotateY(257deg) translateX(100px) rotateZ(15deg);
  }
  80% {
    transform: rotateZ(-15deg) rotateY(257deg) translateX(100px) rotateZ(15deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-15deg) rotateY(257deg) translateX(300px) rotateZ(15deg);
  }
}
.c:nth-child(78) {
  animation: orbit78 14s infinite;
  animation-delay: 0.78s;
  background-color: #9ca6af;
}

@keyframes orbit78 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-256deg) rotateY(345deg) translateX(100px) rotateZ(256deg);
  }
  80% {
    transform: rotateZ(-256deg) rotateY(345deg) translateX(100px) rotateZ(256deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-256deg) rotateY(345deg) translateX(300px) rotateZ(256deg);
  }
}
.c:nth-child(79) {
  animation: orbit79 14s infinite;
  animation-delay: 0.79s;
  background-color: #9ca6af;
}

@keyframes orbit79 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-51deg) rotateY(163deg) translateX(100px) rotateZ(51deg);
  }
  80% {
    transform: rotateZ(-51deg) rotateY(163deg) translateX(100px) rotateZ(51deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-51deg) rotateY(163deg) translateX(300px) rotateZ(51deg);
  }
}
.c:nth-child(80) {
  animation: orbit80 14s infinite;
  animation-delay: 0.8s;
  background-color: #9ca6af;
}

@keyframes orbit80 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-297deg) rotateY(234deg) translateX(100px) rotateZ(297deg);
  }
  80% {
    transform: rotateZ(-297deg) rotateY(234deg) translateX(100px) rotateZ(297deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-297deg) rotateY(234deg) translateX(300px) rotateZ(297deg);
  }
}
.c:nth-child(81) {
  animation: orbit81 14s infinite;
  animation-delay: 0.81s;
  background-color: #9ca6af;
}

@keyframes orbit81 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-255deg) rotateY(339deg) translateX(100px) rotateZ(255deg);
  }
  80% {
    transform: rotateZ(-255deg) rotateY(339deg) translateX(100px) rotateZ(255deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-255deg) rotateY(339deg) translateX(300px) rotateZ(255deg);
  }
}
.c:nth-child(82) {
  animation: orbit82 14s infinite;
  animation-delay: 0.82s;
  background-color: #9ca6b0;
}

@keyframes orbit82 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-360deg) rotateY(74deg) translateX(100px) rotateZ(360deg);
  }
  80% {
    transform: rotateZ(-360deg) rotateY(74deg) translateX(100px) rotateZ(360deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-360deg) rotateY(74deg) translateX(300px) rotateZ(360deg);
  }
}
.c:nth-child(83) {
  animation: orbit83 14s infinite;
  animation-delay: 0.83s;
  background-color: #9ca6b0;
}

@keyframes orbit83 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-183deg) rotateY(134deg) translateX(100px) rotateZ(183deg);
  }
  80% {
    transform: rotateZ(-183deg) rotateY(134deg) translateX(100px) rotateZ(183deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-183deg) rotateY(134deg) translateX(300px) rotateZ(183deg);
  }
}
.c:nth-child(84) {
  animation: orbit84 14s infinite;
  animation-delay: 0.84s;
  background-color: #9ca6b0;
}

@keyframes orbit84 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-135deg) rotateY(77deg) translateX(100px) rotateZ(135deg);
  }
  80% {
    transform: rotateZ(-135deg) rotateY(77deg) translateX(100px) rotateZ(135deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-135deg) rotateY(77deg) translateX(300px) rotateZ(135deg);
  }
}
.c:nth-child(85) {
  animation: orbit85 14s infinite;
  animation-delay: 0.85s;
  background-color: #9ca6b0;
}

@keyframes orbit85 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-282deg) rotateY(241deg) translateX(100px) rotateZ(282deg);
  }
  80% {
    transform: rotateZ(-282deg) rotateY(241deg) translateX(100px) rotateZ(282deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-282deg) rotateY(241deg) translateX(300px) rotateZ(282deg);
  }
}
.c:nth-child(86) {
  animation: orbit86 14s infinite;
  animation-delay: 0.86s;
  background-color: #9ca6b0;
}

@keyframes orbit86 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-321deg) rotateY(357deg) translateX(100px) rotateZ(321deg);
  }
  80% {
    transform: rotateZ(-321deg) rotateY(357deg) translateX(100px) rotateZ(321deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-321deg) rotateY(357deg) translateX(300px) rotateZ(321deg);
  }
}
.c:nth-child(87) {
  animation: orbit87 14s infinite;
  animation-delay: 0.87s;
  background-color: #9ba6b0;
}

@keyframes orbit87 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-226deg) rotateY(284deg) translateX(100px) rotateZ(226deg);
  }
  80% {
    transform: rotateZ(-226deg) rotateY(284deg) translateX(100px) rotateZ(226deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-226deg) rotateY(284deg) translateX(300px) rotateZ(226deg);
  }
}
.c:nth-child(88) {
  animation: orbit88 14s infinite;
  animation-delay: 0.88s;
  background-color: #9ba6b0;
}

@keyframes orbit88 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-343deg) rotateY(37deg) translateX(100px) rotateZ(343deg);
  }
  80% {
    transform: rotateZ(-343deg) rotateY(37deg) translateX(100px) rotateZ(343deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-343deg) rotateY(37deg) translateX(300px) rotateZ(343deg);
  }
}
.c:nth-child(89) {
  animation: orbit89 14s infinite;
  animation-delay: 0.89s;
  background-color: #9ba6b0;
}

@keyframes orbit89 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-17deg) rotateY(71deg) translateX(100px) rotateZ(17deg);
  }
  80% {
    transform: rotateZ(-17deg) rotateY(71deg) translateX(100px) rotateZ(17deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-17deg) rotateY(71deg) translateX(300px) rotateZ(17deg);
  }
}
.c:nth-child(90) {
  animation: orbit90 14s infinite;
  animation-delay: 0.9s;
  background-color: #9ba6b0;
}

@keyframes orbit90 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-354deg) rotateY(231deg) translateX(100px) rotateZ(354deg);
  }
  80% {
    transform: rotateZ(-354deg) rotateY(231deg) translateX(100px) rotateZ(354deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-354deg) rotateY(231deg) translateX(300px) rotateZ(354deg);
  }
}
.c:nth-child(91) {
  animation: orbit91 14s infinite;
  animation-delay: 0.91s;
  background-color: #9ba6b1;
}

@keyframes orbit91 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-129deg) rotateY(5deg) translateX(100px) rotateZ(129deg);
  }
  80% {
    transform: rotateZ(-129deg) rotateY(5deg) translateX(100px) rotateZ(129deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-129deg) rotateY(5deg) translateX(300px) rotateZ(129deg);
  }
}
.c:nth-child(92) {
  animation: orbit92 14s infinite;
  animation-delay: 0.92s;
  background-color: #9ba6b1;
}

@keyframes orbit92 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-323deg) rotateY(61deg) translateX(100px) rotateZ(323deg);
  }
  80% {
    transform: rotateZ(-323deg) rotateY(61deg) translateX(100px) rotateZ(323deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-323deg) rotateY(61deg) translateX(300px) rotateZ(323deg);
  }
}
.c:nth-child(93) {
  animation: orbit93 14s infinite;
  animation-delay: 0.93s;
  background-color: #9ba6b1;
}

@keyframes orbit93 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-200deg) rotateY(113deg) translateX(100px) rotateZ(200deg);
  }
  80% {
    transform: rotateZ(-200deg) rotateY(113deg) translateX(100px) rotateZ(200deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-200deg) rotateY(113deg) translateX(300px) rotateZ(200deg);
  }
}
.c:nth-child(94) {
  animation: orbit94 14s infinite;
  animation-delay: 0.94s;
  background-color: #9ba6b1;
}

@keyframes orbit94 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-43deg) rotateY(5deg) translateX(100px) rotateZ(43deg);
  }
  80% {
    transform: rotateZ(-43deg) rotateY(5deg) translateX(100px) rotateZ(43deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-43deg) rotateY(5deg) translateX(300px) rotateZ(43deg);
  }
}
.c:nth-child(95) {
  animation: orbit95 14s infinite;
  animation-delay: 0.95s;
  background-color: #9aa7b1;
}

@keyframes orbit95 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-37deg) rotateY(174deg) translateX(100px) rotateZ(37deg);
  }
  80% {
    transform: rotateZ(-37deg) rotateY(174deg) translateX(100px) rotateZ(37deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-37deg) rotateY(174deg) translateX(300px) rotateZ(37deg);
  }
}
.c:nth-child(96) {
  animation: orbit96 14s infinite;
  animation-delay: 0.96s;
  background-color: #9aa7b1;
}

@keyframes orbit96 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-129deg) rotateY(108deg) translateX(100px) rotateZ(129deg);
  }
  80% {
    transform: rotateZ(-129deg) rotateY(108deg) translateX(100px) rotateZ(129deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-129deg) rotateY(108deg) translateX(300px) rotateZ(129deg);
  }
}
.c:nth-child(97) {
  animation: orbit97 14s infinite;
  animation-delay: 0.97s;
  background-color: #9aa7b1;
}

@keyframes orbit97 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-129deg) rotateY(252deg) translateX(100px) rotateZ(129deg);
  }
  80% {
    transform: rotateZ(-129deg) rotateY(252deg) translateX(100px) rotateZ(129deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-129deg) rotateY(252deg) translateX(300px) rotateZ(129deg);
  }
}
.c:nth-child(98) {
  animation: orbit98 14s infinite;
  animation-delay: 0.98s;
  background-color: #9aa7b1;
}

@keyframes orbit98 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-102deg) rotateY(124deg) translateX(100px) rotateZ(102deg);
  }
  80% {
    transform: rotateZ(-102deg) rotateY(124deg) translateX(100px) rotateZ(102deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-102deg) rotateY(124deg) translateX(300px) rotateZ(102deg);
  }
}
.c:nth-child(99) {
  animation: orbit99 14s infinite;
  animation-delay: 0.99s;
  background-color: #9aa7b2;
}

@keyframes orbit99 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-183deg) rotateY(71deg) translateX(100px) rotateZ(183deg);
  }
  80% {
    transform: rotateZ(-183deg) rotateY(71deg) translateX(100px) rotateZ(183deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-183deg) rotateY(71deg) translateX(300px) rotateZ(183deg);
  }
}
.c:nth-child(100) {
  animation: orbit100 14s infinite;
  animation-delay: 1s;
  background-color: #9aa7b2;
}

@keyframes orbit100 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-176deg) rotateY(220deg) translateX(100px) rotateZ(176deg);
  }
  80% {
    transform: rotateZ(-176deg) rotateY(220deg) translateX(100px) rotateZ(176deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-176deg) rotateY(220deg) translateX(300px) rotateZ(176deg);
  }
}
.c:nth-child(101) {
  animation: orbit101 14s infinite;
  animation-delay: 1.01s;
  background-color: #9aa7b2;
}

@keyframes orbit101 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-320deg) rotateY(199deg) translateX(100px) rotateZ(320deg);
  }
  80% {
    transform: rotateZ(-320deg) rotateY(199deg) translateX(100px) rotateZ(320deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-320deg) rotateY(199deg) translateX(300px) rotateZ(320deg);
  }
}
.c:nth-child(102) {
  animation: orbit102 14s infinite;
  animation-delay: 1.02s;
  background-color: #9aa7b2;
}

@keyframes orbit102 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-156deg) rotateY(100deg) translateX(100px) rotateZ(156deg);
  }
  80% {
    transform: rotateZ(-156deg) rotateY(100deg) translateX(100px) rotateZ(156deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-156deg) rotateY(100deg) translateX(300px) rotateZ(156deg);
  }
}
.c:nth-child(103) {
  animation: orbit103 14s infinite;
  animation-delay: 1.03s;
  background-color: #99a7b2;
}

@keyframes orbit103 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-143deg) rotateY(324deg) translateX(100px) rotateZ(143deg);
  }
  80% {
    transform: rotateZ(-143deg) rotateY(324deg) translateX(100px) rotateZ(143deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-143deg) rotateY(324deg) translateX(300px) rotateZ(143deg);
  }
}
.c:nth-child(104) {
  animation: orbit104 14s infinite;
  animation-delay: 1.04s;
  background-color: #99a7b2;
}

@keyframes orbit104 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-2deg) rotateY(206deg) translateX(100px) rotateZ(2deg);
  }
  80% {
    transform: rotateZ(-2deg) rotateY(206deg) translateX(100px) rotateZ(2deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-2deg) rotateY(206deg) translateX(300px) rotateZ(2deg);
  }
}
.c:nth-child(105) {
  animation: orbit105 14s infinite;
  animation-delay: 1.05s;
  background-color: #99a7b2;
}

@keyframes orbit105 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-203deg) rotateY(302deg) translateX(100px) rotateZ(203deg);
  }
  80% {
    transform: rotateZ(-203deg) rotateY(302deg) translateX(100px) rotateZ(203deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-203deg) rotateY(302deg) translateX(300px) rotateZ(203deg);
  }
}
.c:nth-child(106) {
  animation: orbit106 14s infinite;
  animation-delay: 1.06s;
  background-color: #99a7b2;
}

@keyframes orbit106 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-311deg) rotateY(8deg) translateX(100px) rotateZ(311deg);
  }
  80% {
    transform: rotateZ(-311deg) rotateY(8deg) translateX(100px) rotateZ(311deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-311deg) rotateY(8deg) translateX(300px) rotateZ(311deg);
  }
}
.c:nth-child(107) {
  animation: orbit107 14s infinite;
  animation-delay: 1.07s;
  background-color: #99a7b2;
}

@keyframes orbit107 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-96deg) rotateY(11deg) translateX(100px) rotateZ(96deg);
  }
  80% {
    transform: rotateZ(-96deg) rotateY(11deg) translateX(100px) rotateZ(96deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-96deg) rotateY(11deg) translateX(300px) rotateZ(96deg);
  }
}
.c:nth-child(108) {
  animation: orbit108 14s infinite;
  animation-delay: 1.08s;
  background-color: #99a7b3;
}

@keyframes orbit108 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-112deg) rotateY(346deg) translateX(100px) rotateZ(112deg);
  }
  80% {
    transform: rotateZ(-112deg) rotateY(346deg) translateX(100px) rotateZ(112deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-112deg) rotateY(346deg) translateX(300px) rotateZ(112deg);
  }
}
.c:nth-child(109) {
  animation: orbit109 14s infinite;
  animation-delay: 1.09s;
  background-color: #99a7b3;
}

@keyframes orbit109 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-84deg) rotateY(321deg) translateX(100px) rotateZ(84deg);
  }
  80% {
    transform: rotateZ(-84deg) rotateY(321deg) translateX(100px) rotateZ(84deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-84deg) rotateY(321deg) translateX(300px) rotateZ(84deg);
  }
}
.c:nth-child(110) {
  animation: orbit110 14s infinite;
  animation-delay: 1.1s;
  background-color: #99a7b3;
}

@keyframes orbit110 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-279deg) rotateY(64deg) translateX(100px) rotateZ(279deg);
  }
  80% {
    transform: rotateZ(-279deg) rotateY(64deg) translateX(100px) rotateZ(279deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-279deg) rotateY(64deg) translateX(300px) rotateZ(279deg);
  }
}
.c:nth-child(111) {
  animation: orbit111 14s infinite;
  animation-delay: 1.11s;
  background-color: #99a7b3;
}

@keyframes orbit111 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-214deg) rotateY(159deg) translateX(100px) rotateZ(214deg);
  }
  80% {
    transform: rotateZ(-214deg) rotateY(159deg) translateX(100px) rotateZ(214deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-214deg) rotateY(159deg) translateX(300px) rotateZ(214deg);
  }
}
.c:nth-child(112) {
  animation: orbit112 14s infinite;
  animation-delay: 1.12s;
  background-color: #98a7b3;
}

@keyframes orbit112 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-294deg) rotateY(24deg) translateX(100px) rotateZ(294deg);
  }
  80% {
    transform: rotateZ(-294deg) rotateY(24deg) translateX(100px) rotateZ(294deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-294deg) rotateY(24deg) translateX(300px) rotateZ(294deg);
  }
}
.c:nth-child(113) {
  animation: orbit113 14s infinite;
  animation-delay: 1.13s;
  background-color: #98a7b3;
}

@keyframes orbit113 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-252deg) rotateY(230deg) translateX(100px) rotateZ(252deg);
  }
  80% {
    transform: rotateZ(-252deg) rotateY(230deg) translateX(100px) rotateZ(252deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-252deg) rotateY(230deg) translateX(300px) rotateZ(252deg);
  }
}
.c:nth-child(114) {
  animation: orbit114 14s infinite;
  animation-delay: 1.14s;
  background-color: #98a7b3;
}

@keyframes orbit114 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-354deg) rotateY(153deg) translateX(100px) rotateZ(354deg);
  }
  80% {
    transform: rotateZ(-354deg) rotateY(153deg) translateX(100px) rotateZ(354deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-354deg) rotateY(153deg) translateX(300px) rotateZ(354deg);
  }
}
.c:nth-child(115) {
  animation: orbit115 14s infinite;
  animation-delay: 1.15s;
  background-color: #98a7b3;
}

@keyframes orbit115 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-313deg) rotateY(92deg) translateX(100px) rotateZ(313deg);
  }
  80% {
    transform: rotateZ(-313deg) rotateY(92deg) translateX(100px) rotateZ(313deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-313deg) rotateY(92deg) translateX(300px) rotateZ(313deg);
  }
}
.c:nth-child(116) {
  animation: orbit116 14s infinite;
  animation-delay: 1.16s;
  background-color: #98a7b4;
}

@keyframes orbit116 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-122deg) rotateY(3deg) translateX(100px) rotateZ(122deg);
  }
  80% {
    transform: rotateZ(-122deg) rotateY(3deg) translateX(100px) rotateZ(122deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-122deg) rotateY(3deg) translateX(300px) rotateZ(122deg);
  }
}
.c:nth-child(117) {
  animation: orbit117 14s infinite;
  animation-delay: 1.17s;
  background-color: #98a7b4;
}

@keyframes orbit117 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-202deg) rotateY(256deg) translateX(100px) rotateZ(202deg);
  }
  80% {
    transform: rotateZ(-202deg) rotateY(256deg) translateX(100px) rotateZ(202deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-202deg) rotateY(256deg) translateX(300px) rotateZ(202deg);
  }
}
.c:nth-child(118) {
  animation: orbit118 14s infinite;
  animation-delay: 1.18s;
  background-color: #98a7b4;
}

@keyframes orbit118 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-58deg) rotateY(125deg) translateX(100px) rotateZ(58deg);
  }
  80% {
    transform: rotateZ(-58deg) rotateY(125deg) translateX(100px) rotateZ(58deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-58deg) rotateY(125deg) translateX(300px) rotateZ(58deg);
  }
}
.c:nth-child(119) {
  animation: orbit119 14s infinite;
  animation-delay: 1.19s;
  background-color: #98a7b4;
}

@keyframes orbit119 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-3deg) rotateY(158deg) translateX(100px) rotateZ(3deg);
  }
  80% {
    transform: rotateZ(-3deg) rotateY(158deg) translateX(100px) rotateZ(3deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-3deg) rotateY(158deg) translateX(300px) rotateZ(3deg);
  }
}
.c:nth-child(120) {
  animation: orbit120 14s infinite;
  animation-delay: 1.2s;
  background-color: #97a7b4;
}

@keyframes orbit120 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-253deg) rotateY(51deg) translateX(100px) rotateZ(253deg);
  }
  80% {
    transform: rotateZ(-253deg) rotateY(51deg) translateX(100px) rotateZ(253deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-253deg) rotateY(51deg) translateX(300px) rotateZ(253deg);
  }
}
.c:nth-child(121) {
  animation: orbit121 14s infinite;
  animation-delay: 1.21s;
  background-color: #97a7b4;
}

@keyframes orbit121 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-68deg) rotateY(37deg) translateX(100px) rotateZ(68deg);
  }
  80% {
    transform: rotateZ(-68deg) rotateY(37deg) translateX(100px) rotateZ(68deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-68deg) rotateY(37deg) translateX(300px) rotateZ(68deg);
  }
}
.c:nth-child(122) {
  animation: orbit122 14s infinite;
  animation-delay: 1.22s;
  background-color: #97a7b4;
}

@keyframes orbit122 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-301deg) rotateY(303deg) translateX(100px) rotateZ(301deg);
  }
  80% {
    transform: rotateZ(-301deg) rotateY(303deg) translateX(100px) rotateZ(301deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-301deg) rotateY(303deg) translateX(300px) rotateZ(301deg);
  }
}
.c:nth-child(123) {
  animation: orbit123 14s infinite;
  animation-delay: 1.23s;
  background-color: #97a7b4;
}

@keyframes orbit123 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-310deg) rotateY(285deg) translateX(100px) rotateZ(310deg);
  }
  80% {
    transform: rotateZ(-310deg) rotateY(285deg) translateX(100px) rotateZ(310deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-310deg) rotateY(285deg) translateX(300px) rotateZ(310deg);
  }
}
.c:nth-child(124) {
  animation: orbit124 14s infinite;
  animation-delay: 1.24s;
  background-color: #97a7b5;
}

@keyframes orbit124 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-43deg) rotateY(305deg) translateX(100px) rotateZ(43deg);
  }
  80% {
    transform: rotateZ(-43deg) rotateY(305deg) translateX(100px) rotateZ(43deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-43deg) rotateY(305deg) translateX(300px) rotateZ(43deg);
  }
}
.c:nth-child(125) {
  animation: orbit125 14s infinite;
  animation-delay: 1.25s;
  background-color: #97a7b5;
}

@keyframes orbit125 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-229deg) rotateY(12deg) translateX(100px) rotateZ(229deg);
  }
  80% {
    transform: rotateZ(-229deg) rotateY(12deg) translateX(100px) rotateZ(229deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-229deg) rotateY(12deg) translateX(300px) rotateZ(229deg);
  }
}
.c:nth-child(126) {
  animation: orbit126 14s infinite;
  animation-delay: 1.26s;
  background-color: #97a7b5;
}

@keyframes orbit126 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-276deg) rotateY(273deg) translateX(100px) rotateZ(276deg);
  }
  80% {
    transform: rotateZ(-276deg) rotateY(273deg) translateX(100px) rotateZ(276deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-276deg) rotateY(273deg) translateX(300px) rotateZ(276deg);
  }
}
.c:nth-child(127) {
  animation: orbit127 14s infinite;
  animation-delay: 1.27s;
  background-color: #97a7b5;
}

@keyframes orbit127 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-93deg) rotateY(169deg) translateX(100px) rotateZ(93deg);
  }
  80% {
    transform: rotateZ(-93deg) rotateY(169deg) translateX(100px) rotateZ(93deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-93deg) rotateY(169deg) translateX(300px) rotateZ(93deg);
  }
}
.c:nth-child(128) {
  animation: orbit128 14s infinite;
  animation-delay: 1.28s;
  background-color: #97a7b5;
}

@keyframes orbit128 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-171deg) rotateY(107deg) translateX(100px) rotateZ(171deg);
  }
  80% {
    transform: rotateZ(-171deg) rotateY(107deg) translateX(100px) rotateZ(171deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-171deg) rotateY(107deg) translateX(300px) rotateZ(171deg);
  }
}
.c:nth-child(129) {
  animation: orbit129 14s infinite;
  animation-delay: 1.29s;
  background-color: #96a7b5;
}

@keyframes orbit129 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-79deg) rotateY(115deg) translateX(100px) rotateZ(79deg);
  }
  80% {
    transform: rotateZ(-79deg) rotateY(115deg) translateX(100px) rotateZ(79deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-79deg) rotateY(115deg) translateX(300px) rotateZ(79deg);
  }
}
.c:nth-child(130) {
  animation: orbit130 14s infinite;
  animation-delay: 1.3s;
  background-color: #96a7b5;
}

@keyframes orbit130 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-28deg) rotateY(77deg) translateX(100px) rotateZ(28deg);
  }
  80% {
    transform: rotateZ(-28deg) rotateY(77deg) translateX(100px) rotateZ(28deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-28deg) rotateY(77deg) translateX(300px) rotateZ(28deg);
  }
}
.c:nth-child(131) {
  animation: orbit131 14s infinite;
  animation-delay: 1.31s;
  background-color: #96a7b5;
}

@keyframes orbit131 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-350deg) rotateY(172deg) translateX(100px) rotateZ(350deg);
  }
  80% {
    transform: rotateZ(-350deg) rotateY(172deg) translateX(100px) rotateZ(350deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-350deg) rotateY(172deg) translateX(300px) rotateZ(350deg);
  }
}
.c:nth-child(132) {
  animation: orbit132 14s infinite;
  animation-delay: 1.32s;
  background-color: #96a7b5;
}

@keyframes orbit132 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-72deg) rotateY(25deg) translateX(100px) rotateZ(72deg);
  }
  80% {
    transform: rotateZ(-72deg) rotateY(25deg) translateX(100px) rotateZ(72deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-72deg) rotateY(25deg) translateX(300px) rotateZ(72deg);
  }
}
.c:nth-child(133) {
  animation: orbit133 14s infinite;
  animation-delay: 1.33s;
  background-color: #96a7b6;
}

@keyframes orbit133 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-190deg) rotateY(221deg) translateX(100px) rotateZ(190deg);
  }
  80% {
    transform: rotateZ(-190deg) rotateY(221deg) translateX(100px) rotateZ(190deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-190deg) rotateY(221deg) translateX(300px) rotateZ(190deg);
  }
}
.c:nth-child(134) {
  animation: orbit134 14s infinite;
  animation-delay: 1.34s;
  background-color: #96a7b6;
}

@keyframes orbit134 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-133deg) rotateY(108deg) translateX(100px) rotateZ(133deg);
  }
  80% {
    transform: rotateZ(-133deg) rotateY(108deg) translateX(100px) rotateZ(133deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-133deg) rotateY(108deg) translateX(300px) rotateZ(133deg);
  }
}
.c:nth-child(135) {
  animation: orbit135 14s infinite;
  animation-delay: 1.35s;
  background-color: #96a7b6;
}

@keyframes orbit135 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-304deg) rotateY(239deg) translateX(100px) rotateZ(304deg);
  }
  80% {
    transform: rotateZ(-304deg) rotateY(239deg) translateX(100px) rotateZ(304deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-304deg) rotateY(239deg) translateX(300px) rotateZ(304deg);
  }
}
.c:nth-child(136) {
  animation: orbit136 14s infinite;
  animation-delay: 1.36s;
  background-color: #96a7b6;
}

@keyframes orbit136 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-196deg) rotateY(5deg) translateX(100px) rotateZ(196deg);
  }
  80% {
    transform: rotateZ(-196deg) rotateY(5deg) translateX(100px) rotateZ(196deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-196deg) rotateY(5deg) translateX(300px) rotateZ(196deg);
  }
}
.c:nth-child(137) {
  animation: orbit137 14s infinite;
  animation-delay: 1.37s;
  background-color: #95a7b6;
}

@keyframes orbit137 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-29deg) rotateY(311deg) translateX(100px) rotateZ(29deg);
  }
  80% {
    transform: rotateZ(-29deg) rotateY(311deg) translateX(100px) rotateZ(29deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-29deg) rotateY(311deg) translateX(300px) rotateZ(29deg);
  }
}
.c:nth-child(138) {
  animation: orbit138 14s infinite;
  animation-delay: 1.38s;
  background-color: #95a7b6;
}

@keyframes orbit138 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-44deg) rotateY(249deg) translateX(100px) rotateZ(44deg);
  }
  80% {
    transform: rotateZ(-44deg) rotateY(249deg) translateX(100px) rotateZ(44deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-44deg) rotateY(249deg) translateX(300px) rotateZ(44deg);
  }
}
.c:nth-child(139) {
  animation: orbit139 14s infinite;
  animation-delay: 1.39s;
  background-color: #95a7b6;
}

@keyframes orbit139 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-275deg) rotateY(330deg) translateX(100px) rotateZ(275deg);
  }
  80% {
    transform: rotateZ(-275deg) rotateY(330deg) translateX(100px) rotateZ(275deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-275deg) rotateY(330deg) translateX(300px) rotateZ(275deg);
  }
}
.c:nth-child(140) {
  animation: orbit140 14s infinite;
  animation-delay: 1.4s;
  background-color: #95a7b6;
}

@keyframes orbit140 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-225deg) rotateY(283deg) translateX(100px) rotateZ(225deg);
  }
  80% {
    transform: rotateZ(-225deg) rotateY(283deg) translateX(100px) rotateZ(225deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-225deg) rotateY(283deg) translateX(300px) rotateZ(225deg);
  }
}
.c:nth-child(141) {
  animation: orbit141 14s infinite;
  animation-delay: 1.41s;
  background-color: #95a7b7;
}

@keyframes orbit141 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-13deg) rotateY(162deg) translateX(100px) rotateZ(13deg);
  }
  80% {
    transform: rotateZ(-13deg) rotateY(162deg) translateX(100px) rotateZ(13deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-13deg) rotateY(162deg) translateX(300px) rotateZ(13deg);
  }
}
.c:nth-child(142) {
  animation: orbit142 14s infinite;
  animation-delay: 1.42s;
  background-color: #95a7b7;
}

@keyframes orbit142 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-14deg) rotateY(4deg) translateX(100px) rotateZ(14deg);
  }
  80% {
    transform: rotateZ(-14deg) rotateY(4deg) translateX(100px) rotateZ(14deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-14deg) rotateY(4deg) translateX(300px) rotateZ(14deg);
  }
}
.c:nth-child(143) {
  animation: orbit143 14s infinite;
  animation-delay: 1.43s;
  background-color: #95a7b7;
}

@keyframes orbit143 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-246deg) rotateY(58deg) translateX(100px) rotateZ(246deg);
  }
  80% {
    transform: rotateZ(-246deg) rotateY(58deg) translateX(100px) rotateZ(246deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-246deg) rotateY(58deg) translateX(300px) rotateZ(246deg);
  }
}
.c:nth-child(144) {
  animation: orbit144 14s infinite;
  animation-delay: 1.44s;
  background-color: #95a7b7;
}

@keyframes orbit144 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-316deg) rotateY(195deg) translateX(100px) rotateZ(316deg);
  }
  80% {
    transform: rotateZ(-316deg) rotateY(195deg) translateX(100px) rotateZ(316deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-316deg) rotateY(195deg) translateX(300px) rotateZ(316deg);
  }
}
.c:nth-child(145) {
  animation: orbit145 14s infinite;
  animation-delay: 1.45s;
  background-color: #94a7b7;
}

@keyframes orbit145 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-15deg) rotateY(131deg) translateX(100px) rotateZ(15deg);
  }
  80% {
    transform: rotateZ(-15deg) rotateY(131deg) translateX(100px) rotateZ(15deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-15deg) rotateY(131deg) translateX(300px) rotateZ(15deg);
  }
}
.c:nth-child(146) {
  animation: orbit146 14s infinite;
  animation-delay: 1.46s;
  background-color: #94a7b7;
}

@keyframes orbit146 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-302deg) rotateY(223deg) translateX(100px) rotateZ(302deg);
  }
  80% {
    transform: rotateZ(-302deg) rotateY(223deg) translateX(100px) rotateZ(302deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-302deg) rotateY(223deg) translateX(300px) rotateZ(302deg);
  }
}
.c:nth-child(147) {
  animation: orbit147 14s infinite;
  animation-delay: 1.47s;
  background-color: #94a7b7;
}

@keyframes orbit147 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-63deg) rotateY(209deg) translateX(100px) rotateZ(63deg);
  }
  80% {
    transform: rotateZ(-63deg) rotateY(209deg) translateX(100px) rotateZ(63deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-63deg) rotateY(209deg) translateX(300px) rotateZ(63deg);
  }
}
.c:nth-child(148) {
  animation: orbit148 14s infinite;
  animation-delay: 1.48s;
  background-color: #94a7b7;
}

@keyframes orbit148 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-215deg) rotateY(144deg) translateX(100px) rotateZ(215deg);
  }
  80% {
    transform: rotateZ(-215deg) rotateY(144deg) translateX(100px) rotateZ(215deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-215deg) rotateY(144deg) translateX(300px) rotateZ(215deg);
  }
}
.c:nth-child(149) {
  animation: orbit149 14s infinite;
  animation-delay: 1.49s;
  background-color: #94a7b7;
}

@keyframes orbit149 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-67deg) rotateY(308deg) translateX(100px) rotateZ(67deg);
  }
  80% {
    transform: rotateZ(-67deg) rotateY(308deg) translateX(100px) rotateZ(67deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-67deg) rotateY(308deg) translateX(300px) rotateZ(67deg);
  }
}
.c:nth-child(150) {
  animation: orbit150 14s infinite;
  animation-delay: 1.5s;
  background-color: #94a7b8;
}

@keyframes orbit150 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-111deg) rotateY(122deg) translateX(100px) rotateZ(111deg);
  }
  80% {
    transform: rotateZ(-111deg) rotateY(122deg) translateX(100px) rotateZ(111deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-111deg) rotateY(122deg) translateX(300px) rotateZ(111deg);
  }
}
.c:nth-child(151) {
  animation: orbit151 14s infinite;
  animation-delay: 1.51s;
  background-color: #94a7b8;
}

@keyframes orbit151 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-94deg) rotateY(268deg) translateX(100px) rotateZ(94deg);
  }
  80% {
    transform: rotateZ(-94deg) rotateY(268deg) translateX(100px) rotateZ(94deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-94deg) rotateY(268deg) translateX(300px) rotateZ(94deg);
  }
}
.c:nth-child(152) {
  animation: orbit152 14s infinite;
  animation-delay: 1.52s;
  background-color: #94a7b8;
}

@keyframes orbit152 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-329deg) rotateY(260deg) translateX(100px) rotateZ(329deg);
  }
  80% {
    transform: rotateZ(-329deg) rotateY(260deg) translateX(100px) rotateZ(329deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-329deg) rotateY(260deg) translateX(300px) rotateZ(329deg);
  }
}
.c:nth-child(153) {
  animation: orbit153 14s infinite;
  animation-delay: 1.53s;
  background-color: #94a7b8;
}

@keyframes orbit153 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-51deg) rotateY(161deg) translateX(100px) rotateZ(51deg);
  }
  80% {
    transform: rotateZ(-51deg) rotateY(161deg) translateX(100px) rotateZ(51deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-51deg) rotateY(161deg) translateX(300px) rotateZ(51deg);
  }
}
.c:nth-child(154) {
  animation: orbit154 14s infinite;
  animation-delay: 1.54s;
  background-color: #93a7b8;
}

@keyframes orbit154 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-139deg) rotateY(250deg) translateX(100px) rotateZ(139deg);
  }
  80% {
    transform: rotateZ(-139deg) rotateY(250deg) translateX(100px) rotateZ(139deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-139deg) rotateY(250deg) translateX(300px) rotateZ(139deg);
  }
}
.c:nth-child(155) {
  animation: orbit155 14s infinite;
  animation-delay: 1.55s;
  background-color: #93a7b8;
}

@keyframes orbit155 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-107deg) rotateY(189deg) translateX(100px) rotateZ(107deg);
  }
  80% {
    transform: rotateZ(-107deg) rotateY(189deg) translateX(100px) rotateZ(107deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-107deg) rotateY(189deg) translateX(300px) rotateZ(107deg);
  }
}
.c:nth-child(156) {
  animation: orbit156 14s infinite;
  animation-delay: 1.56s;
  background-color: #93a7b8;
}

@keyframes orbit156 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-182deg) rotateY(13deg) translateX(100px) rotateZ(182deg);
  }
  80% {
    transform: rotateZ(-182deg) rotateY(13deg) translateX(100px) rotateZ(182deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-182deg) rotateY(13deg) translateX(300px) rotateZ(182deg);
  }
}
.c:nth-child(157) {
  animation: orbit157 14s infinite;
  animation-delay: 1.57s;
  background-color: #93a7b8;
}

@keyframes orbit157 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-124deg) rotateY(218deg) translateX(100px) rotateZ(124deg);
  }
  80% {
    transform: rotateZ(-124deg) rotateY(218deg) translateX(100px) rotateZ(124deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-124deg) rotateY(218deg) translateX(300px) rotateZ(124deg);
  }
}
.c:nth-child(158) {
  animation: orbit158 14s infinite;
  animation-delay: 1.58s;
  background-color: #93a7b9;
}

@keyframes orbit158 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-92deg) rotateY(40deg) translateX(100px) rotateZ(92deg);
  }
  80% {
    transform: rotateZ(-92deg) rotateY(40deg) translateX(100px) rotateZ(92deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-92deg) rotateY(40deg) translateX(300px) rotateZ(92deg);
  }
}
.c:nth-child(159) {
  animation: orbit159 14s infinite;
  animation-delay: 1.59s;
  background-color: #93a7b9;
}

@keyframes orbit159 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-184deg) rotateY(82deg) translateX(100px) rotateZ(184deg);
  }
  80% {
    transform: rotateZ(-184deg) rotateY(82deg) translateX(100px) rotateZ(184deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-184deg) rotateY(82deg) translateX(300px) rotateZ(184deg);
  }
}
.c:nth-child(160) {
  animation: orbit160 14s infinite;
  animation-delay: 1.6s;
  background-color: #93a7b9;
}

@keyframes orbit160 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-119deg) rotateY(124deg) translateX(100px) rotateZ(119deg);
  }
  80% {
    transform: rotateZ(-119deg) rotateY(124deg) translateX(100px) rotateZ(119deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-119deg) rotateY(124deg) translateX(300px) rotateZ(119deg);
  }
}
.c:nth-child(161) {
  animation: orbit161 14s infinite;
  animation-delay: 1.61s;
  background-color: #93a7b9;
}

@keyframes orbit161 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-136deg) rotateY(167deg) translateX(100px) rotateZ(136deg);
  }
  80% {
    transform: rotateZ(-136deg) rotateY(167deg) translateX(100px) rotateZ(136deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-136deg) rotateY(167deg) translateX(300px) rotateZ(136deg);
  }
}
.c:nth-child(162) {
  animation: orbit162 14s infinite;
  animation-delay: 1.62s;
  background-color: #92a7b9;
}

@keyframes orbit162 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-155deg) rotateY(188deg) translateX(100px) rotateZ(155deg);
  }
  80% {
    transform: rotateZ(-155deg) rotateY(188deg) translateX(100px) rotateZ(155deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-155deg) rotateY(188deg) translateX(300px) rotateZ(155deg);
  }
}
.c:nth-child(163) {
  animation: orbit163 14s infinite;
  animation-delay: 1.63s;
  background-color: #92a7b9;
}

@keyframes orbit163 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-276deg) rotateY(63deg) translateX(100px) rotateZ(276deg);
  }
  80% {
    transform: rotateZ(-276deg) rotateY(63deg) translateX(100px) rotateZ(276deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-276deg) rotateY(63deg) translateX(300px) rotateZ(276deg);
  }
}
.c:nth-child(164) {
  animation: orbit164 14s infinite;
  animation-delay: 1.64s;
  background-color: #92a7b9;
}

@keyframes orbit164 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-96deg) rotateY(223deg) translateX(100px) rotateZ(96deg);
  }
  80% {
    transform: rotateZ(-96deg) rotateY(223deg) translateX(100px) rotateZ(96deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-96deg) rotateY(223deg) translateX(300px) rotateZ(96deg);
  }
}
.c:nth-child(165) {
  animation: orbit165 14s infinite;
  animation-delay: 1.65s;
  background-color: #92a7b9;
}

@keyframes orbit165 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-128deg) rotateY(153deg) translateX(100px) rotateZ(128deg);
  }
  80% {
    transform: rotateZ(-128deg) rotateY(153deg) translateX(100px) rotateZ(128deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-128deg) rotateY(153deg) translateX(300px) rotateZ(128deg);
  }
}
.c:nth-child(166) {
  animation: orbit166 14s infinite;
  animation-delay: 1.66s;
  background-color: #92a7ba;
}

@keyframes orbit166 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-261deg) rotateY(341deg) translateX(100px) rotateZ(261deg);
  }
  80% {
    transform: rotateZ(-261deg) rotateY(341deg) translateX(100px) rotateZ(261deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-261deg) rotateY(341deg) translateX(300px) rotateZ(261deg);
  }
}
.c:nth-child(167) {
  animation: orbit167 14s infinite;
  animation-delay: 1.67s;
  background-color: #92a7ba;
}

@keyframes orbit167 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-26deg) rotateY(133deg) translateX(100px) rotateZ(26deg);
  }
  80% {
    transform: rotateZ(-26deg) rotateY(133deg) translateX(100px) rotateZ(26deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-26deg) rotateY(133deg) translateX(300px) rotateZ(26deg);
  }
}
.c:nth-child(168) {
  animation: orbit168 14s infinite;
  animation-delay: 1.68s;
  background-color: #92a7ba;
}

@keyframes orbit168 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-189deg) rotateY(100deg) translateX(100px) rotateZ(189deg);
  }
  80% {
    transform: rotateZ(-189deg) rotateY(100deg) translateX(100px) rotateZ(189deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-189deg) rotateY(100deg) translateX(300px) rotateZ(189deg);
  }
}
.c:nth-child(169) {
  animation: orbit169 14s infinite;
  animation-delay: 1.69s;
  background-color: #92a7ba;
}

@keyframes orbit169 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-116deg) rotateY(186deg) translateX(100px) rotateZ(116deg);
  }
  80% {
    transform: rotateZ(-116deg) rotateY(186deg) translateX(100px) rotateZ(116deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-116deg) rotateY(186deg) translateX(300px) rotateZ(116deg);
  }
}
.c:nth-child(170) {
  animation: orbit170 14s infinite;
  animation-delay: 1.7s;
  background-color: #92a7ba;
}

@keyframes orbit170 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-14deg) rotateY(224deg) translateX(100px) rotateZ(14deg);
  }
  80% {
    transform: rotateZ(-14deg) rotateY(224deg) translateX(100px) rotateZ(14deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-14deg) rotateY(224deg) translateX(300px) rotateZ(14deg);
  }
}
.c:nth-child(171) {
  animation: orbit171 14s infinite;
  animation-delay: 1.71s;
  background-color: #91a7ba;
}

@keyframes orbit171 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-157deg) rotateY(178deg) translateX(100px) rotateZ(157deg);
  }
  80% {
    transform: rotateZ(-157deg) rotateY(178deg) translateX(100px) rotateZ(157deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-157deg) rotateY(178deg) translateX(300px) rotateZ(157deg);
  }
}
.c:nth-child(172) {
  animation: orbit172 14s infinite;
  animation-delay: 1.72s;
  background-color: #91a7ba;
}

@keyframes orbit172 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-135deg) rotateY(166deg) translateX(100px) rotateZ(135deg);
  }
  80% {
    transform: rotateZ(-135deg) rotateY(166deg) translateX(100px) rotateZ(135deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-135deg) rotateY(166deg) translateX(300px) rotateZ(135deg);
  }
}
.c:nth-child(173) {
  animation: orbit173 14s infinite;
  animation-delay: 1.73s;
  background-color: #91a7ba;
}

@keyframes orbit173 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-147deg) rotateY(9deg) translateX(100px) rotateZ(147deg);
  }
  80% {
    transform: rotateZ(-147deg) rotateY(9deg) translateX(100px) rotateZ(147deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-147deg) rotateY(9deg) translateX(300px) rotateZ(147deg);
  }
}
.c:nth-child(174) {
  animation: orbit174 14s infinite;
  animation-delay: 1.74s;
  background-color: #91a7ba;
}

@keyframes orbit174 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-119deg) rotateY(339deg) translateX(100px) rotateZ(119deg);
  }
  80% {
    transform: rotateZ(-119deg) rotateY(339deg) translateX(100px) rotateZ(119deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-119deg) rotateY(339deg) translateX(300px) rotateZ(119deg);
  }
}
.c:nth-child(175) {
  animation: orbit175 14s infinite;
  animation-delay: 1.75s;
  background-color: #91a7bb;
}

@keyframes orbit175 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-60deg) rotateY(156deg) translateX(100px) rotateZ(60deg);
  }
  80% {
    transform: rotateZ(-60deg) rotateY(156deg) translateX(100px) rotateZ(60deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-60deg) rotateY(156deg) translateX(300px) rotateZ(60deg);
  }
}
.c:nth-child(176) {
  animation: orbit176 14s infinite;
  animation-delay: 1.76s;
  background-color: #91a7bb;
}

@keyframes orbit176 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-252deg) rotateY(79deg) translateX(100px) rotateZ(252deg);
  }
  80% {
    transform: rotateZ(-252deg) rotateY(79deg) translateX(100px) rotateZ(252deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-252deg) rotateY(79deg) translateX(300px) rotateZ(252deg);
  }
}
.c:nth-child(177) {
  animation: orbit177 14s infinite;
  animation-delay: 1.77s;
  background-color: #91a7bb;
}

@keyframes orbit177 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-136deg) rotateY(283deg) translateX(100px) rotateZ(136deg);
  }
  80% {
    transform: rotateZ(-136deg) rotateY(283deg) translateX(100px) rotateZ(136deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-136deg) rotateY(283deg) translateX(300px) rotateZ(136deg);
  }
}
.c:nth-child(178) {
  animation: orbit178 14s infinite;
  animation-delay: 1.78s;
  background-color: #91a7bb;
}

@keyframes orbit178 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-263deg) rotateY(293deg) translateX(100px) rotateZ(263deg);
  }
  80% {
    transform: rotateZ(-263deg) rotateY(293deg) translateX(100px) rotateZ(263deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-263deg) rotateY(293deg) translateX(300px) rotateZ(263deg);
  }
}
.c:nth-child(179) {
  animation: orbit179 14s infinite;
  animation-delay: 1.79s;
  background-color: #90a7bb;
}

@keyframes orbit179 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-107deg) rotateY(154deg) translateX(100px) rotateZ(107deg);
  }
  80% {
    transform: rotateZ(-107deg) rotateY(154deg) translateX(100px) rotateZ(107deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-107deg) rotateY(154deg) translateX(300px) rotateZ(107deg);
  }
}
.c:nth-child(180) {
  animation: orbit180 14s infinite;
  animation-delay: 1.8s;
  background-color: #90a7bb;
}

@keyframes orbit180 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-284deg) rotateY(139deg) translateX(100px) rotateZ(284deg);
  }
  80% {
    transform: rotateZ(-284deg) rotateY(139deg) translateX(100px) rotateZ(284deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-284deg) rotateY(139deg) translateX(300px) rotateZ(284deg);
  }
}
.c:nth-child(181) {
  animation: orbit181 14s infinite;
  animation-delay: 1.81s;
  background-color: #90a7bb;
}

@keyframes orbit181 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-360deg) rotateY(212deg) translateX(100px) rotateZ(360deg);
  }
  80% {
    transform: rotateZ(-360deg) rotateY(212deg) translateX(100px) rotateZ(360deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-360deg) rotateY(212deg) translateX(300px) rotateZ(360deg);
  }
}
.c:nth-child(182) {
  animation: orbit182 14s infinite;
  animation-delay: 1.82s;
  background-color: #90a7bb;
}

@keyframes orbit182 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-18deg) rotateY(218deg) translateX(100px) rotateZ(18deg);
  }
  80% {
    transform: rotateZ(-18deg) rotateY(218deg) translateX(100px) rotateZ(18deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-18deg) rotateY(218deg) translateX(300px) rotateZ(18deg);
  }
}
.c:nth-child(183) {
  animation: orbit183 14s infinite;
  animation-delay: 1.83s;
  background-color: #90a7bc;
}

@keyframes orbit183 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-20deg) rotateY(13deg) translateX(100px) rotateZ(20deg);
  }
  80% {
    transform: rotateZ(-20deg) rotateY(13deg) translateX(100px) rotateZ(20deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-20deg) rotateY(13deg) translateX(300px) rotateZ(20deg);
  }
}
.c:nth-child(184) {
  animation: orbit184 14s infinite;
  animation-delay: 1.84s;
  background-color: #90a7bc;
}

@keyframes orbit184 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-177deg) rotateY(347deg) translateX(100px) rotateZ(177deg);
  }
  80% {
    transform: rotateZ(-177deg) rotateY(347deg) translateX(100px) rotateZ(177deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-177deg) rotateY(347deg) translateX(300px) rotateZ(177deg);
  }
}
.c:nth-child(185) {
  animation: orbit185 14s infinite;
  animation-delay: 1.85s;
  background-color: #90a7bc;
}

@keyframes orbit185 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-77deg) rotateY(274deg) translateX(100px) rotateZ(77deg);
  }
  80% {
    transform: rotateZ(-77deg) rotateY(274deg) translateX(100px) rotateZ(77deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-77deg) rotateY(274deg) translateX(300px) rotateZ(77deg);
  }
}
.c:nth-child(186) {
  animation: orbit186 14s infinite;
  animation-delay: 1.86s;
  background-color: #90a7bc;
}

@keyframes orbit186 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-68deg) rotateY(306deg) translateX(100px) rotateZ(68deg);
  }
  80% {
    transform: rotateZ(-68deg) rotateY(306deg) translateX(100px) rotateZ(68deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-68deg) rotateY(306deg) translateX(300px) rotateZ(68deg);
  }
}
.c:nth-child(187) {
  animation: orbit187 14s infinite;
  animation-delay: 1.87s;
  background-color: #8fa7bc;
}

@keyframes orbit187 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-94deg) rotateY(343deg) translateX(100px) rotateZ(94deg);
  }
  80% {
    transform: rotateZ(-94deg) rotateY(343deg) translateX(100px) rotateZ(94deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-94deg) rotateY(343deg) translateX(300px) rotateZ(94deg);
  }
}
.c:nth-child(188) {
  animation: orbit188 14s infinite;
  animation-delay: 1.88s;
  background-color: #8fa7bc;
}

@keyframes orbit188 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-138deg) rotateY(247deg) translateX(100px) rotateZ(138deg);
  }
  80% {
    transform: rotateZ(-138deg) rotateY(247deg) translateX(100px) rotateZ(138deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-138deg) rotateY(247deg) translateX(300px) rotateZ(138deg);
  }
}
.c:nth-child(189) {
  animation: orbit189 14s infinite;
  animation-delay: 1.89s;
  background-color: #8fa7bc;
}

@keyframes orbit189 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-42deg) rotateY(338deg) translateX(100px) rotateZ(42deg);
  }
  80% {
    transform: rotateZ(-42deg) rotateY(338deg) translateX(100px) rotateZ(42deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-42deg) rotateY(338deg) translateX(300px) rotateZ(42deg);
  }
}
.c:nth-child(190) {
  animation: orbit190 14s infinite;
  animation-delay: 1.9s;
  background-color: #8fa7bc;
}

@keyframes orbit190 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-288deg) rotateY(84deg) translateX(100px) rotateZ(288deg);
  }
  80% {
    transform: rotateZ(-288deg) rotateY(84deg) translateX(100px) rotateZ(288deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-288deg) rotateY(84deg) translateX(300px) rotateZ(288deg);
  }
}
.c:nth-child(191) {
  animation: orbit191 14s infinite;
  animation-delay: 1.91s;
  background-color: #8fa7bc;
}

@keyframes orbit191 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-263deg) rotateY(114deg) translateX(100px) rotateZ(263deg);
  }
  80% {
    transform: rotateZ(-263deg) rotateY(114deg) translateX(100px) rotateZ(263deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-263deg) rotateY(114deg) translateX(300px) rotateZ(263deg);
  }
}
.c:nth-child(192) {
  animation: orbit192 14s infinite;
  animation-delay: 1.92s;
  background-color: #8fa7bd;
}

@keyframes orbit192 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-183deg) rotateY(276deg) translateX(100px) rotateZ(183deg);
  }
  80% {
    transform: rotateZ(-183deg) rotateY(276deg) translateX(100px) rotateZ(183deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-183deg) rotateY(276deg) translateX(300px) rotateZ(183deg);
  }
}
.c:nth-child(193) {
  animation: orbit193 14s infinite;
  animation-delay: 1.93s;
  background-color: #8fa7bd;
}

@keyframes orbit193 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-106deg) rotateY(122deg) translateX(100px) rotateZ(106deg);
  }
  80% {
    transform: rotateZ(-106deg) rotateY(122deg) translateX(100px) rotateZ(106deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-106deg) rotateY(122deg) translateX(300px) rotateZ(106deg);
  }
}
.c:nth-child(194) {
  animation: orbit194 14s infinite;
  animation-delay: 1.94s;
  background-color: #8fa7bd;
}

@keyframes orbit194 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-140deg) rotateY(251deg) translateX(100px) rotateZ(140deg);
  }
  80% {
    transform: rotateZ(-140deg) rotateY(251deg) translateX(100px) rotateZ(140deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-140deg) rotateY(251deg) translateX(300px) rotateZ(140deg);
  }
}
.c:nth-child(195) {
  animation: orbit195 14s infinite;
  animation-delay: 1.95s;
  background-color: #8fa7bd;
}

@keyframes orbit195 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-217deg) rotateY(243deg) translateX(100px) rotateZ(217deg);
  }
  80% {
    transform: rotateZ(-217deg) rotateY(243deg) translateX(100px) rotateZ(217deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-217deg) rotateY(243deg) translateX(300px) rotateZ(217deg);
  }
}
.c:nth-child(196) {
  animation: orbit196 14s infinite;
  animation-delay: 1.96s;
  background-color: #8ea7bd;
}

@keyframes orbit196 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-201deg) rotateY(5deg) translateX(100px) rotateZ(201deg);
  }
  80% {
    transform: rotateZ(-201deg) rotateY(5deg) translateX(100px) rotateZ(201deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-201deg) rotateY(5deg) translateX(300px) rotateZ(201deg);
  }
}
.c:nth-child(197) {
  animation: orbit197 14s infinite;
  animation-delay: 1.97s;
  background-color: #8ea7bd;
}

@keyframes orbit197 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-59deg) rotateY(340deg) translateX(100px) rotateZ(59deg);
  }
  80% {
    transform: rotateZ(-59deg) rotateY(340deg) translateX(100px) rotateZ(59deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-59deg) rotateY(340deg) translateX(300px) rotateZ(59deg);
  }
}
.c:nth-child(198) {
  animation: orbit198 14s infinite;
  animation-delay: 1.98s;
  background-color: #8ea7bd;
}

@keyframes orbit198 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-245deg) rotateY(91deg) translateX(100px) rotateZ(245deg);
  }
  80% {
    transform: rotateZ(-245deg) rotateY(91deg) translateX(100px) rotateZ(245deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-245deg) rotateY(91deg) translateX(300px) rotateZ(245deg);
  }
}
.c:nth-child(199) {
  animation: orbit199 14s infinite;
  animation-delay: 1.99s;
  background-color: #8ea7bd;
}

@keyframes orbit199 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-306deg) rotateY(77deg) translateX(100px) rotateZ(306deg);
  }
  80% {
    transform: rotateZ(-306deg) rotateY(77deg) translateX(100px) rotateZ(306deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-306deg) rotateY(77deg) translateX(300px) rotateZ(306deg);
  }
}
.c:nth-child(200) {
  animation: orbit200 14s infinite;
  animation-delay: 2s;
  background-color: #8ea7be;
}

@keyframes orbit200 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-262deg) rotateY(127deg) translateX(100px) rotateZ(262deg);
  }
  80% {
    transform: rotateZ(-262deg) rotateY(127deg) translateX(100px) rotateZ(262deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-262deg) rotateY(127deg) translateX(300px) rotateZ(262deg);
  }
}
.c:nth-child(201) {
  animation: orbit201 14s infinite;
  animation-delay: 2.01s;
  background-color: #8ea7be;
}

@keyframes orbit201 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-141deg) rotateY(145deg) translateX(100px) rotateZ(141deg);
  }
  80% {
    transform: rotateZ(-141deg) rotateY(145deg) translateX(100px) rotateZ(141deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-141deg) rotateY(145deg) translateX(300px) rotateZ(141deg);
  }
}
.c:nth-child(202) {
  animation: orbit202 14s infinite;
  animation-delay: 2.02s;
  background-color: #8ea7be;
}

@keyframes orbit202 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-354deg) rotateY(254deg) translateX(100px) rotateZ(354deg);
  }
  80% {
    transform: rotateZ(-354deg) rotateY(254deg) translateX(100px) rotateZ(354deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-354deg) rotateY(254deg) translateX(300px) rotateZ(354deg);
  }
}
.c:nth-child(203) {
  animation: orbit203 14s infinite;
  animation-delay: 2.03s;
  background-color: #8ea7be;
}

@keyframes orbit203 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-104deg) rotateY(343deg) translateX(100px) rotateZ(104deg);
  }
  80% {
    transform: rotateZ(-104deg) rotateY(343deg) translateX(100px) rotateZ(104deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-104deg) rotateY(343deg) translateX(300px) rotateZ(104deg);
  }
}
.c:nth-child(204) {
  animation: orbit204 14s infinite;
  animation-delay: 2.04s;
  background-color: #8da7be;
}

@keyframes orbit204 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-342deg) rotateY(185deg) translateX(100px) rotateZ(342deg);
  }
  80% {
    transform: rotateZ(-342deg) rotateY(185deg) translateX(100px) rotateZ(342deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-342deg) rotateY(185deg) translateX(300px) rotateZ(342deg);
  }
}
.c:nth-child(205) {
  animation: orbit205 14s infinite;
  animation-delay: 2.05s;
  background-color: #8da7be;
}

@keyframes orbit205 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-28deg) rotateY(207deg) translateX(100px) rotateZ(28deg);
  }
  80% {
    transform: rotateZ(-28deg) rotateY(207deg) translateX(100px) rotateZ(28deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-28deg) rotateY(207deg) translateX(300px) rotateZ(28deg);
  }
}
.c:nth-child(206) {
  animation: orbit206 14s infinite;
  animation-delay: 2.06s;
  background-color: #8da7be;
}

@keyframes orbit206 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-224deg) rotateY(286deg) translateX(100px) rotateZ(224deg);
  }
  80% {
    transform: rotateZ(-224deg) rotateY(286deg) translateX(100px) rotateZ(224deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-224deg) rotateY(286deg) translateX(300px) rotateZ(224deg);
  }
}
.c:nth-child(207) {
  animation: orbit207 14s infinite;
  animation-delay: 2.07s;
  background-color: #8da7be;
}

@keyframes orbit207 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-71deg) rotateY(185deg) translateX(100px) rotateZ(71deg);
  }
  80% {
    transform: rotateZ(-71deg) rotateY(185deg) translateX(100px) rotateZ(71deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-71deg) rotateY(185deg) translateX(300px) rotateZ(71deg);
  }
}
.c:nth-child(208) {
  animation: orbit208 14s infinite;
  animation-delay: 2.08s;
  background-color: #8da7bf;
}

@keyframes orbit208 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-58deg) rotateY(34deg) translateX(100px) rotateZ(58deg);
  }
  80% {
    transform: rotateZ(-58deg) rotateY(34deg) translateX(100px) rotateZ(58deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-58deg) rotateY(34deg) translateX(300px) rotateZ(58deg);
  }
}
.c:nth-child(209) {
  animation: orbit209 14s infinite;
  animation-delay: 2.09s;
  background-color: #8da7bf;
}

@keyframes orbit209 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-55deg) rotateY(354deg) translateX(100px) rotateZ(55deg);
  }
  80% {
    transform: rotateZ(-55deg) rotateY(354deg) translateX(100px) rotateZ(55deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-55deg) rotateY(354deg) translateX(300px) rotateZ(55deg);
  }
}
.c:nth-child(210) {
  animation: orbit210 14s infinite;
  animation-delay: 2.1s;
  background-color: #8da7bf;
}

@keyframes orbit210 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-81deg) rotateY(88deg) translateX(100px) rotateZ(81deg);
  }
  80% {
    transform: rotateZ(-81deg) rotateY(88deg) translateX(100px) rotateZ(81deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-81deg) rotateY(88deg) translateX(300px) rotateZ(81deg);
  }
}
.c:nth-child(211) {
  animation: orbit211 14s infinite;
  animation-delay: 2.11s;
  background-color: #8da7bf;
}

@keyframes orbit211 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-204deg) rotateY(229deg) translateX(100px) rotateZ(204deg);
  }
  80% {
    transform: rotateZ(-204deg) rotateY(229deg) translateX(100px) rotateZ(204deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-204deg) rotateY(229deg) translateX(300px) rotateZ(204deg);
  }
}
.c:nth-child(212) {
  animation: orbit212 14s infinite;
  animation-delay: 2.12s;
  background-color: #8da7bf;
}

@keyframes orbit212 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-61deg) rotateY(243deg) translateX(100px) rotateZ(61deg);
  }
  80% {
    transform: rotateZ(-61deg) rotateY(243deg) translateX(100px) rotateZ(61deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-61deg) rotateY(243deg) translateX(300px) rotateZ(61deg);
  }
}
.c:nth-child(213) {
  animation: orbit213 14s infinite;
  animation-delay: 2.13s;
  background-color: #8ca7bf;
}

@keyframes orbit213 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-168deg) rotateY(11deg) translateX(100px) rotateZ(168deg);
  }
  80% {
    transform: rotateZ(-168deg) rotateY(11deg) translateX(100px) rotateZ(168deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-168deg) rotateY(11deg) translateX(300px) rotateZ(168deg);
  }
}
.c:nth-child(214) {
  animation: orbit214 14s infinite;
  animation-delay: 2.14s;
  background-color: #8ca7bf;
}

@keyframes orbit214 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-321deg) rotateY(359deg) translateX(100px) rotateZ(321deg);
  }
  80% {
    transform: rotateZ(-321deg) rotateY(359deg) translateX(100px) rotateZ(321deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-321deg) rotateY(359deg) translateX(300px) rotateZ(321deg);
  }
}
.c:nth-child(215) {
  animation: orbit215 14s infinite;
  animation-delay: 2.15s;
  background-color: #8ca7bf;
}

@keyframes orbit215 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-167deg) rotateY(66deg) translateX(100px) rotateZ(167deg);
  }
  80% {
    transform: rotateZ(-167deg) rotateY(66deg) translateX(100px) rotateZ(167deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-167deg) rotateY(66deg) translateX(300px) rotateZ(167deg);
  }
}
.c:nth-child(216) {
  animation: orbit216 14s infinite;
  animation-delay: 2.16s;
  background-color: #8ca7bf;
}

@keyframes orbit216 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-139deg) rotateY(219deg) translateX(100px) rotateZ(139deg);
  }
  80% {
    transform: rotateZ(-139deg) rotateY(219deg) translateX(100px) rotateZ(139deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-139deg) rotateY(219deg) translateX(300px) rotateZ(139deg);
  }
}
.c:nth-child(217) {
  animation: orbit217 14s infinite;
  animation-delay: 2.17s;
  background-color: #8ca7c0;
}

@keyframes orbit217 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-223deg) rotateY(357deg) translateX(100px) rotateZ(223deg);
  }
  80% {
    transform: rotateZ(-223deg) rotateY(357deg) translateX(100px) rotateZ(223deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-223deg) rotateY(357deg) translateX(300px) rotateZ(223deg);
  }
}
.c:nth-child(218) {
  animation: orbit218 14s infinite;
  animation-delay: 2.18s;
  background-color: #8ca7c0;
}

@keyframes orbit218 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-187deg) rotateY(54deg) translateX(100px) rotateZ(187deg);
  }
  80% {
    transform: rotateZ(-187deg) rotateY(54deg) translateX(100px) rotateZ(187deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-187deg) rotateY(54deg) translateX(300px) rotateZ(187deg);
  }
}
.c:nth-child(219) {
  animation: orbit219 14s infinite;
  animation-delay: 2.19s;
  background-color: #8ca7c0;
}

@keyframes orbit219 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-207deg) rotateY(143deg) translateX(100px) rotateZ(207deg);
  }
  80% {
    transform: rotateZ(-207deg) rotateY(143deg) translateX(100px) rotateZ(207deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-207deg) rotateY(143deg) translateX(300px) rotateZ(207deg);
  }
}
.c:nth-child(220) {
  animation: orbit220 14s infinite;
  animation-delay: 2.2s;
  background-color: #8ca7c0;
}

@keyframes orbit220 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-320deg) rotateY(1deg) translateX(100px) rotateZ(320deg);
  }
  80% {
    transform: rotateZ(-320deg) rotateY(1deg) translateX(100px) rotateZ(320deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-320deg) rotateY(1deg) translateX(300px) rotateZ(320deg);
  }
}
.c:nth-child(221) {
  animation: orbit221 14s infinite;
  animation-delay: 2.21s;
  background-color: #8ba8c0;
}

@keyframes orbit221 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-117deg) rotateY(221deg) translateX(100px) rotateZ(117deg);
  }
  80% {
    transform: rotateZ(-117deg) rotateY(221deg) translateX(100px) rotateZ(117deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-117deg) rotateY(221deg) translateX(300px) rotateZ(117deg);
  }
}
.c:nth-child(222) {
  animation: orbit222 14s infinite;
  animation-delay: 2.22s;
  background-color: #8ba8c0;
}

@keyframes orbit222 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-291deg) rotateY(17deg) translateX(100px) rotateZ(291deg);
  }
  80% {
    transform: rotateZ(-291deg) rotateY(17deg) translateX(100px) rotateZ(291deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-291deg) rotateY(17deg) translateX(300px) rotateZ(291deg);
  }
}
.c:nth-child(223) {
  animation: orbit223 14s infinite;
  animation-delay: 2.23s;
  background-color: #8ba8c0;
}

@keyframes orbit223 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-139deg) rotateY(23deg) translateX(100px) rotateZ(139deg);
  }
  80% {
    transform: rotateZ(-139deg) rotateY(23deg) translateX(100px) rotateZ(139deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-139deg) rotateY(23deg) translateX(300px) rotateZ(139deg);
  }
}
.c:nth-child(224) {
  animation: orbit224 14s infinite;
  animation-delay: 2.24s;
  background-color: #8ba8c0;
}

@keyframes orbit224 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-336deg) rotateY(233deg) translateX(100px) rotateZ(336deg);
  }
  80% {
    transform: rotateZ(-336deg) rotateY(233deg) translateX(100px) rotateZ(336deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-336deg) rotateY(233deg) translateX(300px) rotateZ(336deg);
  }
}
.c:nth-child(225) {
  animation: orbit225 14s infinite;
  animation-delay: 2.25s;
  background-color: #8ba8c1;
}

@keyframes orbit225 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-60deg) rotateY(357deg) translateX(100px) rotateZ(60deg);
  }
  80% {
    transform: rotateZ(-60deg) rotateY(357deg) translateX(100px) rotateZ(60deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-60deg) rotateY(357deg) translateX(300px) rotateZ(60deg);
  }
}
.c:nth-child(226) {
  animation: orbit226 14s infinite;
  animation-delay: 2.26s;
  background-color: #8ba8c1;
}

@keyframes orbit226 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-324deg) rotateY(72deg) translateX(100px) rotateZ(324deg);
  }
  80% {
    transform: rotateZ(-324deg) rotateY(72deg) translateX(100px) rotateZ(324deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-324deg) rotateY(72deg) translateX(300px) rotateZ(324deg);
  }
}
.c:nth-child(227) {
  animation: orbit227 14s infinite;
  animation-delay: 2.27s;
  background-color: #8ba8c1;
}

@keyframes orbit227 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-284deg) rotateY(98deg) translateX(100px) rotateZ(284deg);
  }
  80% {
    transform: rotateZ(-284deg) rotateY(98deg) translateX(100px) rotateZ(284deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-284deg) rotateY(98deg) translateX(300px) rotateZ(284deg);
  }
}
.c:nth-child(228) {
  animation: orbit228 14s infinite;
  animation-delay: 2.28s;
  background-color: #8ba8c1;
}

@keyframes orbit228 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-215deg) rotateY(182deg) translateX(100px) rotateZ(215deg);
  }
  80% {
    transform: rotateZ(-215deg) rotateY(182deg) translateX(100px) rotateZ(215deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-215deg) rotateY(182deg) translateX(300px) rotateZ(215deg);
  }
}
.c:nth-child(229) {
  animation: orbit229 14s infinite;
  animation-delay: 2.29s;
  background-color: #8aa8c1;
}

@keyframes orbit229 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-109deg) rotateY(173deg) translateX(100px) rotateZ(109deg);
  }
  80% {
    transform: rotateZ(-109deg) rotateY(173deg) translateX(100px) rotateZ(109deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-109deg) rotateY(173deg) translateX(300px) rotateZ(109deg);
  }
}
.c:nth-child(230) {
  animation: orbit230 14s infinite;
  animation-delay: 2.3s;
  background-color: #8aa8c1;
}

@keyframes orbit230 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-152deg) rotateY(136deg) translateX(100px) rotateZ(152deg);
  }
  80% {
    transform: rotateZ(-152deg) rotateY(136deg) translateX(100px) rotateZ(152deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-152deg) rotateY(136deg) translateX(300px) rotateZ(152deg);
  }
}
.c:nth-child(231) {
  animation: orbit231 14s infinite;
  animation-delay: 2.31s;
  background-color: #8aa8c1;
}

@keyframes orbit231 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-1deg) rotateY(222deg) translateX(100px) rotateZ(1deg);
  }
  80% {
    transform: rotateZ(-1deg) rotateY(222deg) translateX(100px) rotateZ(1deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-1deg) rotateY(222deg) translateX(300px) rotateZ(1deg);
  }
}
.c:nth-child(232) {
  animation: orbit232 14s infinite;
  animation-delay: 2.32s;
  background-color: #8aa8c1;
}

@keyframes orbit232 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-193deg) rotateY(116deg) translateX(100px) rotateZ(193deg);
  }
  80% {
    transform: rotateZ(-193deg) rotateY(116deg) translateX(100px) rotateZ(193deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-193deg) rotateY(116deg) translateX(300px) rotateZ(193deg);
  }
}
.c:nth-child(233) {
  animation: orbit233 14s infinite;
  animation-delay: 2.33s;
  background-color: #8aa8c1;
}

@keyframes orbit233 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-296deg) rotateY(217deg) translateX(100px) rotateZ(296deg);
  }
  80% {
    transform: rotateZ(-296deg) rotateY(217deg) translateX(100px) rotateZ(296deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-296deg) rotateY(217deg) translateX(300px) rotateZ(296deg);
  }
}
.c:nth-child(234) {
  animation: orbit234 14s infinite;
  animation-delay: 2.34s;
  background-color: #8aa8c2;
}

@keyframes orbit234 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-360deg) rotateY(9deg) translateX(100px) rotateZ(360deg);
  }
  80% {
    transform: rotateZ(-360deg) rotateY(9deg) translateX(100px) rotateZ(360deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-360deg) rotateY(9deg) translateX(300px) rotateZ(360deg);
  }
}
.c:nth-child(235) {
  animation: orbit235 14s infinite;
  animation-delay: 2.35s;
  background-color: #8aa8c2;
}

@keyframes orbit235 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-179deg) rotateY(338deg) translateX(100px) rotateZ(179deg);
  }
  80% {
    transform: rotateZ(-179deg) rotateY(338deg) translateX(100px) rotateZ(179deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-179deg) rotateY(338deg) translateX(300px) rotateZ(179deg);
  }
}
.c:nth-child(236) {
  animation: orbit236 14s infinite;
  animation-delay: 2.36s;
  background-color: #8aa8c2;
}

@keyframes orbit236 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-271deg) rotateY(174deg) translateX(100px) rotateZ(271deg);
  }
  80% {
    transform: rotateZ(-271deg) rotateY(174deg) translateX(100px) rotateZ(271deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-271deg) rotateY(174deg) translateX(300px) rotateZ(271deg);
  }
}
.c:nth-child(237) {
  animation: orbit237 14s infinite;
  animation-delay: 2.37s;
  background-color: #8aa8c2;
}

@keyframes orbit237 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-257deg) rotateY(280deg) translateX(100px) rotateZ(257deg);
  }
  80% {
    transform: rotateZ(-257deg) rotateY(280deg) translateX(100px) rotateZ(257deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-257deg) rotateY(280deg) translateX(300px) rotateZ(257deg);
  }
}
.c:nth-child(238) {
  animation: orbit238 14s infinite;
  animation-delay: 2.38s;
  background-color: #89a8c2;
}

@keyframes orbit238 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-339deg) rotateY(136deg) translateX(100px) rotateZ(339deg);
  }
  80% {
    transform: rotateZ(-339deg) rotateY(136deg) translateX(100px) rotateZ(339deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-339deg) rotateY(136deg) translateX(300px) rotateZ(339deg);
  }
}
.c:nth-child(239) {
  animation: orbit239 14s infinite;
  animation-delay: 2.39s;
  background-color: #89a8c2;
}

@keyframes orbit239 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-253deg) rotateY(3deg) translateX(100px) rotateZ(253deg);
  }
  80% {
    transform: rotateZ(-253deg) rotateY(3deg) translateX(100px) rotateZ(253deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-253deg) rotateY(3deg) translateX(300px) rotateZ(253deg);
  }
}
.c:nth-child(240) {
  animation: orbit240 14s infinite;
  animation-delay: 2.4s;
  background-color: #89a8c2;
}

@keyframes orbit240 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-139deg) rotateY(261deg) translateX(100px) rotateZ(139deg);
  }
  80% {
    transform: rotateZ(-139deg) rotateY(261deg) translateX(100px) rotateZ(139deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-139deg) rotateY(261deg) translateX(300px) rotateZ(139deg);
  }
}
.c:nth-child(241) {
  animation: orbit241 14s infinite;
  animation-delay: 2.41s;
  background-color: #89a8c2;
}

@keyframes orbit241 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-28deg) rotateY(139deg) translateX(100px) rotateZ(28deg);
  }
  80% {
    transform: rotateZ(-28deg) rotateY(139deg) translateX(100px) rotateZ(28deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-28deg) rotateY(139deg) translateX(300px) rotateZ(28deg);
  }
}
.c:nth-child(242) {
  animation: orbit242 14s infinite;
  animation-delay: 2.42s;
  background-color: #89a8c3;
}

@keyframes orbit242 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-271deg) rotateY(332deg) translateX(100px) rotateZ(271deg);
  }
  80% {
    transform: rotateZ(-271deg) rotateY(332deg) translateX(100px) rotateZ(271deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-271deg) rotateY(332deg) translateX(300px) rotateZ(271deg);
  }
}
.c:nth-child(243) {
  animation: orbit243 14s infinite;
  animation-delay: 2.43s;
  background-color: #89a8c3;
}

@keyframes orbit243 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-314deg) rotateY(349deg) translateX(100px) rotateZ(314deg);
  }
  80% {
    transform: rotateZ(-314deg) rotateY(349deg) translateX(100px) rotateZ(314deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-314deg) rotateY(349deg) translateX(300px) rotateZ(314deg);
  }
}
.c:nth-child(244) {
  animation: orbit244 14s infinite;
  animation-delay: 2.44s;
  background-color: #89a8c3;
}

@keyframes orbit244 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-273deg) rotateY(247deg) translateX(100px) rotateZ(273deg);
  }
  80% {
    transform: rotateZ(-273deg) rotateY(247deg) translateX(100px) rotateZ(273deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-273deg) rotateY(247deg) translateX(300px) rotateZ(273deg);
  }
}
.c:nth-child(245) {
  animation: orbit245 14s infinite;
  animation-delay: 2.45s;
  background-color: #89a8c3;
}

@keyframes orbit245 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-59deg) rotateY(348deg) translateX(100px) rotateZ(59deg);
  }
  80% {
    transform: rotateZ(-59deg) rotateY(348deg) translateX(100px) rotateZ(59deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-59deg) rotateY(348deg) translateX(300px) rotateZ(59deg);
  }
}
.c:nth-child(246) {
  animation: orbit246 14s infinite;
  animation-delay: 2.46s;
  background-color: #88a8c3;
}

@keyframes orbit246 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-84deg) rotateY(135deg) translateX(100px) rotateZ(84deg);
  }
  80% {
    transform: rotateZ(-84deg) rotateY(135deg) translateX(100px) rotateZ(84deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-84deg) rotateY(135deg) translateX(300px) rotateZ(84deg);
  }
}
.c:nth-child(247) {
  animation: orbit247 14s infinite;
  animation-delay: 2.47s;
  background-color: #88a8c3;
}

@keyframes orbit247 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-60deg) rotateY(41deg) translateX(100px) rotateZ(60deg);
  }
  80% {
    transform: rotateZ(-60deg) rotateY(41deg) translateX(100px) rotateZ(60deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-60deg) rotateY(41deg) translateX(300px) rotateZ(60deg);
  }
}
.c:nth-child(248) {
  animation: orbit248 14s infinite;
  animation-delay: 2.48s;
  background-color: #88a8c3;
}

@keyframes orbit248 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-238deg) rotateY(274deg) translateX(100px) rotateZ(238deg);
  }
  80% {
    transform: rotateZ(-238deg) rotateY(274deg) translateX(100px) rotateZ(238deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-238deg) rotateY(274deg) translateX(300px) rotateZ(238deg);
  }
}
.c:nth-child(249) {
  animation: orbit249 14s infinite;
  animation-delay: 2.49s;
  background-color: #88a8c3;
}

@keyframes orbit249 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-279deg) rotateY(121deg) translateX(100px) rotateZ(279deg);
  }
  80% {
    transform: rotateZ(-279deg) rotateY(121deg) translateX(100px) rotateZ(279deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-279deg) rotateY(121deg) translateX(300px) rotateZ(279deg);
  }
}
.c:nth-child(250) {
  animation: orbit250 14s infinite;
  animation-delay: 2.5s;
  background-color: #88a8c4;
}

@keyframes orbit250 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-318deg) rotateY(5deg) translateX(100px) rotateZ(318deg);
  }
  80% {
    transform: rotateZ(-318deg) rotateY(5deg) translateX(100px) rotateZ(318deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-318deg) rotateY(5deg) translateX(300px) rotateZ(318deg);
  }
}
.c:nth-child(251) {
  animation: orbit251 14s infinite;
  animation-delay: 2.51s;
  background-color: #88a8c4;
}

@keyframes orbit251 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-346deg) rotateY(288deg) translateX(100px) rotateZ(346deg);
  }
  80% {
    transform: rotateZ(-346deg) rotateY(288deg) translateX(100px) rotateZ(346deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-346deg) rotateY(288deg) translateX(300px) rotateZ(346deg);
  }
}
.c:nth-child(252) {
  animation: orbit252 14s infinite;
  animation-delay: 2.52s;
  background-color: #88a8c4;
}

@keyframes orbit252 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-101deg) rotateY(95deg) translateX(100px) rotateZ(101deg);
  }
  80% {
    transform: rotateZ(-101deg) rotateY(95deg) translateX(100px) rotateZ(101deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-101deg) rotateY(95deg) translateX(300px) rotateZ(101deg);
  }
}
.c:nth-child(253) {
  animation: orbit253 14s infinite;
  animation-delay: 2.53s;
  background-color: #88a8c4;
}

@keyframes orbit253 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-212deg) rotateY(220deg) translateX(100px) rotateZ(212deg);
  }
  80% {
    transform: rotateZ(-212deg) rotateY(220deg) translateX(100px) rotateZ(212deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-212deg) rotateY(220deg) translateX(300px) rotateZ(212deg);
  }
}
.c:nth-child(254) {
  animation: orbit254 14s infinite;
  animation-delay: 2.54s;
  background-color: #88a8c4;
}

@keyframes orbit254 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-322deg) rotateY(20deg) translateX(100px) rotateZ(322deg);
  }
  80% {
    transform: rotateZ(-322deg) rotateY(20deg) translateX(100px) rotateZ(322deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-322deg) rotateY(20deg) translateX(300px) rotateZ(322deg);
  }
}
.c:nth-child(255) {
  animation: orbit255 14s infinite;
  animation-delay: 2.55s;
  background-color: #87a8c4;
}

@keyframes orbit255 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-169deg) rotateY(260deg) translateX(100px) rotateZ(169deg);
  }
  80% {
    transform: rotateZ(-169deg) rotateY(260deg) translateX(100px) rotateZ(169deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-169deg) rotateY(260deg) translateX(300px) rotateZ(169deg);
  }
}
.c:nth-child(256) {
  animation: orbit256 14s infinite;
  animation-delay: 2.56s;
  background-color: #87a8c4;
}

@keyframes orbit256 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-125deg) rotateY(114deg) translateX(100px) rotateZ(125deg);
  }
  80% {
    transform: rotateZ(-125deg) rotateY(114deg) translateX(100px) rotateZ(125deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-125deg) rotateY(114deg) translateX(300px) rotateZ(125deg);
  }
}
.c:nth-child(257) {
  animation: orbit257 14s infinite;
  animation-delay: 2.57s;
  background-color: #87a8c4;
}

@keyframes orbit257 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-49deg) rotateY(296deg) translateX(100px) rotateZ(49deg);
  }
  80% {
    transform: rotateZ(-49deg) rotateY(296deg) translateX(100px) rotateZ(49deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-49deg) rotateY(296deg) translateX(300px) rotateZ(49deg);
  }
}
.c:nth-child(258) {
  animation: orbit258 14s infinite;
  animation-delay: 2.58s;
  background-color: #87a8c4;
}

@keyframes orbit258 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-293deg) rotateY(114deg) translateX(100px) rotateZ(293deg);
  }
  80% {
    transform: rotateZ(-293deg) rotateY(114deg) translateX(100px) rotateZ(293deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-293deg) rotateY(114deg) translateX(300px) rotateZ(293deg);
  }
}
.c:nth-child(259) {
  animation: orbit259 14s infinite;
  animation-delay: 2.59s;
  background-color: #87a8c5;
}

@keyframes orbit259 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-103deg) rotateY(53deg) translateX(100px) rotateZ(103deg);
  }
  80% {
    transform: rotateZ(-103deg) rotateY(53deg) translateX(100px) rotateZ(103deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-103deg) rotateY(53deg) translateX(300px) rotateZ(103deg);
  }
}
.c:nth-child(260) {
  animation: orbit260 14s infinite;
  animation-delay: 2.6s;
  background-color: #87a8c5;
}

@keyframes orbit260 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-55deg) rotateY(68deg) translateX(100px) rotateZ(55deg);
  }
  80% {
    transform: rotateZ(-55deg) rotateY(68deg) translateX(100px) rotateZ(55deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-55deg) rotateY(68deg) translateX(300px) rotateZ(55deg);
  }
}
.c:nth-child(261) {
  animation: orbit261 14s infinite;
  animation-delay: 2.61s;
  background-color: #87a8c5;
}

@keyframes orbit261 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-266deg) rotateY(118deg) translateX(100px) rotateZ(266deg);
  }
  80% {
    transform: rotateZ(-266deg) rotateY(118deg) translateX(100px) rotateZ(266deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-266deg) rotateY(118deg) translateX(300px) rotateZ(266deg);
  }
}
.c:nth-child(262) {
  animation: orbit262 14s infinite;
  animation-delay: 2.62s;
  background-color: #87a8c5;
}

@keyframes orbit262 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-213deg) rotateY(311deg) translateX(100px) rotateZ(213deg);
  }
  80% {
    transform: rotateZ(-213deg) rotateY(311deg) translateX(100px) rotateZ(213deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-213deg) rotateY(311deg) translateX(300px) rotateZ(213deg);
  }
}
.c:nth-child(263) {
  animation: orbit263 14s infinite;
  animation-delay: 2.63s;
  background-color: #86a8c5;
}

@keyframes orbit263 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-33deg) rotateY(306deg) translateX(100px) rotateZ(33deg);
  }
  80% {
    transform: rotateZ(-33deg) rotateY(306deg) translateX(100px) rotateZ(33deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-33deg) rotateY(306deg) translateX(300px) rotateZ(33deg);
  }
}
.c:nth-child(264) {
  animation: orbit264 14s infinite;
  animation-delay: 2.64s;
  background-color: #86a8c5;
}

@keyframes orbit264 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-211deg) rotateY(165deg) translateX(100px) rotateZ(211deg);
  }
  80% {
    transform: rotateZ(-211deg) rotateY(165deg) translateX(100px) rotateZ(211deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-211deg) rotateY(165deg) translateX(300px) rotateZ(211deg);
  }
}
.c:nth-child(265) {
  animation: orbit265 14s infinite;
  animation-delay: 2.65s;
  background-color: #86a8c5;
}

@keyframes orbit265 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-236deg) rotateY(311deg) translateX(100px) rotateZ(236deg);
  }
  80% {
    transform: rotateZ(-236deg) rotateY(311deg) translateX(100px) rotateZ(236deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-236deg) rotateY(311deg) translateX(300px) rotateZ(236deg);
  }
}
.c:nth-child(266) {
  animation: orbit266 14s infinite;
  animation-delay: 2.66s;
  background-color: #86a8c5;
}

@keyframes orbit266 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-265deg) rotateY(238deg) translateX(100px) rotateZ(265deg);
  }
  80% {
    transform: rotateZ(-265deg) rotateY(238deg) translateX(100px) rotateZ(265deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-265deg) rotateY(238deg) translateX(300px) rotateZ(265deg);
  }
}
.c:nth-child(267) {
  animation: orbit267 14s infinite;
  animation-delay: 2.67s;
  background-color: #86a8c6;
}

@keyframes orbit267 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-246deg) rotateY(234deg) translateX(100px) rotateZ(246deg);
  }
  80% {
    transform: rotateZ(-246deg) rotateY(234deg) translateX(100px) rotateZ(246deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-246deg) rotateY(234deg) translateX(300px) rotateZ(246deg);
  }
}
.c:nth-child(268) {
  animation: orbit268 14s infinite;
  animation-delay: 2.68s;
  background-color: #86a8c6;
}

@keyframes orbit268 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-178deg) rotateY(317deg) translateX(100px) rotateZ(178deg);
  }
  80% {
    transform: rotateZ(-178deg) rotateY(317deg) translateX(100px) rotateZ(178deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-178deg) rotateY(317deg) translateX(300px) rotateZ(178deg);
  }
}
.c:nth-child(269) {
  animation: orbit269 14s infinite;
  animation-delay: 2.69s;
  background-color: #86a8c6;
}

@keyframes orbit269 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-194deg) rotateY(292deg) translateX(100px) rotateZ(194deg);
  }
  80% {
    transform: rotateZ(-194deg) rotateY(292deg) translateX(100px) rotateZ(194deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-194deg) rotateY(292deg) translateX(300px) rotateZ(194deg);
  }
}
.c:nth-child(270) {
  animation: orbit270 14s infinite;
  animation-delay: 2.7s;
  background-color: #86a8c6;
}

@keyframes orbit270 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-245deg) rotateY(216deg) translateX(100px) rotateZ(245deg);
  }
  80% {
    transform: rotateZ(-245deg) rotateY(216deg) translateX(100px) rotateZ(245deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-245deg) rotateY(216deg) translateX(300px) rotateZ(245deg);
  }
}
.c:nth-child(271) {
  animation: orbit271 14s infinite;
  animation-delay: 2.71s;
  background-color: #86a8c6;
}

@keyframes orbit271 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-197deg) rotateY(82deg) translateX(100px) rotateZ(197deg);
  }
  80% {
    transform: rotateZ(-197deg) rotateY(82deg) translateX(100px) rotateZ(197deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-197deg) rotateY(82deg) translateX(300px) rotateZ(197deg);
  }
}
.c:nth-child(272) {
  animation: orbit272 14s infinite;
  animation-delay: 2.72s;
  background-color: #85a8c6;
}

@keyframes orbit272 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-46deg) rotateY(13deg) translateX(100px) rotateZ(46deg);
  }
  80% {
    transform: rotateZ(-46deg) rotateY(13deg) translateX(100px) rotateZ(46deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-46deg) rotateY(13deg) translateX(300px) rotateZ(46deg);
  }
}
.c:nth-child(273) {
  animation: orbit273 14s infinite;
  animation-delay: 2.73s;
  background-color: #85a8c6;
}

@keyframes orbit273 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-103deg) rotateY(317deg) translateX(100px) rotateZ(103deg);
  }
  80% {
    transform: rotateZ(-103deg) rotateY(317deg) translateX(100px) rotateZ(103deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-103deg) rotateY(317deg) translateX(300px) rotateZ(103deg);
  }
}
.c:nth-child(274) {
  animation: orbit274 14s infinite;
  animation-delay: 2.74s;
  background-color: #85a8c6;
}

@keyframes orbit274 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-32deg) rotateY(143deg) translateX(100px) rotateZ(32deg);
  }
  80% {
    transform: rotateZ(-32deg) rotateY(143deg) translateX(100px) rotateZ(32deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-32deg) rotateY(143deg) translateX(300px) rotateZ(32deg);
  }
}
.c:nth-child(275) {
  animation: orbit275 14s infinite;
  animation-delay: 2.75s;
  background-color: #85a8c6;
}

@keyframes orbit275 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-250deg) rotateY(42deg) translateX(100px) rotateZ(250deg);
  }
  80% {
    transform: rotateZ(-250deg) rotateY(42deg) translateX(100px) rotateZ(250deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-250deg) rotateY(42deg) translateX(300px) rotateZ(250deg);
  }
}
.c:nth-child(276) {
  animation: orbit276 14s infinite;
  animation-delay: 2.76s;
  background-color: #85a8c7;
}

@keyframes orbit276 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-319deg) rotateY(3deg) translateX(100px) rotateZ(319deg);
  }
  80% {
    transform: rotateZ(-319deg) rotateY(3deg) translateX(100px) rotateZ(319deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-319deg) rotateY(3deg) translateX(300px) rotateZ(319deg);
  }
}
.c:nth-child(277) {
  animation: orbit277 14s infinite;
  animation-delay: 2.77s;
  background-color: #85a8c7;
}

@keyframes orbit277 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-235deg) rotateY(31deg) translateX(100px) rotateZ(235deg);
  }
  80% {
    transform: rotateZ(-235deg) rotateY(31deg) translateX(100px) rotateZ(235deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-235deg) rotateY(31deg) translateX(300px) rotateZ(235deg);
  }
}
.c:nth-child(278) {
  animation: orbit278 14s infinite;
  animation-delay: 2.78s;
  background-color: #85a8c7;
}

@keyframes orbit278 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-243deg) rotateY(281deg) translateX(100px) rotateZ(243deg);
  }
  80% {
    transform: rotateZ(-243deg) rotateY(281deg) translateX(100px) rotateZ(243deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-243deg) rotateY(281deg) translateX(300px) rotateZ(243deg);
  }
}
.c:nth-child(279) {
  animation: orbit279 14s infinite;
  animation-delay: 2.79s;
  background-color: #85a8c7;
}

@keyframes orbit279 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-213deg) rotateY(218deg) translateX(100px) rotateZ(213deg);
  }
  80% {
    transform: rotateZ(-213deg) rotateY(218deg) translateX(100px) rotateZ(213deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-213deg) rotateY(218deg) translateX(300px) rotateZ(213deg);
  }
}
.c:nth-child(280) {
  animation: orbit280 14s infinite;
  animation-delay: 2.8s;
  background-color: #84a8c7;
}

@keyframes orbit280 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-333deg) rotateY(93deg) translateX(100px) rotateZ(333deg);
  }
  80% {
    transform: rotateZ(-333deg) rotateY(93deg) translateX(100px) rotateZ(333deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-333deg) rotateY(93deg) translateX(300px) rotateZ(333deg);
  }
}
.c:nth-child(281) {
  animation: orbit281 14s infinite;
  animation-delay: 2.81s;
  background-color: #84a8c7;
}

@keyframes orbit281 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-226deg) rotateY(305deg) translateX(100px) rotateZ(226deg);
  }
  80% {
    transform: rotateZ(-226deg) rotateY(305deg) translateX(100px) rotateZ(226deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-226deg) rotateY(305deg) translateX(300px) rotateZ(226deg);
  }
}
.c:nth-child(282) {
  animation: orbit282 14s infinite;
  animation-delay: 2.82s;
  background-color: #84a8c7;
}

@keyframes orbit282 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-282deg) rotateY(77deg) translateX(100px) rotateZ(282deg);
  }
  80% {
    transform: rotateZ(-282deg) rotateY(77deg) translateX(100px) rotateZ(282deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-282deg) rotateY(77deg) translateX(300px) rotateZ(282deg);
  }
}
.c:nth-child(283) {
  animation: orbit283 14s infinite;
  animation-delay: 2.83s;
  background-color: #84a8c7;
}

@keyframes orbit283 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-254deg) rotateY(357deg) translateX(100px) rotateZ(254deg);
  }
  80% {
    transform: rotateZ(-254deg) rotateY(357deg) translateX(100px) rotateZ(254deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-254deg) rotateY(357deg) translateX(300px) rotateZ(254deg);
  }
}
.c:nth-child(284) {
  animation: orbit284 14s infinite;
  animation-delay: 2.84s;
  background-color: #84a8c8;
}

@keyframes orbit284 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-313deg) rotateY(109deg) translateX(100px) rotateZ(313deg);
  }
  80% {
    transform: rotateZ(-313deg) rotateY(109deg) translateX(100px) rotateZ(313deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-313deg) rotateY(109deg) translateX(300px) rotateZ(313deg);
  }
}
.c:nth-child(285) {
  animation: orbit285 14s infinite;
  animation-delay: 2.85s;
  background-color: #84a8c8;
}

@keyframes orbit285 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-266deg) rotateY(158deg) translateX(100px) rotateZ(266deg);
  }
  80% {
    transform: rotateZ(-266deg) rotateY(158deg) translateX(100px) rotateZ(266deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-266deg) rotateY(158deg) translateX(300px) rotateZ(266deg);
  }
}
.c:nth-child(286) {
  animation: orbit286 14s infinite;
  animation-delay: 2.86s;
  background-color: #84a8c8;
}

@keyframes orbit286 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-293deg) rotateY(58deg) translateX(100px) rotateZ(293deg);
  }
  80% {
    transform: rotateZ(-293deg) rotateY(58deg) translateX(100px) rotateZ(293deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-293deg) rotateY(58deg) translateX(300px) rotateZ(293deg);
  }
}
.c:nth-child(287) {
  animation: orbit287 14s infinite;
  animation-delay: 2.87s;
  background-color: #84a8c8;
}

@keyframes orbit287 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-211deg) rotateY(211deg) translateX(100px) rotateZ(211deg);
  }
  80% {
    transform: rotateZ(-211deg) rotateY(211deg) translateX(100px) rotateZ(211deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-211deg) rotateY(211deg) translateX(300px) rotateZ(211deg);
  }
}
.c:nth-child(288) {
  animation: orbit288 14s infinite;
  animation-delay: 2.88s;
  background-color: #83a8c8;
}

@keyframes orbit288 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-245deg) rotateY(233deg) translateX(100px) rotateZ(245deg);
  }
  80% {
    transform: rotateZ(-245deg) rotateY(233deg) translateX(100px) rotateZ(245deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-245deg) rotateY(233deg) translateX(300px) rotateZ(245deg);
  }
}
.c:nth-child(289) {
  animation: orbit289 14s infinite;
  animation-delay: 2.89s;
  background-color: #83a8c8;
}

@keyframes orbit289 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-296deg) rotateY(14deg) translateX(100px) rotateZ(296deg);
  }
  80% {
    transform: rotateZ(-296deg) rotateY(14deg) translateX(100px) rotateZ(296deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-296deg) rotateY(14deg) translateX(300px) rotateZ(296deg);
  }
}
.c:nth-child(290) {
  animation: orbit290 14s infinite;
  animation-delay: 2.9s;
  background-color: #83a8c8;
}

@keyframes orbit290 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-278deg) rotateY(339deg) translateX(100px) rotateZ(278deg);
  }
  80% {
    transform: rotateZ(-278deg) rotateY(339deg) translateX(100px) rotateZ(278deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-278deg) rotateY(339deg) translateX(300px) rotateZ(278deg);
  }
}
.c:nth-child(291) {
  animation: orbit291 14s infinite;
  animation-delay: 2.91s;
  background-color: #83a8c8;
}

@keyframes orbit291 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-223deg) rotateY(166deg) translateX(100px) rotateZ(223deg);
  }
  80% {
    transform: rotateZ(-223deg) rotateY(166deg) translateX(100px) rotateZ(223deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-223deg) rotateY(166deg) translateX(300px) rotateZ(223deg);
  }
}
.c:nth-child(292) {
  animation: orbit292 14s infinite;
  animation-delay: 2.92s;
  background-color: #83a8c8;
}

@keyframes orbit292 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-153deg) rotateY(34deg) translateX(100px) rotateZ(153deg);
  }
  80% {
    transform: rotateZ(-153deg) rotateY(34deg) translateX(100px) rotateZ(153deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-153deg) rotateY(34deg) translateX(300px) rotateZ(153deg);
  }
}
.c:nth-child(293) {
  animation: orbit293 14s infinite;
  animation-delay: 2.93s;
  background-color: #83a8c9;
}

@keyframes orbit293 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-140deg) rotateY(8deg) translateX(100px) rotateZ(140deg);
  }
  80% {
    transform: rotateZ(-140deg) rotateY(8deg) translateX(100px) rotateZ(140deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-140deg) rotateY(8deg) translateX(300px) rotateZ(140deg);
  }
}
.c:nth-child(294) {
  animation: orbit294 14s infinite;
  animation-delay: 2.94s;
  background-color: #83a8c9;
}

@keyframes orbit294 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-325deg) rotateY(34deg) translateX(100px) rotateZ(325deg);
  }
  80% {
    transform: rotateZ(-325deg) rotateY(34deg) translateX(100px) rotateZ(325deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-325deg) rotateY(34deg) translateX(300px) rotateZ(325deg);
  }
}
.c:nth-child(295) {
  animation: orbit295 14s infinite;
  animation-delay: 2.95s;
  background-color: #83a8c9;
}

@keyframes orbit295 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-290deg) rotateY(120deg) translateX(100px) rotateZ(290deg);
  }
  80% {
    transform: rotateZ(-290deg) rotateY(120deg) translateX(100px) rotateZ(290deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-290deg) rotateY(120deg) translateX(300px) rotateZ(290deg);
  }
}
.c:nth-child(296) {
  animation: orbit296 14s infinite;
  animation-delay: 2.96s;
  background-color: #83a8c9;
}

@keyframes orbit296 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-282deg) rotateY(210deg) translateX(100px) rotateZ(282deg);
  }
  80% {
    transform: rotateZ(-282deg) rotateY(210deg) translateX(100px) rotateZ(282deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-282deg) rotateY(210deg) translateX(300px) rotateZ(282deg);
  }
}
.c:nth-child(297) {
  animation: orbit297 14s infinite;
  animation-delay: 2.97s;
  background-color: #82a8c9;
}

@keyframes orbit297 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-218deg) rotateY(55deg) translateX(100px) rotateZ(218deg);
  }
  80% {
    transform: rotateZ(-218deg) rotateY(55deg) translateX(100px) rotateZ(218deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-218deg) rotateY(55deg) translateX(300px) rotateZ(218deg);
  }
}
.c:nth-child(298) {
  animation: orbit298 14s infinite;
  animation-delay: 2.98s;
  background-color: #82a8c9;
}

@keyframes orbit298 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-276deg) rotateY(256deg) translateX(100px) rotateZ(276deg);
  }
  80% {
    transform: rotateZ(-276deg) rotateY(256deg) translateX(100px) rotateZ(276deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-276deg) rotateY(256deg) translateX(300px) rotateZ(276deg);
  }
}
.c:nth-child(299) {
  animation: orbit299 14s infinite;
  animation-delay: 2.99s;
  background-color: #82a8c9;
}

@keyframes orbit299 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-97deg) rotateY(125deg) translateX(100px) rotateZ(97deg);
  }
  80% {
    transform: rotateZ(-97deg) rotateY(125deg) translateX(100px) rotateZ(97deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-97deg) rotateY(125deg) translateX(300px) rotateZ(97deg);
  }
}
.c:nth-child(300) {
  animation: orbit300 14s infinite;
  animation-delay: 3s;
  background-color: #82a8c9;
}

@keyframes orbit300 {
  20% {
    opacity: 1;
  }
  30% {
    transform: rotateZ(-105deg) rotateY(45deg) translateX(100px) rotateZ(105deg);
  }
  80% {
    transform: rotateZ(-105deg) rotateY(45deg) translateX(100px) rotateZ(105deg);
    opacity: 1;
  }
  100% {
    transform: rotateZ(-105deg) rotateY(45deg) translateX(300px) rotateZ(105deg);
  }
}

/******** TokenSphereBox ******/

.wrapASBlock { margin: 5px 0px 5px 0px }
.wrapASBlock div.clearfix { clear: both; }
.wrapASBlock > div { float: left; }
.wrapASBlock > div + div { float: right; }
.wrapASBlock > div:first-child { padding-top: 10px }

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
  /* also change the blend mode to what suits you, from darken, to other 
  many options as you deem fit*/
  background-size: cover;
}
`
