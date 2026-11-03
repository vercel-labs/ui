<script lang="ts">
  import { Field, FieldDescription, FieldLabel } from "@ui-sdk/svelte/field"
  import { Radio, RadioGroup, RadioIndicator } from "@ui-sdk/svelte/radio"

  const environments = [
    { value: "kubernetes", title: "Kubernetes", description: "Run GPU workloads on a K8s configured cluster." },
    {
      value: "vm",
      title: "Virtual machine",
      description: "Access a VM configured cluster to run GPU workloads.",
    },
  ]
</script>

<Field>
  <FieldLabel>Compute environment</FieldLabel>
  <FieldDescription>
    Select the compute environment for your cluster.
  </FieldDescription>
  <RadioGroup name="environment" defaultValue="kubernetes">
    {#each environments as environment (environment.value)}
      <label data-slot="card">
        <span data-slot="stack">
          <span>{environment.title}</span>
          <span data-slot="hint">{environment.description}</span>
        </span>
        <Radio value={environment.value}>
          <RadioIndicator />
        </Radio>
      </label>
    {/each}
  </RadioGroup>
</Field>
