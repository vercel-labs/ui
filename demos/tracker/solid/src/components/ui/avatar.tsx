import { Avatar as AvatarPrimitive, AvatarFallback } from "@ui-sdk/solid/avatar"
import { cn } from "cn"

const sizes = {
  sm: "size-5 text-[10px]",
  default: "size-7 text-xs",
  lg: "size-10 text-sm",
}

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
}

function Avatar(props: { name: string; size?: keyof typeof sizes; decorative?: boolean; class?: string }) {
  return (
    <AvatarPrimitive
      aria-hidden={props.decorative ? "true" : undefined}
      class={cn(
        "relative flex shrink-0 rounded-full select-none",
        sizes[props.size ?? "default"],
        props.class,
      )}
    >
      <AvatarFallback class="flex size-full items-center justify-center rounded-full bg-muted font-medium text-muted-foreground">
        <span aria-hidden="true">{initials(props.name)}</span>
        {!props.decorative && <span class="sr-only">{props.name}</span>}
      </AvatarFallback>
    </AvatarPrimitive>
  )
}

export { Avatar }
