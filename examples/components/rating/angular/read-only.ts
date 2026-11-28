import { Component } from "@angular/core"
import { LucideStar } from "@lucide/angular"
import { Rating, RatingItem, type RatingOptions } from "@ui-sdk/angular/rating"

@Component({
  imports: [Rating, RatingItem, LucideStar],
  template: `
    <div
      uiRating
      #rating="uiRating"
      [value]="4.2"
      readOnly
      [getValueLabel]="getValueLabel"
    >
      @for (index of rating.items(); track index) {
        <span uiRatingItem [index]="index">
          <svg lucideStar></svg>
        </span>
      }
    </div>
  `,
})
class Example {
  readonly getValueLabel: RatingOptions["getValueLabel"] = (value, max) =>
    `Rated ${value} out of ${max}`
}

export { Example }
