import { FlattenSimpleInterpolation, FlattenSimpleInterpolation, ThemedCssFunction } from 'styled-components'

export type Color = string
export interface Colors {
  // base
  white: Color
  black: Color
  placeholderColor: Color

  azure1: Color,
  azure2: Color,
  azure2: Color,
  azure3: Color,
  azure4: Color,
  azure5: Color,
  azure6: Color,
  blue1: Color,
  blue2: Color,
  grey1: Color,
  grey2: Color,
  grey3: Color,
  grey4: Color,
  yellowGreen: Color,
  yellowLight: Color,
  violet1: Color,
  violet2: Color,
  violet3: Color,
  violet4: Color,
  violet5: Color,
  violet6: Color,
  violet7: Color,

  // text
  text1: Color
  text2: Color
  text3: Color
  text4: Color
  text5: Color

  // backgrounds / greys
  bg1: Color
  bg2: Color
  bg3: Color
  bg4: Color
  bg5: Color
  bg6: Color
  bg7: Color
  bg8: Color

  modalBG: Color
  advancedBG: Color
  
  // border
  border1: Color

  //blues
  primary1: Color
  primary2: Color
  primary3: Color
  primary4: Color
  primary5: Color

  primaryText1: Color

  // pinks
  secondary1: Color
  secondary2: Color
  secondary3: Color

  // other
  red1: Color
  red2: Color
  red3: Color
  green1: Color
  greenEthItem: Color
  yellow1: Color
  yellow2: Color
  blue1: Color
  blue2: Color
  blue3: Color
  blue4: Color
  blue5: Color
  blue6: Color
  cyan1: Color
  cyan2: Color
  grey: Color
  transparent: Color,
  buttonMateriaPrimaryBackgroundFirstColor: Color
  buttonMateriaPrimaryBackgroundSecondColor: Color
  buttonMateriaPrimaryBackgroundHoverFirstColor: Color
  buttonMateriaPrimaryBackgroundHoverSecondColor: Color
  buttonMateriaErrorBackgroundFirstColor: Color
  buttonMateriaErrorBackgroundSecondColor: Color
  buttonMateriaErrorBackgroundHoverFirstColor: Color
  buttonMateriaErrorBackgroundHoverSecondColor: Color
  buttonMateriaPrimaryBorderColor: Color
  buttonMateriaPrimaryHoverBorderColor: Color
  buttonMateriaPrimaryTextColor: Color
  buttonMateriaErrorBorderColor: Color
  buttonMateriaErrorHoverBorderColor: Color
}

export interface Grids {
  sm: number
  md: number
  lg: number
}

export interface DynamicGridColumnsDefinition {
  value: number,
  location: number
}

declare module 'styled-components' {
  export interface DefaultTheme extends Colors {

    name: string,

    grids: Grids

    // shadows
    shadow1: string

    // media queries
    mediaWidth: {
      upToExtraSmall: ThemedCssFunction<DefaultTheme>
      upToSmall: ThemedCssFunction<DefaultTheme>
      upToMedium: ThemedCssFunction<DefaultTheme>
      upToLarge: ThemedCssFunction<DefaultTheme>
    }

    // css snippets
    flexColumnNoWrap: FlattenSimpleInterpolation
    flexRowNoWrap: FlattenSimpleInterpolation
    
    styledBoxBorder: FlattenSimpleInterpolation

    backgroundContainer: FlattenSimpleInterpolation
    backgroundContainer2: FlattenSimpleInterpolation
    backgroundContainer3: FlattenSimpleInterpolation

    tokenBackground: string
    swapButtonBg: FlattenSimpleInterpolation
    swapButtonSrc: string
    advancedDetailsFooter:FlattenSimpleInterpolation

    utils: {
      hexToRGB: ThemedCssFunction<string, number>,
      gridColumsWidth: ThemedCssFunction<string, number, DynamicGridColumnsDefinition[]>
    }
  }
}
