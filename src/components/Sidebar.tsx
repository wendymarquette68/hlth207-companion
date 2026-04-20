import { NavLink, useNavigate } from 'react-router-dom'
import { useSession } from '../context/SessionContext'
import { clearStudentData, load } from '../utils/storage'
import config from '../config/course.config.json'

const linkBase =
  'block px-3 py-1.5 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400'
const linkActive = 'bg-blue-700 text-white'
const linkInactive = 'text-slate-200 hover:bg-blue-800'

const sectionLabel = 'px-3 pt-4 pb-1 text-xs font-semibold text-blue-400 uppercase tracking-wider'

const NOTES = [
  { to: '/notes/health-issue', label: 'Health Issue' },
  { to: '/notes/article-review', label: 'Article Research' },
  { to: '/notes/policy-advocacy', label: 'Policy Advocacy' },
  { to: '/notes/presentation', label: 'Presentation' },
]

export function Sidebar() {
  const { session, clearSession } = useSession()
  const navigate = useNavigate()

  const handleSignOut = () => {
    if (confirm('This will erase all your local notes. Make sure you have exported your PDFs before signing out.')) {
      clearStudentData()
      clearSession()
      navigate('/')
    }
  }

  return (
    <nav
      aria-label="Main navigation"
      className="w-60 bg-blue-900 text-white flex flex-col min-h-screen"
    >
      {/* Student header */}
      <div className="px-5 py-5 border-b border-blue-800">
        <p className="text-xs font-semibold text-blue-300 uppercase tracking-wider">
          {config.courseTitle} · {config.semester}
        </p>
        <p className="text-sm text-white mt-1 font-medium truncate">
          {session?.studentName}
        </p>
        <p className="text-xs text-blue-400">{session?.section}</p>
      </div>

      <div className="flex-1 px-3 overflow-y-auto">

        {/* Overview */}
        <p className={sectionLabel}>Overview</p>
        <NavLink
          to="/dashboard"
          className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkInactive}`}
        >
          Dashboard
        </NavLink>

        {/* Weekly Activities */}
        <p className={sectionLabel}>Weekly Activities</p>
        {config.weeks.map(week => {
          const isCompleted = !!load(`activity_${week.weekNumber}`)
          return (
            <NavLink
              key={week.weekNumber}
              to={`/activity/${week.weekNumber}`}
              className={({ isActive }) =>
                `${linkBase} flex items-center justify-between ${isActive ? linkActive : linkInactive}`
              }
            >
              <span>Week {week.weekNumber}</span>
              {isCompleted && (
                <span className="text-green-400 text-xs font-bold">✓</span>
              )}
            </NavLink>
          )
        })}

        {/* Planning Notes */}
        <p className={sectionLabel}>Planning Notes</p>
        {NOTES.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkInactive}`}
          >
            {item.label}
          </NavLink>
        ))}

        {/* Reflection */}
        <p className={sectionLabel}>Final</p>
        <NavLink
          to="/reflection"
          className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkInactive}`}
        >
          App Reflection
        </NavLink>

        <div className="pb-4" />
      </div>

      {/* Sign out */}
      <div className="px-3 py-4 border-t border-blue-800">
        <button
          onClick={handleSignOut}
          className="w-full text-left px-3 py-2 rounded-lg text-sm text-blue-300 hover:bg-blue-800 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Sign Out &amp; Clear Data
        </button>
      </div>
    </nav>
  )
}
