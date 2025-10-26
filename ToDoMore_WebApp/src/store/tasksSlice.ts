import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit'
import { supabase } from '@/lib/supabase'
import { type Task, type TaskFormData, type TaskDB, taskFromDB } from '@/types/task'

interface TasksState {
  items: Task[]
  isLoading: boolean
  error: string | null
  selectedTask: Task | null
}

const initialState: TasksState = {
  items: [],
  isLoading: false,
  error: null,
  selectedTask: null,
}

export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (userId: string, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      // Transform database records to frontend format
      return (data || []).map((task: TaskDB) => taskFromDB(task))
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch tasks'
      return rejectWithValue(errorMessage)
    }
  }
)

export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (
    { userId, taskData }: { userId: string; taskData: TaskFormData },
    { rejectWithValue }
  ) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          user_id: userId,
          title: taskData.title,
          description: taskData.description,
          due_date: taskData.dueDate,
          priority: taskData.priority,
          status: taskData.status,
          goal_id: taskData.goalId || null,
          parent_task_id: taskData.parentTaskId || null,
        })
        .select()

      if (error) throw error
      // Transform database record to frontend format
      return data?.[0] ? taskFromDB(data[0] as TaskDB) : null
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create task'
      return rejectWithValue(errorMessage)
    }
  }
)

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async (
    { taskId, taskData }: { taskId: string; taskData: Partial<TaskFormData> },
    { rejectWithValue }
  ) => {
    try {
      const updateData: Record<string, any> = {}
      if (taskData.title !== undefined) updateData.title = taskData.title
      if (taskData.description !== undefined) updateData.description = taskData.description
      if (taskData.dueDate !== undefined) updateData.due_date = taskData.dueDate
      if (taskData.priority !== undefined) updateData.priority = taskData.priority
      if (taskData.status !== undefined) updateData.status = taskData.status
      if (taskData.goalId !== undefined) updateData.goal_id = taskData.goalId || null
      if (taskData.parentTaskId !== undefined) updateData.parent_task_id = taskData.parentTaskId || null

      const { data, error } = await supabase
        .from('tasks')
        .update(updateData)
        .eq('id', taskId)
        .select()

      if (error) throw error
      // Transform database record to frontend format
      return data?.[0] ? taskFromDB(data[0] as TaskDB) : null
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update task'
      return rejectWithValue(errorMessage)
    }
  }
)

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (taskId: string, { rejectWithValue }) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId)

      if (error) throw error
      return taskId
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete task'
      return rejectWithValue(errorMessage)
    }
  }
)

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setSelectedTask: (state, action: PayloadAction<Task | null>) => {
      state.selectedTask = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.isLoading = false
        state.items = action.payload
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(createTask.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.isLoading = false
        if (action.payload) {
          state.items.unshift(action.payload)
        }
      })
      .addCase(createTask.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(updateTask.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.isLoading = false
        if (action.payload) {
          const index = state.items.findIndex((t) => t.id === action.payload!.id)
          if (index !== -1) {
            state.items[index] = action.payload
          }
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(deleteTask.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.isLoading = false
        state.items = state.items.filter((t) => t.id !== action.payload)
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { setSelectedTask, clearError } = tasksSlice.actions
export default tasksSlice.reducer
