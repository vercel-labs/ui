<script setup lang="ts">
import { Field, FieldControl, FieldLabel } from "@ui-sdk/vue/field"
import { Tabs, TabsIndicator, TabsList, TabsPanel, TabsTab } from "@ui-sdk/vue/tabs"
</script>

<template>
  <Tabs default-value="reply">
    <TabsList aria-label="Comment">
      <TabsTab value="reply">Reply</TabsTab>
      <TabsTab value="formatting">Formatting</TabsTab>
      <TabsIndicator />
    </TabsList>
    <TabsPanel value="reply" keep-mounted>
      <Field>
        <FieldLabel>Message</FieldLabel>
        <FieldControl rows="3" placeholder="Write a reply…">
          <template #render="{ props }">
            <textarea v-bind="props" />
          </template>
        </FieldControl>
      </Field>
    </TabsPanel>
    <TabsPanel value="formatting">
      <p>Use **bold**, _italics_ and `code` to format your reply.</p>
      <p>Paste a link on its own line to show a preview.</p>
    </TabsPanel>
  </Tabs>
</template>
