<script lang="ts">
  import { Field, FieldControl, FieldLabel } from "@ui-sdk/svelte/field"
  import { Tabs, TabsIndicator, TabsList, TabsPanel, TabsTab } from "@ui-sdk/svelte/tabs"
</script>

<Tabs defaultValue="reply">
  <TabsList aria-label="Comment">
    <TabsTab value="reply">Reply</TabsTab>
    <TabsTab value="formatting">Formatting</TabsTab>
    <TabsIndicator />
  </TabsList>
  <TabsPanel value="reply" keepMounted>
    <Field>
      <FieldLabel>Message</FieldLabel>
      <FieldControl rows="3" placeholder="Write a reply…">
        {#snippet render({ props })}
          <textarea {...props}></textarea>
        {/snippet}
      </FieldControl>
    </Field>
  </TabsPanel>
  <TabsPanel value="formatting">
    <p>Use **bold**, _italics_ and `code` to format your reply.</p>
    <p>Paste a link on its own line to show a preview.</p>
  </TabsPanel>
</Tabs>
