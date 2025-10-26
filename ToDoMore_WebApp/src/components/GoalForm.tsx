import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { createGoal, updateGoal } from '@/store/goalsSlice'
import { type AppDispatch } from '@/store/store'
import { type Goal, type GoalFormData } from '@/types/goal'
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

interface GoalFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  goal?: Goal | null
  userId: string
}

const initialFormData: GoalFormData = {
  title: '',
  description: '',
  specific: '',
  measurable: '',
  achievable: '',
  relevant: '',
  timeBound: '',
  status: 'Not Started',
}

export function GoalForm({ open, onOpenChange, goal, userId }: GoalFormProps) {
  const [formData, setFormData] = useState<GoalFormData>(initialFormData)
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    if (goal) {
      setFormData({
        title: goal.title,
        description: goal.description || '',
        specific: goal.smart.specific,
        measurable: goal.smart.measurable,
        achievable: goal.smart.achievable,
        relevant: goal.smart.relevant,
        timeBound: goal.smart.timeBound,
        status: goal.status,
      })
    } else {
      setFormData(initialFormData)
    }
  }, [goal, open])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleStatusChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      status: value as 'Not Started' | 'In Progress' | 'Achieved',
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (!formData.title || !formData.specific || !formData.measurable) {
        toast({
          title: 'Validation error',
          description: 'Please fill in required fields (Title, Specific, Measurable)',
        })
        setIsLoading(false)
        return
      }

      if (goal) {
        await dispatch(updateGoal({ goalId: goal.id, goalData: formData })).unwrap()
        toast({
          title: 'Goal updated',
          description: 'Your goal has been successfully updated',
        })
      } else {
        await dispatch(createGoal({ userId, goalData: formData })).unwrap()
        toast({
          title: 'Goal created',
          description: 'Your new goal has been created successfully',
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
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{goal ? 'Edit Goal' : 'Create New Goal'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Goal Title *
            </label>
            <Input
              name="title"
              placeholder="e.g., Lose 10 pounds"
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
              placeholder="Additional details about your goal"
              value={formData.description}
              onChange={handleInputChange}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
              rows={2}
            />
          </div>

          <div className="space-y-3 bg-blue-50 p-3 rounded-lg border border-blue-200">
            <p className="text-sm font-semibold text-gray-900">SMART Framework</p>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Specific *
              </label>
              <textarea
                name="specific"
                placeholder="What exactly do you want to achieve?"
                value={formData.specific}
                onChange={handleInputChange}
                disabled={isLoading}
                className="w-full px-3 py-2 border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                rows={2}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Measurable *
              </label>
              <textarea
                name="measurable"
                placeholder="How will you measure progress?"
                value={formData.measurable}
                onChange={handleInputChange}
                disabled={isLoading}
                className="w-full px-3 py-2 border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                rows={2}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Achievable
              </label>
              <textarea
                name="achievable"
                placeholder="Is this goal realistic and attainable?"
                value={formData.achievable}
                onChange={handleInputChange}
                disabled={isLoading}
                className="w-full px-3 py-2 border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                rows={2}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Relevant
              </label>
              <textarea
                name="relevant"
                placeholder="Why is this goal important to you?"
                value={formData.relevant}
                onChange={handleInputChange}
                disabled={isLoading}
                className="w-full px-3 py-2 border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                rows={2}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time-Bound
              </label>
              <Input
                name="timeBound"
                type="text"
                placeholder="e.g., By December 31, 2025"
                value={formData.timeBound}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <Select value={formData.status} onValueChange={handleStatusChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Not Started">Not Started</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Achieved">Achieved</SelectItem>
              </SelectContent>
            </Select>
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
              {isLoading ? 'Saving...' : goal ? 'Update Goal' : 'Create Goal'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
