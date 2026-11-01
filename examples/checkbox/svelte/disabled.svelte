<script lang="ts">
  import { Check } from "@lucide/svelte"
  import { Checkbox, CheckboxIndicator } from "@ui-sdk/svelte/checkbox"
</script>

<div data-slot="stack">
  <label data-slot="label">
    <Checkbox defaultChecked disabled>
      <CheckboxIndicator>
        <Check aria-hidden="true" />
      </CheckboxIndicator>
    </Checkbox>
    Security alerts
  </label>
  <label data-slot="label">
    <Checkbox disabled>
      <CheckboxIndicator>
        <Check aria-hidden="true" />
      </CheckboxIndicator>
    </Checkbox>
    Enable notifications
  </label>
</div>
