import { Component } from "@angular/core"
import { Separator } from "@ui-sdk/angular/separator"

@Component({
  imports: [Separator],
  template: `
    <div data-slot="stack">
      <dl>
        <dt>Plan</dt>
        <dd>Pro</dd>
      </dl>
      <div uiSeparator></div>
      <dl>
        <dt>Seats</dt>
        <dd>8 of 10</dd>
      </dl>
      <div uiSeparator></div>
      <dl>
        <dt>Renews</dt>
        <dd>December 1, 2026</dd>
      </dl>
    </div>
  `,
})
class Example {}

export { Example }
