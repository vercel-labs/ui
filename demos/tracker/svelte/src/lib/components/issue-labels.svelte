<script lang="ts">
  import { Badge } from "#ui/badge"
  import { labelOf } from "tracker-data"

  let { labels, class: className }: { labels: string[]; class?: string } =
    $props()
</script>

<ul class={className} aria-label="Labels">
  {#each labels as id (id)}
    {@const label = labelOf(id)}
    {#if label}
      <li>
        <Badge>
          <span class="size-2 rounded-full" style:background={label.color}
          ></span>
          {label.name}
        </Badge>
      </li>
    {/if}
  {/each}
</ul>
