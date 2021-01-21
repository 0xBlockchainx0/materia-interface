import darkBackground from '../assets/images/backgrounds/dark.png'
import darkFrameCorner from '../assets/images/large-box-corner-decoration.png'

import tokenbackgroundDark from '../assets/images/token-background.png'
import tokenbackgroundLight from '../assets/images/token-background-light.png'
import tokenbackgroundClassic from '../assets/images/token-background-classic.png'
import swapButtonBgDark from '../assets/images/button-background.png'
import swapButtonBgLight from '../assets/images/button-background-light.png'

export const images = {
    backgrounds: {
      dark: darkBackground,
      light: null,
      classic: null
    },
    decorators: {
      largeBoxes: {
        dark: darkFrameCorner,
        light: null,
        classic: null
      },
      smallBoxes: {
        dark: null,
        light: null,
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
    }
}