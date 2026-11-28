import { Component } from "@angular/core"
import { LucideCheck } from "@lucide/angular"
import { useLog } from "../../../shared/angular/log"
import {
  createListboxController,
  Listbox,
  ListboxItem,
  ListboxItemIndicator,
} from "@ui-sdk/angular/listbox"

@Component({
  imports: [Listbox, ListboxItem, ListboxItemIndicator, LucideCheck],
  template: `
    <div data-slot="stack">
      <div data-slot="controls">
        <button type="button" (click)="controller.selectAll()">
          Select All
        </button>
        <button type="button" (click)="controller.clear()">Clear</button>
        <button type="button" (click)="controller.focus()">Focus</button>
      </div>
      <div
        uiListbox
        multiple
        [controller]="controller"
        (beforeValueChange)="
          log($event.value.length + ' selected (' + $event.reason + ')')
        "
        aria-label="Toppings"
      >
        @for (topping of toppings; track topping.value) {
          <div uiListboxItem [value]="topping.value">
            {{ topping.label }}
            <span *uiListboxItemIndicator>
              <svg lucideCheck></svg>
            </span>
          </div>
        }
      </div>
    </div>
  `,
})
class Example {
  readonly toppings = [
    { value: "basil", label: "Basil" },
    { value: "cheese", label: "Extra cheese" },
    { value: "mushroom", label: "Mushroom" },
    { value: "olive", label: "Olive" },
    { value: "onion", label: "Onion" },
    { value: "pepper", label: "Pepper" },
  ]

  readonly log = useLog()

  readonly controller = createListboxController<string, true>()
}

export { Example }
