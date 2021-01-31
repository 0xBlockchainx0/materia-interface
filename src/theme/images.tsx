import darkBackground from '../assets/images/backgrounds/dark.png'
import darkFrameCorner from '../assets/images/box-decorators/large-dark.png'
import darkSecondaryFrameCorner from '../assets/images/box-decorators/small-dark.png'
import darkGridDecorator from '../assets/images/box-decorators/grid-dark.png'

import lightBackground from '../assets/images/backgrounds/light.png'
import lightFrameCorner from '../assets/images/box-decorators/large-light.png'
import lightSecondaryFrameCorner from '../assets/images/box-decorators/small-dark.png'
import lightGridDecorator from '../assets/images/box-decorators/grid-light.png'

import tokenbackgroundDark from '../assets/images/token-backgrounds/dark.png'
import tokenbackgroundLight from '../assets/images/token-backgrounds/light.png'
import tokenbackgroundClassic from '../assets/images/token-backgrounds/classic.png'
import swapButtonBgDark from '../assets/images/button-background.png'
import swapButtonBgLight from '../assets/images/button-background-light.png'

import tokenImageNotFoundDark from '../assets/images/token-backgrounds/default-token-image-dark.png'
import tokenImageNotFoundLight from '../assets/images/token-backgrounds/default-token-image-light.png'

export const images = {
    backgrounds: {
      dark: darkBackground,
      light: lightBackground,
      classic: null
    },
    decorators: {
      grid: {
        dark: darkGridDecorator,
        light: lightGridDecorator,
        classic: null
      },
      largeBoxes: {
        dark: darkFrameCorner,
        light: lightFrameCorner,
        classic: null
      },
      smallBoxes: {
        dark: darkSecondaryFrameCorner,
        light: lightSecondaryFrameCorner,
        classic: null
      }
    },
    token: {
      dark: tokenbackgroundDark,
      light: tokenbackgroundLight,
      classic: tokenbackgroundClassic
    },
    swap: {
      dark: swapButtonBgDark,
      light: swapButtonBgLight,
      classic: null
    },
    tokenImageNotFound: {
      dark: tokenImageNotFoundDark,
      light: tokenImageNotFoundLight,
      classic: null
    }
}