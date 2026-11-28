import { Component } from "@angular/core"
import { LucideStar } from "@lucide/angular"
import { useLog } from "../../../shared/angular/log"
import { Field, FieldLabel } from "@ui-sdk/angular/field"
import { Rating, RatingItem } from "@ui-sdk/angular/rating"

@Component({
  imports: [Field, FieldLabel, Rating, RatingItem, LucideStar],
  template: `
    <form data-slot="stack" (submit)="onSubmit($event)">
      <div uiField>
        <label uiFieldLabel>Rate your stay</label>
        <div uiRating #rating="uiRating" name="stay" required>
          @for (index of rating.items(); track index) {
            <span uiRatingItem [index]="index">
              <svg lucideStar></svg>
            </span>
          }
        </div>
      </div>
      <div data-slot="row">
        <button type="submit" data-variant="solid">Send Review</button>
        <button type="reset">Reset</button>
      </div>
    </form>
  `,
})
class Example {
  readonly log = useLog()

  onSubmit(event: SubmitEvent) {
    event.preventDefault()
    this.log(
      `Submitted stay=${new FormData(event.currentTarget as HTMLFormElement).get("stay")}`
    )
  }
}

export { Example }
