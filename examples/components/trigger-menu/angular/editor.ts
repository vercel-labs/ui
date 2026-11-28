import { Component, ElementRef, computed, viewChild } from "@angular/core"
import { Field, FieldControl, FieldLabel } from "@ui-sdk/angular/field"
import {
  type TriggerMenuDataItem,
  TriggerMenu,
  TriggerMenuContent,
  TriggerMenuItem,
  TriggerMenuList,
  textFieldAdapter,
} from "@ui-sdk/angular/trigger-menu"

@Component({
  imports: [
    Field,
    FieldControl,
    FieldLabel,
    TriggerMenu,
    TriggerMenuContent,
    TriggerMenuItem,
    TriggerMenuList,
  ],
  template: `
    <ng-container
      uiTriggerMenu
      [editor]="editor()"
      [triggers]="[{ char: '@', items: people }]"
    >
      <div uiField>
        <label uiFieldLabel>Notes</label>
        <textarea
          uiFieldControl
          #field
          placeholder="Type @ to mention someone…"
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

  readonly field = viewChild<ElementRef<HTMLTextAreaElement>>("field")

  readonly editor = computed(() => {
    const field = this.field()?.nativeElement
    return field ? textFieldAdapter(field) : undefined
  })

  itemsOf(items: unknown) {
    return items as TriggerMenuDataItem[]
  }
}

export { Example }
