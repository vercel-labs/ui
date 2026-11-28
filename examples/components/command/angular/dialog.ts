import { Component, signal } from "@angular/core"
import {
  LucideCalculator,
  LucideCalendar,
  LucideCreditCard,
  LucideDynamicIcon,
  LucideSearch,
  LucideSettings,
  LucideSmile,
  LucideUser,
} from "@lucide/angular"
import { useLog } from "../../../shared/angular/log"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandGroupLabel,
  CommandInput,
  CommandItem,
  CommandItemIcon,
  CommandList,
} from "@ui-sdk/angular/command"
import {
  Dialog,
  DialogBackdrop,
  DialogContent,
  DialogShortcut,
  DialogTitle,
  DialogTrigger,
} from "@ui-sdk/angular/dialog"

@Component({
  imports: [
    Command,
    CommandEmpty,
    CommandGroup,
    CommandGroupLabel,
    CommandInput,
    CommandItem,
    CommandItemIcon,
    CommandList,
    Dialog,
    DialogBackdrop,
    DialogContent,
    DialogShortcut,
    DialogTitle,
    DialogTrigger,
    LucideDynamicIcon,
    LucideSearch,
  ],
  template: `
    <div data-slot="stack">
      <ng-container uiDialog [(open)]="open">
        <button uiDialogTrigger shortcut="mod+k">
          Search…
          <kbd uiDialogShortcut></kbd>
        </button>
        <div *uiDialogBackdrop></div>
        <div *uiDialogContent>
          <h2 uiDialogTitle>Command palette</h2>
          <div uiCommand (action)="onAction($event.value)">
            <div data-slot="row">
              <svg lucideSearch></svg>
              <input
                uiCommandInput
                aria-label="Search commands"
                placeholder="Type a command or search…"
              />
            </div>
            <div uiCommandEmpty>No results found.</div>
            <div uiCommandList>
              <div uiCommandGroup>
                <div uiCommandGroupLabel>Suggestions</div>
                @for (item of commands; track item.value) {
                  <div
                    uiCommandItem
                    [value]="item.value"
                    [disabled]="item.disabled"
                  >
                    <span uiCommandItemIcon>
                      <svg [lucideIcon]="item.icon"></svg>
                    </span>
                    {{ item.label }}
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      </ng-container>
    </div>
  `,
})
class Example {
  readonly commands = [
    { value: "calendar", label: "Calendar", icon: LucideCalendar },
    { value: "emoji", label: "Search Emoji", icon: LucideSmile },
    {
      value: "calculator",
      label: "Calculator",
      icon: LucideCalculator,
      disabled: true,
    },
    { value: "profile", label: "Profile", icon: LucideUser },
    { value: "billing", label: "Billing", icon: LucideCreditCard },
    { value: "settings", label: "Settings", icon: LucideSettings },
  ]

  readonly log = useLog()

  readonly open = signal(false)

  onAction(value: string) {
    this.log(`Ran ${value}`)
    this.open.set(false)
  }
}

export { Example }
