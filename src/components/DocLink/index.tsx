import React, { useContext } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { ExternalLink } from '../../theme'

export default function DocLink({ title, href, target = '_blank', className }: 
  {title: string, href: string, target?: string, className?: string }) {
  const theme = useContext(ThemeContext)
  return (
    <ExternalLink href={href} target={target} rel="noopener noreferrer" className={className}>{title}</ExternalLink>
  )
}