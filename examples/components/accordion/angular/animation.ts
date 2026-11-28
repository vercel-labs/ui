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
    <div uiAccordion [defaultValue]="['one']">
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
      value: "one",
      label: "Why animate the height?",
      content: "So the content below slides instead of jumping.",
    },
    {
      value: "two",
      label: "Where does the height come from?",
      content:
        "The panel measures itself and writes the result to a CSS variable while it animates.",
    },
    {
      value: "three",
      label: "Does it animate on first paint?",
      content: "No. Panels open on the server or on mount show at once.",
    },
  ]
}

export { Example }
