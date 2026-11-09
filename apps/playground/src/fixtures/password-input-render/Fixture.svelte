<script lang="ts">
  import {
    PasswordInput,
    PasswordInputControl,
    PasswordInputToggle,
  } from "@ui-sdk/svelte"

  let action = $state("")
</script>

<div class="fixture">
  <button>Before</button>
  <PasswordInput
    class="password-input"
    onVisibleChange={(visible) => (action = `visible: ${visible}`)}
  >
    <PasswordInputControl class="input" aria-label="Password" />
    <PasswordInputToggle aria-label="Show password">
      {#snippet render({ props, state })}
        <span
          {...props}
          class={[
            "password-toggle",
            state.visible ? "is-visible" : "is-hidden",
          ]}
        >
          <span aria-hidden="true">{state.visible ? "Hide" : "Show"}</span>
        </span>
      {/snippet}
    </PasswordInputToggle>
  </PasswordInput>
  <button>After</button>
  <output role="status" aria-label="Last action">{action}</output>
</div>
