<script setup lang="ts">
import {
  createDrawerController,
  Drawer,
  DrawerBackdrop,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from "@ui-sdk/vue/drawer"
import { ref } from "vue"

type SharedDocument = { name: string; size: string; uploading?: boolean }

const documents: SharedDocument[] = [
  { name: "Budget.xlsx", size: "48 KB" },
  { name: "Roadmap.pdf", size: "1.2 MB" },
  { name: "Launch video.mp4", size: "310 MB", uploading: true },
]

const share = createDrawerController<SharedDocument, "copy" | "email">()
const SharedDocumentDrawerContent = DrawerContent<SharedDocument>
const status = ref("")

async function shareLatest() {
  const { reason, returnValue } = await share.open({ payload: documents[1] })
  status.value = returnValue ? `Shared from code: ${returnValue}` : `Closed with ${reason}`
}

function onOpenChange(open: boolean, details: { returnValue?: string }) {
  if (!open && details.returnValue) status.value = `Shared: ${details.returnValue}`
}
</script>

<template>
  <div data-slot="stack">
    <ul data-slot="list">
      <li data-slot="row" v-for="file in documents" :key="file.name">
        <span data-slot="row">
          {{ file.name }}
          <span data-slot="hint">{{ file.uploading ? "Uploading…" : file.size }}</span>
        </span>
        <DrawerTrigger
          :controller="share"
          :payload="file"
          :disabled="file.uploading"
          :aria-label="`Share ${file.name}`"
          >Share</DrawerTrigger
        >
      </li>
    </ul>
    <div data-slot="row">
      <button data-variant="solid" type="button" @click="shareLatest">Share the roadmap</button>
      <span data-slot="hint" role="status">{{ status }}</span>
    </div>
    <Drawer :controller="share" @open-change="onOpenChange">
      <DrawerBackdrop />
      <SharedDocumentDrawerContent v-slot="{ state }">
        <div data-slot="grip" aria-hidden="true" />
        <div data-slot="stack">
          <DrawerTitle>Share {{ state.payload?.name }}</DrawerTitle>
          <DrawerDescription>Anyone with the link can view it.</DrawerDescription>
        </div>
        <div data-slot="stack">
          <DrawerClose data-variant="solid" value="copy">Copy link</DrawerClose>
          <DrawerClose value="email">Send by email</DrawerClose>
        </div>
      </SharedDocumentDrawerContent>
    </Drawer>
  </div>
</template>
