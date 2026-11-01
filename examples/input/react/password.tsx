import { Field, FieldLabel } from "@ui-sdk/react/field"
import { Input, InputGroup } from "@ui-sdk/react/input"
import { Eye, EyeOff } from "lucide-react"
import * as React from "react"

export function Example() {
  const [visible, setVisible] = React.useState(false)
  return (
    <Field name="password">
      <FieldLabel>Password</FieldLabel>
      <InputGroup>
        <Input type={visible ? "text" : "password"} autoComplete="current-password" />
        <button
          type="button"
          aria-label="Show password"
          aria-pressed={visible}
          onClick={() => setVisible((value) => !value)}
        >
          {visible ? <EyeOff /> : <Eye />}
        </button>
      </InputGroup>
    </Field>
  )
}
