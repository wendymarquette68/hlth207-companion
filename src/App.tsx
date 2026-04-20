import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { SessionProvider, useSession } from './context/SessionContext'
import { Layout } from './components/Layout'
import { Welcome } from './pages/Welcome'
import { Dashboard } from './pages/Dashboard'
import { ActivityPage } from './pages/ActivityPage'
import { HealthIssue } from './pages/modules/HealthIssue'
import { ArticleReview } from './pages/modules/ArticleReview'
import { PolicyAdvocacy } from './pages/modules/PolicyAdvocacy'
import { Presentation } from './pages/modules/Presentation'
import { ReflectionPage } from './pages/ReflectionPage'

function ProtectedRoutes() {
  const { session } = useSession()
  if (!session) return <Navigate to="/" replace />
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/activity/:weekNumber" element={<ActivityPage />} />
        <Route path="/notes/health-issue" element={<HealthIssue />} />
        <Route path="/notes/article-review" element={<ArticleReview />} />
        <Route path="/notes/policy-advocacy" element={<PolicyAdvocacy />} />
        <Route path="/notes/presentation" element={<Presentation />} />
        <Route path="/reflection" element={<ReflectionPage />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  )
}

function AppRoutes() {
  const { session } = useSession()
  return (
    <Routes>
      <Route
        path="/"
        element={session ? <Navigate to="/dashboard" replace /> : <Welcome />}
      />
      <Route path="/*" element={<ProtectedRoutes />} />
    </Routes>
  )
}

export default function App() {
  return (
    <SessionProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </SessionProvider>
  )
}
