<script lang="ts">
  import { Check } from "@lucide/svelte"
  import { Checkbox, CheckboxIndicator } from "@ui-sdk/svelte/checkbox"
</script>

<label data-slot="label">
  <Checkbox>
    <CheckboxIndicator>
      <Check aria-hidden="true" />
    </CheckboxIndicator>
  </Checkbox>
  Accept terms and conditions
</label>
