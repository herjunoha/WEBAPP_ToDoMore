import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import goalsReducer from './goalsSlice'
import tasksReducer from './tasksSlice'
import streaksReducer from './streaksSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    goals: goalsReducer,
    tasks: tasksReducer,
    streaks: streaksReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
