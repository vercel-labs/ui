<script setup lang="ts">
import type { ChangeDetails } from "@ui-sdk/core"
import { Avatar, AvatarFallback, AvatarImage } from "@ui-sdk/vue"
import { avatarAction, avatarFixture } from "tests/fixtures/avatar.ts"
import { ref } from "vue"

const [first, ...rest] = avatarFixture.items
const action = ref("")
const src = ref<string | undefined>(first.src)
const mounts = ref(0)

function onStatus(status: string, details: ChangeDetails) {
  action.value = avatarAction(status, details.reason)
}
</script>

<template>
  <div class="fixture">
    <button>Before</button>
    <Avatar :key="mounts" class="avatar" @loading-status-change="onStatus">
      <AvatarImage
        v-if="src !== undefined"
        class="avatar-image"
        :src="src"
        :alt="first.name"
      />
      <AvatarFallback class="avatar-fallback">{{
        first.initials
      }}</AvatarFallback>
    </Avatar>
    <Avatar v-for="item in rest" :key="item.name" class="avatar">
      <AvatarImage
        v-if="item.src !== undefined"
        class="avatar-image"
        :src="item.src"
        :alt="item.name"
        :referrerpolicy="item.referrerPolicy"
        :crossorigin="item.crossOrigin"
      />
      <AvatarFallback class="avatar-fallback" :delay="item.delay">{{
        item.initials
      }}</AvatarFallback>
    </Avatar>
    <button @click="src = avatarFixture.nextSrc">Change image</button>
    <button @click="src = undefined">Remove image</button>
    <button @click="mounts++">Remount</button>
    <button>After</button>
    <output role="status" aria-label="Last action">{{ action }}</output>
  </div>
</template>
