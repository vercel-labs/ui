<script setup lang="ts">
import { ArchiveIcon, MailIcon, ReplyIcon } from "@lucide/vue"
import { Tabs, TabsList, TabsPanel, TabsTab, TabsTabIcon } from "@ui-sdk/vue/tabs"
</script>

<template>
  <Tabs default-value="inbox">
    <TabsList aria-label="Mail">
      <TabsTab value="inbox">
        <TabsTabIcon>
          <MailIcon />
        </TabsTabIcon>
        Inbox
      </TabsTab>
      <TabsTab value="replies">
        <TabsTabIcon mirror>
          <ReplyIcon />
        </TabsTabIcon>
        Replies
      </TabsTab>
      <TabsTab value="archive">
        <TabsTabIcon>
          <ArchiveIcon />
        </TabsTabIcon>
        Archive
      </TabsTab>
    </TabsList>
    <TabsPanel value="inbox">Messages sent to you.</TabsPanel>
    <TabsPanel value="replies">Replies to your messages.</TabsPanel>
    <TabsPanel value="archive">Messages you put away.</TabsPanel>
  </Tabs>
</template>
