import React, { useContext } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { useLastTruthy } from '../../hooks/useLast'
import { AdvancedBatchSwapDetails, AdvancedBatchSwapDetailsProps } from './AdvancedBatchSwapDetails'
import { AdvancedDetailsFooter, IconButton, SecondaryPanelBoxContainer } from '../../theme'
import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'react-feather'

const ShowInfoContainer = styled.div`
  display: flex;
  padding: 0px 0.5rem;
`

const ShowInfoText = styled.div`
  width: 90%;
`

const ShowInfoAccordion = styled.div`
  width: 10%;
`

export default function AdvancedBatchSwapDetailsDropdown({ trade, ...rest }: AdvancedBatchSwapDetailsProps) {
  const lastTrade = useLastTruthy(trade)
  const booleanTrade = Boolean(trade)
  const theme = useContext(ThemeContext)
  const [showInfo, setShowInfo] = useState(false)

  return (
    <AdvancedDetailsFooter show={booleanTrade}>
      <SecondaryPanelBoxContainer className={theme.name}>
        <div className="inner-content">
          <ShowInfoContainer>
            <ShowInfoText>Pair Info</ShowInfoText>
            <ShowInfoAccordion>
              <IconButton
                className={`${theme.name}`}
                onClick={() => {
                  setShowInfo(!showInfo)
                }}
              >
                {showInfo ? <ChevronUp /> : <ChevronDown />}
              </IconButton>
            </ShowInfoAccordion>
          </ShowInfoContainer>
          {showInfo && <AdvancedBatchSwapDetails {...rest} trade={trade ?? lastTrade ?? undefined} />}
        </div>
      </SecondaryPanelBoxContainer>
    </AdvancedDetailsFooter>
  )
}
