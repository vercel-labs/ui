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
    <div uiScrollArea>
      <div *uiScrollAreaViewport role="region" aria-label="Tags">
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
  `,
})
class Example {
  readonly tags = Array.from(
    { length: 50 },
    (_, index) => `v1.2.0-beta.${50 - index}`
  )
}

export { Example }
