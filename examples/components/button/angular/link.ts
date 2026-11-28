import { Component } from "@angular/core"
import { Button } from "@ui-sdk/angular/button"

@Component({
  imports: [Button],
  template: `
    <div data-slot="row">
      <a uiButton href="#installation">Get Started</a>
      <a uiButton disabled href="#changelog">Changelog</a>
    </div>
  `,
})
class Example {}

export { Example }
