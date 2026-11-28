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
      <div *uiScrollAreaViewport role="region" aria-label="Release notes">
        <div *uiScrollAreaContent>
          @for (note of notes; track note.version) {
            <article>
              <h3>
                {{ note.version }} <span data-slot="hint">{{ note.date }}</span>
              </h3>
              <p>{{ note.text }}</p>
            </article>
          }
        </div>
      </div>
      <div data-slot="top-fade"></div>
      <div data-slot="bottom-fade"></div>
      <div uiScrollAreaScrollbar>
        <div uiScrollAreaThumb></div>
      </div>
    </div>
  `,
})
class Example {
  readonly notes = [
    {
      version: "v1.12.0",
      date: "Oct 28",
      text: "Scroll areas follow streamed content and stop when you scroll up.",
    },
    {
      version: "v1.11.2",
      date: "Oct 14",
      text: "Focus returns to the right trigger when a nested dialog closes.",
    },
    {
      version: "v1.11.1",
      date: "Oct 2",
      text: "Date pickers keep the selected month when the locale changes.",
    },
    {
      version: "v1.11.0",
      date: "Sep 23",
      text: "Menus open on Arrow Down and skip disabled items while typing.",
    },
    {
      version: "v1.10.3",
      date: "Sep 9",
      text: "Toasts pause their timers while the window is in the background.",
    },
    {
      version: "v1.10.2",
      date: "Aug 27",
      text: "Sliders snap to the nearest step when dragged past either end.",
    },
    {
      version: "v1.10.1",
      date: "Aug 18",
      text: "Tooltips wait for a short delay before moving to a new trigger.",
    },
    {
      version: "v1.10.0",
      date: "Aug 5",
      text: "Comboboxes can load their options while you type.",
    },
  ]
}

export { Example }
