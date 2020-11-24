import React, { useContext, useMemo } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { Pair } from '@uniswap/sdk'
import { Link } from 'react-router-dom'
import { SwapPoolTabs } from '../../components/NavigationTabs'
import FullPositionCard from '../../components/PositionCard'
import { useTokenBalancesWithLoadingIndicator } from '../../state/wallet/hooks'
import { StyledInternalLink, ExternalLink, TYPE, HideSmall } from '../../theme'
import { Text } from 'rebass'
import Card from '../../components/Card'
import { RowBetween, RowFixed } from '../../components/Row'
import { ButtonPrimary, ButtonSecondary } from '../../components/Button'
import { AutoColumn } from '../../components/Column'

import { useActiveWeb3React } from '../../hooks'
import { usePairs } from '../../data/Reserves'
import { toLiquidityToken, useTrackedTokenPairs } from '../../state/user/hooks'
import { Dots } from '../../components/swap/styleds'
import { CardSection, DataCard, CardNoise, CardBGImage } from '../../components/earn/styled'
import AppBody from '../AppBody'

const PageWrapper = styled(AutoColumn)`
  max-width: 640px;
  width: 100%;
`

const VoteCard = styled(DataCard)`
  // background: rgba(0, 27, 49, 0.5) !important;
  border: 2px solid #1992d3;
  background: #002852;
  border-radius: 0px !important;
  overflow: hidden;
`

const TitleRow = styled(RowBetween)`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-wrap: wrap;
    gap: 12px;
    width: 100%;
    flex-direction: column-reverse;
  `};
`

const ButtonRow = styled(RowFixed)`
  gap: 8px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 100%;
    flex-direction: row-reverse;
    justify-content: space-between;
  `};
`

const ResponsiveButtonPrimary = styled(ButtonPrimary)`
  width: fit-content;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 48%;
  `};
`

const ResponsiveButtonSecondary = styled(ButtonSecondary)`
  width: fit-content;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 48%;
  `};
`

const EmptyProposals = styled.div`
  border: 1px solid ${({ theme }) => theme.cyan1};
  padding: 16px 12px;
  // border-radius: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const GoBottom = styled.div`
  margin-top: auto;
`

const PoolGridContainer = styled.div`
  display: grid;
  grid-template-columns: 3% auto;

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
${({ theme }) => theme.backgroundContainer}
`

export default function Pool() {
  const theme = useContext(ThemeContext)
  const { account } = useActiveWeb3React()

  // fetch the user's balances of all tracked LP tokens
  const trackedTokenPairs = useTrackedTokenPairs()
  const tokenPairsWithLiquidityTokens = useMemo(
    () => trackedTokenPairs.map(tokens => ({ liquidityToken: toLiquidityToken(tokens), tokens })),
    [trackedTokenPairs]
  )
  const liquidityTokens = useMemo(() => tokenPairsWithLiquidityTokens.map(tpwlt => tpwlt.liquidityToken), [
    tokenPairsWithLiquidityTokens
  ])
  const [pairsBalances, fetchingPairBalances] = useTokenBalancesWithLoadingIndicator(
    account ?? undefined,
    liquidityTokens
  )

  // fetch the reserves for all pools in which the user has a balance
  const liquidityTokensWithBalances = useMemo(
    () =>
      tokenPairsWithLiquidityTokens.filter(({ liquidityToken }) =>
        pairsBalances[liquidityToken.address]?.greaterThan('0')
      ),
    [tokenPairsWithLiquidityTokens, pairsBalances]
  )

  const pairs = usePairs(liquidityTokensWithBalances.map(({ tokens }) => tokens))
  const isLoading =
    fetchingPairBalances || pairs?.length < liquidityTokensWithBalances.length || pairs?.some(Pair => !Pair)

  const allPairsWithLiquidity = pairs.map(([, pair]) => pair).filter((pair): pair is Pair => Boolean(pair))

  return (
    <>
      <AppBody>
        <SwapPoolTabs active={'pool'} />
        <PoolGridContainer>
        <ItemColumn>
            <div style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
              <p style={{ fontSize: 'xx-large', margin: '0px 0px 0px -10px', color: '#fff' }}>
                Pool
              </p>
            </div>
            </ItemColumn>
          <MainContainer>
          <VoteCard>
          {/* <CardBGImage /> */}
          {/* <CardNoise /> */}
          <CardSection>
            <AutoColumn gap="md">
              <RowBetween>
                <TYPE.white color={theme.text1} fontWeight={600}>Liquidity provider rewards</TYPE.white>
              </RowBetween>
              <RowBetween>
                <TYPE.white fontSize={14}>
                  {`Liquidity providers earn a 0.3% fee on all trades proportional to their share of the pool. Fees are added to the pool, accrue in real time and can be claimed by withdrawing your liquidity.`}
                </TYPE.white>
              </RowBetween>
            </AutoColumn>
          </CardSection>
          <CardBGImage />
          <CardNoise />
        </VoteCard>
        <AutoColumn gap="lg" justify="center">
          <AutoColumn gap="lg" style={{ width: '100%' }}>
            <TitleRow style={{ marginTop: '1rem' }} padding={'0'}>
              <HideSmall>
                <TYPE.mediumHeader style={{ marginTop: '0.5rem', justifySelf: 'flex-start' }}>
                  Your liquidity
                </TYPE.mediumHeader>
              </HideSmall>
              <ButtonRow>
                <ResponsiveButtonSecondary as={Link} padding="6px 8px" to="/create/ETH">
                  Create a pair
                </ResponsiveButtonSecondary>
                <ResponsiveButtonPrimary id="join-pool-button" as={Link} padding="6px 8px" to="/add/ETH">
                  <Text fontWeight={500} fontSize={16}>
                    Add Liquidity
                  </Text>
                </ResponsiveButtonPrimary>
              </ButtonRow>
            </TitleRow>

            {!account ? (
              <Card padding="40px">
                <TYPE.body color={theme.text3} textAlign="center">
                  Connect to a wallet to view your liquidity.
                </TYPE.body>
              </Card>
            ) : isLoading ? (
              <EmptyProposals>
                <TYPE.body color={theme.text3} textAlign="center">
                  <Dots>Loading</Dots>
                </TYPE.body>
              </EmptyProposals>
            ) : allPairsWithLiquidity?.length > 0 ? (
              <>
                <ButtonSecondary>
                  <RowBetween>
                    <ExternalLink href={'https://info.materia.exchange/account/' + account}>
                      Account analytics and accrued fees
                    </ExternalLink>
                    <span> ↗</span>
                  </RowBetween>
                </ButtonSecondary>

                {allPairsWithLiquidity.map(pair => (
                  <FullPositionCard key={pair.liquidityToken.address} pair={pair} />
                ))}
              </>
            ) : (
                    <EmptyProposals>
                      <TYPE.body color={theme.text3} textAlign="center">
                        No liquidity found.
                </TYPE.body>
                    </EmptyProposals>
                  )}
          </AutoColumn>
        </AutoColumn>
 
          </MainContainer>

        </PoolGridContainer>
     </AppBody>
    </>
  )
}
