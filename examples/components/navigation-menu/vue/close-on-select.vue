<script setup lang="ts">
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@ui-sdk/vue/navigation-menu"
import { ref } from "vue"
import { ChevronDownIcon } from "@lucide/vue"

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
const opened = ref("")
</script>

<template>
  <div data-slot="stack">
    <NavigationMenu aria-label="Main" :close-on-select="false">
      <NavigationMenuList>
        <NavigationMenuItem value="components">
          <NavigationMenuTrigger>
            Components
            <ChevronDownIcon />
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul>
              <li v-for="page in components" :key="page.href">
                <NavigationMenuLink :href="page.href" @click.prevent="opened = page.title">
                  {{ page.title }}
                </NavigationMenuLink>
              </li>
            </ul>
            <ul>
              <li>
                <NavigationMenuLink
                  href="https://example.com/docs/components"
                  close-on-select
                  @click.prevent="opened = 'All components'"
                >
                  Browse all
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
      <NavigationMenuViewport />
    </NavigationMenu>
    <output data-slot="output">{{ opened ? `Opened: ${opened}` : "Press a link" }}</output>
  </div>
</template>
