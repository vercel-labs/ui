"use client"

import { cn } from "cn"
import { Columns3, List, SlidersHorizontal } from "lucide-react"
import { useRouter } from "next/navigation"
import { IssueFilters } from "@/components/issue-filters"
import { buttonVariants } from "@/components/ui/button"
import { Drawer, DrawerClose, DrawerContent, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { Toggle, ToggleGroup } from "@/components/ui/toggle"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { href, type Query } from "tracker-data"

function IssueToolbar({ query }: { query: Query }) {
  const router = useRouter()
  const filtered = Boolean(query.priority || query.assignee)

  function change(patch: Partial<Query>) {
    router.push(href(query, patch))
  }

  return (
    <div className="ms-auto flex items-center gap-2">
      <div className="max-md:hidden">
        <IssueFilters query={query} onChange={change} />
      </div>
      <Drawer>
        <DrawerTrigger
          className={cn(buttonVariants({ variant: filtered ? "secondary" : "ghost" }), "md:hidden")}
        >
          <SlidersHorizontal aria-hidden="true" />
          Filters
        </DrawerTrigger>
        <DrawerContent>
          <div className="grid gap-5 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
            <DrawerTitle>Filters</DrawerTitle>
            <IssueFilters query={query} onChange={change} stacked />
            <DrawerClose className={buttonVariants({ variant: "primary" })}>Done</DrawerClose>
          </div>
        </DrawerContent>
      </Drawer>
      <ToggleGroup
        aria-label="Layout"
        value={[query.view]}
        onValueChange={([view]) => view && change({ view: view as Query["view"], page: 1 })}
      >
        <Tooltip>
          <TooltipTrigger render={<Toggle value="list" aria-label="List" />}>
            <List aria-hidden="true" />
          </TooltipTrigger>
          <TooltipContent>List</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger render={<Toggle value="board" aria-label="Board" />}>
            <Columns3 aria-hidden="true" />
          </TooltipTrigger>
          <TooltipContent>Board</TooltipContent>
        </Tooltip>
      </ToggleGroup>
    </div>
  )
}

export { IssueToolbar }
