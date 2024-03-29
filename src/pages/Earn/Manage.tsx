import React, { useCallback, useState, useContext } from 'react'
import { ThemeContext } from 'styled-components'
import { Link } from 'react-router-dom'
import { JSBI, TokenAmount } from '@materia-dex/sdk'
import { RouteComponentProps } from 'react-router-dom'
import DoubleCurrencyLogo from '../../components/DoubleLogo'
import { useCurrency } from '../../hooks/Tokens'
import { useWalletModalToggle } from '../../state/application/hooks'
import {
  PageGridContainer,
  SecondaryPanelBoxContainer,
  SecondaryPanelBoxContainerExtraDecorator,
  SimpleTextParagraph,
  ActionButton,
  SectionTitle,
  PageItemsContainer,
  TabsBar,
  PageContentContainer,
  DynamicGrid,
  ExternalLink,
  PoolSection,
  SectionContent
} from '../../theme'
import { ButtonMateriaPrimary } from '../../components/Button'
import StakingModal from '../../components/earn/StakingModal'
import { StakingSeason, useStakingInfo, useStakingInfoSecondSeason } from '../../state/stake/hooks'
import UnstakingModal from '../../components/earn/UnstakingModal'
import ClaimRewardModal from '../../components/earn/ClaimRewardModal'
import { useTokenBalance } from '../../state/wallet/hooks'
import { useActiveWeb3React } from '../../hooks'
import { useColor } from '../../hooks/useColor'
import { CountUp } from 'use-count-up'

import { wrappedCurrency } from '../../utils/wrappedCurrency'
import { currencyId } from '../../utils/currencyId'
import { useTotalSupply } from '../../data/TotalSupply'
import { usePair } from '../../data/Reserves'
import usePrevious from '../../hooks/usePrevious'
import { BIG_INT_ZERO, WUSD } from '../../constants'
import AppBody from '../AppBody'

export default function Manage({
  match: {
    params: { currencyIdA, currencyIdB, season }
  }
}: RouteComponentProps<{ currencyIdA: string; currencyIdB: string, season: string }>) {
  const theme = useContext(ThemeContext)

  const { account, chainId } = useActiveWeb3React()

  // get currencies and pair
  const [currencyA, currencyB, currencyWUSD] = [useCurrency(currencyIdA), useCurrency(currencyIdB), useCurrency(WUSD[chainId ?? 1].address)]
  const tokenA = wrappedCurrency(currencyA ?? undefined, chainId)
  const tokenB = wrappedCurrency(currencyB ?? undefined, chainId)

  const [, stakingTokenPair] = usePair(tokenA, tokenB)
  
  const stakingInfoSeasonOne = useStakingInfo(stakingTokenPair)?.[0]
  const stakingInfoSeasonTwo = useStakingInfoSecondSeason(stakingTokenPair)?.[0]
  const stakingInfo =
    season == StakingSeason.SEASON_TWO
      ? stakingInfoSeasonTwo
      : stakingInfoSeasonOne

  // detect existing unstaked MP position to show add button if none found
  const userLiquidityUnstaked = useTokenBalance(account ?? undefined, stakingInfo?.stakedAmount?.token)
  const showAddLiquidityButton = Boolean(stakingInfo?.stakedAmount?.equalTo('0') && userLiquidityUnstaked?.equalTo('0'))

  // toggle for staking modal and unstaking modal
  const [showStakingModal, setShowStakingModal] = useState(false)
  const [showUnstakingModal, setShowUnstakingModal] = useState(false)
  const [showClaimRewardModal, setShowClaimRewardModal] = useState(false)

  // fade cards if nothing staked or nothing earned yet
  const disableTop = !stakingInfo?.stakedAmount || stakingInfo.stakedAmount.equalTo(JSBI.BigInt(0))
  const token = currencyA === currencyWUSD ? tokenB : tokenA
  const tokenWUSD = currencyA === currencyWUSD ? tokenA : tokenB

  const backgroundColor = useColor(token)

  // get tokenWUSD value of staked MP tokens
  const totalSupplyOfStakingToken = useTotalSupply(stakingInfo?.stakedAmount?.token)
  let valueOfTotalStakedAmountInUSD: TokenAmount | undefined
  if (totalSupplyOfStakingToken && stakingTokenPair && stakingInfo && tokenWUSD) {
    // take the total amount of MP tokens staked, multiply by WUSD value of all MP tokens, divide by all MP tokens
    valueOfTotalStakedAmountInUSD = new TokenAmount(
      tokenWUSD,
      JSBI.divide(
        JSBI.multiply(
          JSBI.multiply(stakingInfo.totalStakedAmount.raw, stakingTokenPair.reserveOf(tokenWUSD).raw),
          JSBI.BigInt(2) // this is b/c the value of MP shares are ~double the value of the tokenWUSD they entitle owner to
        ),
        totalSupplyOfStakingToken.raw
      )
    )
  }

  const countUpAmount = stakingInfo?.earnedAmount?.toFixed(6) ?? '0'
  const countUpAmountPrevious = usePrevious(countUpAmount) ?? '0'

  // get the WUSD value of staked tokenWUSD
  // const USDPrice = useUSDCPrice(tokenWUSD)
  // const valueOfTotalStakedAmountInUSDC =
  //   valueOfTotalStakedAmountInUSD && USDPrice?.quote(valueOfTotalStakedAmountInUSD)

  const toggleWalletModal = useWalletModalToggle()

  const handleDepositClick = useCallback(() => {
    if (account) {
      setShowStakingModal(true)
    } else {
      toggleWalletModal()
    }
  }, [account, toggleWalletModal])
  const [showMore, setShowMore] = useState(false)

  return (
    <>
      <AppBody>
        <PageGridContainer className="liquidity-mining">
          <div className={`left-column liquidity-mining ${theme.name}`}>
            <div className="collapsable-title">
              <div className="pull-right">
                <ActionButton className={theme.name} onClick={() => { setShowMore(!showMore) }}>
                  {showMore ? ('Hide Rewards Info') : ('View Rewards Info')}
                </ActionButton>
              </div>
              <div className="clear-fix"></div>
            </div>
            <div className={`collapsable-item ${showMore ? 'opened' : 'collapsed'}`}>
              <SimpleTextParagraph className={`p0 mt0 mb0 ${theme.name}`}>
                <SectionTitle className={`mt10 ${theme.name}`}>Materia liquidity mining</SectionTitle>
                <SectionContent>Deposit your Liquidity Provider tokens to receive GIL, the Materia DFO protocol governance token.
                    <ExternalLink href="https://www.dfohub.com/" target="_blank" className="yellow"> Read more about DFO</ExternalLink>
                </SectionContent>
              </SimpleTextParagraph>
            </div>
          </div>
          <PageItemsContainer className={theme.name}>
            <TabsBar className={theme.name}>
              <DynamicGrid className={theme.name} columns={2}>
                <div className={`text-left title ${theme.name}`}>{currencyA?.symbol}-{currencyB?.symbol} Liquidity Mining</div>
                <div className="text-right">
                  <DoubleCurrencyLogo currency0={currencyA ?? undefined} currency1={currencyB ?? undefined} size={24} radius={true} cssClassName="liquidity-mining-double-token" />
                </div>
              </DynamicGrid>
            </TabsBar>
            <div className="clear-fix">
              <PageContentContainer className={`one ${theme.name}`}>
                <PoolSection>
                  <DynamicGrid className={theme.name} columns={2}>
                    <div className="text-left">
                      <SectionTitle className={theme.name}>Total deposits</SectionTitle>
                      <SimpleTextParagraph className={`extreme ${theme.name}`}>
                        {/* {valueOfTotalStakedAmountInUSDC
                          ? `$${valueOfTotalStakedAmountInUSDC.toFixed(0)}`
                          : `${valueOfTotalStakedAmountInUSD?.toSignificant(4) ?? '-'} ETH`} */}
                        {`${valueOfTotalStakedAmountInUSD?.toSignificant(4) ?? '-'} WUSD`}
                      </SimpleTextParagraph>
                    </div>
                    <div className="text-left">
                      <SectionTitle className={theme.name}>Pool Rate</SectionTitle>
                      <SimpleTextParagraph className={`extreme ${theme.name}`}>
                        {stakingInfo?.totalRewardRate?.multiply((60 * 60 * 24).toString())?.toFixed(0) ?? '-'} {' GIL / day'}
                      </SimpleTextParagraph>
                    </div>
                  </DynamicGrid>
                  <>

                    {showAddLiquidityButton && (
                      <SimpleTextParagraph className={`mt0 ${theme.name}`}>
                        <strong>Step 1. Get Liquidity tokens</strong>
                        <br /><br />
                        {`MP tokens are required. Once you've added liquidity to the ${currencyA?.symbol}-${currencyB?.symbol} pool you can stake your liquidity tokens on this page.`}
                        <br /><br />
                        <ButtonMateriaPrimary className={theme.name} as={Link} width={'fit-content'}
                          to={`/add/${currencyA && currencyId(currencyA)}/${currencyB && currencyId(currencyB)}`}>
                          {`Add ${currencyA?.symbol}-${currencyB?.symbol} liquidity`}
                        </ButtonMateriaPrimary>
                      </SimpleTextParagraph>
                    )}

                    {stakingInfo && (
                      <>
                        <StakingModal
                          isOpen={showStakingModal}
                          onDismiss={() => setShowStakingModal(false)}
                          stakingInfo={stakingInfo}
                          userLiquidityUnstaked={userLiquidityUnstaked}
                        />
                        <UnstakingModal
                          isOpen={showUnstakingModal}
                          onDismiss={() => setShowUnstakingModal(false)}
                          stakingInfo={stakingInfo}
                        />
                        <ClaimRewardModal
                          isOpen={showClaimRewardModal}
                          onDismiss={() => setShowClaimRewardModal(false)}
                          stakingInfo={stakingInfo}
                        />
                      </>
                    )}

                    <SectionTitle className={theme.name}>Your liquidity deposits</SectionTitle>
                    <DynamicGrid className={`${theme.name}`} columns={2}>
                      <div className={`text text-left font25 ${theme.name}`}>{stakingInfo?.stakedAmount?.toSignificant(6) ?? '-'}</div>
                      <div className={`text text-right font25 ${theme.name}`}>MP {currencyA?.symbol}-{currencyB?.symbol}</div>
                    </DynamicGrid>
                    <div className="clear-fix"></div>
                    <SectionTitle className={`${theme.name}`}>Your unclaimed GIL</SectionTitle>
                    <DynamicGrid className={`${theme.name}`} columns={2}>
                      <div className={`text text-left font25 ${theme.name}`}>
                        <CountUp
                          key={countUpAmount}
                          isCounting
                          decimalPlaces={4}
                          start={parseFloat(countUpAmountPrevious)}
                          end={parseFloat(countUpAmount)}
                          thousandsSeparator={','}
                          duration={1}
                        />
                      </div>
                      <div className="clear-fix pt7">
                        <div className="pull-right ml10">
                          {stakingInfo?.earnedAmount && JSBI.notEqual(BIG_INT_ZERO, stakingInfo?.earnedAmount?.raw) && (
                            <ActionButton width="fit-content" onClick={() => setShowClaimRewardModal(true)} className={theme.name}>Claim</ActionButton>
                          )}
                        </div>
                        <div className="pull-right">
                          {stakingInfo?.rewardRate?.multiply((60 * 60 * 24).toString())?.toSignificant(4) ?? '-'} {' GIL / day'}
                        </div>
                      </div>
                    </DynamicGrid>
                    <SimpleTextParagraph className={`text-centered ${theme.name}`}>
                      When you withdraw, the contract will automagically claim GIL on your behalf!
                    </SimpleTextParagraph>
                    {/* LIQUIDITY MINING SEASON ONE */}
                    {!showAddLiquidityButton && season == StakingSeason.SEASON_ONE && (
                      <DynamicGrid className={`${theme.name}`} columns={(stakingInfo?.stakedAmount?.greaterThan(JSBI.BigInt(0)) ? 1 : 0)}>
                        {stakingInfo?.stakedAmount?.greaterThan(JSBI.BigInt(0)) && (
                          <div className="text-centered">
                            <ButtonMateriaPrimary className={theme.name} width={'fit-content'} onClick={() => setShowUnstakingModal(true)}>
                              Withdraw
                              </ButtonMateriaPrimary>
                          </div>
                        )}
                      </DynamicGrid>
                    )}
                    {/* LIQUIDITY MINING SEASON TWO */}
                    {!showAddLiquidityButton && season == StakingSeason.SEASON_TWO && (
                      <DynamicGrid className={`${theme.name}`} columns={(stakingInfo?.stakedAmount?.greaterThan(JSBI.BigInt(0)) ? 2 : 1)}>
                        <div className={`${(stakingInfo?.stakedAmount?.greaterThan(JSBI.BigInt(0)) ? 'text-left' : 'text-centered')}`}>
                          <ButtonMateriaPrimary className={theme.name} width={'fit-content'} onClick={handleDepositClick}>
                            {stakingInfo?.stakedAmount?.greaterThan(JSBI.BigInt(0)) ? 'Deposit' : 'Deposit MP Tokens'}
                          </ButtonMateriaPrimary>
                        </div>
                        {stakingInfo?.stakedAmount?.greaterThan(JSBI.BigInt(0)) && (
                          <div className="text-right">
                            <ButtonMateriaPrimary className={theme.name} width={'fit-content'} onClick={() => setShowUnstakingModal(true)}>
                              Withdraw
                              </ButtonMateriaPrimary>
                          </div>
                        )}
                      </DynamicGrid>
                    )}
                    {!userLiquidityUnstaked ? null : userLiquidityUnstaked.equalTo('0') ? null : (
                      <SimpleTextParagraph className={`text-centered ${theme.name}`}>
                        {userLiquidityUnstaked.toSignificant(6)} MP tokens available
                      </SimpleTextParagraph>
                    )}
                  </>
                </PoolSection>
              </PageContentContainer>
            </div>
          </PageItemsContainer>
        </PageGridContainer>
      </AppBody>
    </>

  )
}
