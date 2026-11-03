<script lang="ts">
  import type { ChangeDetails } from "@ui-sdk/core"
  import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport,
  } from "@ui-sdk/svelte"
  import {
    navigationMenuAction,
    navigationMenuFixture as fixture,
    navigationMenuLayout,
    navigationMenuOptions,
  } from "tests/fixtures/navigation-menu.ts"

  const options = navigationMenuOptions()
  const layout = navigationMenuLayout()
  let action = $state("")

  function report(value: string | null, { reason }: ChangeDetails) {
    action = navigationMenuAction(value, reason)
  }
</script>

<div class="fixture">
  <button>Before</button>
  <NavigationMenu {...options} aria-label="Main" class="nav-menu" onValueChange={report}>
    <NavigationMenuList class={options.orientation === "vertical" ? "nav-list vertical" : "nav-list"}>
      {#each fixture.items as item, index (item.value)}
        <NavigationMenuItem value={item.value}>
          <NavigationMenuTrigger class="nav-trigger">{item.trigger}</NavigationMenuTrigger>
          <NavigationMenuContent
            class={index === 0 ? "nav-content" : "nav-content narrow"}
            keepMounted={layout.keepMounted}
            hiddenUntilFound={layout.hiddenUntilFound}
            {...layout.placement}
          >
            <ul>
              {#each item.links as link (link.href)}
                <li><NavigationMenuLink href={link.href}>{link.label}</NavigationMenuLink></li>
              {/each}
            </ul>
            {#if index === 1 && layout.nested}
              <NavigationMenu orientation="vertical">
                <NavigationMenuList class="nav-list vertical">
                  <NavigationMenuItem value={fixture.nested.value}>
                    <NavigationMenuTrigger class="nav-trigger">{fixture.nested.trigger}</NavigationMenuTrigger>
                    <NavigationMenuContent class="nav-content narrow">
                      <ul>
                        {#each fixture.nested.links as link (link.href)}
                          <li><NavigationMenuLink href={link.href}>{link.label}</NavigationMenuLink></li>
                        {/each}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            {/if}
          </NavigationMenuContent>
        </NavigationMenuItem>
      {/each}
      <NavigationMenuItem>
        <NavigationMenuLink class="nav-link" href={fixture.link.href} current>{fixture.link.label}</NavigationMenuLink>
      </NavigationMenuItem>
    </NavigationMenuList>
    <NavigationMenuIndicator class="nav-indicator" />
    {#if layout.viewport}
      <NavigationMenuViewport class="nav-viewport" {...layout.placement} />
    {/if}
  </NavigationMenu>
  <button>After</button>
  <output role="status" aria-label="Last action">{action}</output>
</div>
