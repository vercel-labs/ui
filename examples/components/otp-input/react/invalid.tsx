import { OTPInput, OTPInputGroup, OTPInputSlot } from "@ui-sdk/react/otp-input"

export function Example() {
  return (
    <div data-slot="stack">
      <OTPInput
        defaultValue="000000"
        aria-label="Verification code"
        aria-invalid
        aria-describedby="otp-error"
      >
        <OTPInputGroup>
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <OTPInputSlot key={index} index={index} />
          ))}
        </OTPInputGroup>
      </OTPInput>
      <p id="otp-error">That code didn't work. Check it and try again.</p>
    </div>
  )
}
