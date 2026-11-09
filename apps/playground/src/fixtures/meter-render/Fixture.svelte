<script lang="ts">
  import { Meter, MeterIndicator, MeterTrack, MeterValue } from "@ui-sdk/svelte"

  // Parts rendered as other elements, and from their state.
  let value = $state(40)
</script>

<div class="fixture">
  <button>Before</button>
  <Meter {value} aria-label="Memory">
    {#snippet render({ props, state })}
      <section
        {...props}
        class={`gauge ${state.percent >= 80 ? "is-high" : "is-ok"}`}
      >
        <MeterValue>
          {#snippet children(valueState)}{valueState.text} used{/snippet}
        </MeterValue>
        <MeterTrack class="gauge-track"
          ><MeterIndicator class="gauge-indicator" /></MeterTrack
        >
      </section>
    {/snippet}
  </Meter>
  <button onclick={() => (value = 90)}>Fill</button>
  <button>After</button>
  <output role="status" aria-label="Last action"></output>
</div>
