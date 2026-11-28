import { Directive, inject, InjectionToken, input } from "@angular/core"
import type { rating } from "@ui-sdk/core/rating"
import { useNativeInput } from "./native-input.ts"
import { usePart, type PrimitiveHandle } from "./use-primitive.ts"

const RatingHandle = new InjectionToken<PrimitiveHandle<typeof rating>>(
  "ui-sdk rating"
)

// One score of a star: the radio that picks it, and the native radio the form submits.
@Directive({ selector: "button[uiRatingRadio]" })
class RatingRadio {
  readonly value = input.required<string>()

  constructor() {
    const rating = inject(RatingHandle)
    const props = () => ({ value: this.value() })
    usePart(rating, "radio", props)
    useNativeInput(rating, "input", props)
  }
}

export { RatingHandle, RatingRadio }
