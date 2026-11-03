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

  const timings = [
    { label: "Instant", delay: 0, closeDelay: 0 },
    { label: "Default", delay: 50, closeDelay: 50 },
    { label: "Patient", delay: 400, closeDelay: 600 },
  ]
  let timing = $state.raw(timings[1])
</script>

<div data-slot="stack">
  <div role="group" aria-label="Timing" data-slot="row">
    {#each timings as option (option.label)}
      <button aria-pressed={timing === option} onclick={() => (timing = option)}>
        {option.label}
      </button>
    {/each}
  </div>
  <NavigationMenu aria-label="Main" delay={timing.delay} closeDelay={timing.closeDelay}>
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
    </NavigationMenuList>
    <NavigationMenuViewport />
  </NavigationMenu>
  <output data-slot="output">
    Opens after {timing.delay}ms, closes {timing.closeDelay}ms after the pointer leaves.
  </output>
</div>
