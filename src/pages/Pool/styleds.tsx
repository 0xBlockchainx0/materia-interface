import { Text } from 'rebass'
import styled from 'styled-components'

export const Wrapper = styled.div`
  position: relative;
`
export const ClickableText = styled(Text)`
  :hover { cursor: pointer; }
  color: ${({ theme }) => theme.text2};
  font-weight: 500;
  font-size: 14px;

  &.classic { 
    color: ${({ theme }) => theme.white};
    font-size: 11px; 
    text-shadow: 1px 1px 1px ${({ theme }) => theme.black}; 
    line-height: 2em; 
    text-align: center;
    margin: 10px auto;
  }
`
export const MaxButton = styled.button<{ width: string }>`
  padding: 0.5rem 1rem;
  background-color: ${({ theme }) => theme.primary5};
  border: 1px solid ${({ theme }) => theme.primary5};
  border-radius: 0.5rem;
  font-size: 1rem;
  ${({ theme }) => theme.mediaWidth.upToSmall` padding: 0.25rem 0.5rem; `};
  font-weight: 500;
  cursor: pointer;
  margin: 0.25rem;
  overflow: hidden;
  color: ${({ theme }) => theme.primary1};
  :hover {
    border: 1px solid ${({ theme }) => theme.primary1};
  }
  :focus {
    border: 1px solid ${({ theme }) => theme.primary1};
    outline: none;
  }
`


