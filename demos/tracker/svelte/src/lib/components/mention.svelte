<script lang="ts">
  import { Avatar } from "#ui/avatar"
  import { HoverCard, HoverCardContent, HoverCardTrigger } from "#ui/hover-card"
  import { personOf } from "tracker-data"

  let { id, label }: { id: string; label: string } = $props()

  const person = $derived(personOf(id))
</script>

{#if person}
  <HoverCard>
    <HoverCardTrigger
      href={`/?tab=all&assignee=${person.id}`}
      class="rounded-sm font-medium text-foreground underline-offset-4 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/30"
    >
      @{person.name}
    </HoverCardTrigger>
    <HoverCardContent>
      <div class="flex items-center gap-3">
        <Avatar name={person.name} size="lg" decorative />
        <div class="grid gap-0.5">
          <p class="font-medium">{person.name}</p>
          <p class="text-muted-foreground">{person.role}</p>
        </div>
      </div>
      <p class="text-xs text-muted-foreground">Select to see their issues.</p>
    </HoverCardContent>
  </HoverCard>
{:else}
  @{label}
{/if}
