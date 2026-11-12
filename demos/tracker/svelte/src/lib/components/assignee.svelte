<script lang="ts">
  import { Avatar } from "#ui/avatar"
  import { personOf } from "tracker-data"

  interface Props {
    id: string | null
  }

  let { id }: Props = $props()

  const person = $derived(personOf(id))
</script>

{#if person}
  <Avatar name={person.name} />
{:else}
  <span class="size-7 shrink-0"></span>
{/if}
