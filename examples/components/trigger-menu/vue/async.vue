<script setup lang="ts">
import {
  type TriggerMenuDataItem,
  TriggerMenu,
  TriggerMenuContent,
  TriggerMenuEmpty,
  TriggerMenuInput,
  TriggerMenuItem,
  TriggerMenuList,
  TriggerMenuStatus,
} from "@ui-sdk/vue/trigger-menu"

const channels = ["general", "random", "design", "engineering", "marketing", "support"]

function searchChannels(query: string, { signal }: { signal: AbortSignal }) {
  return new Promise<{ value: string; label: string }[]>((resolve, reject) => {
    const timer = setTimeout(
      () =>
        resolve(
          channels
            .filter((channel) => channel.includes(query.toLowerCase()))
            .map((channel) => ({ value: channel, label: channel })),
        ),
      400,
    )
    signal.addEventListener("abort", () => {
      clearTimeout(timer)
      reject(signal.reason)
    })
  })
}
</script>

<template>
  <TriggerMenu :triggers="[{ char: '#', type: 'channel', items: searchChannels }]">
    <div data-slot="stack">
      <TriggerMenuInput aria-label="Message" placeholder="Type # to link a channel" />
      <TriggerMenuStatus v-slot="{ state }">
        {{
          state.loading
            ? "Loading channels…"
            : state.open
              ? `${state.count} channels`
              : state.status === "error"
                ? "Couldn't load channels."
                : ""
        }}
      </TriggerMenuStatus>
    </div>
    <TriggerMenuContent>
      <TriggerMenuEmpty>No channels found.</TriggerMenuEmpty>
      <TriggerMenuList v-slot="{ state }">
        <TriggerMenuItem
          v-for="item in state.items as TriggerMenuDataItem[]"
          :key="item.value"
          :value="item.value"
          :label="item.label"
          :disabled="item.disabled"
        >
          {{ item.label }}
        </TriggerMenuItem>
      </TriggerMenuList>
    </TriggerMenuContent>
  </TriggerMenu>
</template>
