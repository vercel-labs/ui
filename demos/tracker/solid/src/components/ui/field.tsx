import {
  FieldControl as FieldControlPrimitive,
  FieldDescription as FieldDescriptionPrimitive,
  FieldError as FieldErrorPrimitive,
  FieldLabel as FieldLabelPrimitive,
  Field as FieldPrimitive,
} from "@ui-sdk/solid/field"
import { cn } from "cn"
import { omit, type ComponentProps } from "solid-js"

const control =
  "h-8 w-full min-w-0 rounded-2xl border border-transparent bg-input/50 px-2.5 text-base outline-none transition-[color,box-shadow] duration-200 placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 disabled:opacity-50 data-invalid:border-destructive/50 data-invalid:ring-3 data-invalid:ring-destructive/15 motion-reduce:transition-none md:text-sm"

function Field(
  props: Omit<ComponentProps<typeof FieldPrimitive>, "class"> & {
    class?: string
  }
) {
  const rest = omit(props, "class")
  return (
    <FieldPrimitive
      class={cn("flex min-w-0 flex-col gap-2", props.class)}
      {...rest}
    />
  )
}

function FieldLabel(
  props: Omit<ComponentProps<typeof FieldLabelPrimitive>, "class"> & {
    class?: string
  }
) {
  const rest = omit(props, "class")
  return (
    <FieldLabelPrimitive
      class={cn(
        "text-sm leading-none font-medium data-disabled:opacity-50",
        props.class
      )}
      {...rest}
    />
  )
}

function FieldControl(
  props: Omit<ComponentProps<typeof FieldControlPrimitive>, "class"> & {
    class?: string
  }
) {
  const rest = omit(props, "class")
  return <FieldControlPrimitive class={cn(control, props.class)} {...rest} />
}

function FieldDescription(
  props: Omit<ComponentProps<typeof FieldDescriptionPrimitive>, "class"> & {
    class?: string
  }
) {
  const rest = omit(props, "class")
  return (
    <FieldDescriptionPrimitive
      class={cn("text-sm text-muted-foreground", props.class)}
      {...rest}
    />
  )
}

function FieldError(
  props: Omit<ComponentProps<typeof FieldErrorPrimitive>, "class"> & {
    class?: string
  }
) {
  const rest = omit(props, "class")
  return (
    <FieldErrorPrimitive
      class={cn("text-sm text-destructive", props.class)}
      {...rest}
    />
  )
}

export {
  control,
  Field,
  FieldControl,
  FieldDescription,
  FieldError,
  FieldLabel,
}
