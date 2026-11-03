import { Field, FieldDescription, FieldLabel } from "@ui-sdk/react/field"
import { Radio, RadioGroup, RadioIndicator } from "@ui-sdk/react/radio"

const environments = [
  { value: "kubernetes", title: "Kubernetes", description: "Run GPU workloads on a K8s configured cluster." },
  {
    value: "vm",
    title: "Virtual machine",
    description: "Access a VM configured cluster to run GPU workloads.",
  },
]

export function Example() {
  return (
    <Field>
      <FieldLabel>Compute environment</FieldLabel>
      <FieldDescription>Select the compute environment for your cluster.</FieldDescription>
      <RadioGroup name="environment" defaultValue="kubernetes">
        {environments.map((environment) => (
          <label data-slot="card" key={environment.value}>
            <span data-slot="stack">
              <span>{environment.title}</span>
              <span data-slot="hint">{environment.description}</span>
            </span>
            <Radio value={environment.value}>
              <RadioIndicator />
            </Radio>
          </label>
        ))}
      </RadioGroup>
    </Field>
  )
}
