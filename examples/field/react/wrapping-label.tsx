import { Checkbox, CheckboxIndicator } from "@ui-sdk/react/checkbox"
import { Field, FieldDescription, FieldLabel } from "@ui-sdk/react/field"
import { Check } from "lucide-react"

const options = [
  { name: "backups", title: "Daily backups", description: "Keep a copy of every database each night." },
  { name: "alerts", title: "Usage alerts", description: "Email the team when usage passes its limit." },
]

export function Example() {
  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      {options.map((option) => (
        <FieldLabel
          key={option.name}
          className="cursor-pointer rounded-2xl border border-border p-4 transition-colors hover:bg-input/40 has-data-checked:bg-input/30"
        >
          <Field className="flex flex-row items-start gap-3">
            <Checkbox
              className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-[5px] border border-transparent bg-input/90 outline-none transition-shadow focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground data-disabled:opacity-50"
              name={option.name}
            >
              <CheckboxIndicator className="grid place-content-center">
                <Check className="size-3.5" />
              </CheckboxIndicator>
            </Checkbox>
            <span className="flex flex-col gap-1">
              <span className="text-sm leading-snug font-medium">{option.title}</span>
              <FieldDescription className="text-sm text-muted-foreground">
                {option.description}
              </FieldDescription>
            </span>
          </Field>
        </FieldLabel>
      ))}
    </div>
  )
}
