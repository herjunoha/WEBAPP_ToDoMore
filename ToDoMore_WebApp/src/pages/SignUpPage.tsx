import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setUser, setLoading } from '@/store/authSlice'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from '@/hooks/use-toast'

export function SignUpPage() {
  const [username, setUsername] = useState('')
  const [pin, setPin] = useState('')
  const [confirmPin, setConfirmPin] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    dispatch(setLoading(true))

    try {
      if (!username || !pin || !confirmPin) {
        throw new Error('Please fill in all fields')
      }

      if (pin !== confirmPin) {
        throw new Error('PINs do not match')
      }

      if (pin.length < 6) {
        throw new Error('PIN must be at least 6 characters')
      }

      // Normalize username
      const normalizedUsername = username.toLowerCase().trim()
      
      // Validate username format (alphanumeric and underscores only)
      if (!/^[a-z0-9_]+$/.test(normalizedUsername)) {
        throw new Error('Username can only contain letters, numbers, and underscores')
      }

      // Supabase signup with email and password (using PIN as password)
      // Store actual username in user metadata
      const email = `${normalizedUsername}@todomore.local`
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password: pin,
        options: {
          data: {
            username: normalizedUsername,
          },
        },
      })

      if (authError) {
        // Provide user-friendly error messages
        if (authError.message.includes('already registered')) {
          throw new Error('Username already taken')
        }
        throw authError
      }

      if (data.user) {
        dispatch(setUser({
          id: data.user.id,
          email: normalizedUsername,
        }))
        toast({
          title: 'Account created!',
          description: `Welcome, ${normalizedUsername}!`,
        })
        navigate('/dashboard')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sign up failed'
      setError(errorMessage)
      toast({
        title: 'Sign up failed',
        description: errorMessage,
      })
    } finally {
      setIsLoading(false)
      dispatch(setLoading(false))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">To Do: More</h1>
            <p className="text-gray-600">Create your account</p>
          </div>

          <form onSubmit={handleSignUp} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <Input
                id="username"
                type="text"
                placeholder="Choose a username (letters, numbers, _)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
                pattern="[a-zA-Z0-9_]+"
              />
            </div>

            <div>
              <label htmlFor="pin" className="block text-sm font-medium text-gray-700 mb-1">
                PIN
              </label>
              <Input
                id="pin"
                type="password"
                placeholder="Enter a PIN (min 6 characters)"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                disabled={isLoading}
                minLength={6}
              />
            </div>

            <div>
              <label htmlFor="confirmPin" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm PIN
              </label>
              <Input
                id="confirmPin"
                type="password"
                placeholder="Confirm your PIN"
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value)}
                disabled={isLoading}
                minLength={6}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </span>
              ) : (
                'Sign Up'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
