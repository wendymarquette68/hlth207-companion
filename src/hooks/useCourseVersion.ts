import { useSession } from '../context/SessionContext'
import config from '../config/course.config.json'

export function useCourseVersion() {
  const { session } = useSession()
  return (
    config.versions.find(v => v.id === session?.versionId) ?? config.versions[0]
  )
}
