import { Component, signal } from "@angular/core"
import { LucideCheck } from "@lucide/angular"
import {
  Listbox,
  ListboxItem,
  ListboxItemIndicator,
} from "@ui-sdk/angular/listbox"

@Component({
  imports: [Listbox, ListboxItem, ListboxItemIndicator, LucideCheck],
  template: `
    <div data-slot="stack">
      <div data-slot="controls">
        <button type="button" (click)="disabled.set(!disabled())">
          {{ disabled() ? "Enable the List" : "Disable the List" }}
        </button>
      </div>
      <div
        uiListbox
        multiple
        [disabled]="disabled()"
        [defaultValue]="['basil']"
        aria-label="Toppings"
      >
        @for (topping of toppings; track topping.value) {
          <div
            uiListboxItem
            [value]="topping.value"
            [disabled]="topping.value === 'olive'"
          >
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

  readonly disabled = signal(false)
}

export { Example }
