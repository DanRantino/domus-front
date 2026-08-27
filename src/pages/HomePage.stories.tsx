import type { Meta, StoryObj } from '@storybook/react'
import { MemoryRouter } from 'react-router'

import { HomePage } from '#/pages/HomePage'

const meta = {
  title: 'Pages/Home',
  component: HomePage,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
} satisfies Meta<typeof HomePage>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
