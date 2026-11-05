<script lang="ts">
  import {
    createImageCropperController,
    ImageCropper,
    ImageCropperFlip,
    ImageCropperGrid,
    ImageCropperHandle,
    ImageCropperImage,
    ImageCropperRotate,
    ImageCropperSelection,
    ImageCropperViewport,
    ImageCropperZoom,
    type ImageCropperCropChangeDetails,
    type ImageCropperCropCommitDetails,
  } from "@ui-sdk/svelte"
  import { imageCropperOptions } from "tests/fixtures/page.ts"
  import { describeCrop, imageCropperFixture } from "tests/fixtures/image-cropper.ts"

  const controller = createImageCropperController()
  const { cancel, ...options } = imageCropperOptions()

  let action = $state("")
  let committed = $state("")

  function onCropChange(crop: Parameters<typeof describeCrop>[0], details: ImageCropperCropChangeDetails) {
    if (cancel && details.reason !== "image-load") return details.cancel()
    action = `${describeCrop(crop)}:${details.reason}`
  }

  function onCropCommit(crop: Parameters<typeof describeCrop>[0], details: ImageCropperCropCommitDetails) {
    committed = `${describeCrop(crop)}:${details.reason}`
  }
</script>

<div class="fixture">
  <button type="button">Before</button>
  <ImageCropper
    aria-label={imageCropperFixture.label}
    src={imageCropperFixture.src}
    {...options}
    {controller}
    {onCropChange}
    {onCropCommit}
  >
    <ImageCropperViewport>
      <ImageCropperImage alt={imageCropperFixture.alt} />
      <ImageCropperSelection>
        <ImageCropperGrid />
        {#each imageCropperFixture.handles as position (position)}
          <ImageCropperHandle {position} />
        {/each}
      </ImageCropperSelection>
    </ImageCropperViewport>
    <ImageCropperZoom />
    <ImageCropperRotate>Rotate</ImageCropperRotate>
    <ImageCropperFlip>Flip</ImageCropperFlip>
  </ImageCropper>
  <button type="button">After</button>
  <button type="button" onclick={() => controller.setCrop({ x: 0, y: 0, width: 100, height: 100 })}>
    Use corner
  </button>
  <output role="status" aria-label="Last action">{action}</output>
  <output aria-label="Committed">{committed}</output>
</div>
