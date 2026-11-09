<script lang="ts">
  import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport,
  } from "@ui-sdk/svelte/navigation-menu"
  import {
    exposeNavigationMenuValue,
    navigationMenuFixture as fixture,
    navigationMenuLayout,
  } from "tests/fixtures/navigation-menu.ts"

  const layout = navigationMenuLayout()
  let value = $state<string | null>(null)
  let completed = $state<boolean[]>([])
  exposeNavigationMenuValue((next) => (value = next))
</script>

<div class="fixture">
  <button>Before</button>
  <NavigationMenu
    aria-label="Main"
    class="nav-menu"
    delay={0}
    closeDelay={0}
    bind:value
    onOpenChangeComplete={(open) => completed.push(open)}
  >
    <NavigationMenuList class="nav-list">
      {#each fixture.items as item (item.value)}
        <NavigationMenuItem value={item.value}>
          <NavigationMenuTrigger class="nav-trigger"
            >{item.trigger}</NavigationMenuTrigger
          >
          <NavigationMenuContent class="nav-content">
            <ul>
              {#each item.links as link (link.href)}
                <li>
                  <NavigationMenuLink href={link.href}
                    >{link.label}</NavigationMenuLink
                  >
                </li>
              {/each}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      {/each}
    </NavigationMenuList>
    {#if layout.viewport}
      <NavigationMenuViewport class="nav-viewport" />
    {/if}
  </NavigationMenu>
  <button>After</button>
  <output role="status" aria-label="Completed">{completed.join(",")}</output>
</div>
