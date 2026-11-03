<script lang="ts">
  import { ChevronDownIcon } from "@lucide/svelte"
  import { Collapsible, CollapsiblePanel, CollapsibleTrigger } from "@ui-sdk/svelte/collapsible"

  const notes = [
    "Search now matches file contents, not only names.",
    "Shared links remember the folder they were opened from.",
    "Uploads resume after the connection drops.",
  ]

  let settled = $state("")
</script>


  <Collapsible onOpenChangeComplete={(open) => (settled = open ? "opening" : "closing")}>
    <CollapsibleTrigger data-variant="secondary">
      Release notes
      <ChevronDownIcon />
    </CollapsibleTrigger>
    <CollapsiblePanel>
      <ul>
        {#each notes as note (note)}
          <li>{note}</li>
        {/each}
      </ul>
    </CollapsiblePanel>
  </Collapsible>
  <output data-slot="output">
    {settled ? `Finished ${settled}` : "Not animated yet"}
  </output>

