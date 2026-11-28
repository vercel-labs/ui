import { Component } from "@angular/core"
import { Toggle, ToggleGroup } from "@ui-sdk/angular/toggle"

@Component({
  imports: [Toggle, ToggleGroup],
  template: `
    <div dir="rtl">
      <div uiToggleGroup [defaultValue]="['list']" aria-label="العرض">
        @for (item of views; track item.value) {
          <button uiToggle [value]="item.value">
            {{ item.label }}
          </button>
        }
      </div>
    </div>
  `,
})
class Example {
  readonly views = [
    { value: "list", label: "قائمة" },
    { value: "grid", label: "شبكة" },
    { value: "cards", label: "بطاقات" },
  ]
}

export { Example }
