import { Component } from "@angular/core"
import {
  LucideDynamicIcon,
  LucideMousePointer2,
  LucidePencil,
  LucideSquare,
  LucideTrash2,
  LucideType,
} from "@lucide/angular"
import { useLog } from "../../../shared/angular/log"
import { Toggle, ToggleGroup, ToggleIcon } from "@ui-sdk/angular/toggle"
import {
  Toolbar,
  ToolbarButton,
  ToolbarSeparator,
} from "@ui-sdk/angular/toolbar"

@Component({
  imports: [
    Toggle,
    ToggleGroup,
    ToggleIcon,
    Toolbar,
    ToolbarButton,
    ToolbarSeparator,
    LucideDynamicIcon,
    LucideTrash2,
  ],
  template: `
    <div uiToolbar orientation="vertical" aria-label="Canvas">
      <div
        uiToggleGroup
        [defaultValue]="['select']"
        [deselectable]="false"
        orientation="vertical"
        aria-label="Tool"
        (beforeValueChange)="
          log(
            tools.find((tool) => tool.value === $event.value[0])?.label +
              ' tool'
          )
        "
      >
        @for (item of tools; track item.value) {
          <button uiToggle [value]="item.value" [aria-label]="item.label">
            <span uiToggleIcon>
              <svg [lucideIcon]="item.icon"></svg>
            </span>
          </button>
        }
      </div>
      <div uiToolbarSeparator></div>
      <button
        uiToolbarButton
        aria-label="Delete"
        (click)="log('Deleted selection')"
      >
        <svg lucideTrash2></svg>
      </button>
    </div>
  `,
})
class Example {
  readonly tools = [
    { value: "select", label: "Select", icon: LucideMousePointer2 },
    { value: "draw", label: "Draw", icon: LucidePencil },
    { value: "shape", label: "Shape", icon: LucideSquare },
    { value: "text", label: "Text", icon: LucideType },
  ]

  readonly log = useLog()
}

export { Example }
