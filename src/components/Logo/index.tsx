import React, { useState, useContext } from 'react'
import { ThemeContext } from 'styled-components'
import { ImageProps } from 'rebass'
import { images } from '../../theme/images'

const BAD_SRCS: { [tokenAddress: string]: true } = {}

export interface LogoProps extends Pick<ImageProps, 'style' | 'alt' | 'className'> {
  srcs: string[]
}

/**
 * Renders an image by sequentially trying a list of URIs, and then eventually a fallback triangle alert
 */
export default function Logo({ srcs, alt, ...rest }: LogoProps) {
  const [, refresh] = useState<number>(0)
  const src: string | undefined = srcs.find(src => !BAD_SRCS[src])
  const theme = useContext(ThemeContext)

  if (src) {
    return (
      <img
        {...rest}
        alt={alt}
        src={src}
        onError={() => {
          if (src) BAD_SRCS[src] = true
          refresh(i => i + 1)
        }}
      />
    )
  }
  if(theme.name == 'dark'){
    return <img {...rest} alt="Token Image Not Found" src={images.tokenImageNotFound.dark}/>
  }
  else if(theme.name == 'light'){
    return <img {...rest} alt="Token Image Not Found" src={images.tokenImageNotFound.light}/>
  }
  else {
    return <img {...rest} alt="Token Image Not Found" src={images.tokenImageNotFound.dark}/>
  }
}
