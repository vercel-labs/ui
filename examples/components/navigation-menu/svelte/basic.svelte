<script lang="ts">
  import { ArrowRightIcon, ChevronDownIcon, CircleIcon, CircleCheckIcon, CircleQuestionMarkIcon } from "@lucide/svelte"
  import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuLinkIcon,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport,
  } from "@ui-sdk/svelte/navigation-menu"

  const gettingStarted = [
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
  ]

  const components = [
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
    {
      title: "Tabs",
      href: "https://example.com/docs/components/tabs",
      description: "Shows one panel of content at a time, picked from a list of tabs.",
    },
    {
      title: "Tooltip",
      href: "https://example.com/docs/components/tooltip",
      description: "A short label for a control, shown on hover or keyboard focus.",
    },
  ]

  const statuses = [
    { title: "Backlog", href: "https://example.com/issues/backlog", icon: CircleQuestionMarkIcon },
    { title: "To do", href: "https://example.com/issues/to-do", icon: CircleIcon },
    { title: "Done", href: "https://example.com/issues/done", icon: CircleCheckIcon },
    { title: "All issues", href: "https://example.com/issues", icon: ArrowRightIcon, mirror: true },
  ]
</script>

<NavigationMenu aria-label="Main">
  <NavigationMenuList>
    <NavigationMenuItem value="getting-started">
      <NavigationMenuTrigger>
        Getting started
        <ChevronDownIcon />
      </NavigationMenuTrigger>
      <NavigationMenuContent>
        <ul data-slot="grid">
          <li>
            <NavigationMenuLink href="https://example.com" data-variant="featured">
              <span>ui-sdk</span>
              <span data-slot="hint">
                Accessible components for React, Vue, Svelte, Solid and Web Components.
              </span>
            </NavigationMenuLink>
          </li>
          {#each gettingStarted as page (page.href)}
            <li>
              <NavigationMenuLink href={page.href}>
                <span>{page.title}</span>
                <span data-slot="hint">{page.description}</span>
              </NavigationMenuLink>
            </li>
          {/each}
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
    <NavigationMenuItem value="components">
      <NavigationMenuTrigger>
        Components
        <ChevronDownIcon />
      </NavigationMenuTrigger>
      <NavigationMenuContent>
        <ul data-slot="grid">
          {#each components as page (page.href)}
            <li>
              <NavigationMenuLink href={page.href}>
                <span>{page.title}</span>
                <span data-slot="hint">{page.description}</span>
              </NavigationMenuLink>
            </li>
          {/each}
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
    <NavigationMenuItem value="with-icon">
      <NavigationMenuTrigger>
        With Icon
        <ChevronDownIcon />
      </NavigationMenuTrigger>
      <NavigationMenuContent>
        <ul>
          {#each statuses as status (status.href)}
            <li>
              <NavigationMenuLink href={status.href}>
                <NavigationMenuLinkIcon mirror={status.mirror}>
                  <status.icon />
                </NavigationMenuLinkIcon>
                {status.title}
              </NavigationMenuLink>
            </li>
          {/each}
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
    <NavigationMenuItem>
      <NavigationMenuLink href="https://example.com/docs">
        Docs
      </NavigationMenuLink>
    </NavigationMenuItem>
  </NavigationMenuList>
  <NavigationMenuViewport />
</NavigationMenu>
