import React, { useCallback, useState, useContext } from 'react'
import { ThemeContext } from 'styled-components'
import Popover, { PopoverProps } from '../Popover'
import { TooltipContainer } from '../../theme'

interface TooltipProps extends Omit<PopoverProps, 'content'> {
  text: string
}

export default function Tooltip({ text, ...rest }: TooltipProps) {
  const theme = useContext(ThemeContext)
  return <Popover content={<TooltipContainer>{text}</TooltipContainer>} {...rest} />
}

export function MouseoverTooltip({ children, ...rest }: Omit<TooltipProps, 'show'>) {
  const [show, setShow] = useState(false)
  const open = useCallback(() => setShow(true), [setShow])
  const close = useCallback(() => setShow(false), [setShow])
  const theme = useContext(ThemeContext)
  return (
    <Tooltip {...rest} show={show}>
      <div onMouseEnter={open} onMouseLeave={close}>
        {children}
      </div>
    </Tooltip>
  )
}
