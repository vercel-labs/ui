<script lang="ts">
  import { Moon, Sun } from "@lucide/svelte"
  import { Switch, SwitchThumb } from "@ui-sdk/svelte/switch"
</script>

<label data-slot="label">
  <Switch>
    {#snippet render({ props, state })}
      <button {...props}>
        <SwitchThumb>
          {#snippet render({ props, state: thumbState })}
            <span {...props}>
              {#if thumbState.checked}<Moon />{:else}<Sun />{/if}
            </span>
          {/snippet}
        </SwitchThumb>
      </button>
    {/snippet}
  </Switch>
  Dark mode
</label>
