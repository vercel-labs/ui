import { Component, signal } from "@angular/core"
import { LucideChevronDown } from "@lucide/angular"
import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
} from "@ui-sdk/angular/accordion"
import { type ChangeDetails } from "@ui-sdk/core"
import { createAccordionController } from "@ui-sdk/core/accordion"

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
    <div>
      <div data-slot="controls">
        <button type="button" (click)="accordion.open('security')">
          Review security
        </button>
      </div>
      <div uiAccordion [(value)]="value" multiple [controller]="accordion">
        @for (item of items; track item.value) {
          <div
            uiAccordionItem
            [value]="item.value"
            (beforeOpenChange)="confirmClose(item.value, $event.value, $event)"
          >
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
      value: "account",
      label: "Account",
      content: "Your name, email address and profile photo.",
    },
    {
      value: "security",
      label: "Security",
      content: "Your password, passkeys and two-factor authentication.",
    },
    {
      value: "sessions",
      label: "Sessions",
      content: "Devices signed in to your account in the last 30 days.",
    },
  ]

  readonly accordion = createAccordionController()

  readonly value = signal(["account"])

  confirmClose(item: string, open: boolean, details: ChangeDetails) {
    if (
      !open &&
      item === "security" &&
      !window.confirm("Close the security settings?")
    ) {
      details.cancel()
    }
  }
}

export { Example }
