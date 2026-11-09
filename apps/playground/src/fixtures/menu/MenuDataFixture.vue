<script setup lang="ts">
import { Menu, MenuTrigger } from "@ui-sdk/vue"
import { createMenuController } from "@ui-sdk/core/menu"
import { menuOptions } from "tests/fixtures/page.ts"
import { ref } from "vue"

const controller = createMenuController()
const options = menuOptions()
import { menuData } from "./data"

const action = ref("")
</script>

<template>
  <div class="fixture">
    <button>Before</button>
    <Menu
      v-bind="options"
      :controller="controller"
      :items="menuData"
      @action="(value: string) => (action = value)"
    >
      <MenuTrigger>File</MenuTrigger>
    </Menu>
    <button>After</button>
    <output role="status" aria-label="Last action">{{ action }}</output>
    <button @click="controller.open({ focus: 'first' })">
      Open with controller
    </button>
  </div>
</template>
