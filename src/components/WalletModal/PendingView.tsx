import { AbstractConnector } from '@web3-react/abstract-connector'
import React, { useContext } from 'react'
import styled, { ThemeContext } from 'styled-components'
import Option from './Option'
import { SUPPORTED_WALLETS } from '../../constants'
import { injected } from '../../connectors'
import {
  LoaderBoxContainer,
  StyledLoader,
  LoadingMessage,
  LoaderErrorGroup,
  LoaderErrorButton,
  LoadingWrapper
} from '../../theme'

export default function PendingView({
  connector,
  error = false,
  setPendingError,
  tryActivation
}: {
  connector?: AbstractConnector
  error?: boolean
  setPendingError: (error: boolean) => void
  tryActivation: (connector: AbstractConnector) => void
}) {
  const isMetamask = window?.ethereum?.isMetaMask
  const theme = useContext(ThemeContext)

  return (
    <LoaderBoxContainer>
      <LoadingMessage error={error}>
        <LoadingWrapper>
          {error ? (
            <LoaderErrorGroup>
              <div>Error connecting.</div>
              <LoaderErrorButton onClick={() => { setPendingError(false); connector && tryActivation(connector) }}>
                Try Again
              </LoaderErrorButton>
            </LoaderErrorGroup>
          ) : (
            <>
              <StyledLoader />
              Initializing...
            </>
          )}
        </LoadingWrapper>
      </LoadingMessage>
      {Object.keys(SUPPORTED_WALLETS).map(key => {
        const option = SUPPORTED_WALLETS[key]
        if (option.connector === connector) {
          if (option.connector === injected) {
            if (isMetamask && option.name !== 'MetaMask') {
              return null
            }
            if (!isMetamask && option.name === 'MetaMask') {
              return null
            }
          }
          return (
            <Option
              id={`connect-${key}`}
              key={key}
              clickable={false}
              color={option.color}
              header={option.name}
              subheader={option.description}
              icon={require('../../assets/images/' + option.iconName)}
            />
          )
        }
        return null
      })}
    </LoaderBoxContainer>
  )
}
