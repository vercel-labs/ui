import { Component } from "@angular/core"
import { Preferences, usePreference } from "@ui-sdk/angular/preferences"
import {
  SegmentedControl,
  SegmentedControlIndicator,
  SegmentedControlItem,
} from "@ui-sdk/angular/segmented-control"
import type { ColorSchemeValue } from "@ui-sdk/core"
import { colorScheme } from "../color-scheme"

@Component({
  imports: [
    Preferences,
    SegmentedControl,
    SegmentedControlIndicator,
    SegmentedControlItem,
  ],
  template: `
    <div uiPreferences [preferences]="[colorScheme]">
      <div data-slot="appearance">
        <div data-slot="appearance-text">
          <p data-slot="appearance-title">Appearance</p>
          <p data-slot="appearance-description">
            Pick a color scheme, or follow your system.
          </p>
        </div>
        <div
          uiSegmentedControl
          aria-label="Color scheme"
          [value]="scheme().value"
          (valueChange)="choose($event)"
        >
          <span uiSegmentedControlIndicator></span>
          <button uiSegmentedControlItem value="light">Light</button>
          <button uiSegmentedControlItem value="dark">Dark</button>
          <button uiSegmentedControlItem value="system">System</button>
        </div>
      </div>
    </div>
  `,
})
class Example {
  readonly colorScheme = colorScheme

  readonly scheme = usePreference(colorScheme)

  choose(next: string | null) {
    colorScheme.set(next as ColorSchemeValue)
  }
}

export { Example }
