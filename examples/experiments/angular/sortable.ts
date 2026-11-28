import {
  Component,
  Directive,
  inject,
  input,
  output,
  signal,
} from "@angular/core"
import { usePart, usePrimitive } from "@ui-sdk/angular/primitive"
import { sortable, type SortableOptions } from "../sortable"

const tracks: Record<
  string,
  { title: string; artist: string; length: string }
> = {
  t1: { title: "Northern Lights", artist: "Halden", length: "3:42" },
  t2: { title: "Glass Harbor", artist: "Mira Vale", length: "4:05" },
  t3: { title: "Copper Sky", artist: "The Fieldnotes", length: "2:58" },
  t4: { title: "Ash and Ember", artist: "Halden", length: "3:17" },
  t5: { title: "Slow Tide", artist: "Oona Reyes", length: "5:01" },
  t6: { title: "Paper Moons", artist: "Mira Vale", length: "3:33" },
}

const photos: Record<string, { label: string; tone: string }> = {
  p1: { label: "Dunes", tone: "#f97316" },
  p2: { label: "Fjord", tone: "#6366f1" },
  p3: { label: "Meadow", tone: "#10b981" },
  p4: { label: "Dusk", tone: "#9333ea" },
  p5: { label: "Glacier", tone: "#0ea5e9" },
  p6: { label: "Canyon", tone: "#dc2626" },
  p7: { label: "Forest", tone: "#15803d" },
  p8: { label: "Harbor", tone: "#475569" },
  p9: { label: "Lagoon", tone: "#0891b2" },
}

@Directive({ selector: "[appSortable]", exportAs: "appSortable" })
class Sortable {
  readonly value = input<string[]>()

  readonly defaultValue = input<string[]>()

  readonly orientation = input<SortableOptions["orientation"]>()

  readonly valueChange = output<string[]>()

  readonly handle = usePrimitive(sortable, () => ({
    value: this.value(),
    defaultValue: this.defaultValue(),
    orientation: this.orientation(),
    onValueChange: (next: string[]) => this.valueChange.emit(next),
  }))

  readonly state = usePart(this.handle, "root").state
}

@Directive({ selector: "[appSortableItem]" })
class SortableItem {
  readonly value = input.required<string>()

  constructor() {
    usePart(inject(Sortable).handle, "item", () => ({ value: this.value() }))
  }
}

@Directive({ selector: "[appSortableHandle]" })
class SortableHandle {
  constructor() {
    const item = inject(SortableItem)
    usePart(inject(Sortable).handle, "handle", () => ({ value: item.value() }))
  }
}

@Directive({ selector: "[appSortableInstructions]" })
class SortableInstructions {
  constructor() {
    usePart(inject(Sortable).handle, "instructions")
  }
}

@Component({
  imports: [Sortable, SortableHandle, SortableInstructions, SortableItem],
  template: `
    <div data-slot="sortable-layout">
      <div data-slot="stack">
        <div data-slot="row">
          <button type="button" data-size="sm" (click)="sortByTitle()">
            Sort by title
          </button>
          <button type="button" data-size="sm" (click)="reverse()">
            Reverse
          </button>
        </div>
        <div
          appSortable
          #playlistList="appSortable"
          [(value)]="playlist"
          aria-label="Playlist"
        >
          @for (
            key of playlistList.state().order;
            track key;
            let index = $index
          ) {
            <div appSortableItem [value]="key">
              <span appSortableHandle>
                <svg
                  viewBox="0 0 16 16"
                  width="16"
                  height="16"
                  fill="currentColor"
                >
                  @for (y of [4, 8, 12]; track y) {
                    @for (x of [6, 10]; track x) {
                      <circle [attr.cx]="x" [attr.cy]="y" r="1.2"></circle>
                    }
                  }
                </svg>
              </span>
              <span data-slot="sortable-index">{{ index + 1 }}</span>
              <span data-slot="stack">
                <span>{{ tracks[key]!.title }}</span>
                <span data-slot="hint">{{ tracks[key]!.artist }}</span>
              </span>
              <span data-slot="hint">{{ tracks[key]!.length }}</span>
            </div>
          }
          <div appSortableInstructions>
            Space picks up the focused track, or every selected track; then Up
            and Down move them, Space drops them and Escape puts them back.
            Shift with an arrow selects, Control or Command with A selects all.
          </div>
        </div>
      </div>
      <div
        appSortable
        #photoList="appSortable"
        [defaultValue]="photoKeys"
        orientation="grid"
        aria-label="Photos"
      >
        @for (key of photoList.state().order; track key) {
          <div appSortableItem [value]="key" [style.--tone]="photos[key]!.tone">
            {{ photos[key]!.label }}
          </div>
        }
        <div appSortableInstructions>
          Space picks up the focused photo, or every selected photo; then the
          arrows move them, Space drops them and Escape puts them back.
        </div>
      </div>
    </div>
  `,
})
class Example {
  readonly tracks = tracks

  readonly photos = photos

  readonly photoKeys = Object.keys(photos)

  readonly playlist = signal(Object.keys(tracks))

  sortByTitle() {
    this.playlist.set(
      [...this.playlist()].sort((a, b) =>
        tracks[a]!.title.localeCompare(tracks[b]!.title)
      )
    )
  }

  reverse() {
    this.playlist.set([...this.playlist()].reverse())
  }
}

export { Example, Sortable, SortableHandle, SortableInstructions, SortableItem }
