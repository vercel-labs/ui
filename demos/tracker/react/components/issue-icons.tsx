import { cn } from "cn"
import {
  Circle,
  CircleAlert,
  CircleCheck,
  CircleDashed,
  CircleDotDashed,
  CircleX,
  Minus,
  SignalHigh,
  SignalLow,
  SignalMedium,
} from "lucide-react"
import { priorityOf, statusOf, type Priority, type Status } from "tracker-data"

const statusIcons = {
  backlog: CircleDashed,
  todo: Circle,
  "in-progress": CircleDotDashed,
  done: CircleCheck,
  canceled: CircleX,
}

const priorityIcons = {
  urgent: CircleAlert,
  high: SignalHigh,
  medium: SignalMedium,
  low: SignalLow,
  none: Minus,
}

function StatusIcon({
  status,
  label,
  className,
}: {
  status: Status
  label?: boolean
  className?: string
}) {
  const Icon = statusIcons[status]
  return (
    <Icon
      {...(label
        ? { role: "img", "aria-label": statusOf(status).label }
        : { "aria-hidden": true })}
      className={cn(
        "size-4 shrink-0 text-muted-foreground",
        status === "in-progress" && "text-amber-500",
        status === "done" && "text-emerald-600 dark:text-emerald-400",
        className
      )}
    />
  )
}

function PriorityIcon({
  priority,
  label,
  className,
}: {
  priority: Priority
  label?: boolean
  className?: string
}) {
  const Icon = priorityIcons[priority]
  return (
    <Icon
      {...(label
        ? { role: "img", "aria-label": priorityOf(priority).label }
        : { "aria-hidden": true })}
      className={cn(
        "size-4 shrink-0 text-muted-foreground",
        priority === "urgent" && "text-destructive",
        className
      )}
    />
  )
}

export { PriorityIcon, StatusIcon }
