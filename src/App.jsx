import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import AppLayout from './layout/app-layout'
import LandingPage from './pages/LandingPage'
import Login from './auth/Login'
import Signup from './auth/Signup'
import AuthLayout from './auth/AuthLayout'
import Dashboard from './pages/Dashboard'
import ProtectedRoute from './components/ProtectedRoute'
import ProfilePage from './pages/ProfilePage'
import ResumeAnalyzer from './pages/ResumeAnalyzer'
import ResumeDetailsPage from './pages/ResumeDetailsPage'
import JobMatchesPage from './pages/JobMatchesPage'
import ResumesPage from './pages/ResumesPage'
import './index.css'

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <LandingPage />
      },
      {
        element: <AuthLayout />,
        children: [
          {
            path: "/login",
            element: <Login />
          },
          {
            path: "/signup",
            element: <Signup />
          }
        ]
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "/dashboard",
            element: <Dashboard />
          },
          {
            path: "/dashboard/profile",
            element: <ProfilePage />
          },
          {
            path: "/dashboard/analyzer",
            element: <ResumeAnalyzer />
          },
          {
            path: "/dashboard/resumes",
            element: <ResumesPage />
          },
          {
            path: "/dashboard/resumes/:id",
            element: <ResumeDetailsPage />
          },
          {
            path: "/dashboard/jobs",
            element: <JobMatchesPage />
          }
        ]
      }
    ]
  }
])

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}

export default App