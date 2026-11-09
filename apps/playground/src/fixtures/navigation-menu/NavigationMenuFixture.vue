<script setup lang="ts">
import type { ChangeDetails } from "@ui-sdk/core"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@ui-sdk/vue"
import {
  navigationMenuAction,
  navigationMenuFixture as fixture,
  navigationMenuLayout,
  navigationMenuOptions,
} from "tests/fixtures/navigation-menu.ts"
import { ref } from "vue"

const options = navigationMenuOptions()
const layout = navigationMenuLayout()
const action = ref("")

function report(value: string | null, { reason }: ChangeDetails) {
  action.value = navigationMenuAction(value, reason)
}
</script>

<template>
  <div class="fixture">
    <button>Before</button>
    <NavigationMenu
      v-bind="options"
      aria-label="Main"
      class="nav-menu"
      @value-change="report"
    >
      <NavigationMenuList
        :class="
          options.orientation === 'vertical' ? 'nav-list vertical' : 'nav-list'
        "
      >
        <NavigationMenuItem
          v-for="(item, index) in fixture.items"
          :key="item.value"
          :value="item.value"
        >
          <NavigationMenuTrigger class="nav-trigger">{{
            item.trigger
          }}</NavigationMenuTrigger>
          <NavigationMenuContent
            :class="index === 0 ? 'nav-content' : 'nav-content narrow'"
            :keep-mounted="layout.keepMounted"
            :hidden-until-found="layout.hiddenUntilFound"
            v-bind="layout.placement"
          >
            <ul>
              <li v-for="link in item.links" :key="link.href">
                <NavigationMenuLink :href="link.href">{{
                  link.label
                }}</NavigationMenuLink>
              </li>
            </ul>
            <NavigationMenu
              v-if="index === 1 && layout.nested"
              orientation="vertical"
            >
              <NavigationMenuList class="nav-list vertical">
                <NavigationMenuItem :value="fixture.nested.value">
                  <NavigationMenuTrigger class="nav-trigger">{{
                    fixture.nested.trigger
                  }}</NavigationMenuTrigger>
                  <NavigationMenuContent class="nav-content narrow">
                    <ul>
                      <li v-for="link in fixture.nested.links" :key="link.href">
                        <NavigationMenuLink :href="link.href">{{
                          link.label
                        }}</NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink
            class="nav-link"
            :href="fixture.link.href"
            current
            >{{ fixture.link.label }}</NavigationMenuLink
          >
        </NavigationMenuItem>
      </NavigationMenuList>
      <NavigationMenuIndicator class="nav-indicator" />
      <NavigationMenuViewport
        v-if="layout.viewport"
        class="nav-viewport"
        v-bind="layout.placement"
      />
    </NavigationMenu>
    <button>After</button>
    <output role="status" aria-label="Last action">{{ action }}</output>
  </div>
</template>
