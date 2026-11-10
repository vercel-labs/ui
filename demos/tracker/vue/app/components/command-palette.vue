<script setup lang="ts">
import { CircleDot, Columns3, List, Plus, Search, Settings } from "@lucide/vue"
import { cn } from "cn"
import { href, parseQuery } from "tracker-data"
import { buttonVariants } from "~/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandGroupLabel,
  CommandInput,
  CommandItem,
  CommandItemIcon,
  CommandList,
} from "~/components/ui/command"
import {
  Dialog,
  DialogBackdrop,
  DialogContent,
  DialogShortcut,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"

const tracker = useTracker()
const issues = useIssues()
const route = useRoute()
const query = computed(() => parseQuery(route.query))
const open = ref(false)

function run(value: string) {
  open.value = false
  if (value === "new-issue") {
    tracker.newIssue.open()
  } else if (value === "settings") {
    navigateTo("/settings")
  } else if (value === "list" || value === "board") {
    navigateTo(href(query.value, { view: value, page: 1 }))
  } else {
    navigateTo(href(query.value, { issue: value }))
  }
}
</script>

<template>
  <Dialog v-model:open="open">
    <DialogTrigger
      shortcut="mod+k"
      :class="
        cn(
          buttonVariants({ variant: 'outline' }),
          'w-48 justify-between font-normal text-muted-foreground max-sm:w-8 max-sm:px-0'
        )
      "
    >
      <Search aria-hidden="true" class="sm:hidden" />
      <span class="max-sm:sr-only">Search…</span>
      <DialogShortcut
        class="inline-flex h-5 items-center rounded-lg bg-muted px-1 text-xs font-medium max-sm:hidden"
      />
    </DialogTrigger>
    <DialogBackdrop />
    <DialogContent
      class="top-[min(6rem,10dvh)] translate-y-0 gap-0 overflow-hidden p-0 sm:max-w-lg"
    >
      <DialogTitle class="sr-only">Search</DialogTitle>
      <Command @action="run">
        <CommandInput
          aria-label="Search issues and commands"
          placeholder="Search issues or type a command…"
        />
        <CommandEmpty>No results.</CommandEmpty>
        <CommandList>
          <CommandGroup>
            <CommandGroupLabel>Commands</CommandGroupLabel>
            <CommandItem value="new-issue">
              <CommandItemIcon><Plus /></CommandItemIcon>
              New issue
            </CommandItem>
            <CommandItem value="list">
              <CommandItemIcon><List /></CommandItemIcon>
              Show as list
            </CommandItem>
            <CommandItem value="board">
              <CommandItemIcon><Columns3 /></CommandItemIcon>
              Show as board
            </CommandItem>
            <CommandItem value="settings">
              <CommandItemIcon><Settings /></CommandItemIcon>
              Settings
            </CommandItem>
          </CommandGroup>
          <CommandGroup>
            <CommandGroupLabel>Issues</CommandGroupLabel>
            <CommandItem
              v-for="issue in issues"
              :key="issue.id"
              :value="issue.id"
              :label="issue.title"
              :keywords="[issue.id]"
            >
              <CommandItemIcon><CircleDot /></CommandItemIcon>
              <span class="truncate">{{ issue.title }}</span>
              <span class="ms-auto text-xs text-muted-foreground">{{
                issue.id
              }}</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </DialogContent>
  </Dialog>
</template>
