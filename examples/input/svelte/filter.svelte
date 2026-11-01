<script lang="ts">
  import { Field, FieldDescription, FieldLabel } from "@ui-sdk/svelte/field"
  import { Input } from "@ui-sdk/svelte/input"
</script>

<Field name="code">
  <FieldLabel>
    Verification code
  </FieldLabel>
  <Input
    inputmode="numeric"
    autocomplete="one-time-code"
    maxlength={6}
    onValueChange={(value: string, details: { cancel: () => void }) => {
      if (!/^\d*$/.test(value)) details.cancel()
    }}
  />
  <FieldDescription>
    Six digits from the text we sent.
  </FieldDescription>
</Field>
