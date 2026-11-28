import { Component } from "@angular/core"
import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
  type AccordionValueChange,
} from "@ui-sdk/angular/accordion"
import { createAccordionController } from "@ui-sdk/core/accordion"
import {
  accordionFixture,
  describeValue,
} from "../../../../../tests/fixtures/accordion"
import { accordionOptions } from "../../../../../tests/fixtures/page"
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
        [controller]="controller"
        [defaultValue]="options.defaultValue"
        [multiple]="options.multiple"
        [disabled]="options.disabled"
        [keepMounted]="options.keepMounted"
        [hiddenUntilFound]="options.hiddenUntilFound"
        [collapsible]="options.collapsible"
        (beforeValueChange)="onValueChange($event)"
      >
        @for (item of items; track item.value) {
          <div
            uiAccordionItem
            class="accordion-item"
            [value]="item.value"
            [disabled]="item.disabled && !warrantyEnabled()"
            (openChangeComplete)="
              complete.set(item.value + ' ' + ($event ? 'open' : 'closed'))
            "
          >
            <h3 uiAccordionHeader class="accordion-header">
              <button uiAccordionTrigger class="accordion-trigger">
                {{ item.label }}
              </button>
            </h3>
            <div *uiAccordionPanel class="accordion-panel">
              {{ item.content }}
              @if (item.field) {
                <label> {{ item.field }} <input /></label>
              }
              @if (item.close) {
                <button (click)="controller.close(item.value)">
                  {{ item.close }}
                </button>
              }
            </div>
          </div>
        }
      </div>
      <button>After</button>
      <output role="status" aria-label="Last action">{{ action() }}</output>
      <output aria-label="Last completed">{{ complete() }}</output>
      <button (click)="controller.open('support')">Show support</button>
      <button (click)="warrantyEnabled.set(!warrantyEnabled())">
        Toggle warranty
      </button>
    </div>
  `,
})
class Fixture {
  readonly controller = createAccordionController()
  readonly options = accordionOptions()
  readonly items = accordionFixture.items
  readonly action = state("")
  readonly complete = state("")
  readonly warrantyEnabled = state(false)

  onValueChange(change: AccordionValueChange) {
    const { cancel } = this.options
    if (
      cancel &&
      change.value.includes(cancel) &&
      !this.controller.getValue().includes(cancel)
    ) {
      return change.cancel()
    }
    this.action.set(describeValue(change.value))
  }
}

function mount(root: HTMLElement) {
  return mountAngular(Fixture, root)
}

export { Fixture, mount }
