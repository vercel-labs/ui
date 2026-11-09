<script setup lang="ts">
import {
  createDrawerController,
  Drawer,
  DrawerBackdrop,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHandle,
  DrawerOutlet,
  DrawerShortcut,
  DrawerTitle,
  DrawerTrigger,
} from "@ui-sdk/vue"
import {
  drawerFixture,
  drawerOptions,
  drawerParts,
  exposeDrawerFixture,
  recordDrawer,
} from "tests/fixtures/drawer.ts"
import { onMounted, ref } from "vue"

const controller = createDrawerController()
// The specs' hooks live on the window, which the server doesn't have.
onMounted(() => exposeDrawerFixture(controller))

const options = drawerOptions()
const parts = drawerParts()
const action = ref("")
const more = ref(false)
</script>

<template>
  <div class="fixture">
    <button>Before</button>
    <Drawer
      :controller="controller"
      v-bind="options"
      @open-change="
        (open, details) => recordDrawer(`drawer:${open}:${details.reason}`)
      "
      @snap-point-change="
        (snapPoint, details) => recordDrawer(`${snapPoint}:${details.reason}`)
      "
      @dismiss-attempt="(details) => recordDrawer(`attempt:${details.reason}`)"
    >
      <DrawerTrigger>{{ drawerFixture.trigger }}</DrawerTrigger>
      <DrawerBackdrop v-if="parts.backdrop" class="drawer-backdrop" />
      <DrawerContent class="drawer">
        <DrawerHandle class="handle" :aria-label="drawerFixture.handle" />
        <DrawerTitle class="title">{{ drawerFixture.title }}</DrawerTitle>
        <DrawerDescription class="description">{{
          drawerFixture.description
        }}</DrawerDescription>
        <label v-if="parts.field" class="field">
          {{ drawerFixture.field }}
          <input />
        </label>
        <ul
          v-if="parts.scroll"
          class="scroll"
          :aria-label="drawerFixture.scroll.label"
          tabindex="0"
        >
          <li v-for="item in drawerFixture.scroll.items" :key="item">
            {{ item }}
          </li>
        </ul>
        <template v-if="parts.grow">
          <button @click="more = true">{{ drawerFixture.grow.button }}</button>
          <p v-if="more" class="more">{{ drawerFixture.grow.text }}</p>
        </template>
        <div class="actions">
          <button @click="action = 'submit'">{{ drawerFixture.action }}</button>
          <DrawerClose>{{ drawerFixture.close }}</DrawerClose>
        </div>
        <Drawer
          v-if="parts.nested"
          @open-change="
            (open, details) => recordDrawer(`nested:${open}:${details.reason}`)
          "
        >
          <DrawerTrigger>{{ drawerFixture.nested.trigger }}</DrawerTrigger>
          <DrawerBackdrop v-if="parts.backdrop" class="drawer-backdrop" />
          <DrawerContent class="drawer">
            <DrawerTitle class="title">{{
              drawerFixture.nested.title
            }}</DrawerTitle>
            <DrawerClose>{{ drawerFixture.nested.close }}</DrawerClose>
          </DrawerContent>
        </Drawer>
      </DrawerContent>
    </Drawer>
    <button>After</button>
    <output role="status" aria-label="Last action">{{ action }}</output>
    <button @click="controller.open()">{{ drawerFixture.controller }}</button>
    <button @click="action = 'page'">{{ drawerFixture.page }}</button>
    <DrawerTrigger
      v-if="parts.shortcut"
      :controller="controller"
      :shortcut="drawerFixture.shortcut.keys"
    >
      {{ drawerFixture.shortcut.trigger }}
      <DrawerShortcut />
    </DrawerTrigger>
    <DrawerOutlet
      v-if="parts.outlet"
      :controller="controller"
      class="outlet"
      role="region"
      :aria-label="drawerFixture.outlet.label"
      :keyframes="drawerFixture.outlet.keyframes"
    />
  </div>
</template>
