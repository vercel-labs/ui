import { Component } from "@angular/core"
import { LucideBold, LucideItalic, LucideLink } from "@lucide/angular"
import { Toggle, ToggleIcon } from "@ui-sdk/angular/toggle"
import {
  Toolbar,
  ToolbarButton,
  ToolbarSeparator,
} from "@ui-sdk/angular/toolbar"

@Component({
  imports: [
    Toggle,
    ToggleIcon,
    Toolbar,
    ToolbarButton,
    ToolbarSeparator,
    LucideBold,
    LucideItalic,
    LucideLink,
  ],
  template: `
    <div dir="rtl">
      <div uiToolbar aria-label="تنسيق">
        <button uiToggle aria-label="غامق">
          <span uiToggleIcon>
            <svg lucideBold></svg>
          </span>
        </button>
        <button uiToggle aria-label="مائل">
          <span uiToggleIcon>
            <svg lucideItalic></svg>
          </span>
        </button>
        <div uiToolbarSeparator></div>
        <button uiToolbarButton aria-label="إدراج رابط">
          <svg lucideLink></svg>
        </button>
      </div>
    </div>
  `,
})
class Example {}

export { Example }
