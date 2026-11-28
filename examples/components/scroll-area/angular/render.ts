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
    <section uiScrollArea #scrollArea="uiScrollArea">
      <article *uiScrollAreaViewport aria-label="Releases">
        <div *uiScrollAreaContent>
          <ul>
            @for (tag of tags; track tag) {
              <li>{{ tag }}</li>
            }
          </ul>
        </div>
      </article>
      <p data-slot="hint" aria-hidden="true">
        {{
          scrollArea.state().atStart
            ? "Scroll for older releases"
            : "More releases below"
        }}
      </p>
      <div uiScrollAreaScrollbar>
        <div uiScrollAreaThumb></div>
      </div>
    </section>
  `,
})
class Example {
  readonly tags = Array.from(
    { length: 50 },
    (_, index) => `v1.2.0-beta.${50 - index}`
  )
}

export { Example }
