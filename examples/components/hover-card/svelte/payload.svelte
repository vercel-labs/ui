<script lang="ts">
  import {
    createHoverCardController,
    HoverCard,
    HoverCardContent,
    type HoverCardContentState,
    HoverCardTrigger,
  } from "@ui-sdk/svelte/hover-card"

  const people = [
    {
      handle: "ada",
      name: "Ada Lovelace",
      initials: "AL",
      bio: "Wrote the first published program, for the Analytical Engine.",
    },
    {
      handle: "grace",
      name: "Grace Hopper",
      initials: "GH",
      bio: "Built the first compiler and popularized the word “debugging”.",
    },
    {
      handle: "alan",
      name: "Alan Turing",
      initials: "AT",
      bio: "Described the universal machine every computer descends from.",
    },
  ]

  type Person = (typeof people)[number]

  const card = createHoverCardController<Person>()
  const profileOf = (person: Person | undefined) => `https://example.com/people/${person?.handle}`
</script>

<ul>
  {#each people as person (person.handle)}
    <li data-slot="row">
      <HoverCardTrigger controller={card} payload={person} href={profileOf(person)}>
        {person.name}
      </HoverCardTrigger>
      <span data-slot="hint">@{person.handle}</span>
    </li>
  {/each}
</ul>
<HoverCard controller={card}>
  <HoverCardContent align="start">
    {#snippet children(state: HoverCardContentState<Person>)}
      <div data-slot="row">
        <div data-slot="avatar" aria-hidden="true">{state.payload?.initials}</div>
        <div data-slot="stack">
          <p>{state.payload?.name}</p>
          <p>{state.payload?.bio}</p>
          <a href={profileOf(state.payload)}>View profile</a>
        </div>
      </div>
    {/snippet}
  </HoverCardContent>
</HoverCard>
