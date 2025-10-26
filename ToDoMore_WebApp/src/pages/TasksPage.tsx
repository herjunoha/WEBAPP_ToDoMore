import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchTasks, deleteTask } from '@/store/tasksSlice'
import { fetchGoals, updateGoalProgress } from '@/store/goalsSlice'
import { type RootState, type AppDispatch } from '@/store/store'
import { TaskForm } from '@/components/TaskForm'
import { Button } from '@/components/ui/button'
import { toast } from '@/hooks/use-toast'

export function TasksPage() {
  const dispatch = useDispatch<AppDispatch>()
  const { items: tasks, isLoading } = useSelector((state: RootState) => state.tasks)
  const { items: goals } = useSelector((state: RootState) => state.goals)
  const { user } = useSelector((state: RootState) => state.auth)
  const [formOpen, setFormOpen] = useState(false)
  const [selectedTask, setSelectedTaskLocal] = useState<any>(null)
  const [filterStatus, setFilterStatus] = useState<string>('All')
  const [filterPriority, setFilterPriority] = useState<string>('All')

  useEffect(() => {
    if (user) {
      dispatch(fetchTasks(user.id))
      dispatch(fetchGoals(user.id))
    }
  }, [user, dispatch])

  const handleEditTask = (task: any) => {
    setSelectedTaskLocal(task)
    setFormOpen(true)
  }

  const handleCreateTask = () => {
    setSelectedTaskLocal(null)
    setFormOpen(true)
  }

  const handleDeleteTask = async (taskId: string) => {
    const taskToDelete = tasks.find(t => t.id === taskId)
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        await dispatch(deleteTask(taskId)).unwrap()
        
        // Update goal progress if task was linked to a goal
        if (taskToDelete?.goalId) {
          await dispatch(updateGoalProgress(taskToDelete.goalId)).unwrap()
        }
        
        toast({
          title: 'Task deleted',
          description: 'The task has been removed',
        })
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to delete task',
        })
      }
    }
  }

  const handleFormClose = () => {
    setFormOpen(false)
    setSelectedTaskLocal(null)
  }

  const getGoalTitle = (goalId?: string) => {
    if (!goalId) return null
    const goal = goals.find((g) => g.id === goalId)
    return goal?.title
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800'
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'Low':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800'
      case 'In Progress':
        return 'bg-blue-100 text-blue-800'
      case 'Pending':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredTasks = tasks.filter((task) => {
    const statusMatch = filterStatus === 'All' || task.status === filterStatus
    const priorityMatch = filterPriority === 'All' || task.priority === filterPriority
    return statusMatch && priorityMatch
  })

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
        <Button onClick={handleCreateTask}>+ Create Task</Button>
      </div>

      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-3 py-2 border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="All">All Priority</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500">Loading tasks...</p>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500 mb-4">No tasks yet. Create your first task!</p>
          <Button onClick={handleCreateTask}>Create Task</Button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map((task) => (
            <div key={task.id} className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
                    <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                    <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                  </div>
                  {task.description && (
                    <p className="text-gray-600 text-sm mb-2">{task.description}</p>
                  )}
                  <div className="flex gap-4 text-sm text-gray-500">
                    {task.dueDate && (
                      <span>📅 Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                    )}
                    {getGoalTitle(task.goalId) && (
                      <span>🎯 Goal: {getGoalTitle(task.goalId)}</span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEditTask(task)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteTask(task.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <TaskForm
        open={formOpen}
        onOpenChange={handleFormClose}
        task={selectedTask}
        userId={user?.id || ''}
      />
    </div>
  )
}
