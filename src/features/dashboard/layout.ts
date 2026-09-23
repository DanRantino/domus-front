export const dashboardCardMaxHeight = '20rem'

export const dashboardCardSx = {
  maxHeight: dashboardCardMaxHeight,
  minWidth: 0,
} as const

export const tasksCardContentSx = {
  overflowY: 'auto',
  maxHeight: '15rem',
} as const

export const taskItemRowSx = {
  display: 'flex',
  flexDirection: 'row',
  gap: 1,
  border: '1px solid',
  borderColor: 'divider',
  borderRadius: 1,
  p: 1,
  mb: 1,
  alignItems: 'center',
  justifyContent: 'start',
} as const
