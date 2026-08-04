import { HomeSummary } from '../components/HomeSummary'
import { AppSession } from './AppSession'

export function HomePage() {
  return <AppSession>{({ user }) => <HomeSummary user={user} />}</AppSession>
}
