import { Component } from "@angular/core"
import { Tabs, TabsList, TabsPanel, TabsTab } from "@ui-sdk/angular/tabs"

@Component({
  imports: [Tabs, TabsList, TabsPanel, TabsTab],
  template: `
    <div uiTabs defaultValue="shipping" hiddenUntilFound>
      <div uiTabsList aria-label="Policies">
        @for (policy of policies; track policy.value) {
          <button uiTabsTab [value]="policy.value">{{ policy.label }}</button>
        }
      </div>
      @for (policy of policies; track policy.value) {
        <div uiTabsPanel [value]="policy.value">{{ policy.text }}</div>
      }
    </div>
  `,
})
class Example {
  readonly policies = [
    {
      value: "shipping",
      label: "Shipping",
      text: "Orders leave our warehouse within two working days. Express delivery arrives the next morning.",
    },
    {
      value: "returns",
      label: "Returns",
      text: "Send anything back within 30 days. Opened electronics carry a restocking fee of 10 percent.",
    },
    {
      value: "warranty",
      label: "Warranty",
      text: "Every product has a two-year warranty. Batteries are covered for one year from delivery.",
    },
  ]
}

export { Example }
