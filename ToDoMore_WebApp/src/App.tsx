import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Provider, useDispatch } from 'react-redux'
import { store } from '@/store/store'
import { Toaster } from '@/components/ui/toaster'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { AppLayout } from '@/components/AppLayout'
import { LoginPage } from '@/pages/LoginPage'
import { SignUpPage } from '@/pages/SignUpPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { TasksPage } from '@/pages/TasksPage'
import { GoalsPage } from '@/pages/GoalsPage'
import { SettingsPage } from '@/pages/SettingsPage'
import { supabase } from '@/lib/supabase'
import { setUser, setLoading, logout } from '@/store/authSlice'

function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch()

  useEffect(() => {
    // Check for existing session on mount
    dispatch(setLoading(true))
    
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        dispatch(setUser({
          id: session.user.id,
          email: session.user.email || session.user.user_metadata?.username || '',
        }))
      }
      dispatch(setLoading(false))
    })

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        dispatch(setUser({
          id: session.user.id,
          email: session.user.email || session.user.user_metadata?.username || '',
        }))
      } else {
        dispatch(logout())
      }
    })

    return () => subscription.unsubscribe()
  }, [dispatch])

  return <>{children}</>
}

function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <Navigate to="/dashboard" replace />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <DashboardPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/tasks"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <TasksPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/goals"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <GoalsPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <SettingsPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
          <Toaster />
        </BrowserRouter>
      </AuthProvider>
    </Provider>
  )
}

export default App
