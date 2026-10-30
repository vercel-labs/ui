"use client"

import { ChevronDown, ListTodo, Settings } from "lucide-react"
import Link from "next/link"
import { CommandPalette } from "@/components/command-palette"
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
import { viewer } from "tracker-data"

function Header({ issues }: { issues: { id: string; title: string }[] }) {
  return (
    <header className="flex h-12 shrink-0 items-center gap-2 border-b border-border px-3">
      <Menu>
        <MenuTrigger className={buttonVariants({ variant: "ghost", size: "sm" })}>
          <span
            aria-hidden="true"
            className="flex size-5 items-center justify-center rounded-md bg-primary text-[10px] font-semibold text-primary-foreground"
          >
            A
          </span>
          Acme
          <ChevronDown aria-hidden="true" className="text-muted-foreground" />
        </MenuTrigger>
        <MenuContent align="start" className="w-56">
          <MenuGroup>
            <MenuGroupLabel className="flex items-center gap-2">
              <Avatar name={viewer.name} size="sm" decorative />
              {viewer.name}
            </MenuGroupLabel>
            <MenuItem render={<Link href="/" />}>
              <MenuItemIcon>
                <ListTodo />
              </MenuItemIcon>
              Issues
            </MenuItem>
            <MenuItem render={<Link href="/settings" />}>
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
      <div className="ms-auto flex items-center gap-2">
        <CommandPalette issues={issues} />
        <NewIssueDialog />
      </div>
    </header>
  )
}

export { Header }
