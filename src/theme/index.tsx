import React, { useMemo } from 'react'
import { NavLink } from 'react-router-dom'
import styled, {
  ThemeProvider as StyledComponentsThemeProvider,
  createGlobalStyle,
  css,
  DefaultTheme
} from 'styled-components'
import { useIsClassicMode, useIsDarkMode } from '../state/user/hooks'
import { Text, TextProps, Button } from 'rebass'
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
    blue1: classicMode ? '#000000' : darkMode ? '#1e98dc' : '#000000',
    blue2: classicMode ? '#000000' : darkMode ? '#022b63' : '#000000',
    blue3: classicMode ? '#000000' : darkMode ? '#082751' : '#000000',
    grey1: classicMode ? '#000000' : darkMode ? '#5e6873' : '#000000',
    yellowGreen: classicMode ? '#000000' : darkMode ? '#878e13' : '#000000',
    yellowLight: classicMode ? '#000000' : darkMode ? '#ffffbe' : '#000000', 

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
    //blue1: '#2172E5',
    //blue2: '#1671BB',
    cyan1: '#2f9ab8',
    cyan2: '#1992d3',
    grey: '#999999',
    
    
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
  z-index: 0;

  &.dark { border: solid 1px ${({ theme }) => theme.azure1}; }
  &.light {}
  &.classic {}

  @media (max-width: 600px) { max-width: 90% !important; }
  @media (max-width: 1200px) { max-width: 90%; }
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
  }

  &:before { top: -37px; left: -36px; }
  &:after { bottom: -37px; right: -36px; transform: rotate(180deg); }

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
  padding: 20px 58px;
  background-size: cover;

  &.dark {
    background: linear-gradient(-45deg, ${({ theme }) => theme.blue2}00 60%, ${({ theme }) => theme.azure3} 100%);
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
  left: -20px;
  text-transform: capitalize;
  display: inline-block;
  z-index: 10;
  font-weight: 300;
  font-size: 33px;
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
    left: -40px;
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
export const FeatureChildrenContainer = styled.div`
  border-radius:3px;
  max-width: 1200px;
  min-height: 580px;
  padding: 20px;

  &.dark {
    background: linear-gradient(-45deg, ${({ theme }) => theme.blue2}00 40%, ${({ theme }) => theme.azure3} 100%);
  }
  &.light {}
  &.classic {}
`
export const SectionTitle = styled.h6`
  font-weight: 200;
  font-size: 23px;
  position: relative;
  display: inline-block;
  margin: 0px 0px 20px 0px;
  text-transform: capitalize;
  padding:0px;
  width: 80%;

  &.dark {
    color: ${({ theme }) => theme.azure1};
    text-shadow: 2px 3px 5px ${({ theme }) => theme.blue3};
  }

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
    background: linear-gradient(to right, #95e1ff 0%, rgba(15,63,115,0));
  }
`
export const InventoryColumn = styled.div`
  min-height: 580px;
  @media (max-width: 1350px) { display: none; }
`
export const InventoryContainer = styled.div`
  margin-right: 1rem;
  overflow-y: auto;
  max-height: 550px;
  overflow: hidden;
  @media (max-width: 1350px) { display: none; }
`
export const InventoryItemContainer = styled.div`
  padding: 20px 15px 20px 15px; 
  margin-left: 3px;
  margin-bottom: 1px;
  width: 100%;
  height: auto;
  background-size: cover;
  position: relative;
  font-weight: 500;
  font-size: 15px;
  color: ${({ theme }) => theme.text1};

  &.dark {
    background: linear-gradient(90deg, ${({ theme }) => theme.hexToRGB(theme.black, 1)} 0%, ${({ theme }) => theme.hexToRGB(theme.black, 0)} 100%);
    text-shadow: 1px 1px #000;
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

  &.dark { font-weight:400; text-shadow: 1px 1px #000000; }
  &.light {}
  &.classic {}
`
export const SimpleInformationsTextParagraph = styled(SimpleTextParagraph)`
  &.dark { color: ${({ theme }) => theme.azure1}; }
  &.light {}
  &.classic {}
`
const BaseButton = styled(Button)<{ width?: string, borderRadius?: string }>`
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
export const IconButton = styled(BaseButton)<{ width?: string, borderRadius?: string }>`
  cursor: pointer;
  width: fit-content;
  margin-left: 10px !important;

  & > svg { width: 14px; height: 14px; }

  &.dark > svg { stroke: ${({ theme }) => theme.azure1}; }
  &.light > svg {}
  &.classic > svg {}

  &.dark:hover > svg, &.dark:focus > svg { filter: drop-shadow(0px 0px 3px ${({ theme }) => theme.yellowLight}); }
  &.light:hover > svg, &.light:focus > svg {  }
  &.light:classic > svg, &.light:classic > svg {  }
`
export const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 80% auto;
`
export const SwapPageGridContainer = styled.div`
  display: grid;
  grid-template-columns: 30% auto;
  @media (min-width: 601px) and (max-width: 1350px) { grid-template-columns: auto !important; }
  @media (max-width: 600px) { grid-template-columns: auto !important; }
`
export const PageItemsContainer = styled.div`
  &.dark {}
  &.light {}
  &.classic {}

  &.swap { min-height: 580px; }
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
const tabLinkItemActiveClasName = 'active'
export const TabLinkItem = styled(NavLink).attrs({ tabLinkItemActiveClasName })`
  display: flex;
  flex-flow: row nowrap;
  align-items: left;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  font-size: 18px;
  width: fit-content;
  margin: 0 12px;
  font-weight: 400;
  float: right;
  
  &.dark { color: ${({ theme }) => theme.white}; text-shadow: 3px 5px ${({ theme }) => theme.blue3}; }
  &.light { color: ${({ theme }) => theme.grey1}; }
  &.classic { color: #C3C5CB; }

  &.${tabLinkItemActiveClasName} { }

  &.dark.${tabLinkItemActiveClasName} { color: ${({ theme }) => theme.azure1}; }
  &.light.${tabLinkItemActiveClasName} { color: #2f9ab8; }
  &.classic.${tabLinkItemActiveClasName} { color: #2f9ab8; }

  &.dark:hover, &.dark:focus { color: ${({ theme }) => theme.azure1}; }
  &.light:hover, &.light:focus { }
  &.classic:hover, &.classic:focus { }

  &.dark.disabled, &.light.disabled, &.classic.disabled { opacity: 0.7; color: ${({ theme }) => theme.grey1}; }

  &.dark.disabled:hover, &.dark.disabled:focus,
  &.light.disabled:hover, &.light.disabled:focus,
  &.classic.disabled:hover, &.classic.disabled:focus { opacity: 1; }
`
export const SwapPageContentContainer = styled.div`
  margin-top:40px;
  @media (min-width: 1050px) {
    display: grid;
    grid-template-columns: 37.5% 25% 37.5%;
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