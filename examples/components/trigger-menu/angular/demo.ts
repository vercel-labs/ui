import { Component } from "@angular/core"
import { Field, FieldControl, FieldLabel } from "@ui-sdk/angular/field"
import {
  type TriggerMenuDataItem,
  TriggerMenu,
  TriggerMenuContent,
  TriggerMenuEmpty,
  TriggerMenuInput,
  TriggerMenuItem,
  TriggerMenuList,
  TriggerMenuStatus,
} from "@ui-sdk/angular/trigger-menu"

@Component({
  imports: [
    Field,
    FieldControl,
    FieldLabel,
    TriggerMenu,
    TriggerMenuContent,
    TriggerMenuEmpty,
    TriggerMenuInput,
    TriggerMenuItem,
    TriggerMenuList,
    TriggerMenuStatus,
  ],
  template: `
    <ng-container
      uiTriggerMenu
      [triggers]="[{ char: '@', type: 'mention', items: people }]"
    >
      <div uiField>
        <label uiFieldLabel>Message</label>
        <textarea
          uiTriggerMenuInput
          uiFieldControl
          placeholder="Type @ to mention someone…"
        ></textarea>
      </div>
      <div data-slot="visually-hidden">
        <div uiTriggerMenuStatus></div>
      </div>
      <div *uiTriggerMenuContent>
        <div uiTriggerMenuEmpty>No one found</div>
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
