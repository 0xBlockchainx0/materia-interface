import React, { useMemo } from 'react'
import sky from '../assets/images/sky.png'
import styled, {
  ThemeProvider as StyledComponentsThemeProvider,
  createGlobalStyle,
  css,
  DefaultTheme
} from 'styled-components'
import { useIsDarkMode } from '../state/user/hooks'
import { Text, TextProps } from 'rebass'
import { Colors } from './styled'
import { GreyCard } from '../components/Card'
import tokenbackgroundDark from '../assets/images/token-background.png'
import tokenbackgroundLight from '../assets/images/token-background-light.png'
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

export function colors(darkMode: boolean): Colors {
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
    bg8: darkMode ? "rgb(0, 0, 0, 0.5)": "rgb(255, 255, 255, 0.5)",

    //specialty colors
    modalBG: darkMode ? 'rgba(0,0,0,.425)' : 'rgba(0,0,0,0.3)',
    advancedBG: darkMode ? 'rgba(0,0,0,0.1)' : 'rgba(239,241,244)',

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
    transparent: 'transparent'

    // dont wanna forget these blue yet
    // blue4: darkMode ? '#153d6f70' : '#C4D9F8',
    // blue5: darkMode ? '#153d6f70' : '#EBF4FF',
  }
}

export function theme(darkMode: boolean): DefaultTheme {
  return {
    ...colors(darkMode),

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

    bodyBackground: darkMode ? css`
      background: linear-gradient(rgba(0,0,0,.1), rgba(0,0,0,.1)), url(${sky}) no-repeat fixed top;
    `:
      css`
      background: linear-gradient(rgba(255,255,255), rgba(255,255,255)), fixed top;
    `,

    bodyWrapperBackground: darkMode ? css`
    background: rgb(0,77,161, 0.7);
    background: -moz-linear-gradient(168deg, rgba(0,77,161,0.7) 0%, rgba(5,30,64,0.7) 100%);
    background: -webkit-linear-gradient(168deg, rgba(0,77,161,0.7) 0%, rgba(5,30,64,0.7) 100%);
    background: linear-gradient(168deg, rgba(0,77,161,0.7) 0%, rgba(5,30,64,0.7) 100%);`
      :
      css`
    background: rgb(156,208,245, 0.7);
    background: -moz-linear-gradient(168deg, rgba(156,208,245,0.7) 0%, rgba(156,208,245,0.7) 100%);
    background: -webkit-linear-gradient(168deg, rgba(156,208,245,0.7) 0%, rgba(156,208,245,0.7) 100%);
    background: linear-gradient(168deg, rgba(156,208,245,0.7) 0%, rgba(156,208,245,0.7) 100%);`,

    styledBoxBorder: darkMode ? css`
      border: 1px solid #1e9de3;
    `:
      css`
      border: 1px solid #9cd0f5;
    `,

    backgroundContainer: darkMode ? css`
    background: linear-gradient(180deg, rgba(0,77,161,0.7) 0%, rgba(5,30,64,0.7) 100%);
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
    background: linear-gradient(180deg, rgba(0,77,161,0.7) 0%, rgba(5,30,64,0.7) 100%);
    `:
        css`
        background: linear-gradient(180deg, rgba(239,241,244) 0%, rgba(239,241,244) 100%);
    `,
    tokenBackground: darkMode? 'url(' + tokenbackgroundDark + ') no-repeat': 'url(' + tokenbackgroundLight + ') no-repeat',

    swapButtonBg: darkMode? 
    css`background-image:url(${swapButtonBgDark})`:
    css`background-image:url(${swapButtonBgLight})`,

    swapButtonSrc: darkMode? swapButtonBgDark: swapButtonBgLight
  }
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const darkMode = useIsDarkMode()

  const themeObject = useMemo(() => theme(darkMode), [darkMode])

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
    return <TextWrapper fontWeight={500} color={'white'} {...props} />
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
   color: ${colors(false).blue1}; 
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
