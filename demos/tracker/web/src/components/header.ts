import { cn } from "cn"
import { html } from "lit-html"
import { viewer } from "tracker-data"
import { commandPalette } from "../components/command-palette"
import { newIssueDialog } from "../components/new-issue-dialog"
import { icon } from "../lib/icons"
import { avatar, button, styles } from "../lib/ui"

function header() {
  return html`<header
    class="flex h-12 shrink-0 items-center gap-2 border-b border-border px-3"
  >
    <ui-menu>
      <ui-menu-trigger>
        <button class=${button({ variant: "ghost", size: "sm" })}>
          <span
            aria-hidden="true"
            class="flex size-5 items-center justify-center rounded-md bg-primary text-[10px] font-semibold text-primary-foreground"
          >
            A
          </span>
          Acme ${icon("chevron-down", "size-4 text-muted-foreground")}
        </button>
      </ui-menu-trigger>
      <ui-menu-content
        align="start"
        side-offset="6"
        class=${cn(styles.menu, "w-56")}
      >
        <ui-menu-group>
          <ui-menu-group-label
            class=${cn(styles.menuGroupLabel, "flex items-center gap-2")}
          >
            ${avatar(viewer.name, { size: "sm", decorative: true })}
            ${viewer.name}
          </ui-menu-group-label>
          <ui-menu-item as-child>
            <a href="/" class=${styles.menuItem}>
              <ui-menu-item-icon class=${styles.menuItemIcon}
                >${icon("list-todo")}</ui-menu-item-icon
              >
              Issues
            </a>
          </ui-menu-item>
          <ui-menu-item as-child>
            <a href="/settings" class=${styles.menuItem}>
              <ui-menu-item-icon class=${styles.menuItemIcon}
                >${icon("settings")}</ui-menu-item-icon
              >
              Settings
            </a>
          </ui-menu-item>
        </ui-menu-group>
        <ui-menu-separator class=${styles.menuSeparator}></ui-menu-separator>
        <ui-menu-item disabled class=${styles.menuItem}>Sign out</ui-menu-item>
      </ui-menu-content>
    </ui-menu>
    <div class="ms-auto flex items-center gap-2">
      ${commandPalette()} ${newIssueDialog()}
    </div>
  </header>`
}

export { header }
