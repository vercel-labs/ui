import { Component } from "@angular/core"
import { LucideHeart } from "@lucide/angular"
import { Toggle, ToggleIcon } from "@ui-sdk/angular/toggle"

@Component({
  imports: [Toggle, ToggleIcon, LucideHeart],
  template: `
    <button uiToggle #favorite="uiToggle" aria-label="Favorite">
      <span uiToggleIcon>
        <svg
          lucideHeart
          [attr.fill]="favorite.state().pressed ? 'currentColor' : 'none'"
        ></svg>
      </span>
    </button>
  `,
})
class Example {}

export { Example }
