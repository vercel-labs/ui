<script lang="ts">
  import { CheckIcon, MinusIcon } from "@lucide/svelte"
  import { Checkbox, CheckboxIndicator } from "@ui-sdk/svelte/checkbox"
</script>

<label data-slot="label">
  <Checkbox defaultChecked="indeterminate">
    <CheckboxIndicator>
      {#snippet children(state)}
        {#if state.indeterminate}
          <MinusIcon aria-hidden="true" />
        {:else}
          <CheckIcon aria-hidden="true" />
        {/if}
      {/snippet}
    </CheckboxIndicator>
  </Checkbox>
  All notifications
</label>
