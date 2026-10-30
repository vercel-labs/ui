<script lang="ts">
  import { ChevronDown, ListTodo, Settings } from "@lucide/svelte"
  import CommandPalette from "#lib/components/command-palette.svelte"
  import NewIssueDialog from "#lib/components/new-issue-dialog.svelte"
  import { Avatar } from "#ui/avatar"
  import { buttonVariants } from "#ui/button"
  import {
    Menu,
    MenuContent,
    MenuGroup,
    MenuGroupLabel,
    MenuItem,
    MenuItemIcon,
    MenuSeparator,
    MenuTrigger,
  } from "#ui/menu"
  import { viewer } from "tracker-data"

  let { issues }: { issues: { id: string; title: string }[] } = $props()
</script>

<header class="flex h-12 shrink-0 items-center gap-2 border-b border-border px-3">
  <Menu>
    <MenuTrigger class={buttonVariants({ variant: "ghost", size: "sm" })}>
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
          <Avatar name={viewer.name} size="sm" decorative />
          {viewer.name}
        </MenuGroupLabel>
        <MenuItem>
          {#snippet render({ props })}
            <a {...props} href="/">
              <MenuItemIcon><ListTodo /></MenuItemIcon>
              Issues
            </a>
          {/snippet}
        </MenuItem>
        <MenuItem>
          {#snippet render({ props })}
            <a {...props} href="/settings">
              <MenuItemIcon><Settings /></MenuItemIcon>
              Settings
            </a>
          {/snippet}
        </MenuItem>
      </MenuGroup>
      <MenuSeparator />
      <MenuItem disabled>Sign out</MenuItem>
    </MenuContent>
  </Menu>
  <div class="ms-auto flex items-center gap-2">
    <CommandPalette {issues} />
    <NewIssueDialog />
  </div>
</header>
