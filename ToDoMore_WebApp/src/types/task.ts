// Database schema uses snake_case
export interface TaskDB {
  id: string
  user_id: string
  title: string
  description?: string
  due_date?: string
  priority: 'Low' | 'Medium' | 'High'
  status: 'Pending' | 'In Progress' | 'Completed'
  goal_id?: string
  parent_task_id?: string
  created_at: string
  updated_at: string
}

// Frontend uses camelCase for convenience
export interface Task {
  id: string
  userId: string
  title: string
  description?: string
  dueDate?: string
  priority: 'Low' | 'Medium' | 'High'
  status: 'Pending' | 'In Progress' | 'Completed'
  goalId?: string
  parentTaskId?: string
  createdAt: string
  updatedAt: string
}

export interface TaskFormData {
  title: string
  description?: string
  dueDate?: string
  priority: 'Low' | 'Medium' | 'High'
  status: 'Pending' | 'In Progress' | 'Completed'
  goalId?: string
  parentTaskId?: string
}

// Utility functions to convert between DB and frontend formats
export function taskFromDB(dbTask: TaskDB): Task {
  return {
    id: dbTask.id,
    userId: dbTask.user_id,
    title: dbTask.title,
    description: dbTask.description,
    dueDate: dbTask.due_date,
    priority: dbTask.priority,
    status: dbTask.status,
    goalId: dbTask.goal_id,
    parentTaskId: dbTask.parent_task_id,
    createdAt: dbTask.created_at,
    updatedAt: dbTask.updated_at,
  }
}

export function taskToDB(task: Partial<Task> & { userId?: string }): Partial<TaskDB> {
  const dbTask: Partial<TaskDB> = {}
  if (task.id) dbTask.id = task.id
  if (task.userId) dbTask.user_id = task.userId
  if (task.title) dbTask.title = task.title
  if (task.description !== undefined) dbTask.description = task.description
  if (task.dueDate !== undefined) dbTask.due_date = task.dueDate
  if (task.priority) dbTask.priority = task.priority
  if (task.status) dbTask.status = task.status
  if (task.goalId !== undefined) dbTask.goal_id = task.goalId
  if (task.parentTaskId !== undefined) dbTask.parent_task_id = task.parentTaskId
  if (task.createdAt) dbTask.created_at = task.createdAt
  if (task.updatedAt) dbTask.updated_at = task.updatedAt
  return dbTask
}
