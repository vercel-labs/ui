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
import {
  exposeNavigationMenuValue,
  navigationMenuFixture as fixture,
  navigationMenuLayout,
} from "tests/fixtures/navigation-menu.ts"
import { ref } from "vue"

const layout = navigationMenuLayout()
const value = ref<string | null>(null)
const completed = ref<boolean[]>([])
exposeNavigationMenuValue((next) => (value.value = next))
</script>

<template>
  <div class="fixture">
    <button>Before</button>
    <NavigationMenu
      v-model:value="value"
      aria-label="Main"
      class="nav-menu"
      :delay="0"
      :close-delay="0"
      @open-change-complete="(open: boolean) => completed.push(open)"
    >
      <NavigationMenuList class="nav-list">
        <NavigationMenuItem
          v-for="item in fixture.items"
          :key="item.value"
          :value="item.value"
        >
          <NavigationMenuTrigger class="nav-trigger">{{
            item.trigger
          }}</NavigationMenuTrigger>
          <NavigationMenuContent class="nav-content">
            <ul>
              <li v-for="link in item.links" :key="link.href">
                <NavigationMenuLink :href="link.href">{{
                  link.label
                }}</NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
      <NavigationMenuViewport v-if="layout.viewport" class="nav-viewport" />
    </NavigationMenu>
    <button>After</button>
    <output role="status" aria-label="Completed">{{
      completed.join(",")
    }}</output>
  </div>
</template>
