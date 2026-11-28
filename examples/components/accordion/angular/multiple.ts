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
    <div uiAccordion multiple [defaultValue]="['notifications']">
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
      value: "notifications",
      label: "Notification settings",
      content: "Choose what we email you about, and how often.",
    },
    {
      value: "privacy",
      label: "Privacy and security",
      content:
        "Turn on two-factor authentication and review signed-in devices.",
    },
    {
      value: "billing",
      label: "Billing and subscription",
      content: "Update your payment method and download past invoices.",
    },
  ]
}

export { Example }
