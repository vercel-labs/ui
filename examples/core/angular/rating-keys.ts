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
import { rating } from "../rating-stages/keys"

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
        <output
          data-slot="rating-value"
          data-value
          aria-label="Rating out of 5"
        >
          {{ value() }}
        </output>
        <span data-slot="hint">out of 5</span>
      </div>
      <div appRating [(value)]="value" aria-label="Rating">
        @for (star of stars; track star) {
          <button
            appRatingStar
            [value]="star.toString()"
            [attr.aria-label]="star + (star === 1 ? ' star' : ' stars')"
          >
            <svg lucideStar></svg>
          </button>
        }
      </div>
    </div>
  `,
})
class Example {
  readonly value = signal(3)

  readonly stars = [1, 2, 3, 4, 5]
}

export { Example, Rating, RatingStar }
