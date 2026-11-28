import { Component } from "@angular/core"
import { LucideStar } from "@lucide/angular"
import { Rating, RatingItem } from "@ui-sdk/angular/rating"

@Component({
  imports: [Rating, RatingItem, LucideStar],
  template: `
    <div
      uiRating
      #rating="uiRating"
      aria-label="Rating"
      [defaultValue]="2"
      disabled
    >
      @for (index of rating.items(); track index) {
        <span uiRatingItem [index]="index">
          <svg lucideStar></svg>
        </span>
      }
    </div>
  `,
})
class Example {}

export { Example }
