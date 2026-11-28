import { Component } from "@angular/core"
import { Listbox, ListboxItem } from "@ui-sdk/angular/listbox"

@Component({
  imports: [Listbox, ListboxItem],
  template: `
    <div dir="rtl">
      <div
        uiListbox
        orientation="horizontal"
        defaultValue="day"
        aria-label="תצוגה"
      >
        @for (view of views; track view.value) {
          <div uiListboxItem [value]="view.value">
            {{ view.label }}
          </div>
        }
      </div>
    </div>
  `,
})
class Example {
  readonly views = [
    { value: "day", label: "יום" },
    { value: "week", label: "שבוע" },
    { value: "month", label: "חודש" },
  ]
}

export { Example }
