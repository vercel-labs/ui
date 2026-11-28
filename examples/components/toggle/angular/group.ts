import { Component } from "@angular/core"
import { LucideBold, LucideItalic, LucideUnderline } from "@lucide/angular"
import { Toggle, ToggleGroup, ToggleIcon } from "@ui-sdk/angular/toggle"

@Component({
  imports: [
    Toggle,
    ToggleGroup,
    ToggleIcon,
    LucideBold,
    LucideItalic,
    LucideUnderline,
  ],
  template: `
    <div uiToggleGroup multiple aria-label="Text formatting">
      <button uiToggle value="bold" aria-label="Bold">
        <span uiToggleIcon>
          <svg lucideBold></svg>
        </span>
      </button>
      <button uiToggle value="italic" aria-label="Italic">
        <span uiToggleIcon>
          <svg lucideItalic></svg>
        </span>
      </button>
      <button uiToggle value="underline" aria-label="Underline">
        <span uiToggleIcon>
          <svg lucideUnderline></svg>
        </span>
      </button>
    </div>
  `,
})
class Example {}

export { Example }
