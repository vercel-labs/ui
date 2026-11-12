<script lang="ts">
  import { Columns3, List, SlidersHorizontal } from "@lucide/svelte"
  import { goto } from "$app/navigation"
  import IssueFilters from "#lib/components/issue-filters.svelte"
  import { buttonVariants } from "#ui/button"
  import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerTitle,
    DrawerTrigger,
  } from "#ui/drawer"
  import { Toggle, ToggleGroup } from "#ui/toggle"
  import { Tooltip, TooltipContent, TooltipTrigger } from "#ui/tooltip"
  import { cn } from "cn"
  import { href, type Query } from "tracker-data"

  interface Props {
    query: Query
  }

  let { query }: Props = $props()

  const filtered = $derived(Boolean(query.priority || query.assignee))

  function change(patch: Partial<Query>) {
    goto(href(query, patch), { reset: false })
  }
</script>

<div class="ms-auto flex items-center gap-2">
  <div class="max-md:hidden">
    <IssueFilters {query} onChange={change} />
  </div>
  <Drawer>
    <DrawerTrigger
      class={cn(
        buttonVariants({ variant: filtered ? "secondary" : "ghost" }),
        "md:hidden"
      )}
    >
      <SlidersHorizontal aria-hidden="true" />
      Filters
    </DrawerTrigger>
    <DrawerContent>
      <div class="grid gap-5 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <DrawerTitle>Filters</DrawerTitle>
        <IssueFilters {query} onChange={change} stacked />
        <DrawerClose class={buttonVariants({ variant: "primary" })}
          >Done</DrawerClose
        >
      </div>
    </DrawerContent>
  </Drawer>
  <ToggleGroup
    aria-label="Layout"
    value={[query.view]}
    onValueChange={([view]) =>
      view && change({ view: view as Query["view"], page: 1 })}
  >
    <Tooltip>
      <TooltipTrigger>
        {#snippet render({ props })}
          <Toggle {...props} value="list" aria-label="List"
            ><List aria-hidden="true" /></Toggle
          >
        {/snippet}
      </TooltipTrigger>
      <TooltipContent>List</TooltipContent>
    </Tooltip>
    <Tooltip>
      <TooltipTrigger>
        {#snippet render({ props })}
          <Toggle {...props} value="board" aria-label="Board"
            ><Columns3 aria-hidden="true" /></Toggle
          >
        {/snippet}
      </TooltipTrigger>
      <TooltipContent>Board</TooltipContent>
    </Tooltip>
  </ToggleGroup>
</div>
