import React, { useCallback, useState } from 'react'
import { AutoColumn, FittedAutoColumn } from '../../components/Column'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

import { JSBI, TokenAmount, ETHER } from '@materia-dex/sdk'
import { RouteComponentProps } from 'react-router-dom'
import DoubleCurrencyLogo from '../../components/DoubleLogo'
import { useCurrency } from '../../hooks/Tokens'
import { useWalletModalToggle } from '../../state/application/hooks'
import { TYPE, ExternalLink } from '../../theme'
import { RowBetween } from '../../components/Row'
import { CardSection, DataCard, CardNoise, CardBGImage } from '../../components/earn/styled'
import { ButtonPrimary, ButtonEmpty, ButtonMateriaPrimary } from '../../components/Button'
import StakingModal from '../../components/earn/StakingModal'
import { useStakingInfo } from '../../state/stake/hooks'
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
import useUSDCPrice from '../../utils/useUSDCPrice'
import { BIG_INT_ZERO, USD } from '../../constants'
import AppBody from '../AppBody'

const PageWrapper = styled(AutoColumn)`
  width: 100%;
`

const PositionInfo = styled(AutoColumn) <{ dim: any }>`
  position: relative;
  width: 100%;
  opacity: ${({ dim }) => (dim ? 0.6 : 1)};
`

const BottomSection = styled(AutoColumn)`
  border-radius: 12px;
  width: 100%;
  position: relative;
`

const StyledDataCard = styled(DataCard) <{ bgColor?: any; showBackground?: any }>`
  z-index: 2;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  background-color: #002852;
  border-radius: 5px;
  border: 1px solid ${({ theme }) => theme.border1};
`

const StyledBottomCard = styled(DataCard) <{ dim: any }>`
  background-color: ${({ theme }) => theme.primary4};
  border-radius: 5px;
  opacity: ${({ dim }) => (dim ? 0.4 : 1)};
  margin-top: -40px;
  padding: 0 1.25rem 1rem 1.25rem;
  padding-top: 32px;
  z-index: 1;
`

const PoolData = styled(DataCard)`
  background: none;
  border-radius: 5px;
  border: 1px solid ${({ theme }) => theme.border1};
  padding: 1rem;
  z-index: 1;
`

const VoteCard = styled(DataCard)`
  // background: radial-gradient(76.02% 75.41% at 1.84% 0%, #27ae60 0%, #000000 100%);
  overflow: hidden;
`

const DataRow = styled(RowBetween)`
  justify-content: center;
  gap: 12px;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-direction: column;
    gap: 12px;
  `};
`

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


const ItemColumn = styled.div`
  width: 0px;
  @media (min-width: 601px) and (max-width: 1350px) { /*display: none;*/ }
  @media (max-width: 600px) { display: none; }
  min-height: 580px;
`



export default function Manage({
  match: {
    params: { currencyIdA, currencyIdB }
  }
}: RouteComponentProps<{ currencyIdA: string; currencyIdB: string }>) {
  const { account, chainId } = useActiveWeb3React()

  // get currencies and pair
  const [currencyA, currencyB, currencyUSD] = [useCurrency(currencyIdA), useCurrency(currencyIdB), useCurrency(USD[chainId ?? 1].address)]
  const tokenA = wrappedCurrency(currencyA ?? undefined, chainId)
  const tokenB = wrappedCurrency(currencyB ?? undefined, chainId)

  const [, stakingTokenPair] = usePair(tokenA, tokenB)
  const stakingInfo = useStakingInfo(stakingTokenPair)?.[0]

  // detect existing unstaked LP position to show add button if none found
  const userLiquidityUnstaked = useTokenBalance(account ?? undefined, stakingInfo?.stakedAmount?.token)
  const showAddLiquidityButton = Boolean(stakingInfo?.stakedAmount?.equalTo('0') && userLiquidityUnstaked?.equalTo('0'))

  // toggle for staking modal and unstaking modal
  const [showStakingModal, setShowStakingModal] = useState(false)
  const [showUnstakingModal, setShowUnstakingModal] = useState(false)
  const [showClaimRewardModal, setShowClaimRewardModal] = useState(false)

  // fade cards if nothing staked or nothing earned yet
  const disableTop = !stakingInfo?.stakedAmount || stakingInfo.stakedAmount.equalTo(JSBI.BigInt(0))
  const token = currencyA === currencyUSD ? tokenB : tokenA
  const tokenUSD = currencyA === currencyUSD ? tokenA : tokenB

  const backgroundColor = useColor(token)

  // get tokenUSD value of staked LP tokens
  const totalSupplyOfStakingToken = useTotalSupply(stakingInfo?.stakedAmount?.token)
  let valueOfTotalStakedAmountInUSD: TokenAmount | undefined
  if (totalSupplyOfStakingToken && stakingTokenPair && stakingInfo && tokenUSD) {
    // take the total amount of LP tokens staked, multiply by USD value of all LP tokens, divide by all LP tokens
    valueOfTotalStakedAmountInUSD = new TokenAmount(
      tokenUSD,
      JSBI.divide(
        JSBI.multiply(
          JSBI.multiply(stakingInfo.totalStakedAmount.raw, stakingTokenPair.reserveOf(tokenUSD).raw),
          JSBI.BigInt(2) // this is b/c the value of LP shares are ~double the value of the tokenUSD they entitle owner to
        ),
        totalSupplyOfStakingToken.raw
      )
    )
  }

  const countUpAmount = stakingInfo?.earnedAmount?.toFixed(6) ?? '0'
  const countUpAmountPrevious = usePrevious(countUpAmount) ?? '0'

  // get the USD value of staked tokenUSD
  // const USDPrice = useUSDCPrice(tokenUSD)
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

  return (
    <>
      <AppBody>
        <LMGridContainer>
          <ItemColumn></ItemColumn>
          <InfoContainer>
            <EarnCard>
              <CardSection>
                <FittedAutoColumn gap="md" minHeight={'580px'}>
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
              <PageWrapper gap="lg" justify="center">
                <RowBetween style={{ gap: '24px' }}>
                  <TYPE.mediumHeader style={{ margin: 0 }}>
                    {currencyA?.symbol}-{currencyB?.symbol} Liquidity Mining
                  </TYPE.mediumHeader>
                  <DoubleCurrencyLogo currency0={currencyA ?? undefined} currency1={currencyB ?? undefined} size={24} radius={true} />
                </RowBetween>

                <DataRow style={{ gap: '24px' }}>
                  <PoolData>
                    <AutoColumn gap="sm">
                      <TYPE.body style={{ margin: 0 }}>Total deposits</TYPE.body>
                      <TYPE.body fontSize={24} fontWeight={500}>
                        {/* {valueOfTotalStakedAmountInUSDC
                          ? `$${valueOfTotalStakedAmountInUSDC.toFixed(0)}`
                          : `${valueOfTotalStakedAmountInUSD?.toSignificant(4) ?? '-'} ETH`} */}
                        {`${valueOfTotalStakedAmountInUSD?.toSignificant(4) ?? '-'} uSD`}
                      </TYPE.body>
                    </AutoColumn>
                  </PoolData>
                  <PoolData>
                    <AutoColumn gap="sm">
                      <TYPE.body style={{ margin: 0 }}>Pool Rate</TYPE.body>
                      <TYPE.body fontSize={24} fontWeight={500}>
                        {stakingInfo?.totalRewardRate
                          ?.multiply((60 * 60 * 24).toString())
                          ?.toFixed(0) ?? '-'}
                        {' GIL / day'}
                      </TYPE.body>
                    </AutoColumn>
                  </PoolData>
                </DataRow>

                {showAddLiquidityButton && (
                  <VoteCard>
                    <CardBGImage />
                    <CardNoise />
                    <CardSection>
                      <AutoColumn gap="md">
                        <RowBetween>
                          <TYPE.white fontWeight={600}>Step 1. Get Liquidity tokens</TYPE.white>
                        </RowBetween>
                        <RowBetween style={{ marginBottom: '1rem' }}>
                          <TYPE.white fontSize={14}>
                            {`LP tokens are required. Once you've added liquidity to the ${currencyA?.symbol}-${currencyB?.symbol} pool you can stake your liquidity tokens on this page.`}
                          </TYPE.white>
                        </RowBetween>
                        <ButtonMateriaPrimary
                          padding="8px"
                          borderRadius="8px"
                          width={'fit-content'}
                          as={Link}
                          to={`/add/${currencyA && currencyId(currencyA)}/${currencyB && currencyId(currencyB)}`}
                        >
                          {`Add ${currencyA?.symbol}-${currencyB?.symbol} liquidity`}
                        </ButtonMateriaPrimary>
                      </AutoColumn>
                    </CardSection>
                    <CardBGImage />
                    <CardNoise />
                  </VoteCard>
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

                <PositionInfo gap="lg" justify="center" dim={showAddLiquidityButton}>
                  <BottomSection gap="lg" justify="center">
                    <StyledDataCard disabled={disableTop} bgColor={backgroundColor} showBackground={!showAddLiquidityButton}>
                      <CardSection>
                        <CardBGImage desaturate />
                        <CardNoise />
                        <AutoColumn gap="md">
                          <RowBetween>
                            <TYPE.white fontWeight={600}>Your liquidity deposits</TYPE.white>
                          </RowBetween>
                          <RowBetween style={{ alignItems: 'baseline' }}>
                            <TYPE.white fontSize={36} fontWeight={600}>
                              {stakingInfo?.stakedAmount?.toSignificant(6) ?? '-'}
                            </TYPE.white>
                            <TYPE.white>
                              LP {currencyA?.symbol}-{currencyB?.symbol}
                            </TYPE.white>
                          </RowBetween>
                        </AutoColumn>
                      </CardSection>
                    </StyledDataCard>
                    <StyledBottomCard dim={stakingInfo?.stakedAmount?.equalTo(JSBI.BigInt(0))}>
                      <CardBGImage desaturate />
                      <CardNoise />
                      <AutoColumn gap="sm">
                        <RowBetween>
                          <div>
                            <TYPE.black>Your unclaimed GIL</TYPE.black>
                          </div>
                          {stakingInfo?.earnedAmount && JSBI.notEqual(BIG_INT_ZERO, stakingInfo?.earnedAmount?.raw) && (
                            <ButtonEmpty
                              padding="8px"
                              borderRadius="8px"
                              width="fit-content"
                              onClick={() => setShowClaimRewardModal(true)}
                            >
                              Claim
                            </ButtonEmpty>
                          )}
                        </RowBetween>
                        <RowBetween>
                          <TYPE.largeHeader fontSize={36} fontWeight={600}>
                            <CountUp
                              key={countUpAmount}
                              isCounting
                              decimalPlaces={4}
                              start={parseFloat(countUpAmountPrevious)}
                              end={parseFloat(countUpAmount)}
                              thousandsSeparator={','}
                              duration={1}
                            />
                          </TYPE.largeHeader>
                          <TYPE.black fontSize={16} fontWeight={500} style={{ paddingLeft: '100px' }}>
                            {stakingInfo?.rewardRate
                              ?.multiply((60 * 60 * 24).toString())
                              ?.toSignificant(4) ?? '-'}
                            {' GIL / day'}
                          </TYPE.black>
                        </RowBetween>
                      </AutoColumn>
                    </StyledBottomCard>
                  </BottomSection>
                  <TYPE.main style={{ textAlign: 'center' }} fontSize={14}>
                    When you withdraw, the contract will automagically claim GIL on your behalf!
                   </TYPE.main>
                  {!showAddLiquidityButton && (
                    <DataRow style={{ marginBottom: '1rem' }}>
                      <ButtonMateriaPrimary padding="8px" borderRadius="8px" onClick={handleDepositClick}>
                        {stakingInfo?.stakedAmount?.greaterThan(JSBI.BigInt(0)) ? 'Deposit' : 'Deposit LP Tokens'}
                      </ButtonMateriaPrimary>

                      {stakingInfo?.stakedAmount?.greaterThan(JSBI.BigInt(0)) && (
                        <>
                          <ButtonMateriaPrimary
                            padding="8px"
                            borderRadius="8px"
                            onClick={() => setShowUnstakingModal(true)}
                          >
                            Withdraw
                          </ButtonMateriaPrimary>
                        </>
                      )}
                    </DataRow>
                  )}
                  {!userLiquidityUnstaked ? null : userLiquidityUnstaked.equalTo('0') ? null : (
                    <TYPE.main>{userLiquidityUnstaked.toSignificant(6)} LP tokens available</TYPE.main>
                  )}
                </PositionInfo>
              </PageWrapper>
            </PoolSection>
          </PoolsContainer>
        </LMGridContainer>
      </AppBody>
    </>

  )
}
