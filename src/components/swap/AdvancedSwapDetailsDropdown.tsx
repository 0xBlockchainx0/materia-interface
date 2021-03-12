import React, { useContext } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { useLastTruthy } from '../../hooks/useLast'
import { AdvancedSwapDetails, AdvancedSwapDetailsProps } from './AdvancedSwapDetails'
import { AdvancedDetailsFooter, SecondaryPanelBoxContainer, SecondaryPanelBoxContainerExtraDecorator } from '../../theme'

export default function AdvancedSwapDetailsDropdown({ trade, ...rest }: AdvancedSwapDetailsProps) {
  const lastTrade = useLastTruthy(trade)
  const booleanTrade = Boolean(trade);
  const theme = useContext(ThemeContext);
  return (
    <AdvancedDetailsFooter show={booleanTrade}>
      <SecondaryPanelBoxContainer className={theme.name}>
        <div className="inner-content">
          <AdvancedSwapDetails {...rest} trade={trade ?? lastTrade ?? undefined} />
        </div>
      </SecondaryPanelBoxContainer>      
    </AdvancedDetailsFooter>
  )
}
