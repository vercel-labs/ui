<script lang="ts">
  import { Tabs, TabsList, TabsPanel, TabsTab } from "@ui-sdk/svelte/tabs"

  const policies = [
    {
      value: "shipping",
      label: "Shipping",
      text: "Orders leave our warehouse within two working days. Express delivery arrives the next morning.",
    },
    {
      value: "returns",
      label: "Returns",
      text: "Send anything back within 30 days. Opened electronics carry a restocking fee of 10 percent.",
    },
    {
      value: "warranty",
      label: "Warranty",
      text: "Every product has a two year warranty. Batteries are covered for one year.",
    },
  ]
</script>

<Tabs defaultValue="shipping" hiddenUntilFound>
  <TabsList aria-label="Policies">
    {#each policies as policy (policy.value)}
      <TabsTab value={policy.value}>
        {policy.label}
      </TabsTab>
    {/each}
  </TabsList>
  {#each policies as policy (policy.value)}
    <TabsPanel value={policy.value}>
      <h3>{policy.label}</h3>
      <p data-slot="hint">{policy.text}</p>
    </TabsPanel>
  {/each}
</Tabs>
