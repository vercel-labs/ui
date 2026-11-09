<script setup lang="ts">
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@ui-sdk/vue"
import { ref } from "vue"
import RouterLink from "./RouterLink.vue"

const action = ref("")
</script>

<template>
  <div class="fixture">
    <button>Before</button>
    <NavigationMenu
      aria-label="Docs"
      class="nav-menu"
      @value-change="
        (value, { reason }) => (action = `${value ?? 'close'}: ${reason}`)
      "
    >
      <NavigationMenuList class="nav-list">
        <NavigationMenuItem value="guides">
          <NavigationMenuTrigger>
            <template #render="{ props, state }">
              <button
                v-bind="props"
                :class="['nav-trigger', state.open ? 'is-open' : 'is-closed']"
              >
                Guides
                <span aria-hidden="true">{{ state.open ? "▲" : "▼" }}</span>
              </button>
            </template>
          </NavigationMenuTrigger>
          <NavigationMenuContent class="nav-content" aria-label="Guides panel">
            <template #render="{ props }">
              <section v-bind="props">
                <NavigationMenuLink current>
                  <template #render="{ props }">
                    <RouterLink v-bind="props" to="#intro"
                      >Introduction</RouterLink
                    >
                  </template>
                </NavigationMenuLink>
                <NavigationMenuLink>
                  <template #render="{ props }">
                    <RouterLink v-bind="props" to="#install"
                      >Install</RouterLink
                    >
                  </template>
                </NavigationMenuLink>
              </section>
            </template>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
      <NavigationMenuViewport class="nav-viewport" />
    </NavigationMenu>
    <button>After</button>
    <output role="status" aria-label="Last action">{{ action }}</output>
  </div>
</template>
