import { Component } from "@angular/core"
import { useLog } from "../../../shared/angular/log"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandGroupLabel,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
  type CommandData,
  type CommandDataItem,
} from "@ui-sdk/angular/command"

type Entry =
  | { key: string; type: "separator" }
  | { key: string; type: "group"; label?: string; commands: CommandDataItem[] }
  | { key: string; type: "item"; command: CommandDataItem }

const commands: CommandData = [
  {
    type: "group",
    label: "Navigation",
    items: [
      { value: "home", label: "Go home", keywords: ["start"] },
      { value: "inbox", label: "Open inbox", shortcut: "mod+i" },
    ],
  },
  { type: "separator" },
  {
    type: "group",
    label: "Preferences",
    items: [
      {
        value: "theme",
        label: "Change theme…",
        items: [
          { value: "light", label: "Light" },
          { value: "dark", label: "Dark" },
          { value: "system", label: "System" },
        ],
      },
      {
        value: "language",
        label: "Change language…",
        items: ["English", "Français", "Deutsch", "日本語"],
      },
      { value: "sign-out", label: "Sign out", shortcut: "mod+shift+q" },
    ],
  },
]

function toCommand(entry: CommandDataItem | string) {
  return typeof entry === "string" ? { value: entry, label: entry } : entry
}

@Component({
  imports: [
    Command,
    CommandEmpty,
    CommandGroup,
    CommandGroupLabel,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
  ],
  template: `
    <div data-slot="stack">
      <div uiCommand [items]="commands" (action)="log('Ran ' + $event.value)">
        <input
          uiCommandInput
          aria-label="Search commands"
          placeholder="Type a command…"
        />
        <div uiCommandEmpty>No results found.</div>
        <div uiCommandList #list="uiCommandList">
          @for (entry of entries(list.state().items); track entry.key) {
            @switch (entry.type) {
              @case ("separator") {
                <div uiCommandSeparator></div>
              }
              @case ("group") {
                <div uiCommandGroup>
                  <div uiCommandGroupLabel>{{ entry.label }}</div>
                  @for (command of entry.commands; track command.value) {
                    <div
                      uiCommandItem
                      [value]="command.value"
                      [label]="command.label"
                      [disabled]="command.disabled"
                      [shortcut]="command.shortcut"
                    >
                      {{ command.label }}
                      @if (command.shortcut) {
                        <span uiCommandShortcut></span>
                      }
                    </div>
                  }
                </div>
              }
              @case ("item") {
                <div
                  uiCommandItem
                  [value]="entry.command.value"
                  [label]="entry.command.label"
                  [disabled]="entry.command.disabled"
                  [shortcut]="entry.command.shortcut"
                >
                  {{ entry.command.label }}
                  @if (entry.command.shortcut) {
                    <span uiCommandShortcut></span>
                  }
                </div>
              }
            }
          }
        </div>
      </div>
    </div>
  `,
})
class Example {
  readonly commands = commands

  readonly log = useLog()

  entries(items: unknown) {
    return (items as CommandData).map<Entry>((entry, index) => {
      if (typeof entry !== "string" && "type" in entry) {
        return entry.type === "separator"
          ? { key: `separator-${index}`, type: "separator" }
          : {
              key: `group-${index}`,
              type: "group",
              label: entry.label,
              commands: entry.items.map(toCommand),
            }
      }
      const command = toCommand(entry)
      return { key: command.value, type: "item", command }
    })
  }
}

export { Example }
