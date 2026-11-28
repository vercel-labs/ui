import { Component } from "@angular/core"
import { LucideCheck } from "@lucide/angular"
import { useLog } from "../../../shared/angular/log"
import {
  Listbox,
  ListboxItem,
  ListboxItemIndicator,
  type ListboxHighlight,
} from "@ui-sdk/angular/listbox"

@Component({
  imports: [Listbox, ListboxItem, ListboxItemIndicator, LucideCheck],
  template: `
    <div
      uiListbox
      defaultValue="utc9"
      (highlight)="onHighlight($event)"
      aria-label="Time zone"
    >
      @for (zone of timezones; track zone.value; let index = $index) {
        <div uiListboxItem [value]="zone.value" [index]="index">
          {{ zone.label }}
          <span *uiListboxItemIndicator>
            <svg lucideCheck></svg>
          </span>
        </div>
      }
    </div>
  `,
})
class Example {
  readonly timezones = Array.from({ length: 27 }, (_, index) => {
    const offset = index - 12
    const label = `UTC${offset < 0 ? "−" : "+"}${String(Math.abs(offset)).padStart(2, "0")}:00`
    return { value: `utc${offset}`, label }
  })

  readonly log = useLog()

  onHighlight(highlight: ListboxHighlight) {
    if (highlight.value) {
      this.log(
        `Focused ${this.timezones[highlight.index].label} (${highlight.index + 1} of ${this.timezones.length})`
      )
    }
  }
}

export { Example }
