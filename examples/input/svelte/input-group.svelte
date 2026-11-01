<script lang="ts">
  import { Field, FieldLabel } from "@ui-sdk/svelte/field"
  import { Input, InputGroup } from "@ui-sdk/svelte/input"
</script>

<div data-slot="stack">

  <Field name="website">
    <FieldLabel>
      Website
    </FieldLabel>
    <InputGroup>
      <span>https://</span>
      <Input placeholder="example" />
      <span>.com</span>
    </InputGroup>
  </Field>

</div>
