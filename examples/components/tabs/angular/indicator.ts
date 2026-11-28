import { Component, signal } from "@angular/core"
import {
  Tabs,
  TabsIndicator,
  TabsList,
  TabsPanel,
  TabsTab,
} from "@ui-sdk/angular/tabs"

@Component({
  imports: [Tabs, TabsIndicator, TabsList, TabsPanel, TabsTab],
  template: `
    <div>
      <div data-slot="controls" role="group" aria-label="Orientation">
        @for (option of orientations; track option.value) {
          <button
            type="button"
            data-size="sm"
            [aria-pressed]="orientation() === option.value"
            (click)="orientation.set(option.value)"
          >
            {{ option.label }}
          </button>
        }
      </div>
      <div uiTabs defaultValue="music" [orientation]="orientation()">
        <div uiTabsList aria-label="Library">
          <button uiTabsTab value="music">Music</button>
          <button uiTabsTab value="podcasts">Podcasts</button>
          <button uiTabsTab value="audiobooks">Audiobooks</button>
          <span uiTabsIndicator></span>
        </div>
        <div uiTabsPanel value="music">
          312 songs in 24 albums, synced to this device.
        </div>
        <div uiTabsPanel value="podcasts">
          8 shows you follow, with 3 new episodes.
        </div>
        <div uiTabsPanel value="audiobooks">
          2 books in progress, 6 hours left in total.
        </div>
      </div>
    </div>
  `,
})
class Example {
  readonly orientations = [
    { value: "horizontal", label: "Horizontal" },
    { value: "vertical", label: "Vertical" },
  ] as const

  readonly orientation = signal<"horizontal" | "vertical">("horizontal")
}

export { Example }
