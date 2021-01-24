import React, { useContext } from 'react'
import { ThemeContext } from 'styled-components'
import { useTransition, useSpring } from 'react-spring'
import { isMobile } from 'react-device-detect'
import '@reach/dialog/styles.css'
import { useGesture } from 'react-use-gesture'
import { 
  ThemedDialogOverlay, 
  ThemedDialogContent, 
  SecondaryPanelBoxContainer,
  SecondaryPanelBoxContainerExtraDecorator } from '../../theme'
interface ModalProps {
  isOpen: boolean
  onDismiss: () => void
  minHeight?: number | false
  maxHeight?: number
  initialFocusRef?: React.RefObject<any>
  children?: React.ReactNode
}

export default function Modal({
  isOpen,
  onDismiss,
  minHeight = false,
  maxHeight = 90,
  initialFocusRef,
  children
}: ModalProps) {
  const fadeTransition = useTransition(isOpen, null, {
    config: { duration: 200 },
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 }
  })  
  const theme = useContext(ThemeContext)
  const [{ y }, set] = useSpring(() => ({ y: 0, config: { mass: 1, tension: 210, friction: 20 } }))
  const bind = useGesture({
    onDrag: state => {
      set({
        y: state.down ? state.movement[1] : 0
      })
      if (state.movement[1] > 300 || (state.velocity > 3 && state.direction[1] > 0)) {
        onDismiss()
      }
    }
  })

  return (
    <>
      {fadeTransition.map(
        ({ item, key, props }) =>
          item && (
            <ThemedDialogOverlay key={key} style={props} onDismiss={onDismiss} initialFocusRef={initialFocusRef} className={theme.name}>
              <ThemedDialogContent
                {...(isMobile
                  ? {
                      ...bind(),
                      style: { transform: y.interpolate(y => `translateY(${y > 0 ? y : 0}px)`) }
                    }
                  : {})}
                aria-label="dialog content"
                minHeight={minHeight}
                maxHeight={maxHeight}
                mobile={isMobile}
              >
                <SecondaryPanelBoxContainer className={ `modal ${theme.name}` }>
                  <SecondaryPanelBoxContainerExtraDecorator className={ `top ${theme.name}` }/> 
                  <div className="inner-content modal-inner-content">
                    {/* prevents the automatic focusing of inputs on mobile by the reach dialog */}
                    {!initialFocusRef && isMobile ? <div tabIndex={1} /> : null}
                    {children}
                  </div>
                  <SecondaryPanelBoxContainerExtraDecorator className={ `bottom ${theme.name}` }/>
                </SecondaryPanelBoxContainer>                
              </ThemedDialogContent>
            </ThemedDialogOverlay>
          )
      )}
    </>
  )
}
