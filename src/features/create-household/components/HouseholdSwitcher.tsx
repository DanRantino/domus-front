import Check from '@mui/icons-material/Check'
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { useState, type MouseEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'

import { landing, landingCtaSx } from '#/pages/home/landing'

import { useHouseholdSession } from '../hooks/useHouseholdSession'
import type { Household } from '../types'

type Variant = 'header' | 'drawer'

type HouseholdSwitcherProps = {
  households: Household[]
  variant: Variant
  onNavigate?: () => void
}

export function HouseholdSwitcher({
  households,
  variant,
  onNavigate,
}: HouseholdSwitcherProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { selectedId, selectHousehold } = useHouseholdSession()
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)

  const selected =
    households.find((household) => household.id === selectedId) ?? households[0]

  function openMenu(event: MouseEvent<HTMLButtonElement>) {
    setAnchorEl(event.currentTarget)
  }

  function closeMenu() {
    setAnchorEl(null)
  }

  function chooseHousehold(id: string) {
    selectHousehold(id)
    closeMenu()
    onNavigate?.()
    void navigate('/dashboard')
  }

  const open = Boolean(anchorEl)

  return (
    <>
      <Button
        variant="contained"
        onClick={openMenu}
        aria-label={t('createHousehold.switcherLabel')}
        aria-haspopup="menu"
        aria-expanded={open}
        endIcon={<KeyboardArrowDown />}
        sx={
          variant === 'header'
            ? { ...landingCtaSx, display: { xs: 'none', sm: 'inline-flex' } }
            : { ...landingCtaSx, justifyContent: 'space-between', width: '100%' }
        }
      >
        {selected?.name ?? t('createHousehold.switcherLabel')}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={closeMenu}
        slotProps={{
          paper: {
            sx: {
              bgcolor: landing.surface,
              color: landing.cream,
              minWidth: 200,
              mt: 1,
            },
          },
        }}
      >
        {households.map((household) => {
          const isSelected = household.id === selected?.id
          return (
            <MenuItem
              key={household.id}
              selected={isSelected}
              onClick={() => chooseHousehold(household.id)}
              aria-current={isSelected ? 'true' : undefined}
              aria-label={isSelected ? t('createHousehold.selected') : undefined}
            >
              {isSelected ? <Check sx={{ mr: 1, fontSize: 18 }} /> : null}
              {household.name}
            </MenuItem>
          )
        })}
      </Menu>
    </>
  )
}
