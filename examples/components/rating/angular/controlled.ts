import { Component, signal } from "@angular/core"
import { LucideStar } from "@lucide/angular"
import { useLog } from "../../../shared/angular/log"
import {
  createRatingController,
  Rating,
  RatingItem,
} from "@ui-sdk/angular/rating"

@Component({
  imports: [Rating, RatingItem, LucideStar],
  template: `
    <div>
      <div data-slot="controls">
        <button type="button" (click)="rating.setValue(null)">
          Clear Rating
        </button>
      </div>
      <div
        uiRating
        aria-label="Rating"
        [(value)]="value"
        (beforeValueChange)="
          log('value: ' + $event.value + ' (' + $event.reason + ')')
        "
        [controller]="rating"
        #stars="uiRating"
      >
        @for (index of stars.items(); track index) {
          <span uiRatingItem [index]="index">
            <svg lucideStar></svg>
          </span>
        }
      </div>
    </div>
  `,
})
class Example {
  readonly log = useLog()

  readonly rating = createRatingController()

  readonly value = signal<number | null>(4)
}

export { Example }
