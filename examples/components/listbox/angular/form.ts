import { Component } from "@angular/core"
import { LucideCheck } from "@lucide/angular"
import { useLog } from "../../../shared/angular/log"
import {
  Listbox,
  ListboxItem,
  ListboxItemIndicator,
} from "@ui-sdk/angular/listbox"

@Component({
  imports: [Listbox, ListboxItem, ListboxItemIndicator, LucideCheck],
  template: `
    <div data-slot="stack">
      <div
        uiListbox
        multiple
        name="toppings"
        form="pizza-order"
        required
        [defaultValue]="['cheese']"
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
      <form id="pizza-order" data-slot="row" (submit)="onSubmit($event)">
        <button type="reset">Reset</button>
        <button data-variant="solid">Order</button>
      </form>
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

  onSubmit(event: SubmitEvent) {
    event.preventDefault()
    this.log(
      `Ordered ${new FormData(event.currentTarget as HTMLFormElement).getAll("toppings").join(", ")}`
    )
  }
}

export { Example }
