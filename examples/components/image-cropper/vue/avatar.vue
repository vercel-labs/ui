<script setup lang="ts">
import { onBeforeUnmount, ref } from "vue"
import { cropImage } from "@ui-sdk/vue/image"
import {
  ImageCropper,
  ImageCropperImage,
  ImageCropperRotate,
  ImageCropperSelection,
  ImageCropperViewport,
  ImageCropperZoom,
  type ImageCrop,
} from "@ui-sdk/vue/image-cropper"

const photo = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="420"><rect width="640" height="420" fill="#fde68a"/><circle cx="460" cy="150" r="56" fill="#fff7ed"/><path d="M0 280 120 170l110 100 120-130 130 125 90-60 70 40v175H0z" fill="#a78bfa"/><path d="M0 330l160-80 120 70 150-80 210 85v95H0z" fill="#6d28d9"/><path d="M0 380q160-35 320-10t320-5v55H0z" fill="#2e1065"/></svg>`,
)}`

const crop = ref<ImageCrop>()
const avatar = ref<string>()

async function save() {
  if (!crop.value) return
  const file = await cropImage(photo, crop.value, { width: 128, shape: "circle" })
  if (avatar.value) URL.revokeObjectURL(avatar.value)
  avatar.value = URL.createObjectURL(file)
}

onBeforeUnmount(() => avatar.value && URL.revokeObjectURL(avatar.value))
</script>

<template>
  <ImageCropper
    v-model:crop="crop"
    aria-label="Profile photo"
    :src="photo"
    mode="frame"
    :aspect-ratio="1"
    shape="circle"
    :max-zoom="4"
  >
    <ImageCropperViewport>
      <ImageCropperImage alt="Mountains at sunset" />
      <ImageCropperSelection />
    </ImageCropperViewport>
    <div data-slot="row">
      <ImageCropperZoom />
      <ImageCropperRotate>Rotate</ImageCropperRotate>
    </div>
    <div data-slot="row">
      <button type="button" @click="save">Save Avatar</button>
      <img v-if="avatar" data-slot="image-cropper-avatar" :src="avatar" alt="Your new avatar" />
    </div>
  </ImageCropper>
</template>
