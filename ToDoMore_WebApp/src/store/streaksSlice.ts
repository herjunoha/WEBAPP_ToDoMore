import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { supabase } from '@/lib/supabase'
import { type Streak, type StreakDB, streakFromDB } from '@/types/streak'

interface StreaksState {
  current: Streak | null
  isLoading: boolean
  error: string | null
}

const initialState: StreaksState = {
  current: null,
  isLoading: false,
  error: null,
}

export const fetchStreak = createAsyncThunk(
  'streaks/fetchStreak',
  async (userId: string, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('streaks')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      // If no streak exists, return default
      if (!data) {
        return {
          id: '',
          userId,
          currentStreak: 0,
          longestStreak: 0,
          lastCompletedDate: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      }

      // Transform database record to frontend format
      return streakFromDB(data as StreakDB)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch streak'
      return rejectWithValue(errorMessage)
    }
  }
)

export const updateStreakOnTaskCompletion = createAsyncThunk(
  'streaks/updateStreakOnTaskCompletion',
  async (userId: string, { rejectWithValue }) => {
    try {
      // Use UTC time to avoid timezone issues
      const now = new Date()
      const todayUTC = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()))
      const todayString = todayUTC.toISOString().split('T')[0]

      // Fetch current streak
      const { data: streakData, error: streakError } = await supabase
        .from('streaks')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (streakError && streakError.code !== 'PGRST116') {
        throw streakError
      }

      let currentStreak = 0
      let longestStreak = 0
      let lastCompletedDate: string | null = null

      if (streakData) {
        currentStreak = streakData.current_streak || 0
        longestStreak = streakData.longest_streak || 0
        lastCompletedDate = streakData.last_completed_date

        // Check if we already have a streak entry for today
        if (lastCompletedDate) {
          // Compare dates in UTC to avoid timezone issues
          const lastDateUTC = new Date(lastCompletedDate + 'T00:00:00Z')
          const lastDateString = lastDateUTC.toISOString().split('T')[0]

          // If last completion was today, don't update
          if (lastDateString === todayString) {
            return streakFromDB(streakData as StreakDB)
          }

          // If last completion was yesterday, increment streak
          const yesterdayUTC = new Date(todayUTC)
          yesterdayUTC.setUTCDate(yesterdayUTC.getUTCDate() - 1)
          const yesterdayString = yesterdayUTC.toISOString().split('T')[0]

          if (lastDateString === yesterdayString) {
            currentStreak += 1
          } else {
            // Otherwise, reset streak to 1 (streak was broken)
            currentStreak = 1
          }
        } else {
          // First completion
          currentStreak = 1
        }

        // Update longest streak if needed
        if (currentStreak > longestStreak) {
          longestStreak = currentStreak
        }

        // Update the streak record
        const { data: updatedData, error: updateError } = await supabase
          .from('streaks')
          .update({
            current_streak: currentStreak,
            longest_streak: longestStreak,
            last_completed_date: todayString,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', userId)
          .select()

        if (updateError) throw updateError
        return updatedData?.[0] ? streakFromDB(updatedData[0] as StreakDB) : streakFromDB(streakData as StreakDB)
      } else {
        // Create new streak record
        const { data: newData, error: createError } = await supabase
          .from('streaks')
          .insert({
            user_id: userId,
            current_streak: 1,
            longest_streak: 1,
            last_completed_date: todayString,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .select()

        if (createError) throw createError
        return newData?.[0] ? streakFromDB(newData[0] as StreakDB) : null
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update streak'
      return rejectWithValue(errorMessage)
    }
  }
)

const streaksSlice = createSlice({
  name: 'streaks',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStreak.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchStreak.fulfilled, (state, action) => {
        state.isLoading = false
        state.current = action.payload
      })
      .addCase(fetchStreak.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(updateStreakOnTaskCompletion.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateStreakOnTaskCompletion.fulfilled, (state, action) => {
        state.isLoading = false
        state.current = action.payload
      })
      .addCase(updateStreakOnTaskCompletion.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { clearError } = streaksSlice.actions
export default streaksSlice.reducer
