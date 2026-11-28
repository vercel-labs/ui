import { Component } from "@angular/core"
import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
} from "@ui-sdk/angular/accordion"
import { describeValue } from "../../../../../tests/fixtures/accordion"
import { mountAngular, state } from "../../angular-mount"

@Component({
  imports: [
    Accordion,
    AccordionHeader,
    AccordionItem,
    AccordionPanel,
    AccordionTrigger,
  ],
  template: `
    <div class="fixture">
      <button>Before</button>
      <div
        uiAccordion
        class="accordion"
        [defaultValue]="['overview']"
        (valueChange)="action.set(describeValue($event))"
      >
        <div
          uiAccordionItem
          #overview="uiAccordionItem"
          class="accordion-item"
          value="overview"
        >
          <span
            hidden
            [class]="overview.state().open ? 'is-open' : 'is-closed'"
          ></span>
          <h2 uiAccordionHeader class="accordion-header">
            <button
              uiAccordionTrigger
              #trigger="uiAccordionTrigger"
              class="accordion-trigger"
            >
              Overview<span aria-hidden="true">
                {{ trigger.state().open ? "−" : "+" }}</span
              >
              <span class="index" hidden>{{ trigger.state().index }}</span>
            </button>
          </h2>
          <section *uiAccordionPanel class="accordion-panel">
            The overview panel.
          </section>
        </div>
        <div uiAccordionItem class="accordion-item" value="details">
          <h3 uiAccordionHeader class="accordion-header">
            <div uiAccordionTrigger class="accordion-trigger">Details</div>
          </h3>
          <div *uiAccordionPanel class="accordion-panel">
            The details panel.
          </div>
        </div>
      </div>
      <button>After</button>
      <output role="status" aria-label="Last action">{{ action() }}</output>
    </div>
  `,
})
class Fixture {
  readonly describeValue = describeValue
  readonly action = state("")
}

function mount(root: HTMLElement) {
  return mountAngular(Fixture, root)
}

export { Fixture, mount }
