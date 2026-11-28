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
    <div uiAccordion [collapsible]="false" [defaultValue]="['overview']">
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
      value: "overview",
      label: "Overview",
      content: "A summary of the project, its goals and its owners.",
    },
    {
      value: "timeline",
      label: "Timeline",
      content: "Kickoff in March, beta in June and launch in September.",
    },
    {
      value: "budget",
      label: "Budget",
      content: "Approved for two engineers and one designer for six months.",
    },
  ]
}

export { Example }
