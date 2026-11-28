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
            @for (paragraph of item.content; track paragraph) {
              <p>{{ paragraph }}</p>
            }
          </div>
        </div>
      }
    </div>
  `,
})
class Example {
  readonly items = [
    {
      value: "shipping",
      label: "What are your shipping options?",
      content: [
        "We offer standard (5 to 7 days), express (2 to 3 days) and overnight shipping.",
        "Every order ships with tracking, and orders over $50 ship free.",
      ],
    },
    {
      value: "returns",
      label: "What is your return policy?",
      content: [
        "Return any unused item in its original packaging within 30 days. Refunds arrive within 5 to 7 business days.",
      ],
    },
    {
      value: "support",
      label: "How can I reach support?",
      content: [
        "Write to us by email or chat, or call us. We answer within 24 hours on business days.",
      ],
    },
  ]
}

export { Example }
