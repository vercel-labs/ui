import { Component } from "@angular/core"
import {
  LucideCreditCard,
  LucideDynamicIcon,
  LucideSettings,
  LucideUser,
} from "@lucide/angular"
import { useLog } from "../../../shared/angular/log"
import {
  Command,
  CommandGroup,
  CommandGroupLabel,
  CommandInput,
  CommandItem,
  CommandItemIcon,
  CommandList,
  CommandShortcut,
} from "@ui-sdk/angular/command"

@Component({
  imports: [
    Command,
    CommandGroup,
    CommandGroupLabel,
    CommandInput,
    CommandItem,
    CommandItemIcon,
    CommandList,
    CommandShortcut,
    LucideDynamicIcon,
  ],
  template: `
    <div data-slot="stack">
      <div uiCommand (action)="log('Ran ' + $event.value)">
        <input
          uiCommandInput
          aria-label="Search settings"
          placeholder="Search settings…"
        />
        <div uiCommandList>
          <div uiCommandGroup>
            <div uiCommandGroupLabel>Settings</div>
            @for (item of settings; track item.value) {
              <div
                uiCommandItem
                [value]="item.value"
                [shortcut]="item.shortcut"
              >
                <span uiCommandItemIcon>
                  <svg [lucideIcon]="item.icon"></svg>
                </span>
                <span>{{ item.label }}</span>
                <span uiCommandShortcut #commandShortcut="uiCommandShortcut">{{
                  commandShortcut.state().text
                }}</span>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
})
class Example {
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

  readonly log = useLog()
}

export { Example }
