import { BigNumber } from '@ethersproject/bignumber'
import { TransactionResponse } from '@ethersproject/providers'
import { ADD_LIQUIDITY_ACTION_SAFE_TRANSFER_TOKEN, Currency, currencyEquals, ETHER, JSBI, TokenAmount, IETH } from '@materia-dex/sdk'
import React, { useCallback, useContext, useState, useMemo } from 'react'
import ReactGA from 'react-ga'
import { NavLink, RouteComponentProps } from 'react-router-dom'
import { ButtonMateriaError, ButtonMateriaLight, ButtonMateriaPrimary, ButtonSecondary } from '../../components/Button'
import { BlueCard, LightCard } from '../../components/Card'
import { AutoColumn, ColumnCenter } from '../../components/Column'
import TransactionConfirmationModal, { ConfirmationModalContent } from '../../components/TransactionConfirmationModal'
import CurrencyInputPanel from '../../components/CurrencyInputPanel'
import DoubleCurrencyLogo from '../../components/DoubleLogo'
import { MinimalPositionCard } from '../../components/PositionCard'
import Row, { AutoRow, RowBetween, RowFlat } from '../../components/Row'
import { darken } from 'polished'

import { ORCHESTRATOR_ADDRESS, USD, ZERO_ADDRESS } from '../../constants'
import { PairState } from '../../data/Reserves'
import { useCurrency } from '../../hooks/Tokens'
import { ApprovalState, useApproveCallback } from '../../hooks/useApproveCallback'
import useTransactionDeadline from '../../hooks/useTransactionDeadline'
import { useWalletModalToggle } from '../../state/application/hooks'
import { Field } from '../../state/mint/actions'
import { useDerivedMintInfo, useMintActionHandlers, useMintState } from '../../state/mint/hooks'

import { useTransactionAdder } from '../../state/transactions/hooks'
import { useIsExpertMode, useUserSlippageTolerance } from '../../state/user/hooks'
import { calculateGasMargin, calculateSlippageAmount, getEthItemCollectionContract, getOrchestratorContract } from '../../utils'
import { maxAmountSpend } from '../../utils/maxAmountSpend'
import { wrappedCurrency } from '../../utils/wrappedCurrency'
import { Dots } from '../Pool/styleds'
import { ConfirmAddModalBottom } from './ConfirmAddModalBottom'
import { currencyId } from '../../utils/currencyId'
import { PoolPriceBar } from './PoolPriceBar'

import styled, { ThemeContext } from 'styled-components'
import { Pair } from '@materia-dex/sdk'
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
import usePoolCurrencies from '../../hooks/usePoolCurrencies'
import { Result } from '../../state/multicall/hooks'
import { Contract } from 'ethers'
import Web3 from 'web3'
import useCheckIsEthItem from '../../hooks/useCheckIsEthItem'
import { decodeInteroperableValueToERC20TokenAmount } from '../../state/swap/hooks'

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

const EmptyProposals = styled.div`
  border: 1px solid ${({ theme }) => theme.cyan1};
  padding: 16px 12px;
  // border-radius: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const PoolGridContainer = styled.div`
  display: grid;
  grid-template-columns: 30px 30% auto;

  @media (min-width: 601px) and (max-width: 1350px) {
    grid-template-columns: 30px 30% auto !important;
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
  width: 0px;
  @media (min-width: 601px) and (max-width: 1350px) { /* display: none; */ }
  @media (max-width: 600px) { display: none; }
  min-height: 580px;
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
  const { poolCurrencyIdA, poolCurrencyIdB } = usePoolCurrencies(currencyIdA, currencyIdB)

  currencyIdA = poolCurrencyIdA
  currencyIdB = poolCurrencyIdB

  // Pool
  // fetch the user's balances of all tracked LP tokens
  const trackedTokenPairs = useTrackedTokenPairs()
  const tokenPairsWithLiquidityTokens = useMemo(
    () => trackedTokenPairs.map(tokens => ({
      liquidityToken: toLiquidityToken(tokens), tokens
    })),
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

  // console.log('***************************************')
  // console.log('allPairsWithLiquidity: ', allPairsWithLiquidity)
  // console.log('liquidityTokensWithBalances: ', liquidityTokensWithBalances)
  // console.log('fetchingPairBalances: ', fetchingPairBalances)
  // console.log('pairsBalances: ', pairsBalances)
  // console.log('liquidityTokens: ', liquidityTokens)
  // console.log('tokenPairsWithLiquidityTokens: ', tokenPairsWithLiquidityTokens)
  // console.log('trackedTokenPairs: ', trackedTokenPairs)
  // console.log('***************************************')

  // AddLiquidity
  const currencyA = useCurrency(currencyIdA)
  const currencyB = useCurrency(currencyIdB)

  const oneCurrencyIsIETH = Boolean(
    chainId &&
    ((currencyA && currencyEquals(currencyA, IETH[chainId])) ||
      (currencyB && currencyEquals(currencyB, IETH[chainId])))
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
    // currencyBalances,
    parsedAmounts,
    price,
    noLiquidity,
    liquidityMinted,
    poolTokenPercentage,
    error
  } = useDerivedMintInfo(currencyA ?? undefined, currencyB ?? undefined, true)
  const {
    // pair: originalPair,
    // pairState: originalPairState,
    currencyBalances: originalCurrencyBalances,
    parsedAmounts: originalParsedAmounts
  } = useDerivedMintInfo(currencyA ?? undefined, currencyB ?? undefined, false)
  const currencyBAddress = currencyB ? (wrappedCurrency(currencyB, chainId)?.address ?? ZERO_ADDRESS) : ZERO_ADDRESS
  const checkIsEthItem = useCheckIsEthItem(currencyBAddress)
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

  // console.log('*********************************')
  // console.log('noLiquidity: ', noLiquidity)
  // console.log('typedValue: ', typedValue)
  // console.log('otherTypedValue: ', otherTypedValue)
  // console.log('independentField: ', independentField)
  // console.log('dependentField: ', dependentField)
  // console.log('parsedAmounts: ', parsedAmounts)
  // console.log('formattedAmounts: ', formattedAmounts)
  // console.log('*********************************')

  // get the max amounts user can add
  const maxAmounts: { [field in Field]?: TokenAmount } = [Field.CURRENCY_A, Field.CURRENCY_B].reduce(
    (accumulator, field) => {
      return {
        ...accumulator,
        [field]: maxAmountSpend(originalCurrencyBalances[field])
      }
    },
    {}
  )

  // // get the max amounts user can add
  // const maxAmounts: { [field in Field]?: TokenAmount } = [Field.CURRENCY_A, Field.CURRENCY_B].reduce(
  //   (accumulator, field) => {
  //     return {
  //       ...accumulator,
  //       [field]: maxAmountSpend(currencyBalances[field])
  //     }
  //   },
  //   {}
  // )

  const atMaxAmounts: { [field in Field]?: TokenAmount } = [Field.CURRENCY_A, Field.CURRENCY_B].reduce(
    (accumulator, field) => {
      return {
        ...accumulator,
        [field]: maxAmounts[field]?.equalTo(originalParsedAmounts[field] ?? '0')
      }
    },
    {}
  )

  // const atMaxAmounts: { [field in Field]?: TokenAmount } = [Field.CURRENCY_A, Field.CURRENCY_B].reduce(
  //   (accumulator, field) => {
  //     return {
  //       ...accumulator,
  //       [field]: maxAmounts[field]?.equalTo(parsedAmounts[field] ?? '0')
  //     }
  //   },
  //   {}
  // )

  // check whether the user has approved the router on the tokens
  const [approvalA, approveACallback] = useApproveCallback(originalParsedAmounts[Field.CURRENCY_A], ORCHESTRATOR_ADDRESS)
  const [approvalB, approveBCallback] = useApproveCallback(originalParsedAmounts[Field.CURRENCY_B], ORCHESTRATOR_ADDRESS)

  const addTransaction = useTransactionAdder()

  async function onAdd(checkIsEthItem: Result | undefined) {
    if (!chainId || !library || !account) return
    const router = getOrchestratorContract(chainId, library, account)
    const isEthItem: boolean = checkIsEthItem?.ethItem
    const ethItemCollection: string = checkIsEthItem?.collection
    const ethItemObjectId: JSBI = JSBI.BigInt(checkIsEthItem?.itemId ?? 0)
    const collectionContract: Contract | null =
      (!library || !account || !chainId || !isEthItem)
        ? null
        : getEthItemCollectionContract(chainId, ethItemCollection, library, account)

    if (!currencyA || !currencyB) {
      return
    }

    const currencyUSD = USD[chainId ?? 1]
    const currencyBIsUSD =  wrappedCurrency(currencyB, chainId)?.address == currencyUSD.address

    // console.log('***************************************')
    // console.log('currencyBIsUSD: ', currencyBIsUSD)
    // console.log('parsedAmounts[Field.CURRENCY_A]: ', parsedAmounts[Field.CURRENCY_A])
    // console.log('originalParsedAmounts[Field.CURRENCY_A]: ', originalParsedAmounts[Field.CURRENCY_A])
    // console.log('parsedAmounts[Field.CURRENCY_B]: ', parsedAmounts[Field.CURRENCY_B])
    // console.log('originalParsedAmounts[Field.CURRENCY_B]: ', originalParsedAmounts[Field.CURRENCY_B])
    // console.log('***************************************')

    // const { [Field.CURRENCY_A]: parsedAmountA, [Field.CURRENCY_B]: parsedAmountB } = parsedAmounts
    // const modifiedParsedAmountA = currencyBIsUSD 
    const parsedAmountA = currencyBIsUSD 
      ? decodeInteroperableValueToERC20TokenAmount(parsedAmounts[Field.CURRENCY_A], originalParsedAmounts[Field.CURRENCY_A]) 
      : parsedAmounts[Field.CURRENCY_A] 
    // const modifiedParsedAmountB = currencyBIsUSD 
    const parsedAmountB = currencyBIsUSD 
      ? parsedAmounts[Field.CURRENCY_B] 
      : decodeInteroperableValueToERC20TokenAmount(parsedAmounts[Field.CURRENCY_B], originalParsedAmounts[Field.CURRENCY_B])
    
    if (!parsedAmountA || !parsedAmountB || !deadline) {
      return
    }

    const isETH: boolean = currencyA === ETHER || currencyB === ETHER

    const amountsMin = {
      [Field.CURRENCY_A]: calculateSlippageAmount(parsedAmountA, noLiquidity ? 0 : allowedSlippage)[0],
      [Field.CURRENCY_B]: calculateSlippageAmount(parsedAmountB, noLiquidity ? 0 : allowedSlippage)[0]
    }
    
    let estimate
    let method: (...args: any) => Promise<TransactionResponse>
    let methodName: string
    let args: Array<string | string[] | number | boolean>
    let value: BigNumber | null
    
    if (isEthItem && !isETH) {
      if (!collectionContract) return

      const web3 = new Web3();
      let operation: number = ADD_LIQUIDITY_ACTION_SAFE_TRANSFER_TOKEN
      let ethItemArgs: (any | any[])

      // (address from, address to, uint256 id, uint256 amount, bytes calldata data)
      estimate = collectionContract.estimateGas.safeTransferFrom
      method = collectionContract.safeTransferFrom
      methodName = "safeTransferFrom"
      ethItemArgs = web3.eth.abi.encodeParameters(
        ["uint256", "bytes"],
        [operation, web3.eth.abi.encodeParameters(
          // (uint bridgeAmountDesired, uint tokenAmountMin, uint bridgeAmountMin, address to, uint deadline)
          ["uint", "uint", "uint", "address", "uint"],
          [
            currencyBIsUSD ? parsedAmountB.raw.toString() : parsedAmountA.raw.toString(),
            currencyBIsUSD ? amountsMin[Field.CURRENCY_A].toString() : amountsMin[Field.CURRENCY_B].toString(),
            currencyBIsUSD ? amountsMin[Field.CURRENCY_B].toString() : amountsMin[Field.CURRENCY_A].toString(),
            account,
            deadline.toHexString()
          ]
        )]
      )
      args = [
        account, 
        ORCHESTRATOR_ADDRESS, 
        ethItemObjectId?.toString() ?? "0", 
        currencyBIsUSD ? parsedAmountA.raw.toString() : parsedAmountB.raw.toString(),
        ethItemArgs]
      value = null
    }
    else {
      if (currencyA === ETHER || currencyB === ETHER) {
        const tokenBIsETH = currencyB === ETHER
        estimate = router.estimateGas.addLiquidityETH
        method = router.addLiquidityETH
        methodName = "addLiquidityETH"
        // (uint bridgeAmountDesired, uint EthAmountMin, uint bridgeAmountMin, address to, uint deadline)
        args = [
          (tokenBIsETH ? parsedAmountA : parsedAmountB).raw.toString(), // token desired
          amountsMin[tokenBIsETH ? Field.CURRENCY_B : Field.CURRENCY_A].toString(), // eth min
          amountsMin[tokenBIsETH ? Field.CURRENCY_A : Field.CURRENCY_B].toString(), // token min
          account,
          deadline.toHexString()
        ]
        value = BigNumber.from((tokenBIsETH ? parsedAmountB : parsedAmountA).raw.toString())
      } else {
        
        estimate = router.estimateGas.addLiquidity
        method = router.addLiquidity
        methodName = "addLiquidity"
        // (address token, uint tokenAmountDesired, uint bridgeAmountDesired, uint tokenAmountMin, uint bridgeAmountMin, address to, uint deadline)
        args = [
          wrappedCurrency(currencyBIsUSD ? currencyA : currencyB, chainId)?.address ?? '',
          currencyBIsUSD ? parsedAmountA.raw.toString() : parsedAmountB.raw.toString(),
          currencyBIsUSD ? parsedAmountB.raw.toString() : parsedAmountA.raw.toString(),
          currencyBIsUSD ? amountsMin[Field.CURRENCY_A].toString() : amountsMin[Field.CURRENCY_B].toString(),
          currencyBIsUSD ? amountsMin[Field.CURRENCY_B].toString() : amountsMin[Field.CURRENCY_A].toString(),
          account,
          deadline.toHexString(),
        ]
        value = null
      }
    }

    // console.log('*********************************')
    // console.log('isETH: ', isETH)
    // console.log('approvalA: ', approvalA)
    // console.log('approvalB: ', approvalB)
    // console.log('originalApprovalA: ', originalApprovalA)
    // console.log('originalApprovalB: ', originalApprovalB)
    // console.log('parsedAmountA: ', parsedAmountA)
    // console.log('parsedAmountB: ', parsedAmountB)
    // console.log('parsedAmountA value: ', parsedAmountA?.toSignificant(6))
    // console.log('parsedAmountB value: ', parsedAmountB?.toSignificant(6))
    // console.log('modifiedParsedAmountA: ', modifiedParsedAmountA)
    // console.log('modifiedParsedAmountB: ', modifiedParsedAmountB)
    // console.log('modifiedParsedAmountA value: ', modifiedParsedAmountA?.toSignificant(6))
    // console.log('modifiedParsedAmountB value: ', modifiedParsedAmountB?.toSignificant(6))
    // console.log('parsedAmountsA: ', parsedAmounts[Field.CURRENCY_A])
    // console.log('parsedAmountsB: ', parsedAmounts[Field.CURRENCY_B])
    // console.log('parsedAmountsA value: ', parsedAmounts[Field.CURRENCY_A]?.toSignificant(6))
    // console.log('parsedAmountsB value: ', parsedAmounts[Field.CURRENCY_B]?.toSignificant(6))
    // console.log('originalParsedAmountsA: ', originalParsedAmounts[Field.CURRENCY_A])
    // console.log('originalParsedAmountsB: ', originalParsedAmounts[Field.CURRENCY_B])
    // console.log('originalParsedAmountsA value: ', originalParsedAmounts[Field.CURRENCY_A]?.toSignificant(6))
    // console.log('originalParsedAmountsB value: ', originalParsedAmounts[Field.CURRENCY_B]?.toSignificant(6))
    // console.log('currencyA: ', currencyA)
    // console.log('currencyB: ', currencyB)
    // console.log('currencyA ETH: ', currencyA === ETHER)
    // console.log('currencyB ETH: ', currencyB === ETHER)
    // console.log('isEthItem: ', isEthItem)
    // console.log('ethItemCollection: ', ethItemCollection)
    // console.log('ethItemObjectId: ', ethItemObjectId?.toString() ?? "0")
    // console.log('methodName: ', methodName)
    // console.log('args: ', args)
    // console.log('value: ', value)
    // console.log('*********************************')

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
              radius={true}
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
              radius={true}
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
        onAdd={() => { onAdd(checkIsEthItem) }}
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

  const activeClassName = 'ACTIVE'
  const StyledNavLink = styled(NavLink).attrs({
    activeClassName
  })`
    ${({ theme }) => theme.flexRowNoWrap}
    align-items: left;
    border-radius: 3rem;
    outline: none;
    cursor: pointer;
    text-decoration: none;
    color: ${({ theme }) => theme.text2};
    font-size: 1rem;
    width: fit-content;
    margin: 0 12px;
    font-weight: 500;

    &.${activeClassName} {
      // border-radius: 12px;
      font-weight: 600;
      color: ${({ theme }) => theme.cyan1};
    }

    :hover,
    :focus {
      color: ${({ theme }) => darken(0.1, theme.cyan1)};
    }
  `


  return (
    <>
      <AppBody>
        <PoolGridContainer>
          <ItemColumn></ItemColumn>
          <PoolContainer>
            <VoteCard>
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
              <AutoColumn gap="0.5rem" style={{ width: '100%' }}>
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
                        <ExternalLink href={'https://info.materiadex.com/account/' + account}>
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
              <AutoColumn justify={'center'} gap="md">
                <Text textAlign="center" fontSize={14} style={{ padding: '0' }}>
                  {"Don't see a pool you joined?"}{' '}
                  <StyledInternalLink id="import-pool-link" to={'/find'}>
                    {'Import it.'}
                  </StyledInternalLink>
                </Text>
              </AutoColumn>
            </AutoColumn>
          </PoolContainer>
          <AddLiquidityContainer>
            <PoolMenu>
              <StyledNavLink
                id={`Create-a-pair`}
                to={'/create/uSD'}
                isActive={(match, { pathname }) =>
                  Boolean(match) ||
                  pathname.startsWith('/create')
                }
              >
                Create a pair
              </StyledNavLink>
              <StyledNavLink
                id={`Add-Liquidity`}
                to={'/add/uSD'}
                isActive={(match, { pathname }) =>
                  Boolean(match) ||
                  pathname.startsWith('/add')
                }
              >
                Add Liquidity
              </StyledNavLink>
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
                  <MinimalPositionCard showUnwrapped={oneCurrencyIsIETH} pair={pair} />
                </PositionContainer>
              ) : null
            }

            {!account ? (
              <ButtonMateriaLight onClick={toggleWalletModal}>Connect Wallet</ButtonMateriaLight>
            ) : (
                <AutoColumn gap={'md'}>
                  {(approvalA === ApprovalState.NOT_APPROVED ||
                    approvalA === ApprovalState.PENDING ||
                    approvalB === ApprovalState.NOT_APPROVED ||
                    approvalB === ApprovalState.PENDING) &&
                    isValid && (
                      <RowBetween>
                        {approvalA !== ApprovalState.APPROVED && (
                          <ButtonMateriaPrimary
                            onClick={approveACallback}
                            disabled={approvalA === ApprovalState.PENDING}
                            width={approvalB !== ApprovalState.APPROVED ? '48%' : '100%'}
                          >
                            {approvalA === ApprovalState.PENDING ? (
                              <Dots>Approving {currencies[Field.CURRENCY_A]?.symbol}</Dots>
                            ) : (
                                'Approve ' + currencies[Field.CURRENCY_A]?.symbol
                              )}
                          </ButtonMateriaPrimary>
                        )}
                        {approvalB !== ApprovalState.APPROVED && (
                          <ButtonMateriaPrimary
                            onClick={approveBCallback}
                            disabled={approvalB === ApprovalState.PENDING}
                            width={approvalA !== ApprovalState.APPROVED ? '48%' : '100%'}
                          >
                            {approvalB === ApprovalState.PENDING ? (
                              <Dots>Approving {currencies[Field.CURRENCY_B]?.symbol}</Dots>
                            ) : (
                                'Approve ' + currencies[Field.CURRENCY_B]?.symbol
                              )}
                          </ButtonMateriaPrimary>
                        )}
                      </RowBetween>
                    )}
                  <ButtonMateriaError
                    onClick={() => {
                      expertMode ? onAdd(checkIsEthItem) : setShowConfirm(true)
                    }}
                    disabled={!isValid || approvalA !== ApprovalState.APPROVED || approvalB !== ApprovalState.APPROVED}
                    error={!isValid && !!parsedAmounts[Field.CURRENCY_A] && !!parsedAmounts[Field.CURRENCY_B]}
                  >
                    <Text fontSize={20} fontWeight={500}>
                      {error ?? 'Supply'}
                    </Text>
                  </ButtonMateriaError>
                </AutoColumn>
              )}

          </AddLiquidityContainer>
        </PoolGridContainer>
      </AppBody>
    </>
  )
}
