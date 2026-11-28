import { Component } from "@angular/core"
import { Button } from "@ui-sdk/angular/button"

@Component({
  imports: [Button],
  template: ` <button uiButton disabled>Disabled</button> `,
})
class Example {}

export { Example }
