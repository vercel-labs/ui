<script lang="ts">
  import { Tabs, TabsIndicator, TabsList, TabsPanel, TabsTab } from "@ui-sdk/svelte/tabs"
</script>

<Tabs defaultValue="reply">
  <TabsList aria-label="Comment">
    <TabsTab value="reply">
      Reply
    </TabsTab>
    <TabsTab value="formatting">
      Formatting
    </TabsTab>
    <TabsIndicator />
  </TabsList>
  <TabsPanel value="reply" keepMounted>
    <textarea
      aria-label="Reply"
      placeholder="Write a reply…"
    ></textarea>
  </TabsPanel>
  <TabsPanel value="formatting">
    Use **bold**, _italics_ and `code`. Paste a link to embed it.
  </TabsPanel>
</Tabs>
