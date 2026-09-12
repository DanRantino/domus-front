import { Card, CardHeader, CardContent, Typography, Box, Checkbox } from '@mui/material'
import { useTranslation } from 'react-i18next'

import { useGetMeQuery, type HouseTask } from '#/api/me'
import { useToast } from '#/components/toast/useToast'
import { useCompleteHouseTaskMutation } from '#/features/tasks/api/tasksApi'

import { TasksCardSkeleton } from './TasksCardSkeleton'

export function TasksCard({ householdId }: { householdId?: string }) {
  const { t } = useTranslation()
  const { data: me, isLoading, isUninitialized } = useGetMeQuery()
  const house = householdId ? me?.houses.find((item) => item.id === householdId) : me?.houses[0]

  if (isUninitialized || isLoading) {
    return <TasksCardSkeleton />
  }

  if (!house) {
    return null
  }

  return (
    <Card sx={{ maxHeight: '20rem', minWidth: 0 }}>
      <CardHeader title={t('dashboard.tasks.title', { name: house.name })} />
      <CardContent sx={{ overflowY: 'auto', maxHeight: '15rem' }}>
        {house.tasks.map((task) => (
          <TaskItem key={task.id} task={task} />
        ))}
      </CardContent>
    </Card>
  )
}

export function TaskItem({ task }: { task: HouseTask }) {
  const { t } = useTranslation()
  const { showToast } = useToast()
  const [completeTask, { isLoading }] = useCompleteHouseTaskMutation()
  const completed = task.status === 'completed'

  return (
    <Box
      sx={{
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
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, width: '3rem', height: '100%' }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Checkbox
            checked={completed}
            disabled={completed || isLoading}
            onChange={(_, checked) => {
              if (!checked || completed) {
                return
              }

              void completeTask({ houseId: task.houseId, taskId: task.id })
                .unwrap()
                .catch(() => {
                  showToast({
                    message: t('dashboard.tasks.completeError'),
                    severity: 'error',
                  })
                })
            }}
            slotProps={{
              input: {
                'aria-label': completed
                  ? t('dashboard.tasks.completed', { title: task.title })
                  : t('dashboard.tasks.complete', { title: task.title }),
              },
            }}
            sx={{ fontSize: 16, color: 'text.secondary' }}
          />
        </Box>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Typography sx={{ fontSize: 16, fontWeight: 600 }}>{task.title}</Typography>
        <Typography sx={{ fontSize: 14, color: 'text.secondary' }}>{task.description}</Typography>
        <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>
          {task.completedAt
            ? new Date(task.completedAt).toLocaleDateString()
            : t('dashboard.tasks.notCompleted')}
        </Typography>
        <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>
          {task.assignee?.displayName ?? t('dashboard.tasks.unassigned')}
        </Typography>
      </Box>
    </Box>
  )
}
