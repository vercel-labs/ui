<script setup lang="ts">
import { Columns3, List, SlidersHorizontal } from "@lucide/vue"
import { cn } from "cn"
import { href, type Query, type View } from "tracker-data"
import IssueFilters from "~/components/issue-filters.vue"
import { buttonVariants } from "~/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "~/components/ui/drawer"
import { Toggle, ToggleGroup } from "~/components/ui/toggle"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip"

const props = defineProps<{ query: Query }>()

const filtered = computed(() =>
  Boolean(props.query.priority || props.query.assignee)
)

function change(patch: Partial<Query>) {
  navigateTo(href(props.query, patch))
}
</script>

<template>
  <div class="ms-auto flex items-center gap-2">
    <div class="max-md:hidden">
      <IssueFilters :query="query" @change="change" />
    </div>
    <Drawer>
      <DrawerTrigger
        :class="
          cn(
            buttonVariants({ variant: filtered ? 'secondary' : 'ghost' }),
            'md:hidden'
          )
        "
      >
        <SlidersHorizontal aria-hidden="true" />
        Filters
      </DrawerTrigger>
      <DrawerContent>
        <div class="grid gap-5 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <DrawerTitle>Filters</DrawerTitle>
          <IssueFilters :query="query" stacked @change="change" />
          <DrawerClose :class="buttonVariants({ variant: 'primary' })"
            >Done</DrawerClose
          >
        </div>
      </DrawerContent>
    </Drawer>
    <ToggleGroup
      aria-label="Layout"
      :value="[query.view]"
      @value-change="
        ([view]: string[]) => view && change({ view: view as View, page: 1 })
      "
    >
      <Tooltip>
        <TooltipTrigger>
          <template #render="{ props: trigger }">
            <Toggle v-bind="trigger" value="list" aria-label="List"
              ><List aria-hidden="true"
            /></Toggle>
          </template>
        </TooltipTrigger>
        <TooltipContent>List</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger>
          <template #render="{ props: trigger }">
            <Toggle v-bind="trigger" value="board" aria-label="Board"
              ><Columns3 aria-hidden="true"
            /></Toggle>
          </template>
        </TooltipTrigger>
        <TooltipContent>Board</TooltipContent>
      </Tooltip>
    </ToggleGroup>
  </div>
</template>
