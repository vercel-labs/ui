import { OTPInput, OTPInputGroup, OTPInputSlot } from "@ui-sdk/react/otp-input"

export function Example() {
  return (
    <OTPInput maxLength={4} textAlign="center" aria-label="PIN">
      <OTPInputGroup>
        {[0, 1, 2, 3].map((index) => (
          <OTPInputSlot key={index} index={index} />
        ))}
      </OTPInputGroup>
    </OTPInput>
  )
}
