<script lang="ts">
  import { Check, Minus } from "@lucide/svelte"
  import { Checkbox, CheckboxIndicator } from "@ui-sdk/svelte/checkbox"
</script>

<label data-slot="label">
  <Checkbox defaultChecked="indeterminate">
    <CheckboxIndicator>
      {#snippet children(state)}
        {#if state.indeterminate}
          <Minus aria-hidden="true" />
        {:else}
          <Check aria-hidden="true" />
        {/if}
      {/snippet}
    </CheckboxIndicator>
  </Checkbox>
  All notifications
</label>
