import { Component } from "@angular/core"
import { LucideBookmark } from "@lucide/angular"
import { Toggle, ToggleIcon } from "@ui-sdk/angular/toggle"

@Component({
  imports: [Toggle, ToggleIcon, LucideBookmark],
  template: `
    <div dir="rtl">
      <button uiToggle>
        <span uiToggleIcon data-variant="fill">
          <svg lucideBookmark></svg>
        </span>
        إشارة مرجعية
      </button>
    </div>
  `,
})
class Example {}

export { Example }
