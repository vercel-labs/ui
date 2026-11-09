import { dynamicComponent } from "@solidjs/web"
import { cn } from "cn"
import { priorityOf, statusOf, type Priority, type Status } from "tracker-data"
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
} from "@/components/icons"

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

function StatusIcon(props: {
  status: Status
  label?: boolean
  class?: string
}) {
  const Icon = dynamicComponent(() => statusIcons[props.status])
  return (
    <Icon
      role={props.label ? "img" : undefined}
      aria-label={props.label ? statusOf(props.status).label : undefined}
      aria-hidden={props.label ? undefined : "true"}
      class={cn(
        "size-4 shrink-0 text-muted-foreground",
        props.status === "in-progress" && "text-amber-500",
        props.status === "done" && "text-emerald-600 dark:text-emerald-400",
        props.class
      )}
    />
  )
}

function PriorityIcon(props: {
  priority: Priority
  label?: boolean
  class?: string
}) {
  const Icon = dynamicComponent(() => priorityIcons[props.priority])
  return (
    <Icon
      role={props.label ? "img" : undefined}
      aria-label={props.label ? priorityOf(props.priority).label : undefined}
      aria-hidden={props.label ? undefined : "true"}
      class={cn(
        "size-4 shrink-0 text-muted-foreground",
        props.priority === "urgent" && "text-destructive",
        props.class
      )}
    />
  )
}

export { PriorityIcon, StatusIcon }
