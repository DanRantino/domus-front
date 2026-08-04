import { createFileRoute } from '@tanstack/react-router'

import { HomePage } from '#/features/users/hoc/HomePage'

export const Route = createFileRoute('/')({ component: HomePage })
