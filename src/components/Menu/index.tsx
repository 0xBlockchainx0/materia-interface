import React, { useRef, useContext } from 'react'
import { ThemeContext } from 'styled-components'
import { BookOpen, Code, Info, MessageCircle, PieChart } from 'react-feather'
import { useOnClickOutside } from '../../hooks/useOnClickOutside'
import { ApplicationModal } from '../../state/application/actions'
import { useModalOpen, useToggleModal } from '../../state/application/hooks'

import { 
  StyledMenuIcon,
  StyledMenuText,
  StyledMenuButton,
  StyledMenu,
  MenuFlyout,
  MenuItem
} from '../../theme'



const CODE_LINK = 'https://github.com/Materia-dex/materia-interface'

export default function Menu() {

  const theme = useContext(ThemeContext)
  const node = useRef<HTMLDivElement>()
  const open = useModalOpen(ApplicationModal.MENU)
  const toggle = useToggleModal(ApplicationModal.MENU)
  useOnClickOutside(node, open ? toggle : undefined)

  return (
    // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/30451
    <StyledMenu ref={node as any} className={theme.name}>
      <StyledMenuButton onClick={toggle} className={theme.name}>
        <StyledMenuIcon className={`footer-icon ${theme.name}`} />
      </StyledMenuButton>
      <StyledMenuText onClick={toggle} className={theme.name}>Menu</StyledMenuText>

      {open && (
        <MenuFlyout className={theme.name}>
          <MenuItem id="link" href="https://materiadex.com/" className={theme.name}>
            <Info/>
            About
          </MenuItem>
          <MenuItem id="link" href="https://materiadex.com/docs/" className={theme.name}>
            <BookOpen/>
            Docs
          </MenuItem>
          <MenuItem id="link" href={CODE_LINK} className={theme.name}>
            <Code/>
            Code
          </MenuItem>
          <MenuItem id="link" href="https://discord.gg/jdYMZrv" className={theme.name}>
            <MessageCircle />
            Discord
          </MenuItem>
          <MenuItem id="link" href="https://info.materiadex.com/" className={theme.name}>
            <PieChart/>
            Analytics
          </MenuItem>
        </MenuFlyout>
      )}
    </StyledMenu>
  )
}
