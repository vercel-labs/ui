import { OTPInput, OTPInputGroup, OTPInputSlot } from "@ui-sdk/react/otp-input"

export function Example() {
  return (
    <div data-slot="stack">
      <OTPInput disabled defaultValue="123456" aria-label="Disabled code">
        <OTPInputGroup>
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <OTPInputSlot key={index} index={index} />
          ))}
        </OTPInputGroup>
      </OTPInput>
      <OTPInput readOnly defaultValue="654321" aria-label="Read-only code">
        <OTPInputGroup>
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <OTPInputSlot key={index} index={index} />
          ))}
        </OTPInputGroup>
      </OTPInput>
    </div>
  )
}
