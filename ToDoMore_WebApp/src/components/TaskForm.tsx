import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createTask, updateTask } from '@/store/tasksSlice'
import { updateGoalProgress } from '@/store/goalsSlice'
import { updateStreakOnTaskCompletion } from '@/store/streaksSlice'
import { type AppDispatch, type RootState } from '@/store/store'
import { type Task, type TaskFormData } from '@/types/task'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from '@/hooks/use-toast'

interface TaskFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  task?: Task | null
  userId: string
}

const initialFormData: TaskFormData = {
  title: '',
  description: '',
  dueDate: '',
  priority: 'Medium',
  status: 'Pending',
  goalId: undefined,
  parentTaskId: undefined,
}

export function TaskForm({ open, onOpenChange, task, userId }: TaskFormProps) {
  const [formData, setFormData] = useState<TaskFormData>(initialFormData)
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch<AppDispatch>()
  const goals = useSelector((state: RootState) => state.goals.items)

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || '',
        dueDate: task.dueDate || '',
        priority: task.priority,
        status: task.status,
        goalId: task.goalId,
        parentTaskId: task.parentTaskId,
      })
    } else {
      setFormData(initialFormData)
    }
  }, [task, open])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value || undefined,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (!formData.title) {
        toast({
          title: 'Validation error',
          description: 'Please fill in the task title',
        })
        setIsLoading(false)
        return
      }

      const isCompletingTask = task && task.status !== 'Completed' && formData.status === 'Completed'
      const goalChanged = task && task.goalId !== formData.goalId

      if (task) {
        await dispatch(updateTask({ taskId: task.id, taskData: formData })).unwrap()
        
        // If marking task as completed, update streak
        if (isCompletingTask && userId) {
          await dispatch(updateStreakOnTaskCompletion(userId)).unwrap()
        }
        
        // Update goal progress if task is linked to a goal or goal changed
        if (formData.goalId) {
          await dispatch(updateGoalProgress(formData.goalId)).unwrap()
        }
        // If goal was changed, update old goal progress too
        if (goalChanged && task.goalId) {
          await dispatch(updateGoalProgress(task.goalId)).unwrap()
        }
        
        toast({
          title: 'Task updated',
          description: 'Your task has been successfully updated',
        })
      } else {
        const newTask = await dispatch(createTask({ userId, taskData: formData })).unwrap()
        
        // Update goal progress if new task is linked to a goal
        if (newTask && formData.goalId) {
          await dispatch(updateGoalProgress(formData.goalId)).unwrap()
        }
        
        toast({
          title: 'Task created',
          description: 'Your new task has been created successfully',
        })
      }

      onOpenChange(false)
      setFormData(initialFormData)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred'
      toast({
        title: 'Error',
        description: errorMessage,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{task ? 'Edit Task' : 'Create New Task'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Task Title *
            </label>
            <Input
              name="title"
              placeholder="e.g., Complete project proposal"
              value={formData.title}
              onChange={handleInputChange}
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              placeholder="Additional details about the task"
              value={formData.description}
              onChange={handleInputChange}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <Select
                value={formData.priority}
                onValueChange={(value) => handleSelectChange('priority', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleSelectChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Due Date
            </label>
            <Input
              name="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={handleInputChange}
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Link to Goal (Optional)
            </label>
            <Select
              value={formData.goalId || ''}
              onValueChange={(value) => handleSelectChange('goalId', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a goal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">No goal</SelectItem>
                {goals.map((goal) => (
                  <SelectItem key={goal.id} value={goal.id}>
                    {goal.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500 mt-1">
              Linking tasks to goals helps track progress
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : task ? 'Update Task' : 'Create Task'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
