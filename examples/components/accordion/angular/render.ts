import { Component } from "@angular/core"
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
  ],
  template: `
    <div uiAccordion multiple [defaultValue]="['install']">
      @for (step of steps; track step.value) {
        <div uiAccordionItem [value]="step.value">
          <h4 uiAccordionHeader>
            <button uiAccordionTrigger #trigger="uiAccordionTrigger">
              @if (trigger.state().index >= 0) {
                <span data-slot="hint" aria-hidden="true">
                  {{ position(trigger.state().index) }}
                </span>
              }
              <span>{{ step.label }}</span>
              <span data-slot="hint" aria-hidden="true">
                {{ trigger.state().open ? "Hide" : "Show" }}
              </span>
            </button>
          </h4>
          <div uiAccordionPanel>
            {{ step.content }}
          </div>
        </div>
      }
    </div>
  `,
})
class Example {
  readonly steps = [
    {
      value: "install",
      label: "Install the package",
      content: "Add it with your package manager. It has no dependencies.",
    },
    {
      value: "import",
      label: "Import the parts",
      content: "Import the accordion parts you need from the package.",
    },
    {
      value: "style",
      label: "Style it",
      content: "Every part renders its state as data attributes you can style.",
    },
  ]

  position(index: number) {
    return String(index + 1).padStart(2, "0")
  }
}

export { Example }
