import React, { useState, useContext } from 'react'
import { JSBI, Pair, Percent } from '@materia-dex/sdk'
import { darken } from 'polished'
import { ChevronDown, ChevronUp } from 'react-feather'
import { Link } from 'react-router-dom'
import { Text } from 'rebass'
import styled, { ThemeContext } from 'styled-components'
import { useTotalSupply } from '../../data/TotalSupply'

import { useActiveWeb3React } from '../../hooks'
import { useTokenBalance } from '../../state/wallet/hooks'
import { 
  ExternalLink, 
  TYPE, 
  StyledPositionCard, 
  Dots, 
  ActionButton, 
  SimpleTextParagraph, 
  IconButton,
  MainOperationButton, 
  SectionTitle, 
  SecondaryPanelBoxContainer, 
  SecondaryPanelBoxContainerExtraDecorator } from '../../theme'
import { currencyId } from '../../utils/currencyId'
import { unwrappedToken } from '../../utils/wrappedCurrency'
import { ButtonSecondary, ButtonEmpty, ButtonMateriaPrimary } from '../Button'
import { CardNoise } from '../earn/styled'

import { useColor } from '../../hooks/useColor'

import Card, { LightCard } from '../Card'
import { AutoColumn } from '../Column'
import CurrencyLogo from '../CurrencyLogo'
import DoubleCurrencyLogo from '../DoubleLogo'
import { RowBetween, RowFixed } from '../Row'

export const FixedHeightRow = styled(RowBetween)`
  height: 24px;
`

export const HoverCard = styled(Card)`
  border: 1px solid transparent;
  :hover {
    border: 1px solid ${({ theme }) => darken(0.06, theme.bg2)};
  }
`


interface PositionCardProps {
  pair: Pair
  showUnwrapped?: boolean
  border?: string
}

export function MinimalPositionCard({ pair, showUnwrapped = false, border }: PositionCardProps) {
  const theme = useContext(ThemeContext)
  const { account } = useActiveWeb3React()

  const currency0 = showUnwrapped ? pair.token0 : unwrappedToken(pair.token0)
  const currency1 = showUnwrapped ? pair.token1 : unwrappedToken(pair.token1)

  const [showMore, setShowMore] = useState(false)

  const userPoolBalance = useTokenBalance(account ?? undefined, pair.liquidityToken)
  const totalPoolTokens = useTotalSupply(pair.liquidityToken)

  const poolTokenPercentage =
    !!userPoolBalance && !!totalPoolTokens && JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
      ? new Percent(userPoolBalance.raw, totalPoolTokens.raw)
      : undefined

  const [token0Deposited, token1Deposited] =
    !!pair &&
    !!totalPoolTokens &&
    !!userPoolBalance &&
    // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
    JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
      ? [
          pair.getLiquidityValue(pair.token0, totalPoolTokens, userPoolBalance, false),
          pair.getLiquidityValue(pair.token1, totalPoolTokens, userPoolBalance, false)
        ]
      : [undefined, undefined]

  return (
    <>
      {userPoolBalance && JSBI.greaterThan(userPoolBalance.raw, JSBI.BigInt(0)) ? (
        <>
          <SectionTitle className={ `mt20 mb20 ${theme.name}` }>Your position</SectionTitle>
          <SecondaryPanelBoxContainer className={ `${theme.name}` }>
            <SecondaryPanelBoxContainerExtraDecorator className={ `top ${theme.name}` }/>
              <div className="inner-content">
                <AutoColumn gap="12px" className="p15">
                  <FixedHeightRow onClick={() => setShowMore(!showMore)}>
                    <RowFixed>
                      <DoubleCurrencyLogo currency0={currency0} currency1={currency1} margin={true} size={14} radius={true} />
                      <Text className={ `evidence-text ${theme.name}` }>
                        {currency0.symbol}/{currency1.symbol}
                      </Text>
                    </RowFixed>
                    <RowFixed>
                      <Text className={ `evidence-text ${theme.name}` }>
                        {userPoolBalance ? userPoolBalance.toSignificant(4) : '-'}
                      </Text>
                    </RowFixed>
                  </FixedHeightRow>
                  <AutoColumn gap="4px">
                    <FixedHeightRow>
                      <Text className={ `evidence-text ${theme.name}` }>Your pool share:</Text>
                      <Text className={ `evidence-text ${theme.name}` }>{poolTokenPercentage ? poolTokenPercentage.toFixed(6) + '%' : '-'}</Text>
                    </FixedHeightRow>
                    <FixedHeightRow>
                      <Text className={ `evidence-text ${theme.name}` }>{currency0.symbol}:</Text>
                      {token0Deposited ? (
                        <RowFixed>
                          <Text className={ `evidence-text ml5 ${theme.name}` }>{token0Deposited?.toSignificant(6)}</Text>
                        </RowFixed>
                      ) : (
                        '-'
                      )}
                    </FixedHeightRow>
                    <FixedHeightRow>
                      <Text className={ `evidence-text ${theme.name}` }>{currency1.symbol}:</Text>
                      {token1Deposited ? (
                        <RowFixed>
                          <Text className={ `evidence-text ml5 ${theme.name}` }>{token1Deposited?.toSignificant(6)}</Text>
                        </RowFixed>
                      ) : (
                        '-'
                      )}
                    </FixedHeightRow>
                  </AutoColumn>
                </AutoColumn>
              </div>      
            <SecondaryPanelBoxContainerExtraDecorator className={ `bottom ${theme.name}` }/>
          </SecondaryPanelBoxContainer>   
        </>
      ) : (
        <SecondaryPanelBoxContainer className={ `${theme.name}` }>
          <SecondaryPanelBoxContainerExtraDecorator className={ `top ${theme.name}` }/>
            <div className="inner-content">
              <SimpleTextParagraph className="p10">
                <span role="img" aria-label="wizard-icon"></span>{' '}
                By adding liquidity you'll earn 0.3% of all trades on this pair proportional to your share of the pool.
                Fees are added to the pool, accrue in real time and can be claimed by withdrawing your liquidity.
              </SimpleTextParagraph>
            </div>
          <SecondaryPanelBoxContainerExtraDecorator className={ `bottom ${theme.name}` }/>
        </SecondaryPanelBoxContainer>
      )}
    </>
  )
}

export default function FullPositionCard({ pair, border }: PositionCardProps) {
  const { account } = useActiveWeb3React()

  const currency0 = unwrappedToken(pair.token0)
  const currency1 = unwrappedToken(pair.token1)

  const [showMore, setShowMore] = useState(false)

  const userPoolBalance = useTokenBalance(account ?? undefined, pair.liquidityToken)
  const totalPoolTokens = useTotalSupply(pair.liquidityToken)

  const poolTokenPercentage =
    !!userPoolBalance && !!totalPoolTokens && JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
      ? new Percent(userPoolBalance.raw, totalPoolTokens.raw)
      : undefined

  const [token0Deposited, token1Deposited] =
    !!pair &&
    !!totalPoolTokens &&
    !!userPoolBalance &&
    // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
    JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
      ? [
          pair.getLiquidityValue(pair.token0, totalPoolTokens, userPoolBalance, false),
          pair.getLiquidityValue(pair.token1, totalPoolTokens, userPoolBalance, false)
        ]
      : [undefined, undefined]

  const backgroundColor = useColor(pair?.token0)
  const theme = useContext(ThemeContext)

  return (
    <StyledPositionCard bgColor={backgroundColor} className={ `pt15 pb15 ${theme.name}` }>
      <CardNoise />
      <AutoColumn gap="12px">
        <FixedHeightRow>
          <RowFixed>
            <DoubleCurrencyLogo currency0={currency0} currency1={currency1} margin={true} size={14} radius={true} />
            <Text fontWeight={500} fontSize={14}>
              {!currency0 || !currency1 ? <Dots>Loading</Dots> : `${currency0.symbol}/${currency1.symbol}`}
            </Text>
          </RowFixed>

          <RowFixed>
            <ActionButton className={theme.name} onClick={() => setShowMore(!showMore)}>
              <label>Manage</label> {showMore ? ( <ChevronUp/> ) : ( <ChevronDown /> )}
            </ActionButton>            
          </RowFixed>
        </FixedHeightRow>

        {showMore && (
          <AutoColumn gap="8px">
            <FixedHeightRow>
              <Text fontSize={14} fontWeight={500}>
                Your pool tokens:
              </Text>
              <Text fontSize={14} fontWeight={500}>
                {userPoolBalance ? userPoolBalance.toSignificant(4) : '-'}
              </Text>
            </FixedHeightRow>
            <FixedHeightRow>
              <RowFixed>
                <Text fontSize={14} fontWeight={500}>
                  Pooled {currency0.symbol}:
                </Text>
              </RowFixed>
              {token0Deposited ? (
                <RowFixed>
                  <Text fontSize={14} fontWeight={500} marginLeft={'6px'}>
                    {token0Deposited?.toSignificant(6)}
                  </Text>
                  <CurrencyLogo size="20px" style={{ marginLeft: '8px' }} currency={currency0} />
                </RowFixed>
              ) : (
                '-'
              )}
            </FixedHeightRow>
            <FixedHeightRow>
              <RowFixed>
                <Text fontSize={14} fontWeight={500}>
                  Pooled {currency1.symbol}:
                </Text>
              </RowFixed>
              {token1Deposited ? (
                <RowFixed>
                  <Text fontSize={14} fontWeight={500} marginLeft={'6px'}>
                    {token1Deposited?.toSignificant(6)}
                  </Text>
                  <CurrencyLogo size="20px" style={{ marginLeft: '8px' }} currency={currency1} />
                </RowFixed>
              ) : (
                '-'
              )}
            </FixedHeightRow>
            <FixedHeightRow>
              <Text fontSize={14} fontWeight={500}>
                Your pool share:
              </Text>
              <Text fontSize={14} fontWeight={500}>
                {poolTokenPercentage ? poolTokenPercentage.toFixed(2) + '%' : '-'}
              </Text>
            </FixedHeightRow>
            <SimpleTextParagraph className={ `text-left ${theme.name}` }>
              <ExternalLink href={`https://info.materiadex.com/account/${account}`}>
              View accrued fees and analytics
                <IconButton className={theme.name}>
                  <span className="icon-symbol">↗</span>
                </IconButton>
              </ExternalLink>
            </SimpleTextParagraph>             
            <RowBetween marginTop="10px">
              <ButtonMateriaPrimary
                padding="8px"
                borderRadius="8px"
                as={Link}
                to={`/add/${currencyId(currency0)}/${currencyId(currency1)}`}
                width="48%"
              >
                Add
              </ButtonMateriaPrimary>
              <ButtonMateriaPrimary
                padding="8px"
                borderRadius="8px"
                as={Link}
                width="48%"
                to={`/remove/${currencyId(currency0)}/${currencyId(currency1)}`}
              >
                Remove
              </ButtonMateriaPrimary>
            </RowBetween>
          </AutoColumn>
        )}
      </AutoColumn>
    </StyledPositionCard>
  )
}
