import { OTPInput, OTPInputGroup, OTPInputSlot } from "@ui-sdk/react/otp-input"

export function Example() {
  return (
    <OTPInput maxLength={6} pattern={/[0-9A-F]/i} inputMode="text" aria-label="Device code">
      <OTPInputGroup>
        {[0, 1, 2, 3, 4, 5].map((index) => (
          <OTPInputSlot key={index} index={index} />
        ))}
      </OTPInputGroup>
    </OTPInput>
  )
}
