import { Component } from "@angular/core"
import { Separator } from "@ui-sdk/angular/separator"

@Component({
  imports: [Separator],
  template: `
    <div data-slot="stack">
      <div data-slot="stack">
        <h3>Hollis Grant</h3>
        <p data-slot="hint">hollis@example.com</p>
      </div>
      <div uiSeparator></div>
      <p>
        Designs the billing and onboarding flows, and reviews every new pricing
        page.
      </p>
    </div>
  `,
})
class Example {}

export { Example }
