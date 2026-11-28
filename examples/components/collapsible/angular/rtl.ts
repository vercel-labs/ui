import { Component } from "@angular/core"
import { LucideChevronDown } from "@lucide/angular"
import {
  Collapsible,
  CollapsiblePanel,
  CollapsibleTrigger,
} from "@ui-sdk/angular/collapsible"

@Component({
  imports: [
    Collapsible,
    CollapsiblePanel,
    CollapsibleTrigger,
    LucideChevronDown,
  ],
  template: `
    <div dir="rtl">
      <div uiCollapsible>
        <div data-slot="row">
          <div data-slot="stack">
            <p>الطلب #4189</p>
            <p data-slot="hint">تم الطلب في ٣ مارس</p>
          </div>
          <span data-slot="row"> تم الشحن </span>
        </div>
        <div>
          <button uiCollapsibleTrigger data-variant="ghost">
            تفاصيل الطلب
            <svg lucideChevronDown></svg>
          </button>
          <div uiCollapsiblePanel>
            <dl>
              @for (detail of details; track detail.label) {
                <div data-slot="row">
                  <dt>{{ detail.label }}</dt>
                  <dd>{{ detail.value }}</dd>
                </div>
              }
            </dl>
          </div>
        </div>
      </div>
    </div>
  `,
})
class Example {
  readonly details = [
    { label: "عنوان الشحن", value: "شارع الملك فهد، الرياض" },
    { label: "المنتجات", value: "قميص كتان × ٢" },
    { label: "التوصيل", value: "عادي، يصل في ٧ مارس" },
    { label: "الإجمالي", value: "٨٤٫٠٠ $" },
  ]
}

export { Example }
