import { Component } from "@angular/core"
import {
  ScrollArea,
  ScrollAreaContent,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaViewport,
  type ScrollAreaType,
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
      @for (type of types; track type) {
        <div data-slot="stack">
          <code>type="{{ type }}"</code>
          <div uiScrollArea [type]="type">
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
  readonly types: ScrollAreaType[] = ["hover", "scroll", "auto", "always"]

  readonly tags = Array.from(
    { length: 20 },
    (_, index) => `v1.2.0-beta.${50 - index}`
  )
}

export { Example }
