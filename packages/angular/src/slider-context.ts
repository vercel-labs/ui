import { Directive, ElementRef, inject, InjectionToken } from "@angular/core"
import type { slider } from "@ui-sdk/core/slider"
import { useFieldControl } from "./field-context.ts"
import { bindAttributes } from "./text.ts"
import { usePart, type PrimitiveHandle } from "./use-primitive.ts"

type SliderThumbScope = {
  handle: PrimitiveHandle<typeof slider>
  /** The props the thumb and its input share. */
  key: () => { index: number; id: string }
  /** The names the author gave the thumb, which its input takes. */
  named: () => Record<string, string | undefined>
  /** Whether the input is the field's control: a range's root is instead. */
  inField: () => boolean
}

const SliderThumbScope = new InjectionToken<SliderThumbScope>(
  "ui-sdk slider thumb"
)

// The native range input inside a thumb, which takes focus and joins the field.
@Directive({ selector: "input[uiSliderThumbInput]" })
class SliderThumbInput {
  constructor() {
    const thumb = inject(SliderThumbScope)
    const el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement
    const field = useFieldControl(() => ({
      id: field?.controlId(),
      describedBy: thumb.named()["aria-describedby"],
    }))
    bindAttributes(
      el,
      thumb.named,
      (name) => name !== "aria-label" && !!field && thumb.inField()
    )
    usePart(thumb.handle, "thumb-input", thumb.key, {
      joined: field && {
        ...field.joined,
        part: () => (thumb.inField() ? field.joined.part() : undefined),
      },
    })
  }
}

export { SliderThumbInput, SliderThumbScope }
