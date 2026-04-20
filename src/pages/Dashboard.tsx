import { Link } from 'react-router-dom'
import { useSession } from '../context/SessionContext'
import { useCourseVersion } from '../hooks/useCourseVersion'
import { load } from '../utils/storage'
import config from '../config/course.config.json'

export function Dashboard() {
  const { session } = useSession()
  const version = useCourseVersion()

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-1">
        Welcome, {session?.studentName}
      </h1>
      <p className="text-sm text-slate-500 mb-8">
        {config.courseTitle} · {version.label} · {session?.section}
      </p>

      <section aria-labelledby="activities-heading">
        <h2 id="activities-heading" className="text-base font-semibold text-slate-700 mb-3">
          Weekly Activities
        </h2>
        <div className="space-y-2">
          {version.weeks.map(week => {
            const isCompleted = !!load(`activity_${week.weekNumber}`)
            return (
              <div
                key={week.weekNumber}
                className="flex items-center justify-between rounded-xl border px-4 py-3 bg-white border-slate-200"
              >
                <div>
                  <p className="text-sm font-medium text-slate-800">
                    {week.label}: {week.title}
                  </p>
                  <p className="text-xs text-slate-500">{week.chapters}</p>
                </div>
                <div className="flex items-center gap-3">
                  {isCompleted && (
                    <span className="text-xs text-green-600 font-medium">✓ Done</span>
                  )}
                  <Link
                    to={`/activity/${week.weekNumber}`}
                    className="text-xs font-semibold text-blue-700 hover:text-blue-900 focus:outline-none focus:underline"
                  >
                    {isCompleted ? 'Review' : 'Start →'}
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <section aria-labelledby="notes-heading" className="mt-10">
        <h2 id="notes-heading" className="text-base font-semibold text-slate-700 mb-3">
          Planning Notes
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            { to: '/notes/health-issue', label: 'Health Issue Exploration' },
            { to: '/notes/article-review', label: 'Article Research' },
            { to: '/notes/policy-advocacy', label: 'Policy Advocacy' },
            { to: '/notes/presentation', label: 'Presentation Planning' },
          ].map(item => (
            <Link
              key={item.to}
              to={item.to}
              className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 hover:border-blue-400 hover:text-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {item.label} →
            </Link>
          ))}
        </div>
      </section>

      <section aria-labelledby="reflection-heading" className="mt-10">
        <h2 id="reflection-heading" className="text-base font-semibold text-slate-700 mb-3">
          Reflection
        </h2>
        <Link
          to="/reflection"
          className="block bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 hover:border-blue-400 hover:text-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 w-fit"
        >
          App Reflection →
        </Link>
      </section>
    </div>
  )
}
