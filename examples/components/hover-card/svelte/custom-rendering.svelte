<script lang="ts">
  import { HoverCard, HoverCardContent, HoverCardTrigger } from "@ui-sdk/svelte/hover-card"

  const ada = {
    handle: "ada",
    name: "Ada Lovelace",
    initials: "AL",
    bio: "Wrote the first published program, for the Analytical Engine.",
  }
</script>

<HoverCard>
  <HoverCardTrigger href="https://example.com/people/ada">
    {#snippet render({ props })}
      <a {...props}>
        <span data-slot="avatar" aria-hidden="true">{ada.initials}</span>
        {ada.name}
      </a>
    {/snippet}
  </HoverCardTrigger>
  <HoverCardContent>
    {#snippet render({ props })}
      <article {...props}>
        <p>@{ada.handle}</p>
        <p>{ada.bio}</p>
      </article>
    {/snippet}
  </HoverCardContent>
</HoverCard>
