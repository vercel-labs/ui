import { Directive, ElementRef, inject, InjectionToken } from "@angular/core"
import type { otpInput } from "@ui-sdk/core/otp-input"
import { useFieldControl } from "./field-context.ts"
import { bindAttributes } from "./text.ts"
import { usePart, type PrimitiveHandle } from "./use-primitive.ts"

type OTPInputScope = {
  handle: PrimitiveHandle<typeof otpInput>
  /** The attributes the author wrote on the root, which its input takes. */
  moved: Record<string, string>
  /** The names the author bound on the root, which its input takes. */
  named: () => Record<string, string | undefined>
}

const OTPInputScope = new InjectionToken<OTPInputScope>("ui-sdk otp input")

// The one real input, over the slots, which takes focus and joins the field.
@Directive({ selector: "input[uiOTPInputControl]" })
class OTPInputControl {
  constructor() {
    const root = inject(OTPInputScope)
    const el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement
    for (const [name, value] of Object.entries(root.moved)) {
      el.setAttribute(name, value)
    }
    const field = useFieldControl(() => ({
      id: root.moved["id"],
      describedBy: root.named()["aria-describedby"],
    }))
    bindAttributes(el, root.named, (name) => name !== "aria-label" && !!field)
    usePart(root.handle, "control", undefined, { joined: field?.joined })
  }
}

export { OTPInputControl, OTPInputScope }
