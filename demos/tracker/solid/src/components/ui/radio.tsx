import {
  Radio as RadioPrimitive,
  RadioGroup as RadioGroupPrimitive,
  RadioIndicator,
} from "@ui-sdk/solid/radio"
import { cn } from "cn"
import { omit, type ComponentProps } from "solid-js"

function RadioGroup(props: Omit<ComponentProps<typeof RadioGroupPrimitive>, "class"> & { class?: string }) {
  const rest = omit(props, "class")
  return <RadioGroupPrimitive class={cn("flex flex-col gap-3", props.class)} {...rest} />
}

function Radio(
  props: Omit<ComponentProps<typeof RadioPrimitive>, "class" | "children"> & { class?: string },
) {
  const rest = omit(props, "class")
  return (
    <RadioPrimitive
      class={cn(
        "relative flex size-4 shrink-0 cursor-default items-center justify-center rounded-full bg-input/90 outline-none transition-shadow after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:ring-3 focus-visible:ring-ring/30 data-checked:bg-primary data-disabled:opacity-50 motion-reduce:transition-none",
        props.class,
      )}
      {...rest}
    >
      <RadioIndicator class="size-1.5 rounded-full bg-primary-foreground" />
    </RadioPrimitive>
  )
}

export { Radio, RadioGroup }
