import { NavLink, useNavigate } from 'react-router-dom'
import { useSession } from '../context/SessionContext'
import { clearStudentData } from '../utils/storage'
import config from '../config/course.config.json'

const NAV = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/notes/health-issue', label: 'Health Issue' },
  { to: '/notes/article-review', label: 'Article Research' },
  { to: '/notes/policy-advocacy', label: 'Policy Advocacy' },
  { to: '/notes/presentation', label: 'Presentation' },
  { to: '/reflection', label: 'Reflection' },
]

const linkBase =
  'block px-3 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400'
const linkActive = 'bg-blue-700 text-white'
const linkInactive = 'text-slate-200 hover:bg-blue-800'

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
      <div className="px-5 py-5 border-b border-blue-800">
        <p className="text-xs font-semibold text-blue-300 uppercase tracking-wider">
          {config.courseTitle} · {config.semester}
        </p>
        <p className="text-sm text-white mt-1 font-medium truncate">
          {session?.studentName}
        </p>
        <p className="text-xs text-blue-400">{session?.section}</p>
      </div>

      <div className="flex-1 px-3 py-4 space-y-1">
        <p className="px-3 text-xs font-semibold text-blue-400 uppercase tracking-wider mb-2">
          Navigation
        </p>
        {NAV.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : linkInactive}`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </div>

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
