import { useNavigate } from "@solidjs/router"
import { cn } from "cn"
import { href, type Query } from "tracker-data"
import { Columns3, List, SlidersHorizontal } from "@/components/icons"
import { IssueFilters } from "@/components/issue-filters"
import { buttonVariants } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Toggle, ToggleGroup } from "@/components/ui/toggle"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

function IssueToolbar(props: { query: Query }) {
  const navigate = useNavigate()
  const filtered = () => Boolean(props.query.priority || props.query.assignee)

  function change(patch: Partial<Query>) {
    navigate(href(props.query, patch), { scroll: false })
  }

  return (
    <div class="ms-auto flex items-center gap-2">
      <div class="max-md:hidden">
        <IssueFilters query={props.query} onChange={change} />
      </div>
      <Drawer>
        <DrawerTrigger
          class={cn(
            buttonVariants({ variant: filtered() ? "secondary" : "ghost" }),
            "md:hidden"
          )}
        >
          <SlidersHorizontal aria-hidden="true" />
          Filters
        </DrawerTrigger>
        <DrawerContent>
          <div class="grid gap-5 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
            <DrawerTitle>Filters</DrawerTitle>
            <IssueFilters query={props.query} onChange={change} stacked />
            <DrawerClose class={buttonVariants({ variant: "primary" })}>
              Done
            </DrawerClose>
          </div>
        </DrawerContent>
      </Drawer>
      <ToggleGroup
        aria-label="Layout"
        value={[props.query.view]}
        onValueChange={([view]) =>
          view && change({ view: view as Query["view"], page: 1 })
        }
      >
        <Tooltip>
          <TooltipTrigger
            render={(attributes) => (
              <Toggle {...attributes} value="list" aria-label="List" />
            )}
          >
            <List aria-hidden="true" />
          </TooltipTrigger>
          <TooltipContent>List</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger
            render={(attributes) => (
              <Toggle {...attributes} value="board" aria-label="Board" />
            )}
          >
            <Columns3 aria-hidden="true" />
          </TooltipTrigger>
          <TooltipContent>Board</TooltipContent>
        </Tooltip>
      </ToggleGroup>
    </div>
  )
}

export { IssueToolbar }
