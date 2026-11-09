<script lang="ts">
  import { Tabs, TabsList, TabsPanel, TabsTab } from "@ui-sdk/svelte"
  import { tabsOptions } from "tests/fixtures/page.ts"

  const { activation } = tabsOptions()
  let action = $state("")
  let reason = $state("")
</script>

<div class="fixture">
  <button>Before</button>
  <Tabs
    class="tabs"
    defaultValue="overview"
    {activation}
    onValueChange={(value, details) => {
      action = value ?? ""
      reason = details.reason
    }}
  >
    <TabsList class="tablist" aria-label="Project">
      <TabsTab class="tab" value="overview" href="#overview">
        {#snippet render({ props })}
          <a {...props}>Overview</a>
        {/snippet}
      </TabsTab>
      <TabsTab class="tab" value="activity" href="#activity">
        {#snippet render({ props })}
          <a {...props}>Activity</a>
        {/snippet}
      </TabsTab>
      <TabsTab class="tab" value="watched">
        {#snippet render({ props, state })}
          <button {...props}
            >Watched{#if state.selected}<span aria-hidden="true">
                •</span
              >{/if}</button
          >
        {/snippet}
      </TabsTab>
      <TabsTab class="tab" value="plain">
        {#snippet children(state)}
          <span class={state.selected ? "is-selected" : "is-unselected"}
            >Plain</span
          >
        {/snippet}
      </TabsTab>
    </TabsList>
    {#each ["overview", "activity", "watched", "plain"] as value (value)}
      <TabsPanel class="panel" {value}>The {value} panel.</TabsPanel>
    {/each}
  </Tabs>
  <button>After</button>
  <output role="status" aria-label="Last action">{action}</output>
  <output role="status" aria-label="Reason">{reason}</output>
</div>
