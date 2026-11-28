import { Component } from "@angular/core"
import { useLog } from "../../../shared/angular/log"
import { Field, FieldControl, FieldLabel } from "@ui-sdk/angular/field"
import {
  type TriggerMenuDataItem,
  TriggerMenu,
  TriggerMenuContent,
  TriggerMenuInput,
  TriggerMenuItem,
  TriggerMenuList,
  createTriggerMenuController,
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
    <div data-slot="stack">
      <div data-slot="controls">
        <button
          type="button"
          (mousedown)="$event.preventDefault()"
          (click)="mention()"
        >
          Mention
        </button>
        <button
          type="button"
          (mousedown)="$event.preventDefault()"
          (click)="insertDate()"
        >
          Insert Date
        </button>
      </div>
      <ng-container
        uiTriggerMenu
        [controller]="menu"
        [triggers]="[{ char: '@', items: people }]"
      >
        <div uiField>
          <label uiFieldLabel>Message</label>
          <textarea
            uiTriggerMenuInput
            uiFieldControl
            placeholder="Write a message…"
          ></textarea>
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
    </div>
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

  readonly log = useLog()

  readonly menu = createTriggerMenuController()

  async mention() {
    const closed = await this.menu.open({ trigger: "@" })
    this.log(`Closed (${closed.reason})`)
  }

  insertDate() {
    this.menu.insert(
      new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
      })
    )
  }

  itemsOf(items: unknown) {
    return items as TriggerMenuDataItem[]
  }
}

export { Example }
