import { Component } from "@angular/core"
import { LucideUsers } from "@lucide/angular"
import { Field, FieldControl, FieldLabel } from "@ui-sdk/angular/field"
import {
  type TriggerDefinition,
  TriggerMenu,
  TriggerMenuContent,
  TriggerMenuGroup,
  TriggerMenuGroupLabel,
  TriggerMenuInput,
  TriggerMenuItem,
  TriggerMenuItemIcon,
  TriggerMenuList,
  TriggerMenuSeparator,
} from "@ui-sdk/angular/trigger-menu"

@Component({
  imports: [
    Field,
    FieldControl,
    FieldLabel,
    TriggerMenu,
    TriggerMenuContent,
    TriggerMenuGroup,
    TriggerMenuGroupLabel,
    TriggerMenuInput,
    TriggerMenuItem,
    TriggerMenuItemIcon,
    TriggerMenuList,
    TriggerMenuSeparator,
    LucideUsers,
  ],
  template: `
    <ng-container uiTriggerMenu [triggers]="triggers">
      <div uiField>
        <label uiFieldLabel>Message</label>
        <textarea
          uiTriggerMenuInput
          uiFieldControl
          placeholder="Type @ and a first name…"
        ></textarea>
      </div>
      <div *uiTriggerMenuContent>
        <div uiTriggerMenuList>
          <div uiTriggerMenuGroup>
            <div uiTriggerMenuGroupLabel>People</div>
            @for (person of people; track person.value) {
              <div
                uiTriggerMenuItem
                [value]="person.value"
                [label]="person.label"
                [disabled]="person.disabled"
              >
                {{ person.label }}
                <span data-slot="hint">{{
                  person.disabled ? "Deactivated" : "@" + person.value
                }}</span>
              </div>
            }
          </div>
          <div uiTriggerMenuSeparator></div>
          <div
            uiTriggerMenuItem
            value="here"
            label="here"
            [keywords]="['everyone', 'channel']"
            (select)="$event.insert('@here ')"
          >
            <span uiTriggerMenuItemIcon>
              <svg lucideUsers></svg>
            </span>
            Notify everyone here
          </div>
        </div>
      </div>
    </ng-container>
  `,
})
class Example {
  readonly triggers: TriggerDefinition[] = [
    {
      char: "@",
      spaces: 2,
      maxLength: 30,
      pattern: /[\p{L}.'-]/u,
      filter: "startsWith",
      insert: (item) => `@${item.label.split(" ")[0]} `,
    },
  ]

  readonly people = [
    { value: "hollis", label: "Hollis Grant" },
    { value: "ines", label: "Inès Moreau" },
    { value: "kofi", label: "Kofi Mensah" },
    { value: "wren", label: "Wren Takahashi" },
    { value: "tomasz", label: "Tomasz Wójcik", disabled: true },
  ]
}

export { Example }
