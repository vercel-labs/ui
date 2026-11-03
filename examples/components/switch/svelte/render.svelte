<script lang="ts">
  import { MoonIcon, SunIcon } from "@lucide/svelte"
  import { Switch, SwitchThumb } from "@ui-sdk/svelte/switch"
</script>

<label data-slot="label">
  <Switch>
    {#snippet render({ props, state })}
      <button {...props}>
        <SwitchThumb>
          {#snippet render({ props, state: thumbState })}
            <span {...props}>
              {#if thumbState.checked}<MoonIcon />{:else}<SunIcon />{/if}
            </span>
          {/snippet}
        </SwitchThumb>
      </button>
    {/snippet}
  </Switch>
  Dark mode
</label>
