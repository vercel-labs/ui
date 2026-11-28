import {
  Component,
  Directive,
  inject,
  input,
  output,
  signal,
} from "@angular/core"
import { LucideStar } from "@lucide/angular"
import { usePart, usePrimitive } from "@ui-sdk/angular/primitive"
import { rating } from "../rating-stages/star"

@Directive({ selector: "[appRating]" })
class Rating {
  readonly value = input<number>()

  readonly valueChange = output<number>()

  readonly handle = usePrimitive(rating, () => ({
    value: this.value(),
    onValueChange: (next: number) => this.valueChange.emit(next),
  }))

  constructor() {
    usePart(this.handle, "root")
  }
}

@Directive({ selector: "[appRatingStar]" })
class RatingStar {
  readonly value = input.required<string>()

  constructor() {
    usePart(inject(Rating).handle, "star", () => ({ value: this.value() }))
  }
}

@Component({
  imports: [Rating, RatingStar, LucideStar],
  template: `
    <div data-slot="stack">
      <div data-slot="rating-readout">
        <output data-slot="rating-value" data-value aria-label="Rating">
          {{ value() }}
        </output>
        <span data-slot="hint">Rating</span>
      </div>
      <div appRating (valueChange)="value.set($event)" aria-label="Rating">
        <button appRatingStar value="1" aria-label="1 star">
          <svg lucideStar></svg>
        </button>
      </div>
    </div>
  `,
})
class Example {
  readonly value = signal(0)
}

export { Example, Rating, RatingStar }
