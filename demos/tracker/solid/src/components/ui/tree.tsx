import {
  TreeGroup as TreeGroupPrimitive,
  TreeItemCheckbox,
  TreeItemLabel as TreeItemLabelPrimitive,
  TreeItem as TreeItemPrimitive,
} from "@ui-sdk/solid/tree"
import { cn } from "cn"
import { children, omit, Show, type ComponentProps } from "solid-js"
import type { JSX } from "@solidjs/web"

function TreeItem(props: {
  value: string
  label: JSX.Element
  class?: string
  children?: JSX.Element
}) {
  const nested = children(() => props.children)
  return (
    <TreeItemPrimitive
      value={props.value}
      class={cn("flex flex-wrap items-center outline-none", props.class)}
    >
      <TreeItemCheckbox class="relative ms-2 flex size-4 shrink-0 cursor-default items-center justify-center rounded-[5px] bg-input/90 after:text-[10px] after:leading-none after:text-primary-foreground data-checked:bg-primary data-checked:after:content-['✓'] data-indeterminate:bg-primary data-indeterminate:after:content-['–']" />
      <TreeItemLabelPrimitive class="flex h-7 min-w-0 flex-1 cursor-default items-center rounded-xl px-2 text-sm select-none hover:bg-muted [[data-checked]>&]:text-muted-foreground [[data-checked]>&]:line-through [:focus-visible>&]:ring-3 [:focus-visible>&]:ring-ring/30 [:focus-visible>&]:ring-inset">
        {props.label}
      </TreeItemLabelPrimitive>
      <Show when={nested.toArray().length > 0}>
        <TreeGroup>{nested()}</TreeGroup>
      </Show>
    </TreeItemPrimitive>
  )
}

function TreeGroup(
  props: Omit<ComponentProps<typeof TreeGroupPrimitive>, "class"> & {
    class?: string
  }
) {
  const rest = omit(props, "class")
  return (
    <TreeGroupPrimitive
      class={cn(
        "h-(--tree-group-height) basis-full overflow-hidden ps-6 transition-[height] duration-200 ease-out data-starting-style:h-0 data-ending-style:h-0 motion-reduce:transition-none",
        props.class
      )}
      {...rest}
    />
  )
}

export { TreeItem }
export { Tree } from "@ui-sdk/solid/tree"
