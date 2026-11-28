import { Component } from "@angular/core"
import { Field, FieldControl, FieldLabel } from "@ui-sdk/angular/field"
import {
  type TriggerMenuDataItem,
  TriggerMenu,
  TriggerMenuContent,
  TriggerMenuInput,
  TriggerMenuItem,
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
    TriggerMenuList,
  ],
  template: `
    <ng-container
      uiTriggerMenu
      [triggers]="[{ char: '@', items: people }]"
      [autoHighlight]="false"
      [loop]="false"
    >
      <div uiField>
        <label uiFieldLabel>Task</label>
        <input
          uiTriggerMenuInput
          uiFieldControl
          placeholder="Type @ to assign someone…"
        />
      </div>
      <div *uiTriggerMenuContent>
        <div uiTriggerMenuList #triggerMenuList="uiTriggerMenuList">
          @for (
            item of itemsOf(triggerMenuList.state().items);
            track item.value
          ) {
            <div uiTriggerMenuItem [value]="item.value" [label]="item.label">
              {{ item.label }}
            </div>
          }
        </div>
      </div>
    </ng-container>
  `,
})
class Example {
  readonly people = [
    { value: "hollis", label: "Hollis Grant" },
    { value: "ines", label: "Inès Moreau" },
    { value: "kofi", label: "Kofi Mensah" },
    { value: "wren", label: "Wren Takahashi" },
    { value: "tomasz", label: "Tomasz Wójcik" },
  ]

  itemsOf(items: unknown) {
    return items as TriggerMenuDataItem[]
  }
}

export { Example }
