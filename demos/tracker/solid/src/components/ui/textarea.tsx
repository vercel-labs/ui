import { Textarea as TextareaPrimitive } from "@ui-sdk/solid/textarea"
import { cn } from "cn"
import { omit, type ComponentProps } from "solid-js"
import { control } from "./field"

function Textarea(props: Omit<ComponentProps<typeof TextareaPrimitive>, "class"> & { class?: string }) {
  const rest = omit(props, "class")
  return <TextareaPrimitive class={cn(control, "h-auto min-h-20 resize-none py-2", props.class)} {...rest} />
}

export { Textarea }
