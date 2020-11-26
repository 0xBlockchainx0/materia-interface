import React from 'react'
import styled from 'styled-components'
import { CardProps, Text } from 'rebass'
import { Box } from 'rebass/styled-components'

const Card = styled(Box)<{ padding?: string; border?: string; borderRadius?: string }>`
  width: 100%;
  // border-radius: 16px;
  padding: 1.25rem;
  padding: ${({ padding }) => padding};
  border: ${({ border }) => border};
  // border-radius: ${({ borderRadius }) => borderRadius};
`
export default Card

export const LightCard = styled(Card)`
  border: 1px solid ${({ theme }) => theme.cyan2};
  background-color: ${({ theme }) => theme.primary5};
`

export const GreyCard = styled(Card)`
  border: 1px solid ${({ theme }) => theme.cyan2};
  background-color: ${({ theme }) => theme.primary5};
`

export const SwapGreyCard = styled(Card)`
  width: auto;
  background-color: rgb(0, 0, 0, 0.5);
  border: 1px solid ${({ theme }) => theme.grey};
  padding: 5px 15px;
  border-radius: 15px;
`

export const OutlineCard = styled(Card)`
  border: 1px solid ${({ theme }) => theme.bg3};
`
export const TransparentCard = styled(Card)`
  color: ${({ theme }) => theme.text1 };
  padding: 0;
`

export const YellowCard = styled(Card)`
  background-color: rgba(243, 132, 30, 0.05);
  color: ${({ theme }) => theme.yellow2};
  font-weight: 500;
`

export const PinkCard = styled(Card)`
  background-color: rgba(255, 0, 122, 0.03);
  color: ${({ theme }) => theme.primary1};
  font-weight: 500;
`

const BlueCardStyled = styled(Card)`
  background-color: ${({ theme }) => theme.primary5};
  color: ${({ theme }) => theme.primary1};
  border-radius: 12px;
  width: fit-content;
`

export const BlueCard = ({ children, ...rest }: CardProps) => {
  return (
    <BlueCardStyled {...rest}>
      <Text fontWeight={500} color="#2172E5">
        {children}
      </Text>
    </BlueCardStyled>
  )
}
