import { Component } from "@angular/core"
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
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandItemIcon,
  CommandItemText,
  CommandList,
} from "@ui-sdk/angular/command"

@Component({
  imports: [
    Command,
    CommandEmpty,
    CommandInput,
    CommandItem,
    CommandItemIcon,
    CommandItemText,
    CommandList,
    LucideDynamicIcon,
    LucideSearch,
  ],
  template: `
    <div uiCommand>
      <div data-slot="row">
        <svg lucideSearch></svg>
        <input
          uiCommandInput
          aria-label="Search commands"
          placeholder="Try “prf” or “emo”…"
        />
      </div>
      <div uiCommandEmpty>No results found.</div>
      <div uiCommandList>
        @for (item of commands; track item.value) {
          <div uiCommandItem [value]="item.value" [disabled]="item.disabled">
            <span uiCommandItemIcon>
              <svg [lucideIcon]="item.icon"></svg>
            </span>
            <span uiCommandItemText>{{ item.label }}</span>
          </div>
        }
      </div>
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
}

export { Example }
