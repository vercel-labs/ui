import { Component } from "@angular/core"
import {
  LucideBold,
  LucideDynamicIcon,
  LucideItalic,
  LucideLink,
  LucideUnderline,
} from "@lucide/angular"
import { useLog } from "../../../shared/angular/log"
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
    LucideDynamicIcon,
    LucideLink,
  ],
  template: `
    <div uiToolbar aria-label="Formatting">
      @for (item of styles; track item.label) {
        <button
          uiToggle
          [aria-label]="item.label"
          (beforePressedChange)="
            log(item.label + ' ' + ($event.value ? 'on' : 'off'))
          "
        >
          <span uiToggleIcon>
            <svg [lucideIcon]="item.icon"></svg>
          </span>
        </button>
      }
      <div uiToolbarSeparator></div>
      <button
        uiToolbarButton
        aria-label="Insert link"
        (click)="log('Insert link')"
      >
        <svg lucideLink></svg>
      </button>
    </div>
  `,
})
class Example {
  readonly styles = [
    { label: "Bold", icon: LucideBold },
    { label: "Italic", icon: LucideItalic },
    { label: "Underline", icon: LucideUnderline },
  ]

  readonly log = useLog()
}

export { Example }
