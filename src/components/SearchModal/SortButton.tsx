import React, { useContext } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { RowFixed } from '../Row'
import { IconButton } from '../../theme'
import { ChevronsDown, ChevronsUp } from 'react-feather'

export default function SortButton({
  toggleSortOrder,
  ascending
}: {
  toggleSortOrder: () => void
  ascending: boolean
}) {
  const theme = useContext(ThemeContext)
  return (
    <IconButton onClick={toggleSortOrder} className={theme.name}>
      {ascending ? ( <ChevronsUp/> ) : <ChevronsDown/> }
    </IconButton>
  )
}
