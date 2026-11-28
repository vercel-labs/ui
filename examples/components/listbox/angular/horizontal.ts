import { Component } from "@angular/core"
import { Listbox, ListboxItem } from "@ui-sdk/angular/listbox"

@Component({
  imports: [Listbox, ListboxItem],
  template: `
    <div
      uiListbox
      orientation="horizontal"
      [loop]="false"
      defaultValue="m"
      aria-label="Size"
    >
      @for (size of sizes; track size.value) {
        <div uiListboxItem [value]="size.value" [disabled]="size.disabled">
          {{ size.label }}
        </div>
      }
    </div>
  `,
})
class Example {
  readonly sizes = [
    { value: "xs", label: "XS" },
    { value: "s", label: "S" },
    { value: "m", label: "M" },
    { value: "l", label: "L" },
    { value: "xl", label: "XL", disabled: true },
  ]
}

export { Example }
