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
  CommandGroup,
  CommandGroupLabel,
  CommandInput,
  CommandItem,
  CommandItemIcon,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@ui-sdk/angular/command"

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
    CommandSeparator,
    CommandShortcut,
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
          placeholder="Type a command or search…"
        />
      </div>
      <div uiCommandEmpty>No results found.</div>
      <div uiCommandList>
        <div uiCommandGroup>
          <div uiCommandGroupLabel>Suggestions</div>
          @for (item of suggestions; track item.value) {
            <div uiCommandItem [value]="item.value" [disabled]="item.disabled">
              <span uiCommandItemIcon>
                <svg [lucideIcon]="item.icon"></svg>
              </span>
              <span>{{ item.label }}</span>
            </div>
          }
        </div>
        <div uiCommandSeparator></div>
        <div uiCommandGroup>
          <div uiCommandGroupLabel>Settings</div>
          @for (item of settings; track item.value) {
            <div uiCommandItem [value]="item.value" [shortcut]="item.shortcut">
              <span uiCommandItemIcon>
                <svg [lucideIcon]="item.icon"></svg>
              </span>
              <span>{{ item.label }}</span>
              <span uiCommandShortcut></span>
            </div>
          }
        </div>
      </div>
    </div>
  `,
})
class Example {
  readonly suggestions = [
    { value: "calendar", label: "Calendar", icon: LucideCalendar },
    { value: "emoji", label: "Search Emoji", icon: LucideSmile },
    {
      value: "calculator",
      label: "Calculator",
      icon: LucideCalculator,
      disabled: true,
    },
  ]

  readonly settings = [
    { value: "profile", label: "Profile", icon: LucideUser, shortcut: "mod+p" },
    {
      value: "billing",
      label: "Billing",
      icon: LucideCreditCard,
      shortcut: "mod+b",
    },
    {
      value: "settings",
      label: "Settings",
      icon: LucideSettings,
      shortcut: "mod+s",
    },
  ]
}

export { Example }
