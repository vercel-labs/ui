<script setup lang="ts">
import {
  Drawer,
  DrawerBackdrop,
  DrawerContent,
  DrawerDescription,
  DrawerHandle,
  DrawerTitle,
  DrawerTrigger,
} from "@ui-sdk/vue/drawer"

const places = [
  { name: "Blue Bottle Coffee", detail: "Coffee · 0.2 mi" },
  { name: "Tartine Bakery", detail: "Bakery · 0.4 mi" },
  { name: "Dolores Park", detail: "Park · 0.5 mi" },
  { name: "Mission Dolores", detail: "Landmark · 0.6 mi" },
  { name: "Ritual Coffee Roasters", detail: "Coffee · 0.7 mi" },
  { name: "Bi-Rite Creamery", detail: "Ice cream · 0.7 mi" },
  { name: "Alamo Square", detail: "Park · 1.1 mi" },
  { name: "The Castro Theatre", detail: "Cinema · 1.2 mi" },
  { name: "Ferry Building", detail: "Market · 2.3 mi" },
  { name: "Coit Tower", detail: "Landmark · 2.9 mi" },
  { name: "Golden Gate Park", detail: "Park · 3.0 mi" },
  { name: "Lands End", detail: "Trail · 5.4 mi" },
]
</script>

<template>
  <Drawer driver="scroll-snap" :snap-points="[0.5, 1]">
    <DrawerTrigger>Native scrolling</DrawerTrigger>
    <DrawerBackdrop />
    <DrawerContent>
      <DrawerHandle aria-label="Resize" />
      <div data-slot="stack">
        <DrawerTitle>Places nearby</DrawerTitle>
        <DrawerDescription>Scroll or swipe it up, like a page.</DrawerDescription>
      </div>
      <ul data-slot="scroll">
        <li data-slot="stack" v-for="place in places" :key="place.name">
          <span>{{ place.name }}</span>
          <span data-slot="hint">{{ place.detail }}</span>
        </li>
      </ul>
    </DrawerContent>
  </Drawer>
</template>
