import { Component } from "@angular/core"
import {
  ScrollArea,
  ScrollAreaContent,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaViewport,
} from "@ui-sdk/angular/scroll-area"

@Component({
  imports: [
    ScrollArea,
    ScrollAreaContent,
    ScrollAreaScrollbar,
    ScrollAreaThumb,
    ScrollAreaViewport,
  ],
  template: `
    <div data-slot="grid">
      @for (delay of delays; track delay.value) {
        <div data-slot="stack">
          <span data-slot="hint">{{ delay.label }}</span>
          <div uiScrollArea type="scroll" [scrollHideDelay]="delay.value">
            <div *uiScrollAreaViewport>
              <div *uiScrollAreaContent>
                <ul>
                  @for (tag of tags; track tag) {
                    <li>{{ tag }}</li>
                  }
                </ul>
              </div>
            </div>
            <div uiScrollAreaScrollbar>
              <div uiScrollAreaThumb></div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
class Example {
  readonly delays = [
    { value: 0, label: "No delay" },
    { value: 2000, label: "2000 ms delay" },
  ]

  readonly tags = Array.from(
    { length: 20 },
    (_, index) => `v1.2.0-beta.${50 - index}`
  )
}

export { Example }
