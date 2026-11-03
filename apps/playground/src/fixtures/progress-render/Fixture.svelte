<script lang="ts">
  import {
    Avatar,
    AvatarFallback,
    OTPInput,
    OTPInputSlot,
    Progress,
    ProgressIndicator,
    ProgressTrack,
    ProgressValue,
  } from "@ui-sdk/svelte"

  // Parts rendered as other elements, and from their state. One fixture
  // covers Progress, Avatar and OTP Input.
  let value = $state(40)
</script>

<div class="fixture">
  <button>Before</button>
  <Progress
    {value}
    aria-label="Export"
    class={`gauge is-${value >= 100 ? "complete" : "progressing"}`}
  >
    {#snippet render({ props, state })}
      <section {...props}>
        <ProgressValue>
          {#snippet children(valueState)}{valueState.percent}% done{/snippet}
        </ProgressValue>
        <ProgressTrack class="gauge-track"
          ><ProgressIndicator class="gauge-indicator" data-status={state.status} /></ProgressTrack
        >
      </section>
    {/snippet}
  </Progress>
  <Avatar class="avatar">
    {#snippet render({ props })}
      <div {...props}>
        <AvatarFallback class="avatar-fallback">
          {#snippet children(state)}
            <span class={`is-${state.loadingStatus}`}>RF</span>
          {/snippet}
        </AvatarFallback>
      </div>
    {/snippet}
  </Avatar>
  <OTPInput aria-label="PIN" maxLength={4} class="otp">
    {#snippet render({ props, state, children })}
      <section {...props}>{@render children?.(state)}</section>
    {/snippet}
    {#each { length: 4 }, index (index)}
      <OTPInputSlot {index} class="otp-slot">
        {#snippet children(state)}
          <span class={state.active ? "is-active" : ""}>{state.char ?? "·"}</span>
        {/snippet}
      </OTPInputSlot>
    {/each}
  </OTPInput>
  <button onclick={() => (value = 100)}>Finish</button>
  <button>After</button>
  <output role="status" aria-label="Last action"></output>
</div>
