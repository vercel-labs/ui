<script setup lang="ts">
import { ChevronDownIcon } from "@lucide/vue"
import {
  Chronology,
  ChronologyConnector,
  ChronologyDescription,
  ChronologyItem,
  ChronologyMarker,
  ChronologyTime,
  ChronologyTitle,
} from "@ui-sdk/vue/chronology"
import {
  Collapsible,
  CollapsiblePanel,
  CollapsibleTrigger,
} from "@ui-sdk/vue/collapsible"

const releases = [
  {
    title: "Version 2.4",
    dateTime: "2026-10-28",
    time: "October 28",
    description: "Faster search and resumable uploads.",
    changes: [
      "Search now matches file contents, not only names.",
      "Uploads resume after the connection drops.",
    ],
  },
  {
    title: "Version 2.3",
    dateTime: "2026-09-30",
    time: "September 30",
    description: "Shared links and a new sidebar.",
    changes: [
      "Shared links remember the folder they were opened from.",
      "The sidebar collapses to icons on narrow screens.",
    ],
  },
  {
    title: "Version 2.2",
    dateTime: "2026-08-26",
    time: "August 26",
    description: "Dark mode follows your system.",
    changes: ["Dark mode follows the system setting.", "Avatars are sharper."],
  },
]
</script>

<template>
  <Chronology aria-label="Changelog">
    <ChronologyItem v-for="release in releases" :key="release.title">
      <ChronologyMarker />
      <ChronologyConnector />
      <ChronologyTitle>{{ release.title }}</ChronologyTitle>
      <ChronologyTime :datetime="release.dateTime">
        {{ release.time }}
      </ChronologyTime>
      <ChronologyDescription>{{ release.description }}</ChronologyDescription>
      <Collapsible>
        <CollapsibleTrigger>
          What Changed
          <ChevronDownIcon aria-hidden="true" />
        </CollapsibleTrigger>
        <CollapsiblePanel>
          <ul>
            <li v-for="change in release.changes" :key="change">
              {{ change }}
            </li>
          </ul>
        </CollapsiblePanel>
      </Collapsible>
    </ChronologyItem>
  </Chronology>
</template>
