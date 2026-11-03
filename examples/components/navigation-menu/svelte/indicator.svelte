<script lang="ts">
  import { ChevronDownIcon } from "@lucide/svelte"
  import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport,
  } from "@ui-sdk/svelte/navigation-menu"

  const sections = [
    {
      value: "guides",
      label: "Guides",
      links: [
        {
          title: "Introduction",
          href: "https://example.com/docs",
          description: "Unstyled components with one core for every framework.",
        },
        {
          title: "Installation",
          href: "https://example.com/docs/installation",
          description: "Add the package for your framework and render your first part.",
        },
        {
          title: "Styling",
          href: "https://example.com/docs/styling",
          description: "Style parts with data attributes, CSS variables and any CSS.",
        },
      ],
    },
    {
      value: "components",
      label: "Components",
      links: [
        {
          title: "Alert Dialog",
          href: "https://example.com/docs/components/alert-dialog",
          description: "Asks for a decision before anything else on the page can be used.",
        },
        {
          title: "Hover Card",
          href: "https://example.com/docs/components/hover-card",
          description: "A preview of what a link points to, for people who pause on it.",
        },
        {
          title: "Progress",
          href: "https://example.com/docs/components/progress",
          description: "Shows how far along a task is, like an upload.",
        },
        {
          title: "Scroll Area",
          href: "https://example.com/docs/components/scroll-area",
          description: "Scrolls its content with scrollbars you can style.",
        },
      ],
    },
  ]
</script>

<NavigationMenu aria-label="Main">
  <NavigationMenuList>
    {#each sections as section (section.value)}
      <NavigationMenuItem value={section.value}>
        <NavigationMenuTrigger>
          {section.label}
          <ChevronDownIcon />
        </NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul>
            {#each section.links as link (link.href)}
              <li>
                <NavigationMenuLink href={link.href}>
                  <span>{link.title}</span>
                  <span data-slot="hint">{link.description}</span>
                </NavigationMenuLink>
              </li>
            {/each}
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
    {/each}
    <NavigationMenuItem>
      <NavigationMenuLink href="https://example.com/docs" current>
        Docs
      </NavigationMenuLink>
    </NavigationMenuItem>
  </NavigationMenuList>
  <NavigationMenuIndicator />
  <NavigationMenuViewport sideOffset={8} />
</NavigationMenu>
