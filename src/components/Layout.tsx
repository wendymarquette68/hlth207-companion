import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'

export function Layout() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main
        id="main-content"
        className="flex-1 bg-slate-50 overflow-y-auto"
        tabIndex={-1}
      >
        <div className="max-w-3xl mx-auto px-6 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
