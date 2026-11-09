<script lang="ts">
  import type { ChangeDetails } from "@ui-sdk/core"
  import { Avatar, AvatarFallback, AvatarImage } from "@ui-sdk/svelte"
  import { avatarAction, avatarFixture } from "tests/fixtures/avatar.ts"

  const [first, ...rest] = avatarFixture.items
  let action = $state("")
  let src = $state<string | undefined>(first.src)
  let mounts = $state(0)

  function onStatus(status: string, details: ChangeDetails) {
    action = avatarAction(status, details.reason)
  }
</script>

<div class="fixture">
  <button>Before</button>
  {#key mounts}
    <Avatar class="avatar" onLoadingStatusChange={onStatus}>
      {#if src !== undefined}
        <AvatarImage class="avatar-image" {src} alt={first.name} />
      {/if}
      <AvatarFallback class="avatar-fallback">{first.initials}</AvatarFallback>
    </Avatar>
  {/key}
  {#each rest as item (item.name)}
    <Avatar class="avatar">
      {#if item.src !== undefined}
        <AvatarImage
          class="avatar-image"
          src={item.src}
          alt={item.name}
          referrerpolicy={item.referrerPolicy}
          crossorigin={item.crossOrigin}
        />
      {/if}
      <AvatarFallback class="avatar-fallback" delay={item.delay}
        >{item.initials}</AvatarFallback
      >
    </Avatar>
  {/each}
  <button onclick={() => (src = avatarFixture.nextSrc)}>Change image</button>
  <button onclick={() => (src = undefined)}>Remove image</button>
  <button onclick={() => mounts++}>Remount</button>
  <button>After</button>
  <output role="status" aria-label="Last action">{action}</output>
</div>
