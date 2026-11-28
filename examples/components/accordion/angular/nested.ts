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
    <div uiAccordion [defaultValue]="['notifications']">
      @for (section of sections; track section.value) {
        <div uiAccordionItem [value]="section.value">
          <h3 uiAccordionHeader>
            <button uiAccordionTrigger>
              {{ section.label }}
              <svg lucideChevronDown></svg>
            </button>
          </h3>
          <div uiAccordionPanel>
            @if (section.topics) {
              <div uiAccordion multiple>
                @for (topic of section.topics; track topic.value) {
                  <div uiAccordionItem [value]="topic.value">
                    <h4 uiAccordionHeader>
                      <button uiAccordionTrigger>
                        {{ topic.label }}
                        <svg lucideChevronDown></svg>
                      </button>
                    </h4>
                    <div uiAccordionPanel>
                      {{ topic.content }}
                    </div>
                  </div>
                }
              </div>
            } @else {
              <div>{{ section.content }}</div>
            }
          </div>
        </div>
      }
    </div>
  `,
})
class Example {
  readonly sections: {
    value: string
    label: string
    content?: string
    topics?: { value: string; label: string; content: string }[]
  }[] = [
    {
      value: "profile",
      label: "Profile",
      content: "Your name, photo and the email address people see.",
    },
    {
      value: "notifications",
      label: "Notifications",
      topics: [
        {
          value: "email",
          label: "Email",
          content: "A weekly digest, and mentions as they happen.",
        },
        {
          value: "push",
          label: "Push",
          content: "Direct messages and replies to your comments.",
        },
      ],
    },
    {
      value: "billing",
      label: "Billing",
      topics: [
        {
          value: "payment",
          label: "Payment methods",
          content: "A Visa card ending in 4242, used for every renewal.",
        },
        {
          value: "invoices",
          label: "Invoices",
          content: "Download a PDF of any invoice from the last two years.",
        },
      ],
    },
  ]
}

export { Example }
