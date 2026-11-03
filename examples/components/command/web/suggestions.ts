import type { ListAnnouncement, CommandData } from "@ui-sdk/core/command"
import "@ui-sdk/web/command"
import { createElement, Search } from "lucide"

const commands: CommandData = [
  "Home",
  "Inbox",
  "Documents",
  "Downloads",
  "Pictures",
  "Music",
  "New file",
  "New folder",
  "Copy",
  "Cut",
  "Paste",
  "Delete",
  "Zoom in",
  "Zoom out",
  "Notifications",
  "Help",
  "Keyboard shortcuts",
  "Settings",
]

const suggested: CommandData = [
  { type: "group", label: "Suggested", items: ["New file", "Settings", "Help"] },
]

function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-command>
      <div data-slot="row">
          ${createElement(Search, { "aria-hidden": "true" }).outerHTML}
          <ui-command-input>
            <input aria-label="Search commands" placeholder="Search commands…" />
          </ui-command-input>
      </div>
      <ui-command-empty>No results found.</ui-command-empty>
      <ui-command-list></ui-command-list>
      <template>
        <ui-command-group>
          <ui-command-group-label></ui-command-group-label>
          <ui-command-item>
            <ui-command-item-text></ui-command-item-text>
          </ui-command-item>
        </ui-command-group>
      </template>
    </ui-command>
  `
  const command = root.querySelector("ui-command")!
  command.announcement = (change: ListAnnouncement) =>
    change.type === "results" ? `${change.count} commands` : null
  command.emptyItems = suggested
  command.items = commands
}

export { mount }
