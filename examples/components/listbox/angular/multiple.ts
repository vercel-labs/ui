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
    <div
      uiListbox
      multiple
      [defaultValue]="['cheese', 'onion']"
      (beforeValueChange)="
        log(($event.value.join(', ') || 'Nothing') + ' (' + $event.reason + ')')
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
}

export { Example }
