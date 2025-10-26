import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchGoals } from '@/store/goalsSlice'
import { fetchTasks } from '@/store/tasksSlice'
import { fetchStreak } from '@/store/streaksSlice'
import { type RootState, type AppDispatch } from '@/store/store'
import { Progress } from '@/components/ui/progress'

export function DashboardPage() {
  const dispatch = useDispatch<AppDispatch>()
  const { user } = useSelector((state: RootState) => state.auth)
  const { items: goals } = useSelector((state: RootState) => state.goals)
  const { items: tasks } = useSelector((state: RootState) => state.tasks)
  const { current: streak } = useSelector((state: RootState) => state.streaks)

  useEffect(() => {
    if (user) {
      dispatch(fetchGoals(user.id))
      dispatch(fetchTasks(user.id))
      dispatch(fetchStreak(user.id))
    }
  }, [user, dispatch])

  // Calculate statistics
  const totalTasks = tasks.length
  const completedTasks = tasks.filter((t) => t.status === 'Completed').length
  const completedToday = tasks.filter((t) => {
    if (t.status !== 'Completed' || !t.updatedAt) return false
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const taskDate = new Date(t.updatedAt)
    taskDate.setHours(0, 0, 0, 0)
    return taskDate.getTime() === today.getTime()
  }).length

  const inProgressGoals = goals.filter((g) => g.status === 'In Progress').length
  const achievedGoals = goals.filter((g) => g.status === 'Achieved').length

  // Calculate goal progress
  const goalsWithProgress = goals.map((goal) => {
    const linkedTasks = tasks.filter((t) => t.goalId === goal.id)
    const completedLinkedTasks = linkedTasks.filter((t) => t.status === 'Completed')
    const progress = linkedTasks.length > 0 
      ? Math.round((completedLinkedTasks.length / linkedTasks.length) * 100)
      : 0
    return { ...goal, progress, linkedTasks: linkedTasks.length, completedLinkedTasks: completedLinkedTasks.length }
  })

  return (
    <div className="p-8 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Dashboard</h1>

      {/* Streak Section */}
      <div className="bg-gradient-to-r from-orange-400 to-orange-600 rounded-lg shadow-lg p-8 mb-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-orange-100 text-sm font-medium mb-2">Current Streak</p>
            <h2 className="text-5xl font-bold">
              🔥 {streak?.currentStreak || 0} days
            </h2>
            <p className="text-orange-100 text-sm mt-2">Longest Streak: {streak?.longestStreak || 0} days</p>
          </div>
          <div className="text-6xl opacity-20">🔥</div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-500 text-sm font-medium">Total Tasks</p>
          <p className="text-4xl font-bold text-gray-900 mt-2">{totalTasks}</p>
          <p className="text-green-600 text-sm mt-2">✓ {completedTasks} completed</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-500 text-sm font-medium">Completed Today</p>
          <p className="text-4xl font-bold text-green-600 mt-2">✓ {completedToday}</p>
          <p className="text-gray-500 text-sm mt-2">Keep it up!</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-500 text-sm font-medium">Active Goals</p>
          <p className="text-4xl font-bold text-blue-600 mt-2">{inProgressGoals}</p>
          <p className="text-gray-500 text-sm mt-2">🎯 {achievedGoals} achieved</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-500 text-sm font-medium">Goal Completion</p>
          <p className="text-4xl font-bold text-purple-600 mt-2">
            {goals.length > 0 ? Math.round((achievedGoals / goals.length) * 100) : 0}%
          </p>
          <p className="text-gray-500 text-sm mt-2">of all goals</p>
        </div>
      </div>

      {/* Goal Progress Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Goal Progress</h2>
        {goalsWithProgress.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No goals yet. Create one to get started!</p>
        ) : (
          <div className="space-y-6">
            {goalsWithProgress.map((goal) => (
              <div key={goal.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{goal.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {goal.completedLinkedTasks} of {goal.linkedTasks} tasks completed
                    </p>
                  </div>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    goal.status === 'Achieved' ? 'bg-green-100 text-green-800' :
                    goal.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {goal.status}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Progress value={goal.progress} className="flex-1" />
                  <span className="text-sm font-semibold text-gray-900 min-w-12 text-right">
                    {goal.progress}%
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-2">{goal.smart.specific}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
