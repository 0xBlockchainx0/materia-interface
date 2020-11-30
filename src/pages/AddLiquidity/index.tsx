import { BigNumber } from '@ethersproject/bignumber'
import { TransactionResponse } from '@ethersproject/providers'
import { Currency, currencyEquals, ETHER, TokenAmount, WETH } from '@uniswap/sdk'
import React, { useCallback, useContext, useState, useMemo } from 'react'
import { Plus } from 'react-feather'
import ReactGA from 'react-ga'
import { RouteComponentProps } from 'react-router-dom'
import { ButtonError, ButtonLight, ButtonPrimary, ButtonSecondary } from '../../components/Button'
import { BlueCard, LightCard } from '../../components/Card'
import { AutoColumn, ColumnCenter } from '../../components/Column'
import TransactionConfirmationModal, { ConfirmationModalContent } from '../../components/TransactionConfirmationModal'
import CurrencyInputPanel from '../../components/CurrencyInputPanel'
import DoubleCurrencyLogo from '../../components/DoubleLogo'
import { MinimalPositionCard } from '../../components/PositionCard'
import Row, {AutoRow, RowBetween, RowFlat, RowFixed } from '../../components/Row'

import { ROUTER_ADDRESS } from '../../constants'
import { PairState } from '../../data/Reserves'
import { useCurrency } from '../../hooks/Tokens'
import { ApprovalState, useApproveCallback } from '../../hooks/useApproveCallback'
import useTransactionDeadline from '../../hooks/useTransactionDeadline'
import { useWalletModalToggle } from '../../state/application/hooks'
import { Field } from '../../state/mint/actions'
import { useDerivedMintInfo, useMintActionHandlers, useMintState } from '../../state/mint/hooks'

import { useTransactionAdder } from '../../state/transactions/hooks'
import { useIsExpertMode, useUserSlippageTolerance } from '../../state/user/hooks'
import { calculateGasMargin, calculateSlippageAmount, getRouterContract } from '../../utils'
import { maxAmountSpend } from '../../utils/maxAmountSpend'
import { wrappedCurrency } from '../../utils/wrappedCurrency'
import { Dots, Wrapper } from '../Pool/styleds'
import { ConfirmAddModalBottom } from './ConfirmAddModalBottom'
import { currencyId } from '../../utils/currencyId'
import { PoolPriceBar } from './PoolPriceBar'

import styled, { ThemeContext } from 'styled-components'
import { Pair } from '@uniswap/sdk'
import { Link } from 'react-router-dom'
import FullPositionCard from '../../components/PositionCard'
import { useTokenBalancesWithLoadingIndicator } from '../../state/wallet/hooks'
import { StyledInternalLink, ExternalLink, TYPE, HideSmall } from '../../theme'
import { Text } from 'rebass'
import Card from '../../components/Card'

import { useActiveWeb3React } from '../../hooks'
import { usePairs } from '../../data/Reserves'
import { toLiquidityToken, useTrackedTokenPairs } from '../../state/user/hooks'
import { CardSection, DataCard, CardNoise, CardBGImage } from '../../components/earn/styled'
import AppBody from '../AppBody'


const PageWrapper = styled(AutoColumn)`
  max-width: 640px;
  width: 100%;
`

const VoteCard = styled(DataCard)`
  background: rgba(0, 27, 49, 0.5) !important;
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
  grid-template-columns: 30px 30% auto;

  @media (min-width: 601px) and (max-width: 1350px) {
    grid-template-columns: 50px auto !important;
  }
  @media (max-width: 600px) {
    grid-template-columns: auto !important;
  }
`

const AddLiquidityContainer = styled.div`
  padding: 1rem 0.5rem 1rem 0.5rem;
  ${({ theme }) => theme.backgroundContainer}
`

const ItemColumn = styled.div`
  @media (min-width: 601px) and (max-width: 1350px) {
    // display: none;
  }
  @media (max-width: 600px) {
    display: none;
  }
`

const PoolContainer = styled.div`
  padding: 1rem;
  font-size: smaller;
  ${({ theme }) => theme.backgroundContainer}
`

const CurrencyContainer = styled.div`
  @media (min-width: 1050px) {
    display: grid;
    grid-template-columns: 37.5% 25% 37.5%;
  }
`

const Divider = styled.div`
  border: 1px solid ${({ theme }) => theme.cyan1};
  margin-top: 0.2rem;
`

const PoolMenu = styled.div`
  display: inline-flex;
`

const PoolMenuItem = styled.div<{ active?: boolean }>`
  padding-right: 1rem;
  opacity: ${({ active }) => (active ? '1' : '0.4')};
  `

  const TradePriceContainer = styled.div`
  margin-top: auto;
`

const PositionContainer = styled.div` 
  padding-bottom: '10px';
  padding-top: '10px'; 
  width: 100%;
  color: ${({ theme }) => theme.text2};
  background-color: ${({ theme }) => theme.advancedBG};
  z-index: -1;
  margin-bottom: 0.5rem;
  border: '1px solid #1e9de3';
  transform: 'translateY(0%)';
  transition: transform 300ms ease-in-out;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden; 
  display: 'block';

  @media (max-width: 600px) {
    padding-left: -2rem !important;
  }
`

export default function AddLiquidity({
  match: {
    params: { currencyIdA, currencyIdB }
  },
  history
}: RouteComponentProps<{ currencyIdA?: string; currencyIdB?: string }>) {
  const { account, chainId, library } = useActiveWeb3React()
  const theme = useContext(ThemeContext)

  // Pool
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

  // AddLiquidity
  const currencyA = useCurrency(currencyIdA)
  const currencyB = useCurrency(currencyIdB)

  const oneCurrencyIsWETH = Boolean(
    chainId &&
    ((currencyA && currencyEquals(currencyA, WETH[chainId])) ||
      (currencyB && currencyEquals(currencyB, WETH[chainId])))
  )

  const toggleWalletModal = useWalletModalToggle() // toggle wallet when disconnected

  const expertMode = useIsExpertMode()

  // mint state
  const { independentField, typedValue, otherTypedValue } = useMintState()
  const {
    dependentField,
    currencies,
    pair,
    pairState,
    currencyBalances,
    parsedAmounts,
    price,
    noLiquidity,
    liquidityMinted,
    poolTokenPercentage,
    error
  } = useDerivedMintInfo(currencyA ?? undefined, currencyB ?? undefined)
  const { onFieldAInput, onFieldBInput } = useMintActionHandlers(noLiquidity)

  const isValid = !error

  // modal and loading
  const [showConfirm, setShowConfirm] = useState<boolean>(false)
  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false) // clicked confirm

  // txn values
  const deadline = useTransactionDeadline() // custom from users settings
  const [allowedSlippage] = useUserSlippageTolerance() // custom from users
  const [txHash, setTxHash] = useState<string>('')

  // get formatted amounts
  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: noLiquidity ? otherTypedValue : parsedAmounts[dependentField]?.toSignificant(6) ?? ''
  }

  // get the max amounts user can add
  const maxAmounts: { [field in Field]?: TokenAmount } = [Field.CURRENCY_A, Field.CURRENCY_B].reduce(
    (accumulator, field) => {
      return {
        ...accumulator,
        [field]: maxAmountSpend(currencyBalances[field])
      }
    },
    {}
  )

  const atMaxAmounts: { [field in Field]?: TokenAmount } = [Field.CURRENCY_A, Field.CURRENCY_B].reduce(
    (accumulator, field) => {
      return {
        ...accumulator,
        [field]: maxAmounts[field]?.equalTo(parsedAmounts[field] ?? '0')
      }
    },
    {}
  )

  // check whether the user has approved the router on the tokens
  const [approvalA, approveACallback] = useApproveCallback(parsedAmounts[Field.CURRENCY_A], ROUTER_ADDRESS)
  const [approvalB, approveBCallback] = useApproveCallback(parsedAmounts[Field.CURRENCY_B], ROUTER_ADDRESS)

  const addTransaction = useTransactionAdder()

  async function onAdd() {
    if (!chainId || !library || !account) return
    const router = getRouterContract(chainId, library, account)

    const { [Field.CURRENCY_A]: parsedAmountA, [Field.CURRENCY_B]: parsedAmountB } = parsedAmounts
    if (!parsedAmountA || !parsedAmountB || !currencyA || !currencyB || !deadline) {
      return
    }

    const amountsMin = {
      [Field.CURRENCY_A]: calculateSlippageAmount(parsedAmountA, noLiquidity ? 0 : allowedSlippage)[0],
      [Field.CURRENCY_B]: calculateSlippageAmount(parsedAmountB, noLiquidity ? 0 : allowedSlippage)[0]
    }

    let estimate,
      method: (...args: any) => Promise<TransactionResponse>,
      args: Array<string | string[] | number>,
      value: BigNumber | null
    if (currencyA === ETHER || currencyB === ETHER) {
      const tokenBIsETH = currencyB === ETHER
      estimate = router.estimateGas.addLiquidityETH
      method = router.addLiquidityETH
      args = [
        wrappedCurrency(tokenBIsETH ? currencyA : currencyB, chainId)?.address ?? '', // token
        (tokenBIsETH ? parsedAmountA : parsedAmountB).raw.toString(), // token desired
        amountsMin[tokenBIsETH ? Field.CURRENCY_A : Field.CURRENCY_B].toString(), // token min
        amountsMin[tokenBIsETH ? Field.CURRENCY_B : Field.CURRENCY_A].toString(), // eth min
        account,
        deadline.toHexString()
      ]
      value = BigNumber.from((tokenBIsETH ? parsedAmountB : parsedAmountA).raw.toString())
    } else {
      estimate = router.estimateGas.addLiquidity
      method = router.addLiquidity
      args = [
        wrappedCurrency(currencyA, chainId)?.address ?? '',
        wrappedCurrency(currencyB, chainId)?.address ?? '',
        parsedAmountA.raw.toString(),
        parsedAmountB.raw.toString(),
        amountsMin[Field.CURRENCY_A].toString(),
        amountsMin[Field.CURRENCY_B].toString(),
        account,
        deadline.toHexString()
      ]
      value = null
    }

    setAttemptingTxn(true)
    await estimate(...args, value ? { value } : {})
      .then(estimatedGasLimit =>
        method(...args, {
          ...(value ? { value } : {}),
          gasLimit: calculateGasMargin(estimatedGasLimit)
        }).then(response => {
          setAttemptingTxn(false)

          addTransaction(response, {
            summary:
              'Add ' +
              parsedAmounts[Field.CURRENCY_A]?.toSignificant(3) +
              ' ' +
              currencies[Field.CURRENCY_A]?.symbol +
              ' and ' +
              parsedAmounts[Field.CURRENCY_B]?.toSignificant(3) +
              ' ' +
              currencies[Field.CURRENCY_B]?.symbol
          })

          setTxHash(response.hash)

          ReactGA.event({
            category: 'Liquidity',
            action: 'Add',
            label: [currencies[Field.CURRENCY_A]?.symbol, currencies[Field.CURRENCY_B]?.symbol].join('/')
          })
        })
      )
      .catch(error => {
        setAttemptingTxn(false)
        // we only care if the error is something _other_ than the user rejected the tx
        if (error?.code !== 4001) {
          console.error(error)
        }
      })
  }

  const modalHeader = () => {
    return noLiquidity ? (
      <AutoColumn gap="20px">
        <LightCard mt="20px" borderRadius="20px">
          <RowFlat>
            <Text fontSize="48px" fontWeight={500} lineHeight="42px" marginRight={10}>
              {currencies[Field.CURRENCY_A]?.symbol + '/' + currencies[Field.CURRENCY_B]?.symbol}
            </Text>
            <DoubleCurrencyLogo
              currency0={currencies[Field.CURRENCY_A]}
              currency1={currencies[Field.CURRENCY_B]}
              size={30}
            />
          </RowFlat>
        </LightCard>
      </AutoColumn>
    ) : (
        <AutoColumn gap="20px">
          <RowFlat style={{ marginTop: '20px' }}>
            <Text fontSize="48px" fontWeight={500} lineHeight="42px" marginRight={10}>
              {liquidityMinted?.toSignificant(6)}
            </Text>
            <DoubleCurrencyLogo
              currency0={currencies[Field.CURRENCY_A]}
              currency1={currencies[Field.CURRENCY_B]}
              size={30}
            />
          </RowFlat>
          <Row>
            <Text fontSize="24px">
              {currencies[Field.CURRENCY_A]?.symbol + '/' + currencies[Field.CURRENCY_B]?.symbol + ' Pool Tokens'}
            </Text>
          </Row>
          <TYPE.italic fontSize={12} textAlign="left" padding={'8px 0 0 0 '}>
            {`Output is estimated. If the price changes by more than ${allowedSlippage /
              100}% your transaction will revert.`}
          </TYPE.italic>
        </AutoColumn>
      )
  }

  const modalBottom = () => {
    return (
      <ConfirmAddModalBottom
        price={price}
        currencies={currencies}
        parsedAmounts={parsedAmounts}
        noLiquidity={noLiquidity}
        onAdd={onAdd}
        poolTokenPercentage={poolTokenPercentage}
      />
    )
  }

  const pendingText = `Supplying ${parsedAmounts[Field.CURRENCY_A]?.toSignificant(6)} ${currencies[Field.CURRENCY_A]?.symbol
    } and ${parsedAmounts[Field.CURRENCY_B]?.toSignificant(6)} ${currencies[Field.CURRENCY_B]?.symbol}`

  const handleCurrencyASelect = useCallback(
    (currencyA: Currency) => {
      const newCurrencyIdA = currencyId(currencyA)
      if (newCurrencyIdA === currencyIdB) {
        history.push(`/add/${currencyIdB}/${currencyIdA}`)
      } else {
        history.push(`/add/${newCurrencyIdA}/${currencyIdB}`)
      }
    },
    [currencyIdB, history, currencyIdA]
  )
  const handleCurrencyBSelect = useCallback(
    (currencyB: Currency) => {
      const newCurrencyIdB = currencyId(currencyB)
      if (currencyIdA === newCurrencyIdB) {
        if (currencyIdB) {
          history.push(`/add/${currencyIdB}/${newCurrencyIdB}`)
        } else {
          history.push(`/add/${newCurrencyIdB}`)
        }
      } else {
        history.push(`/add/${currencyIdA ? currencyIdA : 'ETH'}/${newCurrencyIdB}`)
      }
    },
    [currencyIdA, history, currencyIdB]
  )

  const handleDismissConfirmation = useCallback(() => {
    setShowConfirm(false)
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onFieldAInput('')
    }
    setTxHash('')
  }, [onFieldAInput, txHash])

  const isCreate = history.location.pathname.includes('/create')

  return (
    <>
      <AppBody>
        <PoolGridContainer>
          <ItemColumn>
            <div style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
              <p style={{ fontSize: 'xx-large', margin: '0px 0px 0px -10px', color: '#fff' }}>
                Pool
            </p>
            </div>
          </ItemColumn>
          <PoolContainer>
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

          </PoolContainer>
          <AddLiquidityContainer>
            <PoolMenu>
              <PoolMenuItem active={true}>
                <Link to="/create/ETH">
                  <TYPE.body color={theme.text1} fontWeight={500} fontSize={14}>Create a pair</TYPE.body>
                </Link>
              </PoolMenuItem>
              <PoolMenuItem>
                <Link to="/add/ETH">
                  <TYPE.body color={theme.text1} fontWeight={500} fontSize={14}>Add Liquidity</TYPE.body>
                </Link>
              </PoolMenuItem>
            </PoolMenu>
            <Divider></Divider>
            <TransactionConfirmationModal
              isOpen={showConfirm}
              onDismiss={handleDismissConfirmation}
              attemptingTxn={attemptingTxn}
              hash={txHash}
              content={() => (
                <ConfirmationModalContent
                  title={noLiquidity ? 'You are creating a pool' : 'You will receive'}
                  onDismiss={handleDismissConfirmation}
                  topContent={modalHeader}
                  bottomContent={modalBottom}
                />
              )}
              pendingText={pendingText}
            />
            <CurrencyContainer>
              <AutoColumn gap={'lg'}>
                <CurrencyInputPanel
                  value={formattedAmounts[Field.CURRENCY_A]}
                  onUserInput={onFieldAInput}
                  onMax={() => {
                    onFieldAInput(maxAmounts[Field.CURRENCY_A]?.toExact() ?? '')
                  }}
                  onCurrencySelect={handleCurrencyASelect}
                  showMaxButton={!atMaxAmounts[Field.CURRENCY_A]}
                  currency={currencies[Field.CURRENCY_A]}
                  disableCurrencySelect={true}
                  id="add-liquidity-input-tokena"
                  showCommonBases
                />
              </AutoColumn>
              <TradePriceContainer>
                <AutoColumn justify="space-between" >
                  <AutoRow style={{ padding: '0 1rem', marginBottom: '1rem' }}>
                    <ColumnCenter>
                      {noLiquidity ||
                        (isCreate && (
                          <ColumnCenter>
                            <BlueCard>
                              <AutoColumn gap="10px">
                                <TYPE.link textAlign="center" fontWeight={600} color={'primaryText1'} fontSize={14}>
                                  You are the first liquidity provider.
                            </TYPE.link>
                                <TYPE.link textAlign="center" fontWeight={400} color={'primaryText1'} fontSize={14}>
                                  The ratio of tokens you add will set the price of this pool.
                            </TYPE.link>
                                <TYPE.link textAlign="center" fontWeight={400} color={'primaryText1'} fontSize={14}>
                                  Once you are happy with the rate click supply to review.
                            </TYPE.link>
                              </AutoColumn>
                            </BlueCard>
                          </ColumnCenter>
                        ))}
                      {/* <Plus size="16" color={theme.text2} /> */}
                      {currencies[Field.CURRENCY_A] && currencies[Field.CURRENCY_B] && pairState !== PairState.INVALID && (
                        <>
                          <RowBetween padding="1rem">
                            <TYPE.subHeader fontWeight={500} fontSize={14} textAlign="center">
                              {noLiquidity ? 'Initial prices' : 'Prices'} and pool share
                          </TYPE.subHeader>
                          </RowBetween>
                          <PoolPriceBar
                            currencies={currencies}
                            poolTokenPercentage={poolTokenPercentage}
                            noLiquidity={noLiquidity}
                            price={price}
                          />

                        </>
                      )}
                    </ColumnCenter>
                  </AutoRow>
                </AutoColumn>
              </TradePriceContainer>
              <AutoColumn gap={'lg'}>
                <CurrencyInputPanel
                  value={formattedAmounts[Field.CURRENCY_B]}
                  onUserInput={onFieldBInput}
                  onCurrencySelect={handleCurrencyBSelect}
                  onMax={() => {
                    onFieldBInput(maxAmounts[Field.CURRENCY_B]?.toExact() ?? '')
                  }}
                  showMaxButton={!atMaxAmounts[Field.CURRENCY_B]}
                  currency={currencies[Field.CURRENCY_B]}
                  id="add-liquidity-input-tokenb"
                  showCommonBases
                />
              </AutoColumn>
            </CurrencyContainer>
            {
              pair && !noLiquidity && pairState !== PairState.INVALID ? (
                <PositionContainer>
                  <MinimalPositionCard showUnwrapped={oneCurrencyIsWETH} pair={pair} />
                </PositionContainer>
              ) : null
            }

            {!account ? (
              <ButtonLight onClick={toggleWalletModal}>Connect Wallet</ButtonLight>
            ) : (
                <AutoColumn gap={'md'}>
                  {(approvalA === ApprovalState.NOT_APPROVED ||
                    approvalA === ApprovalState.PENDING ||
                    approvalB === ApprovalState.NOT_APPROVED ||
                    approvalB === ApprovalState.PENDING) &&
                    isValid && (
                      <RowBetween>
                        {approvalA !== ApprovalState.APPROVED && (
                          <ButtonPrimary
                            onClick={approveACallback}
                            disabled={approvalA === ApprovalState.PENDING}
                            width={approvalB !== ApprovalState.APPROVED ? '48%' : '100%'}
                          >
                            {approvalA === ApprovalState.PENDING ? (
                              <Dots>Approving {currencies[Field.CURRENCY_A]?.symbol}</Dots>
                            ) : (
                                'Approve ' + currencies[Field.CURRENCY_A]?.symbol
                              )}
                          </ButtonPrimary>
                        )}
                        {approvalB !== ApprovalState.APPROVED && (
                          <ButtonPrimary
                            onClick={approveBCallback}
                            disabled={approvalB === ApprovalState.PENDING}
                            width={approvalA !== ApprovalState.APPROVED ? '48%' : '100%'}
                          >
                            {approvalB === ApprovalState.PENDING ? (
                              <Dots>Approving {currencies[Field.CURRENCY_B]?.symbol}</Dots>
                            ) : (
                                'Approve ' + currencies[Field.CURRENCY_B]?.symbol
                              )}
                          </ButtonPrimary>
                        )}
                      </RowBetween>
                    )}
                  <ButtonError
                    onClick={() => {
                      expertMode ? onAdd() : setShowConfirm(true)
                    }}
                    disabled={!isValid || approvalA !== ApprovalState.APPROVED || approvalB !== ApprovalState.APPROVED}
                    error={!isValid && !!parsedAmounts[Field.CURRENCY_A] && !!parsedAmounts[Field.CURRENCY_B]}
                  >
                    <Text fontSize={20} fontWeight={500}>
                      {error ?? 'Supply'}
                    </Text>
                  </ButtonError>
                </AutoColumn>
              )}

          </AddLiquidityContainer>
        </PoolGridContainer>
      </AppBody>

    </>
  )
}
