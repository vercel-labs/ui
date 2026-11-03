<script setup lang="ts">
import {
  createNavigationMenuController,
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

const menu = createNavigationMenuController()
const status = ref("Closed")

function toggle() {
  if (menu.getValue() === "components") {
    menu.close()
  } else {
    menu.setValue("components")
  }
}

function read() {
  status.value = menu.isOpen() ? `Open: ${menu.getValue()}` : "Closed"
}
</script>

<template>
  <div data-slot="stack">
    <div data-slot="row">
      <button @click="toggle">Toggle Components</button>
      <button @click="menu.focus('guides')">Focus Guides</button>
      <button @click="read">Read state</button>
    </div>
    <NavigationMenu aria-label="Main" :controller="menu">
      <NavigationMenuList>
        <NavigationMenuItem v-for="section in sections" :key="section.value" :value="section.value">
          <NavigationMenuTrigger>
            {{ section.label }}
            <ChevronDownIcon />
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul>
              <li v-for="link in section.links" :key="link.href">
                <NavigationMenuLink :href="link.href">
                  <span>{{ link.title }}</span>
                  <span data-slot="hint">{{ link.description }}</span>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
      <NavigationMenuViewport />
    </NavigationMenu>
    <output data-slot="output">{{ status }}</output>
  </div>
</template>
