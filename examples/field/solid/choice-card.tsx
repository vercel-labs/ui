import { Field, FieldDescription, FieldLabel } from "@ui-sdk/solid/field"
import { Radio, RadioGroup, RadioIndicator } from "@ui-sdk/solid/radio"
import { For } from "solid-js"

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
        <For each={environments}>
          {(environment) => (
            <label data-slot="card">
              <span data-slot="stack">
                <span>{environment.title}</span>
                <span data-slot="hint">{environment.description}</span>
              </span>
              <Radio value={environment.value}>
                <RadioIndicator />
              </Radio>
            </label>
          )}
        </For>
      </RadioGroup>
    </Field>
  )
}
