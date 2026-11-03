import { OTPInput, OTPInputGroup, OTPInputSeparator, OTPInputSlot } from "@ui-sdk/react/otp-input"
import { MinusIcon } from "lucide-react"

export function Example() {
  return (
    <OTPInput maxLength={8} pattern="alphanumeric" aria-label="Recovery code">
      <OTPInputGroup>
        {[0, 1, 2, 3].map((index) => (
          <OTPInputSlot key={index} index={index} />
        ))}
      </OTPInputGroup>
      <OTPInputSeparator>
        <MinusIcon aria-hidden="true" />
      </OTPInputSeparator>
      <OTPInputGroup>
        {[4, 5, 6, 7].map((index) => (
          <OTPInputSlot key={index} index={index} />
        ))}
      </OTPInputGroup>
    </OTPInput>
  )
}
