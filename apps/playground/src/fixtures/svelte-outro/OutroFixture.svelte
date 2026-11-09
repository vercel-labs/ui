<script lang="ts">
  import {
    Collapsible,
    CollapsiblePanel,
    CollapsibleTrigger,
  } from "@ui-sdk/svelte/collapsible"
  import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport,
  } from "@ui-sdk/svelte/navigation-menu"
  import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@ui-sdk/svelte/popover"
  import { fade } from "svelte/transition"

  const viewport =
    new URLSearchParams(location.search).get("viewport") !== "none"
  let completed = $state<boolean[]>([])
</script>

<!-- Svelte's own transitions on a popup, a panel and navigation menu contents, for the outro spec. -->
<button>Before</button>

<Popover>
  <PopoverTrigger>Open</PopoverTrigger>
  <PopoverContent>
    {#snippet render({ props })}
      <div
        {...props}
        aria-label="Popup"
        transition:fade|global={{ duration: 600 }}
      >
        Popup content
      </div>
    {/snippet}
  </PopoverContent>
</Popover>

<Collapsible>
  <CollapsibleTrigger>Details</CollapsibleTrigger>
  <CollapsiblePanel>
    {#snippet render({ props })}
      <div {...props} transition:fade|global={{ duration: 600 }}>
        Panel content
      </div>
    {/snippet}
  </CollapsiblePanel>
</Collapsible>

<NavigationMenu
  aria-label="Main"
  openOnHover={false}
  onOpenChangeComplete={(open) => completed.push(open)}
>
  <NavigationMenuList>
    {#each ["One", "Two"] as name (name)}
      <NavigationMenuItem value={name}>
        <NavigationMenuTrigger>{name}</NavigationMenuTrigger>
        <NavigationMenuContent>
          {#snippet render({ props })}
            <div {...props} transition:fade|global={{ duration: 600 }}>
              {name} content
            </div>
          {/snippet}
        </NavigationMenuContent>
      </NavigationMenuItem>
    {/each}
  </NavigationMenuList>
  {#if viewport}
    <NavigationMenuViewport />
  {/if}
</NavigationMenu>
<output role="status" aria-label="Completed">{completed.join(",")}</output>

<button>After</button>
