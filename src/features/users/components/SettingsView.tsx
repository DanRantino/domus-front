import type { NotificationSettings, ThemePreference } from '#/lib/domus-api/types'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'

const THEME_OPTIONS: { value: ThemePreference; label: string }[] = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System' },
]

const NOTIFICATION_OPTIONS: {
  key: keyof NotificationSettings
  label: string
  description: string
}[] = [
  {
    key: 'daily_tasks',
    label: 'Daily tasks',
    description: 'Reminders and updates about household tasks.',
  },
  {
    key: 'expenses',
    label: 'Expenses',
    description: 'Alerts when expenses are added or updated.',
  },
  {
    key: 'family_chat',
    label: 'Family chat',
    description: 'Notifications for family conversation activity.',
  },
]

export type SettingsViewProps = {
  fullName: string
  onFullNameChange: (value: string) => void
  onSaveFullName: () => void
  nameSaving: boolean
  nameError: string | null

  theme: ThemePreference
  onThemeChange: (theme: ThemePreference) => void
  notifications: NotificationSettings
  onNotificationChange: (key: keyof NotificationSettings, value: boolean) => void
  settingsPending: boolean
  settingsError: string | null

  passwordConfigured: boolean
  currentPassword: string
  newPassword: string
  confirmPassword: string
  onCurrentPasswordChange: (value: string) => void
  onNewPasswordChange: (value: string) => void
  onConfirmPasswordChange: (value: string) => void
  onChangePassword: () => void
  passwordPending: boolean
  passwordError: string | null
  passwordSuccess: string | null
}

export function SettingsView({
  fullName,
  onFullNameChange,
  onSaveFullName,
  nameSaving,
  nameError,
  theme,
  onThemeChange,
  notifications,
  onNotificationChange,
  settingsPending,
  settingsError,
  passwordConfigured,
  currentPassword,
  newPassword,
  confirmPassword,
  onCurrentPasswordChange,
  onNewPasswordChange,
  onConfirmPasswordChange,
  onChangePassword,
  passwordPending,
  passwordError,
  passwordSuccess,
}: SettingsViewProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-medium">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your profile, appearance, and notification preferences.
        </p>
      </div>

      <Card className="shadow-[0_4px_20px_rgba(74,103,65,0.08)]">
        <CardHeader>
          <CardTitle className="font-serif text-2xl font-medium">Profile</CardTitle>
          <CardDescription>Optional display name for your Domus account.</CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-2">
            <Label htmlFor="full-name">Full name</Label>
            <Input
              id="full-name"
              value={fullName}
              onChange={(event) => onFullNameChange(event.target.value)}
              placeholder="Add your name"
              autoComplete="name"
            />
          </div>
          {nameError ? (
            <Alert variant="destructive">
              <AlertTitle>Could not save name</AlertTitle>
              <AlertDescription>{nameError}</AlertDescription>
            </Alert>
          ) : null}
        </CardContent>
        <CardFooter>
          <Button type="button" onClick={onSaveFullName} disabled={nameSaving}>
            {nameSaving ? 'Saving…' : 'Save name'}
          </Button>
        </CardFooter>
      </Card>

      <Card className="shadow-[0_4px_20px_rgba(74,103,65,0.08)]">
        <CardHeader>
          <CardTitle className="font-serif text-2xl font-medium">Appearance</CardTitle>
          <CardDescription>Choose how Domus looks on this device.</CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Theme">
            {THEME_OPTIONS.map((option) => {
              const active = theme === option.value
              return (
                <button
                  key={option.value}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  disabled={settingsPending}
                  onClick={() => onThemeChange(option.value)}
                  className={cn(
                    buttonVariants({ variant: active ? 'secondary' : 'outline', size: 'default' }),
                  )}
                >
                  {option.label}
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-[0_4px_20px_rgba(74,103,65,0.08)]">
        <CardHeader>
          <CardTitle className="font-serif text-2xl font-medium">Notifications</CardTitle>
          <CardDescription>
            Preference toggles are saved now; delivery channels may arrive later.
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="space-y-5 pt-6">
          {NOTIFICATION_OPTIONS.map((option) => (
            <div key={option.key} className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <Label htmlFor={`notify-${option.key}`}>{option.label}</Label>
                <p className="text-sm text-muted-foreground">{option.description}</p>
              </div>
              <Switch
                id={`notify-${option.key}`}
                checked={notifications[option.key]}
                disabled={settingsPending}
                onCheckedChange={(checked) => onNotificationChange(option.key, checked)}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {settingsError ? (
        <Alert variant="destructive">
          <AlertTitle>Could not update settings</AlertTitle>
          <AlertDescription>{settingsError}</AlertDescription>
        </Alert>
      ) : null}

      <Card className="shadow-[0_4px_20px_rgba(74,103,65,0.08)]">
        <CardHeader>
          <CardTitle className="font-serif text-2xl font-medium">Security</CardTitle>
          <CardDescription>
            Password changes are submitted to the Identity Provider account API. Domus never stores
            credentials.
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="space-y-4 pt-6">
          {passwordConfigured ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="current-password">Current password</Label>
                <Input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(event) => onCurrentPasswordChange(event.target.value)}
                  autoComplete="current-password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(event) => onNewPasswordChange(event.target.value)}
                  autoComplete="new-password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm new password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => onConfirmPasswordChange(event.target.value)}
                  autoComplete="new-password"
                />
              </div>
              {passwordError ? (
                <Alert variant="destructive">
                  <AlertTitle>Could not change password</AlertTitle>
                  <AlertDescription>{passwordError}</AlertDescription>
                </Alert>
              ) : null}
              {passwordSuccess ? (
                <Alert>
                  <AlertTitle>Password updated</AlertTitle>
                  <AlertDescription>{passwordSuccess}</AlertDescription>
                </Alert>
              ) : null}
              <Button type="button" onClick={onChangePassword} disabled={passwordPending}>
                {passwordPending ? 'Updating…' : 'Change password'}
              </Button>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              Configure <code>VITE_LOGTO_PASSWORD_URL</code> to enable password change.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
