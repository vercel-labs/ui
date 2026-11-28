import { Component } from "@angular/core"
import { Separator } from "@ui-sdk/angular/separator"

@Component({
  imports: [Separator],
  template: `
    <div data-slot="stack">
      <button type="button" data-variant="solid">Sign In with Passkey</button>
      <div data-slot="row">
        <div uiSeparator decorative></div>
        <span>or</span>
        <div uiSeparator decorative></div>
      </div>
      <button type="button">Email Me a Link</button>
    </div>
  `,
})
class Example {}

export { Example }
