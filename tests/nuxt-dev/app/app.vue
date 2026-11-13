<script setup lang="ts">
import { createPreference } from "@ui-sdk/core"
import { tabs } from "@ui-sdk/core/tabs"
import { createParts } from "@ui-sdk/vue/primitive"

const view = createPreference({
  values: ["list", "grid"],
  defaultValue: "list",
  attribute: "data-view",
})
const {
  Root: Segments,
  List: SegmentList,
  Tab: Segment,
  Panel: SegmentPanel,
} = createParts(tabs, { root: "div", list: "div", tab: "button", panel: "div" })
</script>

<template>
  <Preferences :preferences="[view]">
    <Tabs default-value="account">
      <TabsList aria-label="Settings">
        <TabsTab value="account">Account</TabsTab>
        <TabsTab value="password">Password</TabsTab>
      </TabsList>
      <TabsPanel value="account">Your profile.</TabsPanel>
      <TabsPanel value="password">A new password.</TabsPanel>
    </Tabs>
    <Segments default-value="day">
      <SegmentList aria-label="Range">
        <Segment value="day">Day</Segment>
        <Segment value="week">Week</Segment>
      </SegmentList>
      <SegmentPanel value="day">128 visitors today.</SegmentPanel>
      <SegmentPanel value="week">1,024 visitors this week.</SegmentPanel>
    </Segments>
  </Preferences>
</template>
