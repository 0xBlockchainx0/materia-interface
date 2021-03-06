import React, { useContext } from 'react'
import { AutoColumn } from '../Column'
import { RowBetween } from '../Row'
import styled, { ThemeContext } from 'styled-components'
import { 
  SecondaryPanelBoxContainer,
  SecondaryPanelBoxContainerExtraDecorator,
  Divider,
  ActionButton,
  TYPE, 
  StyledInternalButtonLink,
  DynamicGrid
} from '../../theme'
import DoubleCurrencyLogo from '../DoubleLogo'
import { JSBI, TokenAmount } from '@materia-dex/sdk'
import { ButtonMateriaPrimary } from '../Button'
import { StakingInfo } from '../../state/stake/hooks'
import { useColor } from '../../hooks/useColor'
import { currencyId } from '../../utils/currencyId'
import { Break } from './styled'
import { unwrappedToken } from '../../utils/wrappedCurrency'
import { useTotalSupply } from '../../data/TotalSupply'
import { usePair } from '../../data/Reserves'
import { useActiveWeb3React } from '../../hooks'
import { WUSD } from '../../constants'

export default function PoolCard({ stakingInfo }: { stakingInfo: StakingInfo }) {
  const theme = useContext(ThemeContext)

  const { chainId } = useActiveWeb3React()

  const token0 = stakingInfo.tokens[0]
  const token1 = stakingInfo.tokens[1]

  const currency0 = unwrappedToken(token0)
  const currency1 = unwrappedToken(token1)
  const currencyWUSD = unwrappedToken(WUSD[chainId ?? 1])

  const isStaking = Boolean(stakingInfo.stakedAmount.greaterThan('0'))

  // get the color of the token
  const token = currency0 === currencyWUSD ? token1 : token0
  const tokenWUSD = currency0 === currencyWUSD ? token0 : token1

  const backgroundColor = useColor(token)

  const totalSupplyOfStakingToken = useTotalSupply(stakingInfo.stakedAmount.token)
  const [, stakingTokenPair] = usePair(...stakingInfo.tokens)

  // let returnOverMonth: Percent = new Percent('0')
  let valueOfTotalStakedAmountInUSD: TokenAmount | undefined
  if (totalSupplyOfStakingToken && stakingTokenPair) {
    // take the total amount of MP tokens staked, multiply by ETH value of all MP tokens, divide by all MP tokens
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
  
  return (
    <SecondaryPanelBoxContainer className={`${theme.name}`}>
      <div className="inner-content p10">
        <DynamicGrid className={theme.name} columns={2} columnsDefinitions={[{value: 25, location: 2}]}>
          <div className="text-left">
            <DynamicGrid className={theme.name} columns={2} columnsDefinitions={[{value: 90, location: 2}]}>
              <DoubleCurrencyLogo currency0={currency0} currency1={currency1} size={24} radius={true} />
              <div className="title ml10 pl-mobile-25">{currency0.symbol}-{currency1.symbol}</div>
            </DynamicGrid>             
          </div>
          <div className="text-right">
            <StyledInternalButtonLink to={`/lm/${currencyId(currency0)}/${currencyId(currency1)}`}>
              <ActionButton className={theme.name}> {isStaking ? 'Manage' : 'Deposit'} </ActionButton>
            </StyledInternalButtonLink>
          </div>
        </DynamicGrid>
        <DynamicGrid className={`mt10 ${theme.name}`} columns={2}>
          <div className="text-left">Total deposited</div>
          <div className="text-right">
            {`${valueOfTotalStakedAmountInUSD?.toSignificant(4) ?? '-'} WUSD`}
          </div>
        </DynamicGrid>
        <DynamicGrid className={`mt10 ${theme.name}`} columns={2}>
          <div className="text-left">Pool rate</div>
          <div className="text-right">
            {`${stakingInfo.totalRewardRate ?.multiply(`${60 * 60 * 24}`) ?.toFixed(0)} GIL / day`} 
          </div>
        </DynamicGrid>
          {isStaking && (
            <>
              <Divider className={`${theme.name} reduced-margins`}/>
              <DynamicGrid className={`${theme.name}`} columns={2}>
                <div className="text-left">Your rate</div>
                <div className="text-right">{`${stakingInfo.rewardRate ?.multiply(`${60 * 60 * 24}`) ?.toSignificant(4)} GIL / day`}</div>
              </DynamicGrid>
            </>
          )}
      </div>
    </SecondaryPanelBoxContainer>
    
  )
}
