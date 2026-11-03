import { Field, FieldDescription, FieldError, FieldLabel } from "@ui-sdk/react/field"
import { FileInput, FileInputDropzone, FileInputTrigger } from "@ui-sdk/react/file-input"
import * as React from "react"

export function Example() {
  const [sent, setSent] = React.useState(false)

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        setSent(true)
      }}
      onReset={() => setSent(false)}
      data-slot="stack"
    >
      <Field>
        <FieldLabel>Proof of address</FieldLabel>
        <FileInput name="proof" required accept={["image/*", ".pdf"]}>
          {({ value: [file] }) => (
            <FileInputDropzone>
              <span data-slot="hint">{file?.name ?? "Drop a scan here"}</span>
              <FileInputTrigger>{file ? "Replace" : "Choose a file"}</FileInputTrigger>
            </FileInputDropzone>
          )}
        </FileInput>
        <FieldDescription>A utility bill or bank statement from the last 3 months.</FieldDescription>
        <div>
          <FieldError match="valueMissing">Add a scan to continue.</FieldError>
        </div>
      </Field>
      <div data-slot="row">
        <button type="submit">Continue</button>
        <button type="reset">Reset</button>
        <span data-slot="output">{sent ? "Sent." : ""}</span>
      </div>
    </form>
  )
}
