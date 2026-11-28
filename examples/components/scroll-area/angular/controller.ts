import { Component } from "@angular/core"
import { useLog } from "../../../shared/angular/log"
import {
  createScrollAreaController,
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
    <div data-slot="stack">
      <div data-slot="controls">
        <button
          type="button"
          (click)="controller.scrollToStart({ behavior: 'smooth' })"
        >
          Back to Top
        </button>
        <button
          type="button"
          (click)="controller.scrollToEnd({ behavior: 'instant' })"
        >
          Jump to the End
        </button>
      </div>
      <div uiScrollArea [controller]="controller">
        <div
          *uiScrollAreaViewport
          role="region"
          aria-label="Tags"
          (scroll)="read()"
        >
          <div *uiScrollAreaContent>
            <h3>Tags</h3>
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
  `,
})
class Example {
  readonly tags = Array.from(
    { length: 50 },
    (_, index) => `v1.2.0-beta.${50 - index}`
  )

  readonly log = useLog()

  readonly controller = createScrollAreaController()

  edge: string | null = "start"

  read() {
    const next = this.controller.isAtEnd()
      ? "end"
      : this.controller.isAtStart()
        ? "start"
        : null
    if (next && next !== this.edge) {
      this.log(`At the ${next}`)
    }
    this.edge = next
  }
}

export { Example }
