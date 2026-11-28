import { Component, computed, viewChild } from "@angular/core"
import {
  ScrollArea,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaViewport,
} from "@ui-sdk/angular/scroll-area"
import { mountAngular } from "../../angular-mount"

const renders = ((window as unknown as { renders: { root: number } }).renders =
  { root: 0 })

@Component({
  imports: [
    ScrollArea,
    ScrollAreaScrollbar,
    ScrollAreaThumb,
    ScrollAreaViewport,
  ],
  template: `
    <div class="fixture">
      <button>Before</button>
      <section uiScrollArea #area="uiScrollArea" class="scroll-area">
        <p class="render-status">{{ status() }}</p>
        <article
          *uiScrollAreaViewport
          class="scroll-area-viewport"
          role="region"
          aria-label="Notes"
        >
          @for (note of notes; track note) {
            <p class="scroll-area-item">{{ note }}</p>
          }
        </article>
        <div uiScrollAreaScrollbar class="scroll-area-scrollbar">
          <div uiScrollAreaThumb class="scroll-area-thumb"></div>
        </div>
      </section>
      <button>After</button>
      <output role="status" aria-label="Last action"></output>
    </div>
  `,
})
class Fixture {
  readonly area = viewChild<ScrollArea>("area")
  readonly atEnd = computed(() => !!this.area()?.state().atEnd)
  // Counts each time the text is worked out, which only an edge flipping
  // should cause.
  readonly status = computed(() => {
    renders.root++
    return this.atEnd() ? "At end" : "Reading"
  })
  readonly notes = Array.from({ length: 40 }, (_, index) => `Note ${index + 1}`)
}

function mount(root: HTMLElement) {
  return mountAngular(Fixture, root)
}

export { Fixture, mount }
