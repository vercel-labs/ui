import { Component } from "@angular/core"
import { LucideStar } from "@lucide/angular"
import { Toggle, ToggleIcon } from "@ui-sdk/angular/toggle"

@Component({
  imports: [Toggle, ToggleIcon, LucideStar],
  template: `
    <div data-slot="card">
      <div data-slot="stack">
        <h3>Q3 Roadmap</h3>
        <p data-slot="hint">Edited by Hollis Grant</p>
      </div>
      <button uiToggle aria-label="Star">
        <span uiToggleIcon data-variant="fill">
          <svg lucideStar></svg>
        </span>
      </button>
    </div>
  `,
})
class Example {}

export { Example }
