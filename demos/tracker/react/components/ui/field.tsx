"use client"

import {
  FieldControl as FieldControlPrimitive,
  FieldDescription as FieldDescriptionPrimitive,
  FieldError as FieldErrorPrimitive,
  FieldLabel as FieldLabelPrimitive,
  Field as FieldPrimitive,
} from "@ui-sdk/react/field"
import { cn } from "cn"
import type { ComponentProps } from "react"

const control =
  "h-8 w-full min-w-0 rounded-2xl border border-transparent bg-input/50 px-2.5 text-base outline-none transition-[color,box-shadow] duration-200 placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 disabled:opacity-50 data-invalid:border-destructive/50 data-invalid:ring-3 data-invalid:ring-destructive/15 motion-reduce:transition-none md:text-sm"

function Field({
  className,
  ...props
}: Omit<ComponentProps<typeof FieldPrimitive>, "className"> & {
  className?: string
}) {
  return (
    <FieldPrimitive
      className={cn("flex min-w-0 flex-col gap-2", className)}
      {...props}
    />
  )
}

function FieldLabel({
  className,
  ...props
}: Omit<ComponentProps<typeof FieldLabelPrimitive>, "className"> & {
  className?: string
}) {
  return (
    <FieldLabelPrimitive
      className={cn(
        "text-sm leading-none font-medium data-disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

function FieldControl({
  className,
  ...props
}: Omit<ComponentProps<typeof FieldControlPrimitive>, "className"> & {
  className?: string
}) {
  return <FieldControlPrimitive className={cn(control, className)} {...props} />
}

function FieldDescription({
  className,
  ...props
}: Omit<ComponentProps<typeof FieldDescriptionPrimitive>, "className"> & {
  className?: string
}) {
  return (
    <FieldDescriptionPrimitive
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

function FieldError({
  className,
  ...props
}: Omit<ComponentProps<typeof FieldErrorPrimitive>, "className"> & {
  className?: string
}) {
  return (
    <FieldErrorPrimitive
      className={cn("text-sm text-destructive", className)}
      {...props}
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
