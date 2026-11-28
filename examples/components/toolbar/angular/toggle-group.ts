import { Component } from "@angular/core"
import {
  LucideAlignCenter,
  LucideAlignLeft,
  LucideAlignRight,
  LucideDynamicIcon,
  LucideList,
  LucideListOrdered,
} from "@lucide/angular"
import { useLog } from "../../../shared/angular/log"
import { Toggle, ToggleGroup, ToggleIcon } from "@ui-sdk/angular/toggle"
import { Toolbar, ToolbarSeparator } from "@ui-sdk/angular/toolbar"

@Component({
  imports: [
    Toggle,
    ToggleGroup,
    ToggleIcon,
    Toolbar,
    ToolbarSeparator,
    LucideDynamicIcon,
  ],
  template: `
    <div uiToolbar aria-label="Paragraph">
      <div
        uiToggleGroup
        [defaultValue]="['left']"
        [deselectable]="false"
        aria-label="Alignment"
        (beforeValueChange)="log('Align ' + $event.value[0])"
      >
        @for (item of alignments; track item.value) {
          <button uiToggle [value]="item.value" [aria-label]="item.label">
            <span uiToggleIcon>
              <svg [lucideIcon]="item.icon"></svg>
            </span>
          </button>
        }
      </div>
      <div uiToolbarSeparator></div>
      <div
        uiToggleGroup
        aria-label="List"
        (beforeValueChange)="logList($event.value[0])"
      >
        @for (item of lists; track item.value) {
          <button uiToggle [value]="item.value" [aria-label]="item.label">
            <span uiToggleIcon>
              <svg [lucideIcon]="item.icon"></svg>
            </span>
          </button>
        }
      </div>
    </div>
  `,
})
class Example {
  readonly alignments = [
    { value: "left", label: "Align left", icon: LucideAlignLeft },
    { value: "center", label: "Align center", icon: LucideAlignCenter },
    { value: "right", label: "Align right", icon: LucideAlignRight },
  ]

  readonly lists = [
    { value: "bulleted", label: "Bulleted list", icon: LucideList },
    { value: "numbered", label: "Numbered list", icon: LucideListOrdered },
  ]

  readonly log = useLog()

  logList(value: string | undefined) {
    this.log(
      this.lists.find((list) => list.value === value)?.label ?? "No list"
    )
  }
}

export { Example }
