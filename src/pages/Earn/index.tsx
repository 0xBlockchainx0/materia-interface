import React, { useContext, useState } from 'react'
import { ThemeContext } from 'styled-components'
import { STAKING_REWARDS_INFO, useStakingInfo } from '../../state/stake/hooks'
import PoolCard from '../../components/earn/PoolCard'
import { Countdown } from './Countdown'
import Loader from '../../components/Loader'
import { useActiveWeb3React } from '../../hooks'
import AppBody from '../AppBody'
import { 
  PageGridContainer,
  SecondaryPanelBoxContainer,
  SecondaryPanelBoxContainerExtraDecorator,
  SimpleTextParagraph,
  PageItemsContainer,
  TabsBar,
  PageContentContainer,
  DynamicGrid,
  ExternalLink,
  PoolSection,
  ActionButton
} from '../../theme'

export default function Earn() {
  const { chainId } = useActiveWeb3React()
  const stakingInfos = useStakingInfo()
  const stakingRewardsExist = Boolean(typeof chainId === 'number' && (STAKING_REWARDS_INFO[chainId]?.length ?? 0) > 0)
  const theme = useContext(ThemeContext)
  const [showMore, setShowMore] = useState(false)

  return (
    <>
      <AppBody>
        <PageGridContainer className="liquidity-mining">
          <div className={`left-column liquidity-mining ${theme.name}`}>
            <div className="collapsable-title">
              <div className="pull-right">
                <ActionButton className={theme.name} onClick={() => { setShowMore(!showMore) }}>
                  {showMore ? ( 'Hide Rewards' ) : ( 'View Rewards' )}
                </ActionButton>
              </div>
              <div className="clear-fix"></div>
            </div>
            <div className={`collapsable-item ${showMore ? 'opened' : 'collapsed'}`}>
            <SecondaryPanelBoxContainer className={`${theme.name}`}>
              <SecondaryPanelBoxContainerExtraDecorator className={`top ${theme.name}`} />
              <div className="inner-content">
                <SimpleTextParagraph className={`p15 mt0 mb0 ${theme.name}`}>
                  <strong>Materia liquidity mining</strong>
                  <br /><br />
                  Deposit your Liquidity Provider tokens to receive GIL, the Materia DFO protocol governance token.
                  <br /><br />
                  <ExternalLink href="https://www.dfohub.com/" target="_blank">Read more about DFO</ExternalLink>
                </SimpleTextParagraph>
              </div>
              <SecondaryPanelBoxContainerExtraDecorator className={`bottom ${theme.name}`} />
            </SecondaryPanelBoxContainer>
            </div>
          </div>
          <PageItemsContainer className={theme.name}>
            <TabsBar className={theme.name}>
              <DynamicGrid className={theme.name} columns={2}>
                <div className={ `text-left title ${theme.name}` }>Participating pools</div>
                <div className="text-right">
                  <Countdown exactEnd={stakingInfos?.[0]?.periodFinish} />
                </div>
              </DynamicGrid>
            </TabsBar>
            <div className="clear-fix">
              <PageContentContainer className={ `one ${theme.name}` }>
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
              </PageContentContainer>
            </div>
          </PageItemsContainer>          
        </PageGridContainer>
      </AppBody>
    </>
  )
}
