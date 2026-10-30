<script setup lang="ts">
import { ChevronDown, ListTodo, Settings } from "@lucide/vue"
import { viewer } from "tracker-data"
import CommandPalette from "~/components/command-palette.vue"
import NewIssueDialog from "~/components/new-issue-dialog.vue"
import { Avatar } from "~/components/ui/avatar"
import { buttonVariants } from "~/components/ui/button"
import {
  Menu,
  MenuContent,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuItemIcon,
  MenuSeparator,
  MenuTrigger,
} from "~/components/ui/menu"
</script>

<template>
  <header class="flex h-12 shrink-0 items-center gap-2 border-b border-border px-3">
    <Menu>
      <MenuTrigger :class="buttonVariants({ variant: 'ghost', size: 'sm' })">
        <span
          aria-hidden="true"
          class="flex size-5 items-center justify-center rounded-md bg-primary text-[10px] font-semibold text-primary-foreground"
        >
          A
        </span>
        Acme
        <ChevronDown aria-hidden="true" class="text-muted-foreground" />
      </MenuTrigger>
      <MenuContent align="start" class="w-56">
        <MenuGroup>
          <MenuGroupLabel class="flex items-center gap-2">
            <Avatar :name="viewer.name" size="sm" decorative />
            {{ viewer.name }}
          </MenuGroupLabel>
          <MenuItem>
            <template #render="{ props }">
              <NuxtLink v-bind="props" to="/">
                <MenuItemIcon><ListTodo /></MenuItemIcon>
                Issues
              </NuxtLink>
            </template>
          </MenuItem>
          <MenuItem>
            <template #render="{ props }">
              <NuxtLink v-bind="props" to="/settings">
                <MenuItemIcon><Settings /></MenuItemIcon>
                Settings
              </NuxtLink>
            </template>
          </MenuItem>
        </MenuGroup>
        <MenuSeparator />
        <MenuItem disabled>Sign out</MenuItem>
      </MenuContent>
    </Menu>
    <div class="ms-auto flex items-center gap-2">
      <CommandPalette />
      <NewIssueDialog />
    </div>
  </header>
</template>
