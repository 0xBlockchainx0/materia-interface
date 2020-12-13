import React from 'react'
import { FittedAutoColumn } from '../../components/Column'
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


const LMGridContainer = styled.div`
  display: grid;
  grid-template-columns: 30px 30% auto;

  @media (min-width: 601px) and (max-width: 1350px) {
    grid-template-columns: 30px 30% auto !important;
  }
  @media (max-width: 600px) {
    grid-template-columns: auto !important;
  }
`

const InfoContainer = styled.div`
  padding: 1rem;
  font-size: smaller;
  ${({ theme }) => theme.backgroundContainer}
`

const PoolsContainer = styled.div`
  padding: 1rem 0.5rem 1rem 0.5rem;
  ${({ theme }) => theme.backgroundContainer}
`

const EarnCard = styled(DataCard)`
  background: rgba(0, 27, 49, 0.5) !important;
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
  min-height: 580px;
`

  const stakingRewardsExist = Boolean(typeof chainId === 'number' && (STAKING_REWARDS_INFO[chainId]?.length ?? 0) > 0)

  return (
    <>
      <AppBody>
        <LMGridContainer>
          <ItemColumn>
            <div style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
              <p style={{ fontSize: 'xx-large', margin: '0px 0px 0px -10px', color: '#fff' }}>
                Liquidity Mining
            </p>
            </div>
          </ItemColumn>
          <InfoContainer>
            <EarnCard>
              <CardSection>
                <FittedAutoColumn gap="md">
                  <RowBetween>
                    <TYPE.white fontWeight={600}>Materia liquidity mining</TYPE.white>
                  </RowBetween>
                  <RowBetween>
                    <TYPE.white fontSize={14}>
                      Deposit your Liquidity Provider tokens to receive GIL, the Materia DFO protocol governance token.
                    </TYPE.white>
                  </RowBetween>{' '}
                  <ExternalLink
                    style={{ color: 'white', textDecoration: 'underline' }}
                    href="https://www.dfohub.com/"
                    target="_blank"
                  >
                    <br />
                    <TYPE.white fontSize={14}>Read more about DFO</TYPE.white>
                  </ExternalLink>
                </FittedAutoColumn>
              </CardSection>
              <CardBGImage />
              <CardNoise />
            </EarnCard>
          </InfoContainer>
          <PoolsContainer>
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
          </PoolsContainer>
        </LMGridContainer>
      </AppBody>
    </>
  )
}
