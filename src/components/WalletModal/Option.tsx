import React, { useContext } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { 
  OptionCardClickable, 
  OptionCardLeft, 
  OptionCardIconWrapper,  
  ExternalLink } from '../../theme'
  
export default function Option({
  link = null,
  clickable = true,
  size,
  onClick = null,
  color,
  header,
  subheader = null,
  icon,
  active = false,
  id
}: {
  link?: string | null
  clickable?: boolean
  size?: number | null
  onClick?: null | (() => void)
  color: string
  header: React.ReactNode
  subheader: React.ReactNode | null
  icon: string
  active?: boolean
  id: string
}) {
  const theme = useContext(ThemeContext)
  const content = (
    <OptionCardClickable id={id} onClick={onClick} clickable={clickable && !active} active={active} className={`option-card-clickable ${theme.name}`}>
      <OptionCardLeft>
        <div className={"header-text " + (active ? 'active' : '')}>
          {header}
        </div>
        {subheader && <div className="sub-header-text">{subheader}</div>}
      </OptionCardLeft>
      <OptionCardIconWrapper size={size}>
        <img src={icon} alt={'Icon'} />
      </OptionCardIconWrapper>
    </OptionCardClickable>
  )
  if (link) {
    return <ExternalLink href={link}>{content}</ExternalLink>
  }

  return content
}
