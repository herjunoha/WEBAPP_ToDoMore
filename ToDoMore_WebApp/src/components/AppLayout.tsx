import { type ReactNode } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import { type RootState } from '@/store/store'
import { logout } from '@/store/authSlice'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'

interface AppLayoutProps {
  children: ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const user = useSelector((state: RootState) => state.auth.user)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    dispatch(logout())
    navigate('/login')
  }

  const isActive = (path: string) => {
    return location.pathname === path
  }

  const navItems = [
    { path: '/dashboard', label: '📊 Dashboard' },
    { path: '/tasks', label: '✓ Tasks' },
    { path: '/goals', label: '🎯 Goals' },
    { path: '/settings', label: '⚙️ Settings' },
  ]

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col shadow-lg">
        <div className="p-6 border-b border-slate-700">
          <h1 className="text-2xl font-bold">To Do: More</h1>
          <p className="text-sm text-slate-400 mt-1">Productivity Matters</p>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                isActive(item.path)
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="border-t border-slate-700 p-4 space-y-3">
          <div className="px-4 py-2">
            <p className="text-sm text-slate-400">Signed in as</p>
            <p className="text-white font-medium truncate">{user?.email}</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="destructive"
            className="w-full"
          >
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
