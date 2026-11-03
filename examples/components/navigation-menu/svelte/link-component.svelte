<script lang="ts">
  import { ChevronDownIcon } from "@lucide/svelte"
  import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport,
  } from "@ui-sdk/svelte/navigation-menu"

  const gettingStarted = [
    {
      title: "Introduction",
      href: "#introduction",
      description: "Unstyled components with one core for every framework.",
    },
    {
      title: "Installation",
      href: "#installation",
      description: "Add the package for your framework and render your first part.",
    },
    {
      title: "Styling",
      href: "#styling",
      description: "Style parts with data attributes, CSS variables and any CSS.",
    },
  ]
  let route = $state("#introduction")

  function navigate(event: MouseEvent, to: string) {
    event.preventDefault()
    route = to
  }
</script>

<div data-slot="stack">
  <NavigationMenu aria-label="Docs">
    <NavigationMenuList>
      <NavigationMenuItem value="guides">
        <NavigationMenuTrigger>
          Guides
          <ChevronDownIcon />
        </NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul>
            {#each gettingStarted as page (page.href)}
              <li>
                <NavigationMenuLink
                  href={page.href}
                  current={route === page.href}
                  onclick={(event) => navigate(event, page.href)}
                >
                  <span>{page.title}</span>
                  <span data-slot="hint">{page.description}</span>
                </NavigationMenuLink>
              </li>
            {/each}
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuLink
          href="#components"
          current={route === "#components"}
          onclick={(event) => navigate(event, "#components")}
        >
          Components
        </NavigationMenuLink>
      </NavigationMenuItem>
    </NavigationMenuList>
    <NavigationMenuViewport />
  </NavigationMenu>
  <output data-slot="output">Route: {route}</output>
</div>
