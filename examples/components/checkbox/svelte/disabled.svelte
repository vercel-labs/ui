<script lang="ts">
  import { CheckIcon } from "@lucide/svelte"
  import { Checkbox, CheckboxIndicator } from "@ui-sdk/svelte/checkbox"
</script>

<div data-slot="stack">
  <label data-slot="label">
    <Checkbox defaultChecked disabled>
      <CheckboxIndicator>
        <CheckIcon aria-hidden="true" />
      </CheckboxIndicator>
    </Checkbox>
    Security alerts
  </label>
  <label data-slot="label">
    <Checkbox disabled>
      <CheckboxIndicator>
        <CheckIcon aria-hidden="true" />
      </CheckboxIndicator>
    </Checkbox>
    Enable notifications
  </label>
</div>
