import { Component } from "@angular/core"
import { Toggle } from "@ui-sdk/angular/toggle"

@Component({
  imports: [Toggle],
  template: ` <button uiToggle data-variant="outline">Bookmark</button> `,
})
class Example {}

export { Example }
