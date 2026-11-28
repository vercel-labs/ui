import { Component } from "@angular/core"
import {
  LucideDynamicIcon,
  LucideTextAlignCenter,
  LucideTextAlignEnd,
  LucideTextAlignStart,
} from "@lucide/angular"
import { Toggle, ToggleGroup, ToggleIcon } from "@ui-sdk/angular/toggle"

@Component({
  imports: [Toggle, ToggleGroup, ToggleIcon, LucideDynamicIcon],
  template: `
    <div
      uiToggleGroup
      [defaultValue]="['start']"
      [deselectable]="false"
      aria-label="Text alignment"
    >
      @for (item of alignments; track item.value) {
        <button uiToggle [value]="item.value" [aria-label]="item.label">
          <span uiToggleIcon [mirror]="item.mirror">
            <svg [lucideIcon]="item.icon"></svg>
          </span>
        </button>
      }
    </div>
  `,
})
class Example {
  readonly alignments = [
    {
      value: "start",
      label: "Align start",
      icon: LucideTextAlignStart,
      mirror: true,
    },
    {
      value: "center",
      label: "Align center",
      icon: LucideTextAlignCenter,
      mirror: false,
    },
    {
      value: "end",
      label: "Align end",
      icon: LucideTextAlignEnd,
      mirror: true,
    },
  ]
}

export { Example }
