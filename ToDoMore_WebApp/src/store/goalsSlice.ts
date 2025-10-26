import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit'
import { supabase } from '@/lib/supabase'
import { type Goal, type GoalFormData, type GoalDB, goalFromDB } from '@/types/goal'

interface GoalsState {
  items: Goal[]
  isLoading: boolean
  error: string | null
  selectedGoal: Goal | null
}

const initialState: GoalsState = {
  items: [],
  isLoading: false,
  error: null,
  selectedGoal: null,
}

export const fetchGoals = createAsyncThunk(
  'goals/fetchGoals',
  async (userId: string, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      // Transform database records to frontend format
      return (data || []).map((goal: GoalDB) => goalFromDB(goal))
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch goals'
      return rejectWithValue(errorMessage)
    }
  }
)

export const createGoal = createAsyncThunk(
  'goals/createGoal',
  async (
    { userId, goalData }: { userId: string; goalData: GoalFormData },
    { rejectWithValue }
  ) => {
    try {
      const { data, error } = await supabase
        .from('goals')
        .insert({
          user_id: userId,
          title: goalData.title,
          description: goalData.description,
          smart: {
            specific: goalData.specific,
            measurable: goalData.measurable,
            achievable: goalData.achievable,
            relevant: goalData.relevant,
            timeBound: goalData.timeBound,
          },
          status: goalData.status,
          progress: 0,
        })
        .select()

      if (error) throw error
      // Transform database record to frontend format
      return data?.[0] ? goalFromDB(data[0] as GoalDB) : null
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create goal'
      return rejectWithValue(errorMessage)
    }
  }
)

export const updateGoal = createAsyncThunk(
  'goals/updateGoal',
  async (
    { goalId, goalData }: { goalId: string; goalData: Partial<GoalFormData> },
    { rejectWithValue }
  ) => {
    try {
      const updateData: Record<string, any> = {}
      if (goalData.title !== undefined) updateData.title = goalData.title
      if (goalData.description !== undefined) updateData.description = goalData.description
      if (goalData.status !== undefined) updateData.status = goalData.status

      if (goalData.specific || goalData.measurable || goalData.achievable || goalData.relevant || goalData.timeBound) {
        updateData.smart = {
          specific: goalData.specific,
          measurable: goalData.measurable,
          achievable: goalData.achievable,
          relevant: goalData.relevant,
          timeBound: goalData.timeBound,
        }
      }

      const { data, error } = await supabase
        .from('goals')
        .update(updateData)
        .eq('id', goalId)
        .select()

      if (error) throw error
      // Transform database record to frontend format
      return data?.[0] ? goalFromDB(data[0] as GoalDB) : null
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update goal'
      return rejectWithValue(errorMessage)
    }
  }
)

export const updateGoalProgress = createAsyncThunk(
  'goals/updateGoalProgress',
  async (goalId: string, { rejectWithValue }) => {
    try {
      // Fetch all tasks linked to this goal
      const { data: tasks, error: tasksError } = await supabase
        .from('tasks')
        .select('status')
        .eq('goal_id', goalId)

      if (tasksError) throw tasksError

      // Calculate progress
      const totalTasks = tasks?.length || 0
      const completedTasks = tasks?.filter(t => t.status === 'Completed').length || 0
      const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

      // Update goal progress in database
      const { data, error } = await supabase
        .from('goals')
        .update({ progress })
        .eq('id', goalId)
        .select()

      if (error) throw error
      return data?.[0] ? goalFromDB(data[0] as GoalDB) : null
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update goal progress'
      return rejectWithValue(errorMessage)
    }
  }
)

export const deleteGoal = createAsyncThunk(
  'goals/deleteGoal',
  async (goalId: string, { rejectWithValue }) => {
    try {
      const { error } = await supabase
        .from('goals')
        .delete()
        .eq('id', goalId)

      if (error) throw error
      return goalId
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete goal'
      return rejectWithValue(errorMessage)
    }
  }
)

const goalsSlice = createSlice({
  name: 'goals',
  initialState,
  reducers: {
    setSelectedGoal: (state, action: PayloadAction<Goal | null>) => {
      state.selectedGoal = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGoals.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchGoals.fulfilled, (state, action) => {
        state.isLoading = false
        state.items = action.payload
      })
      .addCase(fetchGoals.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(createGoal.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createGoal.fulfilled, (state, action) => {
        state.isLoading = false
        if (action.payload) {
          state.items.unshift(action.payload)
        }
      })
      .addCase(createGoal.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(updateGoal.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateGoal.fulfilled, (state, action) => {
        state.isLoading = false
        if (action.payload) {
          const index = state.items.findIndex((g) => g.id === action.payload!.id)
          if (index !== -1) {
            state.items[index] = action.payload
          }
        }
      })
      .addCase(updateGoal.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(deleteGoal.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(deleteGoal.fulfilled, (state, action) => {
        state.isLoading = false
        state.items = state.items.filter((g) => g.id !== action.payload)
      })
      .addCase(deleteGoal.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(updateGoalProgress.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateGoalProgress.fulfilled, (state, action) => {
        state.isLoading = false
        if (action.payload) {
          const index = state.items.findIndex((g) => g.id === action.payload!.id)
          if (index !== -1) {
            state.items[index] = action.payload
          }
        }
      })
      .addCase(updateGoalProgress.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { setSelectedGoal, clearError } = goalsSlice.actions
export default goalsSlice.reducer
