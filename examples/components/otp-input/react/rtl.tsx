import { OTPInput, OTPInputGroup, OTPInputSlot } from "@ui-sdk/react/otp-input"

export function Example() {
  return (
    <div dir="rtl" data-slot="stack">
      <span id="otp-rtl-label" data-slot="label">
        رمز التحقق
      </span>
      <OTPInput maxLength={6} aria-labelledby="otp-rtl-label">
        <OTPInputGroup>
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <OTPInputSlot key={index} index={index} />
          ))}
        </OTPInputGroup>
      </OTPInput>
    </div>
  )
}
