import React, { useMemo } from 'react'
import { NavLink } from 'react-router-dom'
import styled, {
  ThemeProvider as StyledComponentsThemeProvider,
  createGlobalStyle,
  css,
  DefaultTheme
} from 'styled-components'
import { animated } from 'react-spring'
import { useIsClassicMode, useIsDarkMode } from '../state/user/hooks'
import { Text, TextProps, Button } from 'rebass'
import { Box } from 'rebass/styled-components'
import { DialogOverlay, DialogContent } from '@reach/dialog'
import { AutoColumn } from '../components/Column'
import { RowBetween, RowFixed } from '../components/Row'
import Loader from '../components/Loader'
import { Colors } from './styled'
import { images } from './images'
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

const hexToRGB = (hexColor: string, alpha: number = 1) => {
  var parts = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexColor);
  var result = parts ? {
    r: parseInt(parts[1], 16),
    g: parseInt(parts[2], 16),
    b: parseInt(parts[3], 16)
  } : null;
  
  return (!result ? colors(false, false).black : 'rgba(' + result.r + ', ' + result.g + ', ' + result.b + ', ' +  alpha.toString() + ')');
}

export function colors(darkMode: boolean, classicMode: boolean): Colors {
  return {
    // base
    white: '#FFFFFF',
    black: '#000000',
    transparent: 'transparent',

    azure1: classicMode ? '#000000' : darkMode ? '#95e1ff' : '#000000',
    azure2: classicMode ? '#000000' : darkMode ? '#23bee5' : '#000000',
    azure3: classicMode ? '#000000' : darkMode ? '#2d72e9' : '#000000',
    azure4: classicMode ? '#000000' : darkMode ? '#126699' : '#000000',
    azure5: classicMode ? '#000000' : darkMode ? '#97c6f7' : '#000000',
    blue1: classicMode ? '#000000' : darkMode ? '#1e98dc' : '#000000',
    blue2: classicMode ? '#000000' : darkMode ? '#022b63' : '#000000',
    blue3: classicMode ? '#000000' : darkMode ? '#082751' : '#000000',
    blue4: classicMode ? '#000000' : darkMode ? '#081f3f' : '#000000',
    grey1: classicMode ? '#000000' : darkMode ? '#5e6873' : '#000000',
    grey2: classicMode ? '#000000' : darkMode ? '#C3C5CB' : '#000000',
    yellowGreen: classicMode ? '#000000' : darkMode ? '#878e13' : '#000000',
    yellowLight: classicMode ? '#000000' : darkMode ? '#ffffbe' : '#000000', 
    red1: '#FF6871',
    red2: '#F82D3A',
    green1: '#27AE60',
    yellow1: '#FFE270',
    yellow2: '#F3841E',
    grey: '#999999',

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
    
    
    //blue1: '#2172E5',
    //blue2: '#1671BB',
    cyan1: '#2f9ab8',
    cyan2: '#1992d3'
    
    
    
    // dont wanna forget these blue yet
    // blue4: darkMode ? '#153d6f70' : '#C4D9F8',
    // blue5: darkMode ? '#153d6f70' : '#EBF4FF',

    //adatpters
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
    flexColumnNoWrap: css` display: flex; flex-flow: column nowrap; `,
    flexRowNoWrap: css` display: flex; flex-flow: row nowrap;`,

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
    'url(' + images.token.classic + ') no-repeat' :
    darkMode ? 'url(' + images.token.dark + ') no-repeat' : 'url(' + images.token.light + ') no-repeat',

    swapButtonBg: 
    darkMode ?
      css`background-image:url(${images.swap.dark})` :
      css`background-image:url(${images.swap.light})`,

    swapButtonSrc: darkMode ? images.swap.dark : images.swap.light,

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
    `,
    
    hexToRGB: hexToRGB
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
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap');
html, input, textarea, button { font-family: 'Inter', sans-serif; font-display: fallback; }
@supports (font-variation-settings: normal) {
  html, input, textarea, button { font-family: 'Inter', sans-serif; }
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
`
export const ThemedGlobalStyle = createGlobalStyle`
html {
  color: ${({ theme }) => theme.text1};
  background-color: ${({ theme }) => theme.bg2};
}

body {
  min-height: 100vh;
  background-position: 0 -30vh;
  background-blend-mode: luminosity;
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-position: ${({ theme }) => (
      (theme.name == 'classic' ? '0% 0%' : 'top center' )
  )};
  background-image: ${({ theme }) => (
    (theme.name == 'classic' ? 'none' : (
      theme.name == 'dark' ? 'url(' + images.backgrounds.dark + ')' : 
      'url(../assets/images/sky-white.png)'
    ))
  )};
  background-color: ${({ theme }) => (
    (theme.name == 'classic' ? 'linear-gradient(rgba(0,0,0,.9), rgba(0,0,0,.9))' : (
      theme.name == 'dark' ? 'transparent' : 
      'linear-gradient(rgba(255,255,255,.1), rgba(255,255,255,.1))'
    ))
  )};
}

::placeholder { color: ${({ theme }) => theme.placeholderColor}; }
::-webkit-search-decoration { -webkit-appearance: none; }
::-webkit-outer-spin-button, ::-webkit-inner-spin-button { -webkit-appearance: none; }

.margin-auto { margin: auto; }
.clear-fix { clear:both !important; float:none !important; }
.text-left { text-align: left !important;}
.text-right { text-align: right !important;}
.text-center { text-align: center !important;}

/*  --------------------------------------------------------
ALPHA OPACITY
-------------------------------------------------------- */
.alpha2     { opacity: .2 !important; }
.alpha3     { opacity: .3 !important; }
.alpha4     { opacity: .4 !important; }
.alpha5     { opacity: .5 !important; }
.alpha6     { opacity: .6 !important; }
.alpha7     { opacity: .7 !important; }
.alpha8     { opacity: .8 !important; }
.alpha9     { opacity: .9 !important; }
.alpha10    { opacity: 1 !important; }
/*  --------------------------------------------------------
PADDING STYLE
-------------------------------------------------------- */
.p0      { padding: 0 !important; }
.p5      { padding: 5px !important; }
.p10     { padding: 10px !important; }
.p15     { padding: 15px !important; }
.p20     { padding: 20px !important; }
.p25     { padding: 25px !important; }
.p30     { padding: 30px !important; }
.p35     { padding: 35px !important; }
.p40     { padding: 40px !important; }
.p45     { padding: 45px !important; }
.p50     { padding: 50px !important; }
.p55     { padding: 55px !important; }
.p60     { padding: 60px !important; }
.p65     { padding: 65px !important; }
.p70     { padding: 70px !important; }
.p75     { padding: 75px !important; }
.p80     { padding: 80px !important; }
.p85     { padding: 85px !important; }
.p90     { padding: 90px !important; }
.p95     { padding: 95px !important; }
.p100    { padding: 100px !important; }

.pt0    { padding-top: 0px !important; }
.pt5    { padding-top: 5px !important; }
.pt10   { padding-top: 10px !important; }
.pt15   { padding-top: 15px !important; }
.pt20   { padding-top: 20px !important; }
.pt25   { padding-top: 25px !important; }    
.pt30   { padding-top: 30px !important; }    
.pt35   { padding-top: 35px !important; }    
.pt40   { padding-top: 40px !important; }    
.pt45   { padding-top: 45px !important; }    
.pt50   { padding-top: 50px !important; }    
.pt55   { padding-top: 55px !important; }    
.pt60   { padding-top: 60px !important; }    
.pt65   { padding-top: 65px !important; }    
.pt70   { padding-top: 70px !important; }    
.pt75   { padding-top: 75px !important; }    
.pt80   { padding-top: 80px !important; }    
.pt85   { padding-top: 85px !important; }    
.pt90   { padding-top: 90px !important; }    
.pt95   { padding-top: 95px !important; }    
.pt100  { padding-top: 100px !important; }

.pr0    { padding-right: 0px !important; }
.pr5    { padding-right: 5px !important; }
.pr10   { padding-right: 10px !important; }
.pr15   { padding-right: 15px !important; }
.pr20   { padding-right: 20px !important; }
.pr25   { padding-right: 25px !important; }    
.pr30   { padding-right: 30px !important; }    
.pr35   { padding-right: 35px !important; }    
.pr40   { padding-right: 40px !important; }    
.pr45   { padding-right: 45px !important; }    
.pr50   { padding-right: 50px !important; }    
.pr55   { padding-right: 55px !important; }    
.pr60   { padding-right: 60px !important; }    
.pr65   { padding-right: 65px !important; }    
.pr70   { padding-right: 70px !important; }    
.pr75   { padding-right: 75px !important; }    
.pr80   { padding-right: 80px !important; }    
.pr85   { padding-right: 85px !important; }    
.pr90   { padding-right: 90px !important; }    
.pr95   { padding-right: 95px !important; }    
.pr100  { padding-right: 100px !important; }

.pb0    { padding-bottom: 0px !important; }
.pb5    { padding-bottom: 5px !important; }
.pb10   { padding-bottom: 10px !important; }
.pb15   { padding-bottom: 15px !important; }
.pb20   { padding-bottom: 20px !important; }
.pb25   { padding-bottom: 25px !important; }    
.pb30   { padding-bottom: 30px !important; }    
.pb35   { padding-bottom: 35px !important; }    
.pb40   { padding-bottom: 40px !important; }    
.pb45   { padding-bottom: 45px !important; }    
.pb50   { padding-bottom: 50px !important; }    
.pb55   { padding-bottom: 55px !important; }    
.pb60   { padding-bottom: 60px !important; }    
.pb65   { padding-bottom: 65px !important; }    
.pb70   { padding-bottom: 70px !important; }    
.pb75   { padding-bottom: 75px !important; }    
.pb80   { padding-bottom: 80px !important; }    
.pb85   { padding-bottom: 85px !important; }    
.pb90   { padding-bottom: 90px !important; }    
.pb95   { padding-bottom: 95px !important; }    
.pb100  { padding-bottom: 100px !important; }

.pl0    { padding-left: 0px !important; }
.pl5    { padding-left: 5px !important; }
.pl10   { padding-left: 10px !important; }
.pl15   { padding-left: 15px !important; }
.pl20   { padding-left: 20px !important; }
.pl25   { padding-left: 25px !important; }    
.pl30   { padding-left: 30px !important; }    
.pl35   { padding-left: 35px !important; }    
.pl40   { padding-left: 40px !important; }    
.pl45   { padding-left: 45px !important; }    
.pl50   { padding-left: 50px !important; }    
.pl55   { padding-left: 55px !important; }    
.pl60   { padding-left: 60px !important; }    
.pl65   { padding-left: 65px !important; }    
.pl70   { padding-left: 70px !important; }    
.pl75   { padding-left: 75px !important; }    
.pl80   { padding-left: 80px !important; }    
.pl85   { padding-left: 85px !important; }    
.pl90   { padding-left: 90px !important; }    
.pl95   { padding-left: 95px !important; }    
.pl100  { padding-left: 100px !important; }

/*  --------------------------------------------------------
MARGIN STYLE
-------------------------------------------------------- */
.m0      { margin: 0 !important; }
.m5      { margin: 5px !important; }
.m10     { margin: 10px !important; }
.m15     { margin: 15px !important; }
.m20     { margin: 20px !important; }
.m25     { margin: 25px !important; }
.m30     { margin: 30px !important; }
.m35     { margin: 35px !important; }
.m40     { margin: 40px !important; }
.m45     { margin: 45px !important; }
.m50     { margin: 50px !important; }
.m55     { margin: 55px !important; }
.m60     { margin: 60px !important; }
.m65     { margin: 65px !important; }
.m70     { margin: 70px !important; }
.m75     { margin: 75px !important; }
.m80     { margin: 80px !important; }
.m85     { margin: 85px !important; }
.m90     { margin: 90px !important; }
.m95     { margin: 95px !important; }
.m100    { margin: 100px !important; }

.mt0    { margin-top: 0px !important; }
.mt5    { margin-top: 5px !important; }
.mt10   { margin-top: 10px !important; }
.mt15   { margin-top: 15px !important; }
.mt20   { margin-top: 20px !important; }
.mt25   { margin-top: 25px !important; }    
.mt30   { margin-top: 30px !important; }    
.mt35   { margin-top: 35px !important; }    
.mt40   { margin-top: 40px !important; }    
.mt45   { margin-top: 45px !important; }    
.mt50   { margin-top: 50px !important; }    
.mt55   { margin-top: 55px !important; }    
.mt60   { margin-top: 60px !important; }    
.mt65   { margin-top: 65px !important; }    
.mt70   { margin-top: 70px !important; }    
.mt75   { margin-top: 75px !important; }    
.mt80   { margin-top: 80px !important; }    
.mt85   { margin-top: 85px !important; }    
.mt90   { margin-top: 90px !important; }    
.mt95   { margin-top: 95px !important; }    
.mt100  { margin-top: 100px !important; }
.mt110  { margin-top: 110px !important; }
.mt120  { margin-top: 120px !important; }

.mr0    { margin-right: 0px !important; }
.mr5    { margin-right: 5px !important; }
.mr10   { margin-right: 10px !important; }
.mr15   { margin-right: 15px !important; }
.mr20   { margin-right: 20px !important; }
.mr25   { margin-right: 25px !important; }    
.mr30   { margin-right: 30px !important; }    
.mr35   { margin-right: 35px !important; }    
.mr40   { margin-right: 40px !important; }    
.mr45   { margin-right: 45px !important; }    
.mr50   { margin-right: 50px !important; }    
.mr55   { margin-right: 55px !important; }    
.mr60   { margin-right: 60px !important; }    
.mr65   { margin-right: 65px !important; }    
.mr70   { margin-right: 70px !important; }    
.mr75   { margin-right: 75px !important; }    
.mr80   { margin-right: 80px !important; }    
.mr85   { margin-right: 85px !important; }    
.mr90   { margin-right: 90px !important; }    
.mr95   { margin-right: 95px !important; }    
.mr100  { margin-right: 100px !important; }

.mb0    { margin-bottom: 0px !important; }
.mb5    { margin-bottom: 5px !important; }
.mb10   { margin-bottom: 10px !important; }
.mb15   { margin-bottom: 15px !important; }
.mb20   { margin-bottom: 20px !important; }
.mb25   { margin-bottom: 25px !important; }    
.mb30   { margin-bottom: 30px !important; }    
.mb35   { margin-bottom: 35px !important; }    
.mb40   { margin-bottom: 40px !important; }    
.mb45   { margin-bottom: 45px !important; }    
.mb50   { margin-bottom: 50px !important; }    
.mb55   { margin-bottom: 55px !important; }    
.mb60   { margin-bottom: 60px !important; }    
.mb65   { margin-bottom: 65px !important; }    
.mb70   { margin-bottom: 70px !important; }    
.mb75   { margin-bottom: 75px !important; }    
.mb80   { margin-bottom: 80px !important; }    
.mb85   { margin-bottom: 85px !important; }    
.mb90   { margin-bottom: 90px !important; }    
.mb95   { margin-bottom: 95px !important; }    
.mb100  { margin-bottom: 100px !important; }

.ml0    { margin-left: 0px !important; }
.ml5    { margin-left: 5px !important; }
.ml10   { margin-left: 10px !important; }
.ml15   { margin-left: 15px !important; }
.ml20   { margin-left: 20px !important; }
.ml25   { margin-left: 25px !important; }    
.ml30   { margin-left: 30px !important; }    
.ml35   { margin-left: 35px !important; }    
.ml40   { margin-left: 40px !important; }    
.ml45   { margin-left: 45px !important; }    
.ml50   { margin-left: 50px !important; }    
.ml55   { margin-left: 55px !important; }    
.ml60   { margin-left: 60px !important; }    
.ml65   { margin-left: 65px !important; }    
.ml70   { margin-left: 70px !important; }    
.ml75   { margin-left: 75px !important; }    
.ml80   { margin-left: 80px !important; }    
.ml85   { margin-left: 85px !important; }    
.ml90   { margin-left: 90px !important; }    
.ml95   { margin-left: 95px !important; }    
.ml100  { margin-left: 100px !important; }

/*  --------------------------------------------------------
MARGIN STYLE MINUS
-------------------------------------------------------- */
.mt-5    { margin-top: -5px !important; }
.mt-10   { margin-top: -10px !important; }
.mt-15   { margin-top: -15px !important; }
.mt-20   { margin-top: -20px !important; }
.mt-25   { margin-top: -25px !important; }    
.mt-30   { margin-top: -30px !important; }    
.mt-35   { margin-top: -35px !important; }    
.mt-40   { margin-top: -40px !important; }    
.mt-45   { margin-top: -45px !important; }    
.mt-50   { margin-top: -50px !important; }    
.mt-55   { margin-top: -55px !important; }    
.mt-60   { margin-top: -60px !important; }    
.mt-65   { margin-top: -65px !important; }    
.mt-70   { margin-top: -70px !important; }    
.mt-75   { margin-top: -75px !important; }    
.mt-80   { margin-top: -80px !important; }    
.mt-85   { margin-top: -85px !important; }    
.mt-90   { margin-top: -90px !important; }    
.mt-95   { margin-top: -95px !important; }    
.mt-100  { margin-top: -100px !important; }
.mt-110  { margin-top: -110px !important; }
.mt-120  { margin-top: -120px !important; }
.mt-130  { margin-top: -130px !important; }
.mt-140  { margin-top: -140px !important; }
.mt-150  { margin-top: -150px !important; }

.ml-5    { margin-left: -5px !important; }
.ml-10   { margin-left: -10px !important; }
.ml-15   { margin-left: -15px !important; }
.ml-20   { margin-left: -20px !important; }
.ml-25   { margin-left: -25px !important; }    
.ml-30   { margin-left: -30px !important; }    
.ml-35   { margin-left: -35px !important; }    
.ml-40   { margin-left: -40px !important; }    
.ml-45   { margin-left: -45px !important; }    
.ml-50   { margin-left: -50px !important; }    
.ml-55   { margin-left: -55px !important; }    
.ml-60   { margin-left: -60px !important; }    
.ml-65   { margin-left: -65px !important; }    
.ml-70   { margin-left: -70px !important; }    
.ml-75   { margin-left: -75px !important; }    
.ml-80   { margin-left: -80px !important; }    
.ml-85   { margin-left: -85px !important; }    
.ml-90   { margin-left: -90px !important; }    
.ml-95   { margin-left: -95px !important; }    
.ml-100  { margin-left: -100px !important; }
.ml-110  { margin-left: -110px !important; }
.ml-120  { margin-left: -120px !important; }
.ml-130  { margin-left: -130px !important; }
.ml-140  { margin-left: -140px !important; }
.ml-150  { margin-left: -150px !important; }

.mb-5    { margin-bottom: -5px !important; }
.mb-10   { margin-bottom: -10px !important; }
.mb-15   { margin-bottom: -15px !important; }
.mb-20   { margin-bottom: -20px !important; }
.mb-25   { margin-bottom: -25px !important; }    
.mb-30   { margin-bottom: -30px !important; }    
.mb-35   { margin-bottom: -35px !important; }    
.mb-40   { margin-bottom: -40px !important; }    
.mb-45   { margin-bottom: -45px !important; }    
.mb-50   { margin-bottom: -50px !important; }    
.mb-55   { margin-bottom: -55px !important; }    
.mb-60   { margin-bottom: -60px !important; }    
.mb-65   { margin-bottom: -65px !important; }    
.mb-70   { margin-bottom: -70px !important; }    
.mb-75   { margin-bottom: -75px !important; }    
.mb-80   { margin-bottom: -80px !important; }    
.mb-85   { margin-bottom: -85px !important; }    
.mb-90   { margin-bottom: -90px !important; }    
.mb-95   { margin-bottom: -95px !important; }    
.mb-100  { margin-bottom: -100px !important; }
.mb-110  { margin-bottom: -110px !important; }
.mb-120  { margin-bottom: -120px !important; }
.mb-130  { margin-bottom: -130px !important; }
.mb-140  { margin-bottom: -140px !important; }
.mb-150  { margin-bottom: -150px !important; }

.tokenSymbolImage {
  width: 110px;
  height: auto;
  display: block;
  margin-left: auto;
  margin-right: auto;
  border-radius: unset;
  box-shadow: ${({ theme }) => (
    (theme.name == 'classic' ? 
      '0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),0px 24px 32px rgba(0, 0, 0, 0.01)' : (
      theme.name == 'dark' ? 
      '0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),0px 24px 32px rgba(0, 0, 0, 0.01)' : 
      'none'
    ))
  )};
}

`
export const AppWrapper = styled.div`
  display: flex;
  flex-flow: column;
  align-items: flex-start;
  overflow-x: hidden;
`
export const HeaderWrapper = styled.div`
${({ theme }) => theme.flexRowNoWrap}
  width: 100%;
  justify-content: space-between;
`
export const BodyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-top: 25px;
  align-items: center;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 10;  
  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding-left: 16px;
    padding-right: 16px;
    padding-bottom: 16px;
    padding-top: 0rem;
  `};

  z-index: 1;
`
export const Marginer = styled.div`
  margin-top: 5rem;
`
export const MainContainer = styled.div`
  margin: 0 auto;
  padding: 5px;
  position: relative;
  max-width: 1200px;
  min-height: 620px;
  width: 100%;
  display: inline-block;
  z-index: 2;
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),0px 24px 32px rgba(0, 0, 0, 0.01);

  &.dark { border: solid 1px ${({ theme }) => theme.hexToRGB(theme.azure4, 1)}; } 
  &.light {}
  &.classic {}

  @media (max-width: 600px) { max-width: 90% !important; }
  @media (max-width: 1200px) { max-width: 90%; }

  &:before, &:after {
    content: "";
    position:absolute;
    width:305px;
    height:265px;
    background-position: center center;
    background-repeat: no-repeat;
    z-index: -41;
    opacity: 0.6;
    background-size: 100% 100%;
  }

  &.dark:before {    
    background-image: url(${(images.decorators.grid.dark)});    
    bottom: -110px;
    left: -112px;
  }
  &.dark:after {
    background-image: url(${(images.decorators.grid.dark)});
    bottom: -110px;
    right: -112px;
  }
`
export const MainContainerExtraDecorator = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: -1;

  &.top { top:0px; left:0px; }
  &.bottom { bottom: 0px; left: 0px; transform: scaleX(-1); }

  &:before, &:after {
    position: absolute;
    content: " ";
    display: block;
    width: 52px;
    height: 55px; 
    background-color: transparent; 
    background-size: 80% 80%;  
    opacity: 0.6;
  }

  &:before { top: -29px; left: -29px; }
  &:after { bottom: -29px; right: -29px; transform: rotate(180deg); }

  &.dark:before {
    background-image: url(${(images.decorators.largeBoxes.dark)});
    background-position: left top;
    background-repeat: no-repeat;
  }
  &.dark:after {
    background-image: url(${(images.decorators.largeBoxes.dark)});
    background-position: left top;
    background-repeat: no-repeat;
  }

  &.light:before {}
  &.light:after {}

  &.classic:before {}
  &.classic:after {}
`
export const MainContainerContentWrapper = styled.div`
  position: relative;
  max-width: 1200px;
  min-height: 620px;
  width: 100%;
  border-radius: 3px;
  padding: 5px 5px 5px 40px;
  background-size: cover;

  &.dark {
    background: linear-gradient(133deg, ${({ theme }) => theme.hexToRGB(theme.blue2, 0.8)} 60%, ${({ theme }) => theme.hexToRGB(theme.azure3, 0.3)} 100%);
  }
  &.light {}
  &.classic {}
`
export const FeatureTitle = styled.h2`
  writing-mode: vertical-rl;
  text-orientation: mixed;
  padding:0px;
  margin:0px;
  position: absolute;
  top: 0px;
  left: -3px;
  text-transform: capitalize;
  display: inline-block;
  z-index: 10;
  font-weight: 300;
  font-size: 33px;
  padding-top: 15px;
  padding-bottom: 170px;
  overflow: hidden;

  &.dark { color: ${({ theme }) => theme.azure5}; }
  &.light { color: #000000; }
  &.classic { color: #FFFFFF; }

  &.dark:before { }

  &.dark:after {
    content: " ";
    display: block;
    width: 1px;
    height: 120%;
    position: absolute;
    bottom: 0px;
    left: 3px;
    background: linear-gradient(0deg, rgba(15,63,115,0) 0%, ${({ theme }) => theme.hexToRGB(theme.azure1, 1)} 100%);
  }
  
  @media (max-width: 600px) { display: none; }
`
export const FeatureChildrenContainer = styled.div`
  border-radius:3px;
  max-width: 1200px;
  min-height: 580px;
  padding: 20px 7px;

  &.dark {
    background: linear-gradient(-60deg, ${({ theme }) => theme.hexToRGB(theme.blue2, 0.24)} 60%, ${({ theme }) => theme.hexToRGB(theme.azure3, 0.59)} 100%);
  }
  &.light {}
  &.classic {}
`
export const SectionTitle = styled.h6`
  font-weight: 500;
  font-size: 18px;
  position: relative;
  display: inline-block;
  margin: 0px 0px 7px 0px;
  text-transform: capitalize;
  padding:0px;
  width: 80%;

  &.dark { color: ${({ theme }) => theme.azure1}; }

  &.light {
    color: #000000;
    padding: 7px 32% 7px 10px;
    background: transparent;
    border-left: none;
  }

  &.dark:before { }

  &.dark:after {
    content: " ";
    display: block;
    width: 100%;
    height: 1px;
    position: absolute;
    bottom: -1px;
    left: 0px;
    background: linear-gradient(to right, ${({ theme }) => theme.azure1} 0%, rgba(15,63,115,0));
  }
`
export const InventoryColumn = styled.div`
  min-height: 580px;
  @media (max-width: 1350px) { display: none; }
`
export const InventoryContainer = styled.div`
  margin-right: 1rem;
  overflow-y: auto;
  max-height: 580px;
  overflow: hidden;
  @media (max-width: 1350px) { display: none; }
`
export const InventoryItemContainer = styled.div`
  padding: 10px 15px 10px 15px; 
  margin-left: 3px;
  margin-bottom: 1px;
  height: auto;
  background-size: cover;
  position: relative;
  font-weight: 500;
  font-size: 15px;
  color: ${({ theme }) => theme.text1};

  &.dark {
    background: linear-gradient(90deg, ${({ theme }) => theme.hexToRGB(theme.black, 1)} 0%, ${({ theme }) => theme.hexToRGB(theme.black, 0)} 100%);
  }

  &.dark:after {
    content: " ";
    display: block;
    position: absolute;
    width: 2px;
    height: 100%;
    top: 0px;
    left: -3px;
    background-color: ${({ theme }) => theme.black};
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

  &.dark .balanceRow > div:first-child { color: ${({ theme }) => theme.azure2}; }

  &.light .balanceRow > div:first-child,
  &.classic .balanceRow > div:first-child, {
    color: #1671BB;
  }

  & .tokenType {
    margin: 5px 0px 5px 10px;
    display: inline-block;
  }
`
export const SimpleTextParagraph = styled.p`
  font-size: 13px;
  margin: 20px 0px;
  text-align: left;

  &.dark { font-weight:400; }
  &.light {}
  &.classic {}

  &.dark > a { color: ${({ theme }) => theme.azure1}; }
  &.light > a {}
  &.light > a {}
`
export const SimpleInformationsTextParagraph = styled(SimpleTextParagraph)`
  &.dark { color: ${({ theme }) => theme.azure1}; }
  &.light {}
  &.classic {}
`
export const EvidencedTextParagraph = styled(SimpleTextParagraph)`
  font-size: 16px;
  font-weight: 400;
  
  &.dark { color: ${({ theme }) => theme.azure1}; }
  &.light {}
  &.classic {}
`

const BaseButton = styled(Button)<{ width?: string, borderRadius?: string, selected?: boolean }>`
  padding: 0px !important;
  width: ${({ width }) => (width ? width : 'auto')};
  border-radius: ${({ borderRadius }) => (borderRadius ? borderRadius : '0px')};
  display: inline-block;
  text-align: center;
  border-color: transparent;
  outline: none;
  text-decoration: none;
  display: flex;
  justify-content: center;
  flex-wrap: nowrap;
  align-items: center;
  position: relative;
  background: none;

  &:disabled { cursor: auto; }
  > * { user-select: none; }
  &.hidden { display: none !important; }
`
export const IconButton = styled(BaseButton)<{ width?: string, borderRadius?: string, selected?: boolean }>`
  cursor: pointer;
  width: fit-content;
  margin-left: 10px !important;

  & > svg, & > span.icon-symbol { width: 14px; height: 14px; }
  & > span.icon-symbol { display: inline-block; margin-right: 10px; }

  &.dark > svg, &.dark > span.icon-symbol { stroke: ${({ theme }) => theme.azure1}; color: ${({ theme }) => theme.azure1}; }
  &.light > svg, &.light > span.icon-symbol {}
  &.classic > svg, &.classic > span.icon-symbol {}

  &.dark:hover > svg, &.dark:focus > svg { filter: drop-shadow(0px 0px 3px ${({ theme }) => theme.yellowLight}); }
  &.dark:hover > span.icon-symbol, &.dark:focus > span.icon-symbol { text-shadow: 0px 0px 3px ${({ theme }) => theme.yellowLight}; }

  &.light:hover > svg, &.light:focus > svg {  }
  &.light:classic > svg, &.light:classic > svg {  }

  &.popup-close-icon, &.modal-close-icon  { position: absolute; right: 10px; top: 10px; }
`
export const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 80% auto;
`
export const PageGridContainer = styled.div`
  display: grid;
  grid-template-columns: 30% auto;
  @media (min-width: 601px) and (max-width: 1350px) { grid-template-columns: auto !important; }
  @media (max-width: 600px) { grid-template-columns: auto !important; }

  &.swap {}
  &.pool {}

  &.pool > .left-column { padding: 0 1rem 1rem 1rem; }
`
export const PageItemsContainer = styled.div`
  &.dark {}
  &.light {}
  &.classic {}

  &.swap { min-height: 580px; }
`
export const FooterInfo = styled.div`
  font-size: small;
  z-index: 99;
  text-align: center;
  width: 100%;
  display: grid;
  grid-template-columns: 30% auto;  

  &.dark {}
  &.light {}
  &.classic {}

  &.dark > div.swapCaption {     
    margin: 0px auto -20px auto;
  }

`
export const TabsBar = styled.div`
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
    bottom: -29px;
    background: linear-gradient(90deg,rgba(129,205,243,0) 0,#81cdf3 5%, #81cdf3 95%, rgba(129,205,243,0));
  }

  &.dark:after, &.light:after { }
`
const tabLinkItemActiveClassName = 'active'
export const TabLinkItem = styled(NavLink).attrs({ tabLinkItemActiveClassName })`
  display: flex;
  flex-flow: row nowrap;
  align-items: left;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  font-size: 18px;
  width: fit-content;
  margin: 0 12px;
  font-weight: 500;
  float: right;
  
  &.dark { color: ${({ theme }) => theme.white}; }
  &.light { color: ${({ theme }) => theme.grey1}; }
  &.classic { color: #C3C5CB; }

  &.${tabLinkItemActiveClassName} { }

  &.dark.${tabLinkItemActiveClassName} { color: ${({ theme }) => theme.azure1}; }
  &.light.${tabLinkItemActiveClassName} { color: #2f9ab8; }
  &.classic.${tabLinkItemActiveClassName} { color: #2f9ab8; }

  &.dark:hover, &.dark:focus { color: ${({ theme }) => theme.azure1}; }
  &.light:hover, &.light:focus { }
  &.classic:hover, &.classic:focus { }

  &.dark.disabled, &.light.disabled, &.classic.disabled { opacity: 0.7; color: ${({ theme }) => theme.grey1}; }

  &.dark.disabled:hover, &.dark.disabled:focus,
  &.light.disabled:hover, &.light.disabled:focus,
  &.classic.disabled:hover, &.classic.disabled:focus { opacity: 1; }
`
export const PageContentContainer = styled.div`
  margin-top:40px;
  @media (min-width: 1050px) {
    display: grid;
    grid-template-columns: 42.5% 15% 42.5%;
  }
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
  z-index: 1;

  & > .itemsContainer { border-radius: ${({ hideInput }) => (hideInput ? '8px' : '20px')}; }

  & > .itemsContainer .labelRow {
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    color: ${({ theme }) => theme.text1};
    font-size: 0.75rem;
    line-height: 1rem;
    padding: 0rem 1rem 0 1rem;    
  }

  & > .itemsContainer .labelRow span:hover { cursor: pointer; }

  & > .itemsContainer .label { font-weight: 500; font-size: 14px; display: inline; }
  & > .itemsContainer .label.link { cursor: pointer; }

  &.dark > .itemsContainer .label { color: #95e1ff; }
  &.light > .itemsContainer .label { }
  &.classic > .itemsContainer .label {}
`
export const ActionButton = styled(BaseButton)<{ disabled?: boolean, selected?: boolean, useCustomProperties?: boolean }>`
  border-radius: 3px !important;
  font-size: 12px !important;
  font-weight: 500;
  text-transform: capitalize;
  text-align: center;
  letter-spacing: 0.1em;
  padding: 3px 7px !important;

  & > label, & > label + svg { display: block; float: left; }
  & > label + svg { width: 15px; }
  & > label { margin-top: 3px; margin-right: 5px; }

  &.dark {
    color: ${({ theme }) => theme.yellowGreen} !important;
    border: 1px solid ${({ theme }) => theme.yellowGreen} !important;
    background-color: ${({ theme }) => theme.blue3};
  }

  &.light {}
  &.classic {}

  &.dark:hover, &.dark:focus { box-shadow: 0px 0px 4px ${({ theme }) => theme.yellowGreen}; }
  &.light:hover, &.light:focus { }
  &.classic:hover, &.classic:focus { }
`
const InfoCard = styled.button<{ active?: boolean }>`
  border-radius: 3px !important;
  font-size: 12px !important;
  font-weight: 500;
  text-transform: capitalize;
  text-align: center;
  letter-spacing: 0.1em;
  padding: 10px 10px !important;

  &.dark {
    color: ${({ theme }) => theme.azure1} !important;
    border: 1px solid ${({ theme }) => theme.azure1} !important;
    background-color: ${({ theme }) => theme.blue3};
  }

  &.light {}
  &.classic {}

  &.dark:hover, &.dark:focus { box-shadow: 0px 0px 4px ${({ theme }) => theme.azure1}; }
  &.light:hover, &.light:focus { }
  &.classic:hover, &.classic:focus { }
`
const OptionCard = styled(InfoCard as any)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: 2rem;
  padding: 1rem;
`
export const OptionCardClickable = styled(OptionCard as any)<{ clickable?: boolean }>`
  margin-top: 0;
  &:hover { cursor: ${({ clickable }) => (clickable ? 'pointer' : '')}; }
  opacity: ${({ disabled }) => (disabled ? '0.5' : '1')};
`
export const OptionCardLeft = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap};
  justify-content: center;
  height: 100%;

  & > .header-text { position: relative; }
  & > .header-text.active { padding: 12px 0px 12px 25px; }
  & > .header-text.active:before {
    content: "";
    position:absolute;
    top: 50%;
    left: 10px;
    border-radius: 50%;
    width: 12px;
    height: 12px;
    background-color: ${({ theme }) => theme.green1};
    margin-top: -6px;
  }
`
export const OptionCardIconWrapper = styled.div<{ size?: number | null }>`
  ${({ theme }) => theme.flexColumnNoWrap};
  align-items: center;
  justify-content: center;
  & > img, span { height: ${({ size }) => (size ? size + 'px' : '24px')}; width: ${({ size }) => (size ? size + 'px' : '24px')}; }
  ${({ theme }) => theme.mediaWidth.upToMedium` align-items: flex-end; `};
`
export const DropDownButton = styled(BaseButton)<{ width?: string, borderRadius?: string, selected?: boolean }>`
  align-items: center;
  height: 2.2rem;
  font-size: 20px;
  font-weight: 500;
  background-color: transparent;
  outline: none;
  cursor: pointer;
  user-select: none;
  border: none;

  &.dark { color: ${({ theme }) => theme.azure1 }; }
  &.light {}
  &.classic {}

  &.dark > svg { filter: drop-shadow(1px 2px 3px ${({ theme }) => theme.blue3}); }
  &.light > svg {}
  &.light > svg {}
`
export const SwitchButton = styled(Button)<{disabled?: boolean}>`
  padding: 0px !important;
  border-radius: 0px !important;
  display: inline-block;
  text-align: center;
  border-color: transparent;
  outline: none;
  text-decoration: none;
  display: flex;
  justify-content: center;
  flex-wrap: nowrap;
  align-items: center;
  position: relative;
  background: none;
  transform: rotate(45deg);
  width: 30px;
  height: 30px;
  cursor: pointer;

  &:disabled, &.disabled, &.dark.disabled, &.light.disabled, &.classic.disabled,
  &.dark.disabled:hover, &.dark.disabled:focus,
  &.light.disabled:hover, &.light.disabled:focus,
  &.classic.disabled:hover, &.classic.disabled:focus { cursor: auto; opacity: 0.4; box-shadow: none; }
  > * { user-select: none; }
  &.hidden { display: none !important; }

  & > svg { width: 15px; height: 15px; transform: rotate(-45deg); margin-left: -1px; margin-bottom: -1px; }

  &:after, &:before {
    content: "";
    display:block;
    position:absolute;
    width: 46px;
    height: 1px;
    transform: rotate(-45deg);
  }

  &:after { bottom: 44px; right: -39px; }
  &:before { top: 44px; left: -39px; }

  &.dark { border: solid 1px ${({ theme }) => theme.azure1 }; background-color: ${({ theme }) => theme.black }; }
  &.light {}
  &.classic {}

  &.dark:hover, &.dark:focus { box-shadow: 0px 0px 12px ${({ theme }) => theme.azure1 }; }
  &.light:hover, &.light:focus { }
  &.classic:hover, &.classic:focus { }

  &.dark:after { background: linear-gradient(to right, ${({ theme }) => theme.azure1} 0%, rgba(15,63,115,0)); }
  &.dark:before { background: linear-gradient(to right, rgba(15,63,115,0) 0%, ${({ theme }) => theme.azure1} 100%); }

  &.light:after {}
  &.light:before {}

  &.classic:after {}
  &.classic:before {}
`
export const OperationButton = styled(Button)<{label?: string, disabled?: boolean}>`
  padding: 0px !important;
  border-radius: 0px !important;
  display: inline-block;
  text-align: center;
  border-color: transparent;
  outline: none;
  text-decoration: none;
  display: flex;
  justify-content: center;
  flex-wrap: nowrap;
  align-items: center;
  position: relative;
  background: none;
  transform: rotate(45deg);
  width: 30px;
  height: 30px;
  cursor: pointer;

  &:disabled, &.disabled, &.dark.disabled, &.light.disabled, &.classic.disabled,
  &.dark.disabled:hover, &.dark.disabled:focus,
  &.light.disabled:hover, &.light.disabled:focus,
  &.classic.disabled:hover, &.classic.disabled:focus { cursor: auto; opacity: 0.4; box-shadow: none; }
  > * { user-select: none; }
  &.hidden { display: none !important; }

  & > svg { width: 15px; height: 15px; transform: rotate(-45deg); margin-left: -1px; margin-bottom: -1px; }

  &:after, &:before {
    content: "";
    display:block;
    position:absolute;
    width: 216px;
    height: 1px;
    transform: rotate(-45deg);    
  }

  &:after { 
    content: ${({ label }) => (label ? "\"" + label + "\"" : "\"" + + "\"")}; 
    bottom: 94px; 
    right: -144px;
    background: transparent;
    text-align: left;
    padding: 106px 0px 0px 41px;
  }

  &:before { bottom: 103px; right: -183px;  }

  &.dark { border: solid 1px ${({ theme }) => theme.azure1 }; background-color: ${({ theme }) => theme.black }; }
  &.light {}
  &.classic {}

  &.dark:hover, &.dark:focus { box-shadow: 0px 0px 12px ${({ theme }) => theme.azure1 }; }
  &.dark:hover::after { text-shadow: 0px 0px 12px ${({ theme }) => theme.azure1 }; }
  &.light:hover, &.light:focus { }
  &.light:hover::after { }
  &.classic:hover, &.classic:focus { }
  &.classic:hover::after { }

  &.dark:before { background: linear-gradient(to right, ${({ theme }) => theme.azure1} 0%, rgba(15,63,115,0) 100%); }
  &.dark:after {
    font-weight: 500;
    font-size:14px;
    color: ${({ theme }) => theme.azure1 };
    text-shadow: 1px 1px 2px ${({ theme }) => theme.blue3 }; 
  }

  &.light:after {}
  &.light:before {}

  &.classic:after {}
  &.classic:before {}

  &.add-a-send-button { position: absolute; top: 120px; left: 70px; }  
  &.connect-wallet-button { margin-left: -170px; }
  &.wrap-button { margin-left: -190px; }
`
export const MainOperationButton = styled(ActionButton)<{ disabled?: boolean, selected?: boolean, useCustomProperties?: boolean }>`
  font-size: 16px !important;
  padding: 5px 10px !important;

  &:disabled { opacity: 0.5; }

  &.dark.use-custom-properties.expert-mode:not([disabled]),
  &.dark.popup-button.dismiss { 
    border: 1px solid ${({ theme }) => theme.red1} !important;
    color: ${({ theme }) => theme.red1} !important;
  }

  &.dark, &.dark:disabled {
    color: ${({ theme }) => theme.azure2} !important;
    border: 1px solid ${({ theme }) => theme.azure2} !important;
    background-color: ${({ theme }) => theme.blue3};
  }

  &.dark:hover, &.dark:focus { box-shadow: 0px 0px 4px ${({ theme }) => theme.azure2}; }
  &.dark.use-custom-properties.expert-mode:hover, 
  &.dark.use-custom-properties.expert-mode:focus { box-shadow: 0px 0px 4px ${({ theme }) => theme.red2}; }
  &:disabled.dark:hover, &:disabled.dark:focus { box-shadow: none; } 

  &.light {}
  &.classic {}
  
`
export const TradePriceContainer = styled.div`
  margin-top: 250px;
  @media (max-width: 960px) { padding-left: 30px; }
  @media (max-width: 1920px) { padding-left: 30px; }
`
export const AddRecipientPanel = styled.div`
  position: absolute;
  top: 120px;
  left: 70px;
`
export const InputPanel = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap}
  position: relative;
  border-radius: 0px;
  background-color: transparent;
  z-index: 1;
  width: 100%;
`
export const ContainerRow = styled.div<{ error?: boolean }>`
  border: none;
  background: none;
  position:relative;

  &.dark {}
  &.light {}
  &.classic {}

  &:after {
    content: "";
    position: absolute;
    width: 0%;
    height: 1px;
    transition: width .3s;
    bottom: 0px;
    left: 0px; 
  }

  &.dark:after { background-color: ${({ theme, error }) => error ? theme.red2 : theme.azure1 }; }
  &.light:after {}
  &.classic:after {}

  &:hover::after { width: 100%; }

  & > div.input-container { flex: 1; padding: 3px; }
  & > div.input-container > label, & > div.input-container > a { 
    font-size: 13px;
    font-weight: 500;
    display: block;
    float: right;
    margin: 0px 0px 10px 10px;
  }

  &.dark > div.input-container > a { color: ${({ theme }) => theme.azure1 }; }
  &.light > div.input-container > a { }
  &.classic > div.input-container > a { }

  &.search-token-container { margin-bottom: 20px; }

  &.dark.search-token-container { border-bottom: solid 1px ${({ theme }) => theme.hexToRGB(theme.white, 0.2) }; }
`
export const Input = styled.input<{ error?: boolean }>`
  font-size: 16px;
  outline: none;
  border: none;
  flex: 1 1 auto;
  width: 0;
  background-color: transparent;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 500;
  width: 100%;  
  padding: 0px;
  -webkit-appearance: textfield;  

  &.dark { color: ${({ error, theme }) => (error ? theme.red1 : theme.white)}; }
  &.light {}
  &.classic {}
`
export const SearchTokenInput = styled(Input)`
  padding-bottom: 10px;
  font-weight: 300;
`

export const SwapButtonsContainer = styled.div`
  justify-content: center;
  display: flex;
  padding: 1rem 0rem;
  width:auto;
`
export const SecondaryPanelBoxContainer = styled.div`
  padding: 5px;
  position: relative;
  z-index: 2;

  &.dark { border: solid 1px ${({ theme }) => theme.hexToRGB(theme.azure4, 1)}; } 
  &.light {}
  &.classic {}

  &.dark > .inner-content {
    border-radius: 3px;
    width: 100%;
    padding: 5px 5px 5px 5px;
    background-size: cover;
    background: linear-gradient(90deg, ${({ theme }) => theme.hexToRGB(theme.blue4, 0.8)} 60%, ${({ theme }) => theme.hexToRGB(theme.blue3, 0.8)} 100%);
  }

  &.light > .inner-content {}
  &.classic > .inner-content {}

  &.modal > .inner-content { height: 100%; }

  ${({ theme }) => theme.mediaWidth.upToSmall`&.popup{ min-width: 290px; } &.popup:not(:last-of-type) { margin-right: 20px; } `}
  
  &.popup > .popup-inner-content, &.modal > .modal-inner-content { padding: 10px 20px; }

  &.popup > .popup-inner-content h6 { font-size: 13px; margin: 0px 0px 15px 0px; }
  &.popup > .popup-inner-content h6 + ul { font-size: 13px; }

  &.modal > .modal-inner-content h6 { font-size: 15px; margin: 0px 0px 15px 0px; }
  &.modal > .modal-inner-content h6.with-content-divisor { position:relative; padding-bottom: 15px; }
  &.modal > .modal-inner-content h6.with-content-divisor:after {
    content: "";
    display:block;
    position:absolute;
    bottom: 1px;
    left: 0px;
    width: 100%;
    height: 1px;
  }

  &.dark.modal > .modal-inner-content h6.with-content-divisor:after { background-color: ${({ theme }) => theme.azure1 } }
  &.light.modal > .modal-inner-content h6.with-content-divisor:after {}
  &.classic.modal > .modal-inner-content h6.with-content-divisor:after {}

  &.popup > .popup-inner-content .popup-operations-container { overflow: hidden; padding-top: 15px; }
  &.popup > .popup-inner-content .popup-operations-container button { font-size: 12px !important; }
  &.popup > .popup-inner-content .popup-operations-container button:last-child { float: right; }

  &.dark.popup > .popup-inner-content h6, &.dark.modal > .modal-inner-content h6 { color: ${({ theme }) => theme.azure1 } }
  &.dark.popup > .popup-inner-content h6 svg, &.dark.modal > .modal-inner-content h6 svg  { stroke: ${({ theme }) => theme.azure1 } }
  &.light.popup > .popup-inner-content h6, &.light.modal > .modal-inner-content h6  { }
  &.classic.popup > .popup-inner-content h6, &.classic.modal > .modal-inner-content h6 { }

  &.modal > .modal-inner-content .modal-content-wrapper > .connect-wallet-terms-and-conditions { 
    display: flex;
    margin-bottom: 15px;
    padding: 15px 0px 15px 0px;
  }

  &.modal > .modal-inner-content .modal-content-wrapper > .connect-wallet-terms-and-conditions > label { font-size: 15px; }
  &.modal > .modal-inner-content .modal-content-wrapper > .connect-wallet-terms-and-conditions > label > input { margin-right: 10px; }

  &.dark.modal > .modal-inner-content .modal-content-wrapper > .connect-wallet-terms-and-conditions { 
    border-top: solid 1px ${({ theme }) => theme.azure1 };
    border-bottom: solid 1px ${({ theme }) => theme.azure1 };
  }

  &.light.modal > .modal-inner-content .modal-content-wrapper > .connect-wallet-terms-and-conditions { 
  }

  &.classic.modal > .modal-inner-content .modal-content-wrapper > .connect-wallet-terms-and-conditions { 
  }

  &.settings-menu-panel {
    min-width: 20.125rem;
    display: flex;
    flex-direction: column;
    font-size: 1rem;
    position: absolute;
    top: -21rem;
    right: 1rem;
    z-index: 100;

    ${({ theme }) => theme.mediaWidth.upToExtraSmall` min-width: 18.125rem; right: -46px; `};
    ${({ theme }) => theme.mediaWidth.upToMedium` min-width: 18.125rem; top: -22rem; right: 2rem; @media (max-width: 960px) { top: -19.5rem; } `};
  }

  &.settings-menu-panel .sectionHeader { font-weight: 500; font-size: 14px; }
  &.settings-menu-panel .sectionOption { font-weight: 500; font-size: 14px; }

  &.dark.settings-menu-panel .sectionOption { color: ${({ theme }) => theme.grey2 }; }
  &.light.settings-menu-panel .sectionOption { }
  &.classic.settings-menu-panel .sectionOption { }
`
export const SecondaryPanelBoxContainerExtraDecorator = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: -1;
  top: 0px;
  left: 0px;

  &.top { top:0px; left:0px; }
  &.bottom { bottom: 0px; left: 0px; transform: scaleX(-1); }

  &:before, &:after {
    position: absolute;
    content: " ";
    display: block;
    width: 12px;
    height: 12px; 
    background-color: transparent; 
    background-size: 100% 100%;  
    opacity: 1;
  }

  &:before { top: -8px; left: -8px; }
  &:after { bottom: -8px; right: -8px; transform: rotate(180deg); }

  &.dark:before {
    background-image: url(${(images.decorators.smallBoxes.dark)});
    background-position: left top;
    background-repeat: no-repeat;
  }
  &.dark:after {
    background-image: url(${(images.decorators.smallBoxes.dark)});
    background-position: left top;
    background-repeat: no-repeat;
  }

  &.light:before {}
  &.light:after {}

  &.classic:before {}
  &.classic:after {}
`
export const WalletConnectorsContainer = styled.div`
  display: grid;
  grid-gap: 10px;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    grid-template-columns: 1fr;
    grid-gap: 10px;
  `};
`
const Fader = styled.div`
  position: absolute;
  bottom: 0px;
  left: 0px;
  width: 100%;
  height: 2px;
`
export const AnimatedFader = animated(Fader)

export const AdvancedDetailsFooter = styled.div<{ show: boolean }>` 
  display: ${({ show }) => (show ? 'block' : 'none')};
  transform: ${({ show }) => (show ? 'translateY(0%)' : 'translateY(-100%)')};
  width: 100%;
  z-index: -1;
  transition: transform 300ms ease-in-out;
  @media (max-width: 600px) { padding-left: -2rem !important; }
`
const AnimatedDialogOverlay = animated(DialogOverlay)
export const ThemedDialogOverlay = styled(AnimatedDialogOverlay)`
  &[data-reach-dialog-overlay] {
    z-index: 2;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &.dark[data-reach-dialog-overlay] { background-color: ${({ theme }) => theme.hexToRGB(theme.black, 0.8)}; }
  &.light[data-reach-dialog-overlay] {}
  &.classic[data-reach-dialog-overlay] {}
`
const AnimatedDialogContent = animated(DialogContent)
export const ThemedDialogContent = styled(({ minHeight, maxHeight, mobile, isOpen, ...rest }) => (
  <AnimatedDialogContent {...rest} />
)).attrs({ 'aria-label': 'dialog' })`
  overflow-y: ${({ mobile }) => (mobile ? 'scroll' : 'hidden')};

  &[data-reach-dialog-content] {
    background-color: transparent;
    margin: 0 0 2rem 0;
    padding: 0px;
    width: 50vw;
    overflow-y: ${({ mobile }) => (mobile ? 'scroll' : 'hidden')};
    overflow-x: hidden;
    align-self: ${({ mobile }) => (mobile ? 'flex-end' : 'center')};
    max-width: 420px;
    ${({ maxHeight }) => maxHeight && css` max-height: ${maxHeight}vh; `}
    ${({ minHeight }) => minHeight && css` min-height: ${minHeight}vh; `}
    display: flex;
    ${({ theme }) => theme.mediaWidth.upToMedium` width: 65vw; margin: 0; `}
    ${({ theme, mobile }) => theme.mediaWidth.upToSmall` width:  85vw; ${mobile && css` width: 100vw; `} `}
  }
  
  &[data-reach-dialog-content] > .token-selection-content-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    flex: 1 1 0%;
  }

  &[data-reach-dialog-content] > .token-selection-content-container .modal-close-icon { right: 0px; top: 0px; }
`
export const SearchTokenFormItems = styled(AutoColumn)`
  display: grid;
  grid-auto-rows: auto;
  grid-row-gap: 10px;
  position: relative;
  padding: 0px 0px 15px 0px;
  margin-bottom: 15px;

  &.dark {
    border-bottom: solid 1px ${({ theme }) => theme.azure1 };
  }
  &.light {}
  &.classic {}

  & + .tokens-list-container { flex: 1 1 0%; }
  & + .tokens-list-container.dark { border-bottom: solid 1px ${({ theme }) => theme.azure1 };}
  & + .tokens-list-container.light {}
  & + .tokens-list-container.classic {}
`

export const InfoBox = styled.div`
  padding: 10px;
  border-radius: 3px;
  margin: 10px auto;

  &.dark {}
  &.light {}
  &.classic {}

  &.dark.info {
    border: solid 1px ${({ theme }) => theme.azure1 };
    color: ${({ theme }) => theme.azure1 };
  }
  &.light.info {}
  &.light.info {}

  &.dark.warning {
    border: solid 1px ${({ theme }) => theme.yellowGreen };
    color: ${({ theme }) => theme.yellowGreen };
  }
  &.light.warning {}
  &.light.warning {}

  &.dark.error {     
    border: solid 1px ${({ theme }) => theme.red1 };
    color: ${({ theme }) => theme.red1 };
  }
  &.light.error {}
  &.light.error {}
`
export const ModalCaption = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  margin: 20px auto;
  font-size: 15px;
`
export const LoaderBoxContainer = styled.div`
  
`
export const StyledLoader = styled(Loader)`
  margin-right: 10px;
`
export const LoadingMessage = styled.div<{ error?: boolean }>`
  ${({ theme }) => theme.flexRowNoWrap};
  align-items: center;
  justify-content: flex-start;
  color: ${({ theme, error }) => (error ? theme.red1 : theme.azure1)};
  & > * { padding: 10px; }
`
export const LoaderErrorGroup = styled.div`
  ${({ theme }) => theme.flexRowNoWrap};
  align-items: center;
  justify-content: flex-start;
`
export const LoaderErrorButton = styled.div`
  border-radius: 8px;
  font-size: 12px;
  color: ${({ theme }) => theme.text1};
  background-color: ${({ theme }) => theme.bg4};
  margin-left: 1rem;
  padding: 0.5rem;
  font-weight: 600;
  user-select: none;

  &:hover { cursor: pointer; }
`
export const LoadingWrapper = styled.div`
  ${({ theme }) => theme.flexRowNoWrap};
  align-items: center;
  justify-content: center;
`
const SettingsMenuOptionBase = styled.button`
  align-items: center;
  height: 2rem;
  border-radius: 3px;
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

  &.dark input { color: ${({ theme }) => theme.white }; }
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
  border-radius: 3px;
  padding: 0.35rem 0.6rem;
  background: ${({ theme, isActive, isOnSwitch }) => (isActive ? (isOnSwitch ? theme.bg7 : theme.text4) : 'none')};
  font-weight: 500;
  :hover { user-select: ${({ isOnSwitch }) => (isOnSwitch ? 'none' : 'initial')}; }

  &.dark { 
    color: ${({ theme }) => theme.white };
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
export const PaddedColumn = styled(AutoColumn)`
  padding: 20px;
  padding-bottom: 12px;
`
export const SearchTokenListItem = styled(RowBetween)`
  padding: 4px 20px;
  height: 56px;
  display: grid;
  grid-template-columns: auto minmax(auto, 1fr) auto minmax(0, 72px);
  grid-gap: 16px;
  cursor: ${({ disabled }) => !disabled && 'pointer'};
  pointer-events: ${({ disabled }) => disabled && 'none'};
  opacity: ${({ disabled, selected }) => (disabled || selected ? 0.5 : 1)};
  border-radius: 3px;
  margin-bottom: 15px;

  &.dark {
    color: ${({ theme }) => theme.azure2} !important;    
  }

  &.dark:disabled { opacity: 0.5; cursor: pointer; }

  &.dark:hover, &.dark:focus { 
    border: 1px solid ${({ theme }) => theme.azure2} !important;
    background-color: ${({ theme }) => theme.blue3};
    box-shadow: 0px 0px 4px ${({ theme }) => theme.azure2}; 
  }

  &.light {}
  &.classic {}
`
export const ModalContentWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`
export const EmptyProposals = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  &.dark { color: ${({ theme }) => theme.azure1}; }
  &.light {}
  &.classic {}
`
export const Dots = styled.span`
  &::after {
    display: inline-block;
    animation: ellipsis 1.25s infinite;
    content: '.';
    width: 1em;
    text-align: left;
  }
  @keyframes ellipsis {
    0% {
      content: '.';
    }
    33% {
      content: '..';
    }
    66% {
      content: '...';
    }
  }
`
export const StyledPositionCard = styled(Box)<{ bgColor: any }>`
  border: none;  
  position: relative;
  overflow: hidden;

  &.dark { border-top: solid 1px ${({ theme }) => theme.azure1}; border-bottom: solid 1px ${({ theme }) => theme.azure1}; }
  &.light {}
  &.classic {}
`