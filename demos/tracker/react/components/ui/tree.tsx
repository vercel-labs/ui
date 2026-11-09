"use client"

import {
  TreeGroup as TreeGroupPrimitive,
  TreeItemCheckbox,
  TreeItemLabel as TreeItemLabelPrimitive,
  TreeItem as TreeItemPrimitive,
} from "@ui-sdk/react/tree"
import { cn } from "cn"
import type { ComponentProps, ReactNode } from "react"

function TreeItem({
  value,
  label,
  className,
  children,
}: {
  value: string
  label: ReactNode
  className?: string
  children?: ReactNode
}) {
  return (
    <TreeItemPrimitive
      value={value}
      className={cn("flex flex-wrap items-center outline-none", className)}
    >
      <TreeItemCheckbox className="relative ms-2 flex size-4 shrink-0 cursor-default items-center justify-center rounded-[5px] bg-input/90 after:text-[10px] after:leading-none after:text-primary-foreground data-checked:bg-primary data-checked:after:content-['✓'] data-indeterminate:bg-primary data-indeterminate:after:content-['–']" />
      <TreeItemLabelPrimitive className="flex h-7 min-w-0 flex-1 cursor-default items-center rounded-xl px-2 text-sm select-none hover:bg-muted [[data-checked]>&]:text-muted-foreground [[data-checked]>&]:line-through [:focus-visible>&]:ring-3 [:focus-visible>&]:ring-ring/30 [:focus-visible>&]:ring-inset">
        {label}
      </TreeItemLabelPrimitive>
      {children && <TreeGroup>{children}</TreeGroup>}
    </TreeItemPrimitive>
  )
}

function TreeGroup({
  className,
  ...props
}: Omit<ComponentProps<typeof TreeGroupPrimitive>, "className"> & {
  className?: string
}) {
  return (
    <TreeGroupPrimitive
      className={cn(
        "h-(--tree-group-height) basis-full overflow-hidden ps-6 transition-[height] duration-200 ease-out data-starting-style:h-0 data-ending-style:h-0 motion-reduce:transition-none",
        className
      )}
      {...props}
    />
  )
}

export { TreeItem }
export { Tree } from "@ui-sdk/react/tree"
