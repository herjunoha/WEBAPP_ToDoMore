import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchGoals, deleteGoal } from '@/store/goalsSlice'
import { type RootState, type AppDispatch } from '@/store/store'
import { GoalForm } from '@/components/GoalForm'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { toast } from '@/hooks/use-toast'

export function GoalsPage() {
  const dispatch = useDispatch<AppDispatch>()
  const { items: goals, isLoading } = useSelector((state: RootState) => state.goals)
  const { user } = useSelector((state: RootState) => state.auth)
  const [formOpen, setFormOpen] = useState(false)
  const [selectedGoal, setSelectedGoalLocal] = useState<any>(null)

  useEffect(() => {
    if (user) {
      dispatch(fetchGoals(user.id))
    }
  }, [user, dispatch])

  const handleEditGoal = (goal: any) => {
    setSelectedGoalLocal(goal)
    setFormOpen(true)
  }

  const handleCreateGoal = () => {
    setSelectedGoalLocal(null)
    setFormOpen(true)
  }

  const handleDeleteGoal = async (goalId: string) => {
    if (confirm('Are you sure you want to delete this goal?')) {
      try {
        await dispatch(deleteGoal(goalId)).unwrap()
        toast({
          title: 'Goal deleted',
          description: 'The goal has been removed',
        })
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to delete goal',
        })
      }
    }
  }

  const handleFormClose = () => {
    setFormOpen(false)
    setSelectedGoalLocal(null)
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Goals</h1>
        <Button onClick={handleCreateGoal}>+ Create Goal</Button>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500">Loading goals...</p>
        </div>
      ) : goals.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500 mb-4">No goals yet. Create your first goal!</p>
          <Button onClick={handleCreateGoal}>Create Goal</Button>
        </div>
      ) : (
        <div className="space-y-4">
          {goals.map((goal) => (
            <div key={goal.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900">{goal.title}</h3>
                  {goal.description && (
                    <p className="text-gray-600 text-sm mt-1">{goal.description}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEditGoal(goal)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteGoal(goal.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Status</span>
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                    {goal.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4 p-3 bg-slate-50 rounded-lg">
                <div>
                  <p className="text-xs font-semibold text-gray-700 mb-1">Specific</p>
                  <p className="text-xs text-gray-600 line-clamp-2">{goal.smart.specific}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-700 mb-1">Measurable</p>
                  <p className="text-xs text-gray-600 line-clamp-2">{goal.smart.measurable}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-700 mb-1">Achievable</p>
                  <p className="text-xs text-gray-600 line-clamp-2">{goal.smart.achievable}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-700 mb-1">Relevant</p>
                  <p className="text-xs text-gray-600 line-clamp-2">{goal.smart.relevant}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-700 mb-1">Time-Bound</p>
                  <p className="text-xs text-gray-600 line-clamp-2">{goal.smart.timeBound}</p>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Progress</span>
                  <span className="text-sm font-semibold text-gray-900">{goal.progress}%</span>
                </div>
                <Progress value={goal.progress} className="h-2" />
              </div>
            </div>
          ))}
        </div>
      )}

      <GoalForm
        open={formOpen}
        onOpenChange={handleFormClose}
        goal={selectedGoal}
        userId={user?.id || ''}
      />
    </div>
  )
}
