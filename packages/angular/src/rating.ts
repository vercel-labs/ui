import {
  ChangeDetectionStrategy,
  Component,
  computed,
  Directive,
  inject,
  input,
  numberAttribute,
  output,
  type InputSignal,
} from "@angular/core"
import {
  rating,
  ratingItemValues,
  type RatingOptions,
} from "@ui-sdk/core/rating"
import { nullableNumber, optionalBoolean, optionalNumber } from "./inputs.ts"
import { emitChange } from "./outputs.ts"
import { useFieldControl } from "./field-context.ts"
import { RatingHandle, RatingRadio } from "./rating-context.ts"
import { usePart, usePrimitive } from "./use-primitive.ts"

/**
 * What `(beforeValueChange)` emits: the value about to be set, why, and `cancel()` to keep the current one.
 * @experimental
 */
type RatingValueChange = Parameters<
  NonNullable<RatingOptions["onValueChange"]>
>[1] & {
  /** The value the change would set. */
  value: Parameters<NonNullable<RatingOptions["onValueChange"]>>[0]
}

/**
 * A score picked from a row of stars, a radio per star or half star, with a preview while a pointer moves over them. Render a RatingItem for each of its `items()`.
 * @experimental
 */
@Directive({
  selector: "[uiRating]",
  exportAs: "uiRating",
  providers: [
    { provide: RatingHandle, useFactory: () => inject(Rating).handle },
  ],
})
class Rating {
  readonly #field = useFieldControl()
  /** Logs every state change with its reason to the console, in development builds. */
  readonly debug = input(undefined, { transform: optionalBoolean })
  /** The score. Bind it with `[(value)]` to control the rating. `null` means no score yet. */
  readonly value = input(undefined, { transform: nullableNumber })
  /** The score at first, when uncontrolled. A form reset returns to it. */
  readonly defaultValue = input(undefined, { transform: nullableNumber })
  /** The new value, after a change that wasn't canceled. */
  readonly valueChange = output<RatingValueChange["value"]>()
  /** Runs when a user or a form reset wants to change the score. `$event.reason` says why, and `$event.cancel()` stops it. */
  readonly beforeValueChange = output<RatingValueChange>()
  /** How many stars there are. */
  readonly max = input(undefined, { transform: optionalNumber })
  /** The smallest change, as a fraction of a star: `0.5` makes half stars, each half its own radio. */
  readonly step = input(undefined, { transform: optionalNumber })
  /** Lets a press on the checked star clear the score. */
  readonly deselectable = input(undefined, { transform: optionalBoolean })
  /** Disables every star: they can't be focused or changed, and the score isn't submitted. */
  readonly disabled = input(undefined, { transform: optionalBoolean })
  /** Shows the score as an image, named by `getValueLabel`, that can't be changed. Any score shows, like an average of 4.2. */
  readonly readOnly = input(undefined, { transform: optionalBoolean })
  /** Blocks form submission until there's a score, with the browser's own message. */
  readonly required = input(undefined, { transform: optionalBoolean })
  /** The name the score submits under. Without one, the rating submits nothing. */
  readonly name: InputSignal<RatingOptions["name"]> = input()
  /** The id of a form to belong to, when the rating isn't inside that form. */
  readonly form: InputSignal<RatingOptions["form"]> = input()
  /** Whether arrow keys wrap from the last star to the first. */
  readonly loop = input(undefined, { transform: optionalBoolean })
  /** Names a score, for each star's radio and for a read-only rating. */
  readonly getValueLabel: InputSignal<RatingOptions["getValueLabel"]> = input()
  /** Sets the score from anywhere. Create one with `createRatingController()`. */
  readonly controller: InputSignal<RatingOptions["controller"]> = input()

  readonly handle = usePrimitive(rating, () => ({
    debug: this.debug(),
    value: this.value(),
    defaultValue: this.defaultValue(),
    onValueChange: emitChange(this.beforeValueChange, this.valueChange),
    max: this.max(),
    step: this.step(),
    deselectable: this.deselectable(),
    disabled: this.disabled() || this.#field?.disabled(),
    readOnly: this.readOnly(),
    required: this.required(),
    name: this.name() ?? this.#field?.name(),
    form: this.form(),
    loop: this.loop(),
    getValueLabel: this.getValueLabel(),
    controller: this.controller(),
  }))
  /** The stars to render, from 1: one RatingItem for each. */
  readonly items = computed(() =>
    Array.from({ length: this.max() ?? 5 }, (_, at) => at + 1)
  )
  /** The rating's state, as a signal. */
  readonly state = usePart(this.handle, "root", undefined, {
    joined: this.#field?.joined,
  }).state
}

/**
 * One star. Put its icon inside, and read how full it is from its `state()`. The radios that pick its score sit over it.
 * Render one per entry of the Rating's `items()`, with its `index`.
 * @experimental
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "[uiRatingItem]",
  exportAs: "uiRatingItem",
  imports: [RatingRadio],
  template: `<ng-content />
    @for (score of scores(); track score) {
      <button uiRatingRadio [value]="score"></button>
    }`,
})
class RatingItem {
  readonly #rating = inject(Rating)
  /** Which star this is, from 1. */
  readonly index = input.required({ transform: numberAttribute })
  /** The scores the star can take, one per step. */
  readonly scores = computed(() =>
    ratingItemValues(this.index(), this.#rating.step() ?? 1).map(String)
  )
  /** The star's state, as a signal. */
  readonly state = usePart(this.#rating.handle, "item", () => ({
    index: this.index(),
  })).state
}

export { createRatingController } from "@ui-sdk/core/rating"
export type {
  RatingApi,
  RatingChangeOptions,
  RatingController,
  RatingItemProps,
  RatingItemState,
  RatingOptions,
  RatingPrimitive,
  RatingState,
  RatingValueChangeReason,
} from "@ui-sdk/core/rating"

export { Rating, RatingItem, type RatingValueChange }
