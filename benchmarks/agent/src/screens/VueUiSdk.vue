<script setup lang="ts">
import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
} from "@ui-sdk/vue/accordion"
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@ui-sdk/vue/alert-dialog"
import { Button } from "@ui-sdk/vue/button"
import { Field, FieldLabel } from "@ui-sdk/vue/field"
import { Input } from "@ui-sdk/vue/input"
import { Menu, MenuContent, MenuItem, MenuTrigger } from "@ui-sdk/vue/menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@ui-sdk/vue/select"
import { Switch, SwitchThumb } from "@ui-sdk/vue/switch"
import { Tabs, TabsList, TabsPanel, TabsTab } from "@ui-sdk/vue/tabs"
import { reactive, ref } from "vue"
import {
  channels,
  initialSettings,
  type Member,
  save,
  visibilities,
} from "../settings"

const settings = reactive(initialSettings())
const removing = ref<Member | null>(null)
const isConfirming = ref(false)

function confirmRemoval(member: Member) {
  removing.value = member
  isConfirming.value = true
}

function choose(member: Member, action: string) {
  if (action === "remove") {
    confirmRemoval(member)
  } else {
    member.role = member.role === "admin" ? "member" : "admin"
  }
}

function remove() {
  settings.members = settings.members.filter(
    (member) => member.id !== removing.value?.id
  )
}
</script>

<template>
  <main class="screen">
    <h1>Project settings</h1>
    <Tabs default-value="general">
      <TabsList class="row" aria-label="Settings">
        <TabsTab value="general">General</TabsTab>
        <TabsTab value="members">Members</TabsTab>
        <TabsTab value="notifications">Notifications</TabsTab>
      </TabsList>

      <TabsPanel value="general" class="screen">
        <Field class="field">
          <FieldLabel>Project name</FieldLabel>
          <Input v-model:value="settings.name" />
        </Field>
        <Select v-model:value="settings.visibility" :items="visibilities">
          <div class="field">
            <SelectLabel>Visibility</SelectLabel>
            <SelectTrigger class="trigger">
              <SelectValue />
            </SelectTrigger>
          </div>
          <SelectContent class="popup">
            <SelectItem
              v-for="item in visibilities"
              :key="item.value"
              :value="item.value"
              class="item"
            >
              {{ item.label }}
            </SelectItem>
          </SelectContent>
        </Select>
      </TabsPanel>

      <TabsPanel value="members">
        <ul class="members">
          <li v-for="member in settings.members" :key="member.id" class="row">
            <span class="name">{{ member.name }}</span>
            <span>{{ member.role === "admin" ? "Admin" : "Member" }}</span>
            <Menu @action="(action: string) => choose(member, action)">
              <MenuTrigger
                class="button"
                :aria-label="`Actions for ${member.name}`"
              >
                ⋯
              </MenuTrigger>
              <MenuContent class="popup">
                <MenuItem value="role" class="item">
                  {{ member.role === "admin" ? "Make member" : "Make admin" }}
                </MenuItem>
                <MenuItem value="remove" class="item">Remove</MenuItem>
              </MenuContent>
            </Menu>
          </li>
        </ul>
      </TabsPanel>

      <TabsPanel value="notifications">
        <Accordion>
          <AccordionItem
            v-for="channel in channels"
            :key="channel.value"
            :value="channel.value"
          >
            <AccordionHeader>
              <AccordionTrigger class="button">
                {{ channel.label }}
              </AccordionTrigger>
            </AccordionHeader>
            <AccordionPanel class="screen">
              <label
                v-for="item in channel.notifications"
                :key="item.value"
                class="choice"
              >
                <Switch
                  v-model:checked="settings[channel.value][item.value]"
                  class="switch"
                >
                  <SwitchThumb class="switch-thumb" />
                </Switch>
                {{ item.label }}
              </label>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </TabsPanel>
    </Tabs>

    <AlertDialog v-model:open="isConfirming">
      <AlertDialogBackdrop class="backdrop" />
      <AlertDialogContent class="dialog">
        <AlertDialogTitle>Remove {{ removing?.name }}?</AlertDialogTitle>
        <AlertDialogDescription>
          They lose access to this project right away.
        </AlertDialogDescription>
        <div class="row">
          <AlertDialogClose class="button">Cancel</AlertDialogClose>
          <AlertDialogClose class="button" @click="remove">
            Remove
          </AlertDialogClose>
        </div>
      </AlertDialogContent>
    </AlertDialog>

    <Button class="button" @click="save(settings)">Save settings</Button>
  </main>
</template>
