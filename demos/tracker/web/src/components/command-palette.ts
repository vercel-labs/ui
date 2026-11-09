import { createDialogController } from "@ui-sdk/core/dialog"
import { cn } from "cn"
import { html } from "lit-html"
import { repeat } from "lit-html/directives/repeat.js"
import { href } from "tracker-data"
import { newIssue } from "../components/new-issue-dialog"
import { icon, type IconName } from "../lib/icons"
import { navigate, query } from "../lib/router"
import { db } from "../lib/tracker"
import { button, styles } from "../lib/ui"

const palette = createDialogController()

const commands: { value: string; label: string; icon: IconName }[] = [
  { value: "new-issue", label: "New issue", icon: "plus" },
  { value: "list", label: "Show as list", icon: "list" },
  { value: "board", label: "Show as board", icon: "columns" },
  { value: "settings", label: "Settings", icon: "settings" },
]

const item =
  "group flex min-h-8 cursor-default items-center gap-2 rounded-xl px-2 py-1.5 text-sm outline-none select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50"
const itemIcon =
  "flex text-muted-foreground group-data-highlighted:text-current [&_svg]:size-4"
const groupLabel =
  "block px-2 pt-2 pb-1 text-xs font-medium text-muted-foreground"

function run(value: string) {
  palette.close()
  if (value === "new-issue") {
    newIssue.open()
  } else if (value === "settings") {
    navigate("/settings")
  } else if (value === "list" || value === "board") {
    navigate(href(query(), { view: value, page: 1 }))
  } else {
    navigate(href(query(), { issue: value }))
  }
}

function commandPalette() {
  return html`<ui-dialog .controller=${palette}>
    <ui-dialog-trigger shortcut="mod+k">
      <button
        class=${cn(
          button({ variant: "outline" }),
          "w-48 justify-between font-normal text-muted-foreground max-sm:w-8 max-sm:px-0"
        )}
      >
        ${icon("search", "size-4 sm:hidden")}
        <span class="max-sm:sr-only">Search…</span>
        <ui-dialog-shortcut
          class="inline-flex h-5 items-center rounded-lg bg-muted px-1 text-xs font-medium max-sm:hidden"
        ></ui-dialog-shortcut>
      </button>
    </ui-dialog-trigger>
    <ui-dialog-backdrop hidden class=${styles.backdrop}></ui-dialog-backdrop>
    <ui-dialog-content
      hidden
      class=${cn(styles.dialog, "top-[min(6rem,10dvh)] translate-y-0 gap-0 overflow-hidden p-0 sm:max-w-lg")}
    >
      <ui-dialog-title class="sr-only">Search</ui-dialog-title>
      <ui-command
        @action=${(event: CustomEvent<{ value: string }>) => run(event.detail.value)}
      >
        <div class="flex items-center gap-2 border-b border-border px-4">
          ${icon("search", "size-4 shrink-0 text-muted-foreground")}
          <ui-command-input class="contents">
            <input
              aria-label="Search issues and commands"
              placeholder="Search issues or type a command…"
              class="h-12 w-full min-w-0 bg-transparent text-base outline-none placeholder:text-muted-foreground md:text-sm"
            />
          </ui-command-input>
        </div>
        <ui-command-empty
          class="block py-10 text-center text-sm text-muted-foreground empty:hidden"
        >
          No results.
        </ui-command-empty>
        <ui-command-list
          class="block max-h-80 min-h-0 scroll-py-1 overflow-y-auto overscroll-contain p-1"
        >
          <ui-command-group>
            <ui-command-group-label class=${groupLabel}
              >Commands</ui-command-group-label
            >
            ${commands.map(
              (command) =>
                html`<ui-command-item value=${command.value} class=${item}>
                  <ui-command-item-icon class=${itemIcon}
                    >${icon(command.icon)}</ui-command-item-icon
                  >
                  ${command.label}
                </ui-command-item>`
            )}
          </ui-command-group>
          <ui-command-group>
            <ui-command-group-label class=${groupLabel}
              >Issues</ui-command-group-label
            >
            ${repeat(
              db.issues,
              (issue) => issue.id,
              (issue) =>
                html`<ui-command-item
                  value=${issue.id}
                  label=${issue.title}
                  .keywords=${[issue.id]}
                  class=${item}
                >
                  <ui-command-item-icon class=${itemIcon}
                    >${icon("circle-dot")}</ui-command-item-icon
                  >
                  <span class="truncate">${issue.title}</span>
                  <span class="ms-auto text-xs text-muted-foreground"
                    >${issue.id}</span
                  >
                </ui-command-item>`
            )}
          </ui-command-group>
        </ui-command-list>
      </ui-command>
    </ui-dialog-content>
  </ui-dialog>`
}

export { commandPalette }
