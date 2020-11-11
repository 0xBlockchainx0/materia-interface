import React from 'react'
import { AutoColumn } from '../../components/Column'
import styled from 'styled-components'
import { STAKING_REWARDS_INFO, useStakingInfo } from '../../state/stake/hooks'
import { TYPE, ExternalLink } from '../../theme'
import PoolCard from '../../components/earn/PoolCard'
import { RowBetween } from '../../components/Row'
import { CardSection, DataCard, CardNoise, CardBGImage } from '../../components/earn/styled'
import { Countdown } from './Countdown'
import Loader from '../../components/Loader'
import { useActiveWeb3React } from '../../hooks'
import AppBody from '../AppBody'

const PageWrapper = styled(AutoColumn)`
  // max-width: 640px;
  width: 100%;
`

const TopSection = styled(AutoColumn)`
  width: 100%;
`


const EarnCard = styled(DataCard)`
  // background: rgba(0, 27, 49, 0.5) !important;
  border: 2px solid #1992d3;
  background: #002852;
  border-radius: 0px !important;
  overflow: hidden;
`


const PoolSection = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  column-gap: 10px;
  row-gap: 15px;
  width: 100%;
  justify-self: center;
`

export default function Earn() {
  const { chainId } = useActiveWeb3React()
  const stakingInfos = useStakingInfo()

  const DataRow = styled(RowBetween)`
    ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-direction: column;
  `};
  `

  const EarnGridContainer = styled.div`
  display: grid;
  grid-template-columns: 5% auto;

  @media (min-width: 601px) and (max-width: 1350px) {
    grid-template-columns: 50px auto !important;
  }
  @media (max-width: 600px) {
    grid-template-columns: auto !important;
  }
`

const ItemColumn = styled.div`
  @media (min-width: 601px) and (max-width: 1350px) {
    // display: none;
  }
  @media (max-width: 600px) {
    display: none;
  }
`

const MainContainer = styled.div`

`

  const stakingRewardsExist = Boolean(typeof chainId === 'number' && (STAKING_REWARDS_INFO[chainId]?.length ?? 0) > 0)

  return (
    <AppBody>
      <EarnGridContainer>
      <ItemColumn>
            <div style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
              <p style={{ fontSize: 'xx-large', margin: '0px 1.5rem 0px 0px' }}>
                Liquidity Mining
              </p>
            </div>
          </ItemColumn>
          <MainContainer>
          <TopSection gap="md">
        <EarnCard>
          {/* <CardBGImage />
          <CardNoise /> */}
          <CardSection>
            <AutoColumn gap="md">
              <RowBetween>
                <TYPE.white fontWeight={600}>Materia liquidity mining</TYPE.white>
              </RowBetween>
              <RowBetween>
                <TYPE.white fontSize={14}>
                  Deposit your Liquidity Provider tokens to receive $GIL, the Materia DFO protocol governance token.
                </TYPE.white>
              </RowBetween>{' '}
              <ExternalLink
                style={{ color: 'white', textDecoration: 'underline' }}
                href="https://www.dfohub.com/"
                target="_blank"
              >
                <TYPE.white fontSize={14}>Read more about DFO</TYPE.white>
              </ExternalLink>
            </AutoColumn>
          </CardSection>
          <CardBGImage />
          <CardNoise />
        </EarnCard>
      </TopSection>
      <AutoColumn gap="lg" style={{ width: '100%' }}>
        <DataRow style={{ alignItems: 'baseline' }}>
          <TYPE.mediumHeader style={{ marginTop: '0.5rem' }}>Participating pools</TYPE.mediumHeader>
          <Countdown exactEnd={stakingInfos?.[0]?.periodFinish} />
        </DataRow>

        <PoolSection>
          {stakingRewardsExist && stakingInfos?.length === 0 ? (
            <Loader style={{ margin: 'auto' }} />
          ) : !stakingRewardsExist ? (
            'No active rewards'
          ) : (
            stakingInfos?.map(stakingInfo => {
              // need to sort by added liquidity here
              return <PoolCard key={stakingInfo.stakingRewardAddress} stakingInfo={stakingInfo} />
            })
          )}
        </PoolSection>
      </AutoColumn>
      </MainContainer>
      </EarnGridContainer>
   </AppBody>
  )
}
