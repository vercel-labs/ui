<script lang="ts">
  import { ChevronDownIcon, ChevronRightIcon } from "@lucide/svelte"
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

  const groups = [
    {
      value: "overlays",
      label: "Overlays",
      links: [
        { title: "Dialog", href: "https://example.com/docs/components/dialog" },
        { title: "Popover", href: "https://example.com/docs/components/popover" },
        { title: "Tooltip", href: "https://example.com/docs/components/tooltip" },
      ],
    },
    {
      value: "forms",
      label: "Forms",
      links: [
        { title: "Input", href: "https://example.com/docs/components/input" },
        { title: "Select", href: "https://example.com/docs/components/select" },
        { title: "Checkbox", href: "https://example.com/docs/components/checkbox" },
      ],
    },
  ]
</script>

<NavigationMenu aria-label="Main">
  <NavigationMenuList>
    <NavigationMenuItem value="guides">
      <NavigationMenuTrigger>
        Guides
        <ChevronDownIcon />
      </NavigationMenuTrigger>
      <NavigationMenuContent>
        <ul>
          {#each gettingStarted as link (link.href)}
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
    <NavigationMenuItem value="components">
      <NavigationMenuTrigger>
        Components
        <ChevronDownIcon />
      </NavigationMenuTrigger>
      <NavigationMenuContent>
        <NavigationMenu orientation="vertical">
          <NavigationMenuList>
            {#each groups as group (group.value)}
              <NavigationMenuItem value={group.value}>
                <NavigationMenuTrigger>
                  {group.label}
                  <ChevronRightIcon />
                </NavigationMenuTrigger>
                <NavigationMenuContent sideOffset={12}>
                  <ul>
                    {#each group.links as link (link.href)}
                      <li>
                        <NavigationMenuLink href={link.href}>
                          {link.title}
                        </NavigationMenuLink>
                      </li>
                    {/each}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            {/each}
          </NavigationMenuList>
        </NavigationMenu>
      </NavigationMenuContent>
    </NavigationMenuItem>
  </NavigationMenuList>
  <NavigationMenuViewport />
</NavigationMenu>
