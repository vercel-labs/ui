import { viewer } from "tracker-data"
import { CommandPalette } from "@/components/command-palette"
import { ChevronDown, ListTodo, Settings } from "@/components/icons"
import { NewIssueDialog } from "@/components/new-issue-dialog"
import { Avatar } from "@/components/ui/avatar"
import { buttonVariants } from "@/components/ui/button"
import {
  Menu,
  MenuContent,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuItemIcon,
  MenuSeparator,
  MenuTrigger,
} from "@/components/ui/menu"

function Header() {
  return (
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
            <MenuItem render={(props) => <a {...props} href="/" />}>
              <MenuItemIcon>
                <ListTodo />
              </MenuItemIcon>
              Issues
            </MenuItem>
            <MenuItem render={(props) => <a {...props} href="/settings" />}>
              <MenuItemIcon>
                <Settings />
              </MenuItemIcon>
              Settings
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
  )
}

export { Header }
