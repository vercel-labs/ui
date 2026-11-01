<script lang="ts">
  import { Field, FieldControl, FieldDescription, FieldLabel } from "@ui-sdk/svelte/field"

  const departments = [
    { value: "engineering", label: "Engineering" },
    { value: "design", label: "Design" },
    { value: "marketing", label: "Marketing" },
    { value: "sales", label: "Sales" },
    { value: "support", label: "Customer support" },
  ]
</script>

<Field>
  <FieldLabel>Department</FieldLabel>
  <FieldControl name="department">
    {#snippet render({ props })}
      <select {...props}>
        <option value="" disabled selected>Choose department</option>
        {#each departments as department (department.value)}
          <option value={department.value}>{department.label}</option>
        {/each}
      </select>
    {/snippet}
  </FieldControl>
  <FieldDescription>Select your department or area of work.</FieldDescription>
</Field>
