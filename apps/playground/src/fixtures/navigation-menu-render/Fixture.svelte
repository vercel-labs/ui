<script lang="ts">
  import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport,
  } from "@ui-sdk/svelte"
  import RouterLink from "./RouterLink.svelte"

  let action = $state("")
</script>

<div class="fixture">
  <button>Before</button>
  <NavigationMenu
    aria-label="Docs"
    class="nav-menu"
    onValueChange={(value, { reason }) =>
      (action = `${value ?? "close"}: ${reason}`)}
  >
    <NavigationMenuList class="nav-list">
      <NavigationMenuItem value="guides">
        <NavigationMenuTrigger>
          {#snippet render({ props, state })}
            <button
              {...props}
              class={["nav-trigger", state.open ? "is-open" : "is-closed"]}
            >
              Guides <span aria-hidden="true">{state.open ? "▲" : "▼"}</span>
            </button>
          {/snippet}
        </NavigationMenuTrigger>
        <NavigationMenuContent class="nav-content" aria-label="Guides panel">
          {#snippet render({ props })}
            <section {...props}>
              <NavigationMenuLink current>
                {#snippet render({ props })}
                  <RouterLink {...props} to="#intro">Introduction</RouterLink>
                {/snippet}
              </NavigationMenuLink>
              <NavigationMenuLink>
                {#snippet render({ props })}
                  <RouterLink {...props} to="#install">Install</RouterLink>
                {/snippet}
              </NavigationMenuLink>
            </section>
          {/snippet}
        </NavigationMenuContent>
      </NavigationMenuItem>
    </NavigationMenuList>
    <NavigationMenuViewport class="nav-viewport" />
  </NavigationMenu>
  <button>After</button>
  <output role="status" aria-label="Last action">{action}</output>
</div>
