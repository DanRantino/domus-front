import Check from '@mui/icons-material/Check'
import HomeOutlined from '@mui/icons-material/HomeOutlined'
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { useState, type MouseEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'

import { landing, landingCtaSx } from '#/pages/home/landing'
import { palette } from '#/theme/tokens'

import { useHouseholdSession } from '../hooks/useHouseholdSession'
import type { Household } from '../types'

type Variant = 'header' | 'drawer' | 'navbar'

type HouseholdSwitcherProps = {
  households: Household[]
  variant: Variant
  onNavigate?: () => void
}

const navbarSwitcherSx = {
  bgcolor: landing.surface,
  color: landing.cream,
  borderRadius: '10px',
  px: 1.5,
  py: 0.75,
  minHeight: 40,
  maxWidth: { xs: 148, sm: 220 },
  fontWeight: 500,
  fontSize: 14,
  textTransform: 'none',
  boxShadow: 'none',
  '&:hover': {
    bgcolor: palette.neutral[700],
    boxShadow: 'none',
  },
  '& .MuiButton-startIcon': {
    color: palette.primary[300],
    mr: 1,
  },
  '& .MuiButton-endIcon': {
    ml: 0.75,
    color: landing.muted,
  },
} as const

export function HouseholdSwitcher({ households, variant, onNavigate }: HouseholdSwitcherProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { selectedId, selectHousehold } = useHouseholdSession()
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)

  const selected = households.find((household) => household.id === selectedId) ?? households[0]

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
        startIcon={variant === 'navbar' ? <HomeOutlined /> : undefined}
        endIcon={<KeyboardArrowDown />}
        sx={
          variant === 'navbar'
            ? navbarSwitcherSx
            : variant === 'header'
              ? { ...landingCtaSx, display: { xs: 'none', sm: 'inline-flex' } }
              : { ...landingCtaSx, justifyContent: 'space-between', width: '100%' }
        }
      >
        <Box
          component="span"
          sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
        >
          {selected?.name ?? t('createHousehold.switcherLabel')}
        </Box>
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
