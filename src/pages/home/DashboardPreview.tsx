import Box from '@mui/material/Box'
import LinearProgress from '@mui/material/LinearProgress'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'

import { fonts } from '#/theme/tokens'

import { landing } from './landing'

const taskKeys = ['item1', 'item2', 'item3'] as const
const progressTrack = 'rgba(239, 235, 227, 0.12)'

const cardSx = {
  bgcolor: landing.surface,
  border: '1px solid',
  borderColor: landing.line,
  borderRadius: '12px',
  p: { xs: 3, md: 4 },
  minHeight: { md: 280 },
} as const

export function DashboardPreview() {
  const { t } = useTranslation()

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '1.15fr 0.85fr' },
        gap: 2.5,
      }}
    >
      <Box sx={cardSx}>
        <Typography
          component="p"
          sx={{
            fontFamily: fonts.headline,
            fontSize: { xs: 22, md: 26 },
            lineHeight: 1.3,
            color: landing.cream,
            mb: 0.5,
          }}
        >
          {t('home.showcase.tasks.greeting')}
        </Typography>
        <Typography sx={{ color: landing.muted, fontSize: 14, mb: 3 }}>
          {t('home.showcase.tasks.date')}
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {taskKeys.map((key) => (
            <Box
              key={key}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 2,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
                <Box
                  aria-hidden
                  sx={{
                    width: 16,
                    height: 16,
                    flexShrink: 0,
                    borderRadius: '3px',
                    border: '1.5px solid',
                    borderColor: landing.muted,
                  }}
                />
                <Typography sx={{ color: landing.cream, fontSize: 15 }}>
                  {t(`home.showcase.tasks.${key}.label`)}
                </Typography>
              </Box>
              <Typography
                sx={{
                  color: landing.muted,
                  fontSize: 12,
                  letterSpacing: '0.04em',
                  flexShrink: 0,
                }}
              >
                {t(`home.showcase.tasks.${key}.tag`)}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      <Box sx={{ ...cardSx, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Typography
          sx={{
            color: landing.muted,
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            mb: 2,
          }}
        >
          {t('home.showcase.bills.title')}
        </Typography>
        <Typography
          component="p"
          sx={{
            fontFamily: fonts.headline,
            fontSize: { xs: 40, md: 48 },
            lineHeight: 1.1,
            color: landing.cream,
            mb: 3,
          }}
        >
          {t('home.showcase.bills.amount')}
        </Typography>
        <LinearProgress
          variant="determinate"
          value={45}
          aria-label={t('home.showcase.bills.remaining')}
          sx={{
            height: 8,
            borderRadius: 4,
            bgcolor: progressTrack,
            mb: 1.5,
            '& .MuiLinearProgress-bar': {
              bgcolor: landing.forest,
              borderRadius: 4,
            },
          }}
        />
        <Typography sx={{ color: landing.muted, fontSize: 14 }}>
          {t('home.showcase.bills.remaining')}
        </Typography>
      </Box>
    </Box>
  )
}
