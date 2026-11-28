import { Component } from "@angular/core"
import { Separator } from "@ui-sdk/angular/separator"

@Component({
  imports: [Separator],
  template: `
    <div data-slot="row">
      <div data-slot="stack">
        <span>24</span>
        <span data-slot="hint">Projects</span>
      </div>
      <div uiSeparator orientation="vertical"></div>
      <div data-slot="stack">
        <span>1,280</span>
        <span data-slot="hint">Followers</span>
      </div>
      <div uiSeparator orientation="vertical"></div>
      <div data-slot="stack">
        <span>312</span>
        <span data-slot="hint">Following</span>
      </div>
    </div>
  `,
})
class Example {}

export { Example }
