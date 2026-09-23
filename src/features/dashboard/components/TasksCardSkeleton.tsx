import { Card, CardHeader, CardContent, Box, Skeleton } from '@mui/material'
import { useTranslation } from 'react-i18next'

import { dashboardCardSx, taskItemRowSx, tasksCardContentSx } from '../layout'

function TaskItemSkeleton() {
  return (
    <Box sx={taskItemRowSx}>
      <Skeleton variant="rounded" width={24} height={24} sx={{ ml: 1, mr: 1 }} />
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, flex: 1 }}>
        <Skeleton variant="text" width="55%" height={24} />
        <Skeleton variant="text" width="80%" height={20} />
        <Skeleton variant="text" width="30%" height={16} />
        <Skeleton variant="text" width="40%" height={16} />
      </Box>
    </Box>
  )
}

export function TasksCardSkeleton() {
  const { t } = useTranslation()

  return (
    <Card
      sx={dashboardCardSx}
      aria-busy="true"
      aria-live="polite"
      aria-label={t('dashboard.tasks.loading')}
    >
      <CardHeader title={<Skeleton variant="text" width="60%" height={32} />} />
      <CardContent sx={tasksCardContentSx}>
        <TaskItemSkeleton />
        <TaskItemSkeleton />
      </CardContent>
    </Card>
  )
}
