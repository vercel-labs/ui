"use client"

import { Tabs, TabsList, TabsPanel, TabsTab, TabsTabIcon } from "@ui-sdk/react/tabs"
import { ArchiveIcon, MailIcon, ReplyIcon } from "lucide-react"

function Example() {
  return (
    <Tabs defaultValue="inbox">
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
  )
}

export { Example }
