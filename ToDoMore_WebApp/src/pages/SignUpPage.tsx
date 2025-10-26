import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setUser, setError, setLoading } from '@/store/authSlice'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from '@/hooks/use-toast'

export function SignUpPage() {
  const [username, setUsername] = useState('')
  const [pin, setPin] = useState('')
  const [confirmPin, setConfirmPin] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    dispatch(setLoading(true))

    try {
      if (!username || !pin || !confirmPin) {
        throw new Error('Please fill in all fields')
      }

      if (pin !== confirmPin) {
        throw new Error('PINs do not match')
      }

      if (pin.length < 4) {
        throw new Error('PIN must be at least 4 characters')
      }

      // Supabase signup with email and password (using PIN as password)
      const email = `${username}@todomore.local`
      const { data, error } = await supabase.auth.signUp({
        email,
        password: pin,
        options: {
          data: {
            username,
          },
        },
      })

      if (error) {
        throw error
      }

      if (data.user) {
        dispatch(setUser({
          id: data.user.id,
          email: data.user.email || username,
        }))
        toast({
          title: 'Account created!',
          description: `Welcome, ${username}!`,
        })
        navigate('/dashboard')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sign up failed'
      dispatch(setError(errorMessage))
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
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <Input
                id="username"
                type="text"
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="pin" className="block text-sm font-medium text-gray-700 mb-1">
                PIN
              </label>
              <Input
                id="pin"
                type="password"
                placeholder="Enter a PIN (min 4 characters)"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                disabled={isLoading}
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
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Creating account...' : 'Sign Up'}
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
