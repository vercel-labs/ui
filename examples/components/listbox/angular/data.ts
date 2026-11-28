import { Component } from "@angular/core"
import { LucideCheck } from "@lucide/angular"
import { useLog } from "../../../shared/angular/log"
import {
  Listbox,
  ListboxItem,
  ListboxItemIndicator,
  type ListData,
} from "@ui-sdk/angular/listbox"

@Component({
  imports: [Listbox, ListboxItem, ListboxItemIndicator, LucideCheck],
  template: `
    <div
      uiListbox
      [items]="plans"
      [defaultValue]="plans[1].value"
      (valueChange)="logPlan($event)"
      [itemToValue]="itemToValue"
      [isItemEqualToValue]="isItemEqualToValue"
      aria-label="Plan"
    >
      @for (plan of plans; track plan.value.id) {
        <div uiListboxItem [value]="plan.value" [disabled]="plan.disabled">
          {{ plan.label }}
          <span *uiListboxItemIndicator>
            <svg lucideCheck></svg>
          </span>
        </div>
      }
    </div>
  `,
})
class Example {
  readonly plans = [
    { value: { id: "hobby", price: 0 }, label: "Hobby" },
    { value: { id: "pro", price: 20 }, label: "Pro" },
    { value: { id: "team", price: 50 }, label: "Team" },
    {
      value: { id: "enterprise", price: 200 },
      label: "Enterprise",
      disabled: true,
    },
  ] satisfies ListData<{ id: string; price: number }>

  readonly log = useLog()

  readonly itemToValue = (plan: { id: string }) => plan.id

  readonly isItemEqualToValue = (
    plan: { id: string },
    selected: { id: string }
  ) => plan.id === selected.id

  logPlan(plan: { id: string; price: number } | null) {
    this.log(plan ? `${plan.id}, $${plan.price} a month` : "No plan")
  }
}

export { Example }
