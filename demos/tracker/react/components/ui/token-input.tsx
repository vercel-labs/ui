"use client"

import {
  TokenInputEditor as TokenInputEditorPrimitive,
  TokenInputToken as TokenInputTokenPrimitive,
} from "@ui-sdk/react/token-input"
import { cn } from "cn"
import type { ComponentProps } from "react"

function TokenInputEditor({
  className,
  ...props
}: Omit<ComponentProps<typeof TokenInputEditorPrimitive>, "className"> & {
  className?: string
}) {
  return (
    <TokenInputEditorPrimitive
      className={cn(
        "relative min-h-20 overflow-y-auto rounded-2xl border border-transparent bg-input/50 px-2.5 py-2 text-base outline-none transition-[color,box-shadow] duration-200 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 data-empty:before:pointer-events-none data-empty:before:absolute data-empty:before:text-muted-foreground data-empty:before:content-[attr(aria-placeholder)] motion-reduce:transition-none md:text-sm",
        className
      )}
      {...props}
    />
  )
}

function TokenInputToken({
  className,
  ...props
}: Omit<ComponentProps<typeof TokenInputTokenPrimitive>, "className"> & {
  className?: string
}) {
  return (
    <TokenInputTokenPrimitive
      className={cn(
        "inline-flex items-center rounded-2xl bg-input px-1.5 align-baseline font-medium data-selected:ring-3 data-selected:ring-ring/30 dark:bg-input/60",
        className
      )}
      {...props}
    />
  )
}

export { TokenInputEditor, TokenInputToken }
export {
  createTokenInputController,
  TokenInput,
} from "@ui-sdk/react/token-input"
