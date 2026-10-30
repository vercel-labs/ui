type Status = "backlog" | "todo" | "in-progress" | "done" | "canceled"

type Priority = "urgent" | "high" | "medium" | "low" | "none"

type Person = {
  id: string
  name: string
  role: string
}

type Label = {
  id: string
  name: string
  color: string
}

type Subtask = {
  id: string
  title: string
  done: boolean
  subtasks?: Subtask[]
}

type Comment = {
  id: string
  author: string
  body: string
  createdAt: string
}

type Issue = {
  id: string
  title: string
  description: string
  status: Status
  priority: Priority
  assignee: string | null
  labels: string[]
  due: string | null
  createdAt: string
  subtasks: Subtask[]
  comments: Comment[]
}

type Settings = {
  emailNotifications: boolean
  pageSize: number
  autoCloseDays: number
}

export type { Comment, Issue, Label, Person, Priority, Settings, Status, Subtask }
