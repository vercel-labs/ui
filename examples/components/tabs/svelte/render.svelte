<script lang="ts">
  import { Tabs, TabsList, TabsPanel, TabsTab } from "@ui-sdk/svelte/tabs"

  const folders = [
    { value: "inbox", label: "Inbox", count: 12 },
    { value: "unread", label: "Unread", count: 3 },
    { value: "archived", label: "Archived", count: 0 },
  ]
</script>

<Tabs defaultValue="inbox">
  <TabsList aria-label="Mail">
    {#each folders as folder (folder.value)}
      <TabsTab value={folder.value}>
        {#snippet render({ props })}
          <button {...props}>
            {folder.label}
            {#if folder.count > 0}
              <span data-slot="row">
                {folder.count}
              </span>
            {/if}
          </button>
        {/snippet}
      </TabsTab>
    {/each}
  </TabsList>
  {#each folders as folder (folder.value)}
    <TabsPanel value={folder.value}>
      {folder.count > 0 ? `${folder.count} conversations.` : "Nothing archived yet."}
    </TabsPanel>
  {/each}
</Tabs>
