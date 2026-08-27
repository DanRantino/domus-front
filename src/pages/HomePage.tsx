import type { SvgIconComponent } from '@mui/icons-material'
import ChecklistOutlined from '@mui/icons-material/ChecklistOutlined'
import Close from '@mui/icons-material/Close'
import LockOutlined from '@mui/icons-material/LockOutlined'
import MenuIcon from '@mui/icons-material/Menu'
import PaymentsOutlined from '@mui/icons-material/PaymentsOutlined'
import PhotoLibraryOutlined from '@mui/icons-material/PhotoLibraryOutlined'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import Link from '@mui/material/Link'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { DomusMarkIcon } from '#/components/brand/DomusMarkIcon'
import { HomeHouseholdCta } from '#/features/create-household/components/HomeHouseholdCta'
import { fonts } from '#/theme/tokens'

import { DashboardPreview } from './home/DashboardPreview'
import { HomeSessionActions } from './home/HomeSessionActions'
import { landing, landingCtaSx } from './home/landing'

const navItems = [
  { href: '#visao', key: 'home.nav.vision' },
  { href: '#recursos', key: 'home.nav.features' },
  { href: '#privacidade', key: 'home.nav.privacy' },
  { href: '#faq', key: 'home.nav.faq' },
] as const

const features: { titleKey: string; bodyKey: string; Icon: SvgIconComponent }[] = [
  {
    titleKey: 'home.features.organization.title',
    bodyKey: 'home.features.organization.body',
    Icon: ChecklistOutlined,
  },
  {
    titleKey: 'home.features.finances.title',
    bodyKey: 'home.features.finances.body',
    Icon: PaymentsOutlined,
  },
  {
    titleKey: 'home.features.memories.title',
    bodyKey: 'home.features.memories.body',
    Icon: PhotoLibraryOutlined,
  },
]

const steps = [
  { n: '01', titleKey: 'home.steps.one.title', bodyKey: 'home.steps.one.body' },
  { n: '02', titleKey: 'home.steps.two.title', bodyKey: 'home.steps.two.body' },
  { n: '03', titleKey: 'home.steps.three.title', bodyKey: 'home.steps.three.body' },
] as const

const faqs = [
  { q: 'home.faq.one.question', a: 'home.faq.one.answer' },
  { q: 'home.faq.two.question', a: 'home.faq.two.answer' },
  { q: 'home.faq.three.question', a: 'home.faq.three.answer' },
] as const

const footerLinks = [
  { href: '#privacidade', key: 'home.footer.terms' },
  { href: '#privacidade', key: 'home.footer.privacy' },
  { href: '#faq', key: 'home.footer.contact' },
  { href: '#visao', key: 'home.footer.press' },
] as const

const sectionSx = {
  ...landing.gutter,
  py: { xs: 8, md: 14 },
  scrollMarginTop: '88px',
} as const

function BrandMark({ size = 36 }: { size?: number }) {
  return (
    <DomusMarkIcon
      width={size}
      height={Math.round(size * (179 / 211))}
      style={{ display: 'block', flexShrink: 0, color: landing.cream, overflow: 'visible' }}
    />
  )
}

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      underline="none"
      sx={{
        color: landing.muted,
        fontSize: 14,
        fontWeight: 500,
        letterSpacing: '0.02em',
        '&:hover': { color: landing.cream },
      }}
    >
      {label}
    </Link>
  )
}

export function HomePage() {
  const { t } = useTranslation()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <Box sx={{ bgcolor: landing.canvas, color: landing.cream, minHeight: '100svh' }}>
      <Box
        component="header"
        sx={{
          ...landing.gutter,
          position: 'sticky',
          top: 0,
          zIndex: 8,
          display: 'grid',
          gridTemplateColumns: { xs: 'auto 1fr', md: '1fr auto 1fr' },
          alignItems: 'center',
          gap: 2,
          py: 2,
          bgcolor: landing.canvas,
          borderBottom: '1px solid',
          borderColor: landing.line,
        }}
      >
        <Link
          href="#topo"
          underline="none"
          aria-label={t('home.brand')}
          sx={{ justifySelf: 'start', color: landing.cream, lineHeight: 0 }}
        >
          <BrandMark />
        </Link>

        <Stack
          direction="row"
          spacing={4}
          sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}
        >
          {navItems.map((item) => (
            <NavLink key={item.key} href={item.href} label={t(item.key)} />
          ))}
        </Stack>

        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ justifySelf: 'end' }}>
          <HomeSessionActions variant="header" />
          <HomeHouseholdCta variant="header" />
          <IconButton
            aria-label={t('home.nav.menu')}
            onClick={() => setMenuOpen(true)}
            sx={{ display: { md: 'none' }, color: landing.cream }}
          >
            <MenuIcon />
          </IconButton>
        </Stack>
      </Box>

      <Drawer
        anchor="right"
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        slotProps={{
          paper: {
            sx: {
              width: 280,
              bgcolor: landing.canvas,
              color: landing.cream,
              px: 3,
              py: 2,
            },
          },
        }}
      >
        <Stack direction="row" justifyContent="flex-end">
          <IconButton
            aria-label={t('home.nav.close')}
            onClick={() => setMenuOpen(false)}
            sx={{ color: landing.cream }}
          >
            <Close />
          </IconButton>
        </Stack>
        <Stack spacing={3} sx={{ mt: 2 }}>
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              underline="none"
              onClick={() => setMenuOpen(false)}
              sx={{ color: landing.cream, fontSize: 18 }}
            >
              {t(item.key)}
            </Link>
          ))}
          <HomeSessionActions variant="drawer" onNavigate={() => setMenuOpen(false)} />
          <HomeHouseholdCta variant="drawer" onNavigate={() => setMenuOpen(false)} />
        </Stack>
      </Drawer>

      <Box component="main" id="topo">
        <Box
          component="section"
          id="visao"
          sx={{
            ...sectionSx,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            pt: { xs: 10, md: 16 },
          }}
        >
          <Typography
            component="h1"
            sx={{
              fontFamily: fonts.headline,
              fontWeight: 500,
              fontSize: { xs: 36, md: 64 },
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
              maxWidth: 720,
              mb: 3,
            }}
          >
            {t('home.hero.title')}
          </Typography>
          <Typography
            sx={{
              color: landing.muted,
              fontSize: { xs: 16, md: 18 },
              lineHeight: 1.7,
              maxWidth: 560,
              mb: 5,
            }}
          >
            {t('home.hero.subtitle')}
          </Typography>
          <Button variant="contained" size="large" sx={{ ...landingCtaSx, px: 3.5, py: 1.5 }}>
            {t('home.hero.cta')}
          </Button>
        </Box>

        <Box component="section" sx={{ ...sectionSx, pt: { xs: 4, md: 6 } }}>
          <Typography
            component="h2"
            sx={{
              fontFamily: fonts.headline,
              fontWeight: 500,
              fontSize: { xs: 28, md: 40 },
              textAlign: 'center',
              mb: 1.5,
            }}
          >
            {t('home.showcase.title')}
          </Typography>
          <Typography
            sx={{
              color: landing.muted,
              textAlign: 'center',
              maxWidth: 480,
              mx: 'auto',
              mb: 6,
            }}
          >
            {t('home.showcase.subtitle')}
          </Typography>
          <Box sx={{ maxWidth: 960, mx: 'auto' }}>
            <DashboardPreview />
          </Box>
        </Box>

        <Box component="section" id="recursos" sx={sectionSx}>
          <Box
            sx={{
              maxWidth: 1080,
              mx: 'auto',
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
              gap: { xs: 6, md: 8 },
            }}
          >
            {features.map((feature) => (
              <Box key={feature.titleKey} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <feature.Icon sx={{ color: landing.cream, fontSize: 28 }} />
                <Typography
                  component="h2"
                  sx={{
                    fontFamily: fonts.headline,
                    fontWeight: 500,
                    fontSize: 24,
                    lineHeight: 1.3,
                  }}
                >
                  {t(feature.titleKey)}
                </Typography>
                <Typography sx={{ color: landing.muted, lineHeight: 1.7 }}>
                  {t(feature.bodyKey)}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        <Box component="section" sx={sectionSx}>
          <Box
            sx={{
              maxWidth: 1080,
              mx: 'auto',
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
              gap: { xs: 6, md: 8 },
            }}
          >
            {steps.map((step) => (
              <Box key={step.n}>
                <Typography
                  sx={{
                    fontFamily: fonts.headline,
                    color: landing.muted,
                    fontSize: 20,
                    mb: 1,
                  }}
                >
                  {step.n}
                </Typography>
                <Typography
                  component="h2"
                  sx={{
                    fontFamily: fonts.headline,
                    fontWeight: 500,
                    fontSize: 24,
                    mb: 2,
                  }}
                >
                  {t(step.titleKey)}
                </Typography>
                <Box sx={{ borderTop: '1px solid', borderColor: landing.line, mb: 2 }} />
                <Typography sx={{ color: landing.muted, lineHeight: 1.7 }}>
                  {t(step.bodyKey)}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        <Box component="section" id="privacidade" sx={{ ...sectionSx, textAlign: 'center' }}>
          <Box sx={{ maxWidth: 720, mx: 'auto' }}>
            <LockOutlined sx={{ fontSize: 32, color: landing.cream, mb: 3 }} />
            <Typography
              component="h2"
              sx={{
                fontFamily: fonts.headline,
                fontWeight: 500,
                fontSize: { xs: 28, md: 40 },
                mb: 2,
              }}
            >
              {t('home.privacy.title')}
            </Typography>
            <Typography
              sx={{ color: landing.muted, fontSize: { xs: 16, md: 18 }, lineHeight: 1.7 }}
            >
              {t('home.privacy.body')}
            </Typography>
          </Box>
        </Box>

        <Box component="section" id="faq" sx={sectionSx}>
          <Typography
            component="h2"
            sx={{
              fontFamily: fonts.headline,
              fontWeight: 500,
              fontSize: { xs: 28, md: 40 },
              textAlign: 'center',
              mb: 8,
            }}
          >
            {t('home.faq.title')}
          </Typography>
          <Box
            sx={{
              maxWidth: 1080,
              mx: 'auto',
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
              gap: { xs: 5, md: 8 },
            }}
          >
            {faqs.map((item) => (
              <Box key={item.q}>
                <Typography
                  component="h3"
                  sx={{
                    fontFamily: fonts.headline,
                    fontWeight: 500,
                    fontSize: 20,
                    mb: 1.5,
                  }}
                >
                  {t(item.q)}
                </Typography>
                <Typography sx={{ color: landing.muted, lineHeight: 1.7 }}>{t(item.a)}</Typography>
              </Box>
            ))}
          </Box>
        </Box>

        <Box
          component="section"
          sx={{
            ...sectionSx,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            pb: { xs: 10, md: 16 },
          }}
        >
          <Typography
            component="h2"
            sx={{
              fontFamily: fonts.headline,
              fontWeight: 500,
              fontSize: { xs: 32, md: 48 },
              lineHeight: 1.2,
              maxWidth: 640,
              mb: 5,
            }}
          >
            {t('home.cta.title')}
          </Typography>
          <Button variant="contained" size="large" sx={{ ...landingCtaSx, px: 4, py: 1.75 }}>
            {t('home.cta.button')}
          </Button>
        </Box>
      </Box>

      <Box
        component="footer"
        sx={{
          ...landing.gutter,
          py: 3,
          borderTop: '1px solid',
          borderColor: landing.line,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'flex-start', md: 'center' },
          justifyContent: 'space-between',
          gap: 3,
        }}
      >
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={{ xs: 2, sm: 3 }}
          alignItems={{ sm: 'center' }}
        >
          <BrandMark size={28} />
          <Stack direction="row" spacing={3} flexWrap="wrap" useFlexGap>
            {footerLinks.map((item) => (
              <NavLink key={item.key} href={item.href} label={t(item.key)} />
            ))}
          </Stack>
        </Stack>
        <Typography sx={{ color: landing.muted, fontSize: 13 }}>
          {t('home.footer.copyright')}
        </Typography>
      </Box>
    </Box>
  )
}
