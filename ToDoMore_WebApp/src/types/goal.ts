export interface SmartFramework {
  specific: string
  measurable: string
  achievable: string
  relevant: string
  timeBound: string
}

// Database schema uses snake_case
export interface GoalDB {
  id: string
  user_id: string
  title: string
  description?: string
  smart: SmartFramework
  status: 'Not Started' | 'In Progress' | 'Achieved'
  progress: number
  parent_goal_id?: string
  created_at: string
  updated_at: string
}

// Frontend uses camelCase
export interface Goal {
  id: string
  userId: string
  title: string
  description?: string
  smart: SmartFramework
  status: 'Not Started' | 'In Progress' | 'Achieved'
  progress: number
  parentGoalId?: string
  createdAt: string
  updatedAt: string
}

export interface GoalFormData {
  title: string
  description?: string
  specific: string
  measurable: string
  achievable: string
  relevant: string
  timeBound: string
  status: 'Not Started' | 'In Progress' | 'Achieved'
}

// Utility functions to convert between DB and frontend formats
export function goalFromDB(dbGoal: GoalDB): Goal {
  return {
    id: dbGoal.id,
    userId: dbGoal.user_id,
    title: dbGoal.title,
    description: dbGoal.description,
    smart: dbGoal.smart,
    status: dbGoal.status,
    progress: dbGoal.progress,
    parentGoalId: dbGoal.parent_goal_id,
    createdAt: dbGoal.created_at,
    updatedAt: dbGoal.updated_at,
  }
}

export function goalToDB(goal: Partial<Goal> & { userId?: string }): Partial<GoalDB> {
  const dbGoal: Partial<GoalDB> = {}
  if (goal.id) dbGoal.id = goal.id
  if (goal.userId) dbGoal.user_id = goal.userId
  if (goal.title) dbGoal.title = goal.title
  if (goal.description !== undefined) dbGoal.description = goal.description
  if (goal.smart) dbGoal.smart = goal.smart
  if (goal.status) dbGoal.status = goal.status
  if (goal.progress !== undefined) dbGoal.progress = goal.progress
  if (goal.parentGoalId !== undefined) dbGoal.parent_goal_id = goal.parentGoalId
  if (goal.createdAt) dbGoal.created_at = goal.createdAt
  if (goal.updatedAt) dbGoal.updated_at = goal.updatedAt
  return dbGoal
}
