// Database schema uses snake_case
export interface StreakDB {
  id: string
  user_id: string
  current_streak: number
  longest_streak: number
  last_completed_date: string | null
  created_at: string
  updated_at: string
}

// Frontend uses camelCase
export interface Streak {
  id: string
  userId: string
  currentStreak: number
  longestStreak: number
  lastCompletedDate: string | null
  createdAt: string
  updatedAt: string
}

// Utility functions to convert between DB and frontend formats
export function streakFromDB(dbStreak: StreakDB): Streak {
  return {
    id: dbStreak.id,
    userId: dbStreak.user_id,
    currentStreak: dbStreak.current_streak,
    longestStreak: dbStreak.longest_streak,
    lastCompletedDate: dbStreak.last_completed_date,
    createdAt: dbStreak.created_at,
    updatedAt: dbStreak.updated_at,
  }
}

export function streakToDB(streak: Partial<Streak> & { userId?: string }): Partial<StreakDB> {
  const dbStreak: Partial<StreakDB> = {}
  if (streak.id) dbStreak.id = streak.id
  if (streak.userId) dbStreak.user_id = streak.userId
  if (streak.currentStreak !== undefined) dbStreak.current_streak = streak.currentStreak
  if (streak.longestStreak !== undefined) dbStreak.longest_streak = streak.longestStreak
  if (streak.lastCompletedDate !== undefined) dbStreak.last_completed_date = streak.lastCompletedDate
  if (streak.createdAt) dbStreak.created_at = streak.createdAt
  if (streak.updatedAt) dbStreak.updated_at = streak.updatedAt
  return dbStreak
}
