import { Component, signal } from "@angular/core"
import { usePrimitive } from "@ui-sdk/angular/primitive"
import { rating } from "../rating-stages/state"

@Component({
  template: `
    <div data-slot="stack">
      <div data-slot="controls">
        <button
          type="button"
          data-size="sm"
          (click)="handle.api.rate(3, $event)"
        >
          Set to 3
        </button>
        <button
          type="button"
          data-size="sm"
          (click)="handle.api.rate(0, $event)"
        >
          Reset
        </button>
      </div>
      <div data-slot="rating-readout">
        <output data-slot="rating-value" data-value aria-label="Rating">
          {{ value() }}
        </output>
        <span data-slot="hint">Rating</span>
      </div>
    </div>
  `,
})
class Example {
  readonly value = signal(0)

  readonly handle = usePrimitive(rating, () => ({
    onValueChange: (next: number) => this.value.set(next),
  }))
}

export { Example }
