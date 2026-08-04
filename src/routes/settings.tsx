import { createFileRoute } from '@tanstack/react-router'

import { SettingsPage } from '#/features/users/hoc/SettingsPage'

export const Route = createFileRoute('/settings')({ component: SettingsPage })
