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
    <div uiAccordion hiddenUntilFound>
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
  `,
})
class Example {
  readonly items = [
    {
      value: "fruit",
      label: "Which fruit do you stock?",
      content: "Apples, pears, mangoes and, in summer, pineapple.",
    },
    {
      value: "organic",
      label: "Is it organic?",
      content: "Everything we stock is certified organic.",
    },
    {
      value: "delivery",
      label: "When do you deliver?",
      content: "Every weekday morning before 10.",
    },
  ]
}

export { Example }
