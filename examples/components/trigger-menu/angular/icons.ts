import { Component } from "@angular/core"
import {
  LucideClock,
  LucideDynamicIcon,
  LucideReply,
  LucideSearch,
  LucideShare,
  LucideTrash,
} from "@lucide/angular"
import { Field, FieldControl, FieldLabel } from "@ui-sdk/angular/field"
import {
  TriggerMenu,
  TriggerMenuContent,
  TriggerMenuInput,
  TriggerMenuItem,
  TriggerMenuItemIcon,
  TriggerMenuList,
} from "@ui-sdk/angular/trigger-menu"

@Component({
  imports: [
    Field,
    FieldControl,
    FieldLabel,
    TriggerMenu,
    TriggerMenuContent,
    TriggerMenuInput,
    TriggerMenuItem,
    TriggerMenuItemIcon,
    TriggerMenuList,
    LucideDynamicIcon,
  ],
  template: `
    <ng-container
      uiTriggerMenu
      [triggers]="[{ char: '/', boundary: 'start', type: 'command' }]"
    >
      <div uiField>
        <label uiFieldLabel>Message</label>
        <textarea
          uiTriggerMenuInput
          uiFieldControl
          placeholder="Type / for commands…"
        ></textarea>
      </div>
      <div *uiTriggerMenuContent>
        <div uiTriggerMenuList>
          @for (command of commands; track command.value) {
            <div uiTriggerMenuItem [value]="command.value">
              <span uiTriggerMenuItemIcon [mirror]="command.mirror">
                <svg [lucideIcon]="command.icon"></svg>
              </span>
              {{ command.value }}
            </div>
          }
        </div>
      </div>
    </ng-container>
  `,
})
class Example {
  readonly commands = [
    { value: "reply", icon: LucideReply, mirror: true },
    { value: "remind", icon: LucideClock },
    { value: "search", icon: LucideSearch },
    { value: "share", icon: LucideShare },
    { value: "clear", icon: LucideTrash },
  ]
}

export { Example }
