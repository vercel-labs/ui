import { Component } from "@angular/core"
import { Separator } from "@ui-sdk/angular/separator"

@Component({
  imports: [Separator],
  template: `
    <nav aria-label="Legal" data-slot="row">
      <a href="#privacy">Privacy</a>
      <div uiSeparator orientation="vertical"></div>
      <a href="#terms">Terms</a>
      <div uiSeparator orientation="vertical"></div>
      <a href="#cookies">Cookies</a>
    </nav>
  `,
})
class Example {}

export { Example }
