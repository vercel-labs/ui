import { Component } from "@angular/core"
import { LucideChevronDown } from "@lucide/angular"
import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
} from "@ui-sdk/angular/accordion"

@Component({
  imports: [
    Accordion,
    AccordionHeader,
    AccordionItem,
    AccordionPanel,
    AccordionTrigger,
    LucideChevronDown,
  ],
  template: `
    <div dir="rtl">
      <div uiAccordion [defaultValue]="['shipping']">
        @for (item of items; track item.value) {
          <div uiAccordionItem [value]="item.value">
            <h3 uiAccordionHeader>
              <button uiAccordionTrigger>
                {{ item.label }}
                <svg lucideChevronDown></svg>
              </button>
            </h3>
            <div uiAccordionPanel>
              {{ item.content }}
            </div>
          </div>
        }
      </div>
    </div>
  `,
})
class Example {
  readonly items = [
    {
      value: "shipping",
      label: "ما هي خيارات الشحن؟",
      content: "نقدم الشحن العادي والسريع والشحن في اليوم التالي.",
    },
    {
      value: "returns",
      label: "ما هي سياسة الإرجاع؟",
      content: "يمكنك إرجاع أي منتج غير مستخدم خلال ٣٠ يومًا.",
    },
    {
      value: "support",
      label: "كيف أتواصل مع الدعم؟",
      content: "راسلنا عبر البريد أو الدردشة، ونرد خلال ٢٤ ساعة.",
    },
  ]
}

export { Example }
