<script lang="ts">
  import { Field, FieldError, FieldLabel } from "../../src/field"
  import { Input } from "../../src/input"
</script>

<Field invalid>
  <FieldLabel>Name</FieldLabel>
  <Input />
  <FieldError match>Pick a name.</FieldError>
</Field>
