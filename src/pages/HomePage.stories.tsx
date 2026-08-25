import type { Meta, StoryObj } from '@storybook/react'
import { MemoryRouter } from 'react-router'

import { AuthProvider } from '#/auth/AuthProvider'
import { HomePage } from '#/pages/HomePage'

const meta = {
  title: 'Pages/Home',
  component: HomePage,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <AuthProvider>
          <Story />
        </AuthProvider>
      </MemoryRouter>
    ),
  ],
} satisfies Meta<typeof HomePage>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
