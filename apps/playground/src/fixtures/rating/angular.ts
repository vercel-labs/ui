import { Component } from "@angular/core"
import {
  createRatingController,
  Rating,
  RatingItem,
  type RatingValueChange,
} from "@ui-sdk/angular/rating"
import { ratingOptions } from "../../../../../tests/fixtures/page"
import { ratingFixture } from "../../../../../tests/fixtures/rating"
import { mountAngular, state } from "../../angular-mount"

@Component({
  imports: [Rating, RatingItem],
  template: `
    <form class="fixture" (submit)="onSubmit($event)">
      <button type="button">Before</button>
      <div
        uiRating
        #rating="uiRating"
        [attr.aria-label]="quality.label"
        [name]="quality.name"
        [defaultValue]="quality.defaultValue"
        [disabled]="options.disabled"
        [controller]="controller"
        (beforeValueChange)="onValueChange($event)"
      >
        @for (index of rating.items(); track index) {
          <span uiRatingItem #item="uiRatingItem" [index]="index">
            <span class="star">{{ item.state().fill }}</span>
          </span>
        }
      </div>
      <button type="button">After</button>
      <div
        uiRating
        #halves="uiRating"
        [attr.aria-label]="value.label"
        [name]="value.name"
        [step]="value.step"
        deselectable
      >
        @for (index of halves.items(); track index) {
          <span uiRatingItem [index]="index"></span>
        }
      </div>
      <div
        uiRating
        #shown="uiRating"
        [value]="average.value"
        [getValueLabel]="average.getValueLabel"
        readOnly
      >
        @for (index of shown.items(); track index) {
          <span uiRatingItem [index]="index"></span>
        }
      </div>
      <button type="submit">Save</button>
      <button type="reset">Reset</button>
      <button type="button" (click)="controller.setValue(5)">Rate five</button>
      <output role="status" aria-label="Last action">{{ action() }}</output>
      <output aria-label="Submitted">{{ submitted() }}</output>
    </form>
  `,
})
class Fixture {
  readonly controller = createRatingController()
  readonly options = ratingOptions()
  readonly quality = ratingFixture.quality
  readonly value = ratingFixture.value
  readonly average = ratingFixture.average
  readonly action = state("")
  readonly submitted = state("")

  onValueChange(change: RatingValueChange) {
    if (change.value === this.options.cancel) {
      return change.cancel()
    }
    this.action.set(`${change.value}:${change.reason}`)
  }

  onSubmit(event: SubmitEvent) {
    event.preventDefault()
    this.submitted.set(
      Array.from(
        new FormData(event.currentTarget as HTMLFormElement),
        ([key, entry]) => `${key}=${entry}`
      ).join("&")
    )
  }
}

function mount(root: HTMLElement) {
  return mountAngular(Fixture, root)
}

export { Fixture, mount }
