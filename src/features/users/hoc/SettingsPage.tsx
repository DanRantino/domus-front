import { useEffect, useState } from 'react'

import type { DomusUser, NotificationSettings, ThemePreference } from '#/lib/domus-api/types'

import { SettingsView } from '../components/SettingsView'
import { useChangePasswordMutation } from '../hooks/use-change-password'
import { usePatchMeMutation, usePatchMeSettingsMutation } from '../hooks/use-settings-mutations'
import { isPasswordChangeConfigured } from '../services/password'
import { applyThemePreference } from '../theme'
import { AppSession } from './AppSession'

export function SettingsPage() {
  return (
    <AppSession>{({ user }) => <SettingsContainer user={user} />}</AppSession>
  )
}

function SettingsContainer({ user }: { user: DomusUser }) {
  const patchMe = usePatchMeMutation()
  const patchSettings = usePatchMeSettingsMutation()
  const changePassword = useChangePasswordMutation()

  const [fullName, setFullName] = useState(user.full_name ?? '')
  const [nameError, setNameError] = useState<string | null>(null)
  const [settingsError, setSettingsError] = useState<string | null>(null)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null)

  useEffect(() => {
    setFullName(user.full_name ?? '')
  }, [user.full_name])

  const saveFullName = () => {
    setNameError(null)
    const trimmed = fullName.trim()
    patchMe.mutate(
      { full_name: trimmed.length === 0 ? null : trimmed },
      {
        onError: (error) => {
          setNameError(error.message || 'Could not update name.')
        },
        onSuccess: (next) => {
          setFullName(next.full_name ?? '')
        },
      },
    )
  }

  const updateTheme = (theme: ThemePreference) => {
    if (theme === user.settings.theme || patchSettings.isPending) {
      return
    }
    setSettingsError(null)
    const previous = user.settings.theme
    applyThemePreference(theme)
    patchSettings.mutate(
      { theme },
      {
        onError: (error) => {
          applyThemePreference(previous)
          setSettingsError(error.message || 'Could not update theme.')
        },
      },
    )
  }

  const updateNotification = (key: keyof NotificationSettings, value: boolean) => {
    if (user.settings.notifications[key] === value || patchSettings.isPending) {
      return
    }
    setSettingsError(null)
    patchSettings.mutate(
      { notifications: { [key]: value } },
      {
        onError: (error) => {
          setSettingsError(error.message || 'Could not update notifications.')
        },
      },
    )
  }

  const submitPasswordChange = () => {
    setPasswordError(null)
    setPasswordSuccess(null)
    changePassword.mutate(
      { currentPassword, newPassword, confirmPassword },
      {
        onError: (error) => {
          setPasswordError(error.message || 'Could not change password.')
        },
        onSuccess: () => {
          setCurrentPassword('')
          setNewPassword('')
          setConfirmPassword('')
          setPasswordSuccess('Your password was updated successfully.')
        },
      },
    )
  }

  return (
    <SettingsView
      fullName={fullName}
      onFullNameChange={setFullName}
      onSaveFullName={saveFullName}
      nameSaving={patchMe.isPending}
      nameError={nameError}
      theme={user.settings.theme}
      onThemeChange={updateTheme}
      notifications={user.settings.notifications}
      onNotificationChange={updateNotification}
      settingsPending={patchSettings.isPending}
      settingsError={settingsError}
      passwordConfigured={isPasswordChangeConfigured()}
      currentPassword={currentPassword}
      newPassword={newPassword}
      confirmPassword={confirmPassword}
      onCurrentPasswordChange={setCurrentPassword}
      onNewPasswordChange={setNewPassword}
      onConfirmPasswordChange={setConfirmPassword}
      onChangePassword={submitPasswordChange}
      passwordPending={changePassword.isPending}
      passwordError={passwordError}
      passwordSuccess={passwordSuccess}
    />
  )
}
