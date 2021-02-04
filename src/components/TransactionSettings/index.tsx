import React, { useState, useRef, useContext } from 'react'
import styled, { ThemeContext } from 'styled-components'

import QuestionHelper from '../QuestionHelper'
import { TYPE, SettingsMenuOption, SettingsMenuCustomOption, SettingsMenuCustomOptionInput } from '../../theme'
import { AutoColumn } from '../Column'
import { RowBetween, RowFixed } from '../Row'

enum SlippageError {
  InvalidInput = 'InvalidInput',
  RiskyLow = 'RiskyLow',
  RiskyHigh = 'RiskyHigh'
}

enum DeadlineError {
  InvalidInput = 'InvalidInput'
}



const SlippageEmojiContainer = styled.span`
  color: #f3841e;
  ${({ theme }) => theme.mediaWidth.upToSmall` display: none; `}
`

export interface SlippageTabsProps {
  rawSlippage: number
  setRawSlippage: (rawSlippage: number) => void
  deadline: number
  setDeadline: (deadline: number) => void
}

export default function SlippageTabs({ rawSlippage, setRawSlippage, deadline, setDeadline }: SlippageTabsProps) {
  const theme = useContext(ThemeContext)

  const inputRef = useRef<HTMLInputElement>()

  const [slippageInput, setSlippageInput] = useState('')
  const [deadlineInput, setDeadlineInput] = useState('')

  const slippageInputIsValid =
    slippageInput === '' || (rawSlippage / 100).toFixed(2) === Number.parseFloat(slippageInput).toFixed(2)
  const deadlineInputIsValid = deadlineInput === '' || (deadline / 60).toString() === deadlineInput

  let slippageError: SlippageError | undefined
  if (slippageInput !== '' && !slippageInputIsValid) {
    slippageError = SlippageError.InvalidInput
  } else if (slippageInputIsValid && rawSlippage < 50) {
    slippageError = SlippageError.RiskyLow
  } else if (slippageInputIsValid && rawSlippage > 500) {
    slippageError = SlippageError.RiskyHigh
  } else {
    slippageError = undefined
  }

  let deadlineError: DeadlineError | undefined
  if (deadlineInput !== '' && !deadlineInputIsValid) {
    deadlineError = DeadlineError.InvalidInput
  } else {
    deadlineError = undefined
  }

  function parseCustomSlippage(value: string) {
    setSlippageInput(value)

    try {
      const valueAsIntFromRoundedFloat = Number.parseInt((Number.parseFloat(value) * 100).toString())
      if (!Number.isNaN(valueAsIntFromRoundedFloat) && valueAsIntFromRoundedFloat < 5000) {
        setRawSlippage(valueAsIntFromRoundedFloat)
      }
    } catch {}
  }

  function parseCustomDeadline(value: string) {
    setDeadlineInput(value)

    try {
      const valueAsInt: number = Number.parseInt(value) * 60
      if (!Number.isNaN(valueAsInt) && valueAsInt > 0) {
        setDeadline(valueAsInt)
      }
    } catch {}
  }

  return (
    <AutoColumn gap="md">
      <AutoColumn gap="sm">
        <RowFixed>
          <div className="sectionOption">Slippage tolerance</div>
          <QuestionHelper text="Your transaction will revert if the price changes unfavorably by more than this percentage." />
        </RowFixed>
        <RowBetween>
          <SettingsMenuOption className={theme.name} onClick={() => { setSlippageInput(''); setRawSlippage(10); }} active={rawSlippage === 10} > 0.1% </SettingsMenuOption>
          <SettingsMenuOption className={theme.name} onClick={() => { setSlippageInput(''); setRawSlippage(50); }} active={rawSlippage === 50} > 0.5% </SettingsMenuOption>
          <SettingsMenuOption className={theme.name} onClick={() => { setSlippageInput(''); setRawSlippage(100); }} active={rawSlippage === 100} > 1% </SettingsMenuOption>
          <SettingsMenuCustomOption className={theme.name} active={![10, 50, 100].includes(rawSlippage)} warning={!slippageInputIsValid} tabIndex={-1}>
            <RowBetween>
              {!!slippageInput &&
              (slippageError === SlippageError.RiskyLow || slippageError === SlippageError.RiskyHigh) ? (
                <SlippageEmojiContainer>
                  <span role="img" aria-label="warning">
                    ⚠️
                  </span>
                </SlippageEmojiContainer>
              ) : null}
              {/* https://github.com/DefinitelyTyped/DefinitelyTyped/issues/30451 */}
              <SettingsMenuCustomOptionInput
                ref={inputRef as any}
                placeholder={(rawSlippage / 100).toFixed(2)}
                value={slippageInput}
                onBlur={() => { parseCustomSlippage((rawSlippage / 100).toFixed(2)) }}
                onChange={e => parseCustomSlippage(e.target.value)}
                color={!slippageInputIsValid ? 'red' : ''}
              />
              %
            </RowBetween>
          </SettingsMenuCustomOption>
        </RowBetween>
        {!!slippageError && (
          <RowBetween
            style={{
              fontSize: '14px',
              paddingTop: '7px',
              color: slippageError === SlippageError.InvalidInput ? 'red' : '#F3841E'
            }}
          >
            {slippageError === SlippageError.InvalidInput
              ? 'Enter a valid slippage percentage'
              : slippageError === SlippageError.RiskyLow
              ? 'Your transaction may fail'
              : 'Your transaction may be frontrun'}
          </RowBetween>
        )}
      </AutoColumn>

      <AutoColumn gap="sm">
        <RowFixed>
          <div className="sectionOption">Transaction deadline</div>
          <QuestionHelper text="Your transaction will revert if it is pending for more than this long." />
        </RowFixed>
        <RowFixed>
          <SettingsMenuCustomOption className={theme.name} style={{ width: '80px' }} tabIndex={-1}>
            <SettingsMenuCustomOptionInput
              color={!!deadlineError ? 'red' : undefined}
              onBlur={() => { parseCustomDeadline((deadline / 60).toString()) }}
              placeholder={(deadline / 60).toString()}
              value={deadlineInput}
              onChange={e => parseCustomDeadline(e.target.value)}
            />
          </SettingsMenuCustomOption>
          <div className="minutes">minutes</div>
        </RowFixed>
      </AutoColumn>
    </AutoColumn>
  )
}
