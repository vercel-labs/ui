<script setup lang="ts">
import {
  AccordionContent,
  AccordionHeader,
  AccordionItem,
  AccordionRoot,
  AccordionTrigger,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogRoot,
  AlertDialogTitle,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRoot,
  DropdownMenuTrigger,
  Label,
  SelectContent,
  SelectItem,
  SelectItemText,
  SelectPortal,
  SelectRoot,
  SelectTrigger,
  SelectValue,
  SelectViewport,
  SwitchRoot,
  SwitchThumb,
  TabsContent,
  TabsList,
  TabsRoot,
  TabsTrigger,
} from "reka-ui"
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

function toggleRole(member: Member) {
  member.role = member.role === "admin" ? "member" : "admin"
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
    <TabsRoot default-value="general">
      <TabsList class="row" aria-label="Settings">
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="members">Members</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
      </TabsList>

      <TabsContent value="general" class="screen">
        <div class="field">
          <Label for="project-name">Project name</Label>
          <input id="project-name" v-model="settings.name" />
        </div>
        <div class="field">
          <Label for="visibility">Visibility</Label>
          <SelectRoot v-model="settings.visibility">
            <SelectTrigger id="visibility" class="trigger">
              <SelectValue />
            </SelectTrigger>
            <SelectPortal>
              <SelectContent class="popup" position="popper" :side-offset="4">
                <SelectViewport>
                  <SelectItem
                    v-for="item in visibilities"
                    :key="item.value"
                    :value="item.value"
                    class="item"
                  >
                    <SelectItemText>{{ item.label }}</SelectItemText>
                  </SelectItem>
                </SelectViewport>
              </SelectContent>
            </SelectPortal>
          </SelectRoot>
        </div>
      </TabsContent>

      <TabsContent value="members">
        <ul class="members">
          <li v-for="member in settings.members" :key="member.id" class="row">
            <span class="name">{{ member.name }}</span>
            <span>{{ member.role === "admin" ? "Admin" : "Member" }}</span>
            <DropdownMenuRoot>
              <DropdownMenuTrigger
                class="button"
                :aria-label="`Actions for ${member.name}`"
              >
                ⋯
              </DropdownMenuTrigger>
              <DropdownMenuPortal>
                <DropdownMenuContent class="popup" :side-offset="4">
                  <DropdownMenuItem class="item" @select="toggleRole(member)">
                    {{ member.role === "admin" ? "Make member" : "Make admin" }}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    class="item"
                    @select="confirmRemoval(member)"
                  >
                    Remove
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenuPortal>
            </DropdownMenuRoot>
          </li>
        </ul>
      </TabsContent>

      <TabsContent value="notifications">
        <AccordionRoot type="single" collapsible>
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
            <AccordionContent class="screen">
              <label
                v-for="item in channel.notifications"
                :key="item.value"
                class="choice"
              >
                <SwitchRoot
                  v-model="settings[channel.value][item.value]"
                  class="switch"
                >
                  <SwitchThumb class="switch-thumb" />
                </SwitchRoot>
                {{ item.label }}
              </label>
            </AccordionContent>
          </AccordionItem>
        </AccordionRoot>
      </TabsContent>
    </TabsRoot>

    <AlertDialogRoot v-model:open="isConfirming">
      <AlertDialogPortal>
        <AlertDialogOverlay class="backdrop" />
        <AlertDialogContent class="dialog">
          <AlertDialogTitle>Remove {{ removing?.name }}?</AlertDialogTitle>
          <AlertDialogDescription>
            They lose access to this project right away.
          </AlertDialogDescription>
          <div class="row">
            <AlertDialogCancel class="button">Cancel</AlertDialogCancel>
            <AlertDialogAction class="button" @click="remove">
              Remove
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialogPortal>
    </AlertDialogRoot>

    <button type="button" class="button" @click="save(settings)">
      Save settings
    </button>
  </main>
</template>
