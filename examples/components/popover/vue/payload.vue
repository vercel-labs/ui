<script setup lang="ts">
import {
  createPopoverController,
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from "@ui-sdk/vue/popover"
import { ref } from "vue"

type Member = { name: string; role: string }

const popover = createPopoverController<Member>()
const MemberPopoverContent = PopoverContent<Member>
const members = ref<Member[]>([
  { name: "Ada Lovelace", role: "Owner" },
  { name: "Grace Hopper", role: "Editor" },
  { name: "Alan Turing", role: "Viewer" },
])
const status = ref("")

function save(event: SubmitEvent, member: Member | undefined) {
  if ((event.submitter as HTMLButtonElement).value !== "save" || !member) return
  const next = String(new FormData(event.currentTarget as HTMLFormElement).get("role"))
  members.value = members.value.map((entry) =>
    entry.name === member.name ? { ...entry, role: next } : entry,
  )
}

function showEditing(payload: unknown) {
  const member = payload as Member | undefined
  if (member) status.value = `Editing ${member.name}`
}

async function editNewest(event: MouseEvent) {
  const result = await popover.open({
    payload: members.value[members.value.length - 1],
    anchor: event.currentTarget as HTMLElement,
  })
  status.value = `Closed with ${result.reason}, returned ${result.returnValue ?? "nothing"}`
}
</script>

<template>
  <div data-slot="stack">
    <ul>
      <li v-for="member in members" :key="member.name" data-slot="row">
        {{ member.name }}
        <span data-slot="hint">{{ member.role }}</span>
        <PopoverTrigger
          :controller="popover"
          :payload="member"
          :disabled="member.role === 'Owner'"
          data-size="sm"
          data-variant="ghost"
          :aria-label="`Edit ${member.name}`"
        >
          Edit
        </PopoverTrigger>
      </li>
    </ul>
    <Popover :controller="popover" @payload-change="showEditing">
      <MemberPopoverContent v-slot="{ state }" align="end">
        <PopoverTitle>Edit {{ state.payload?.name }}</PopoverTitle>
        <PopoverDescription>Roles decide what they can change.</PopoverDescription>
        <form data-slot="stack" method="dialog" @submit="save($event as SubmitEvent, state.payload)">
          <label data-slot="label">
            Role
            <input :key="state.payload?.name" name="role" :value="state.payload?.role" />
          </label>
          <div data-slot="row">
            <button value="save" data-variant="solid">Save</button>
            <button value="cancel">Cancel</button>
          </div>
        </form>
      </MemberPopoverContent>
    </Popover>
    <button type="button" data-variant="ghost" @click="editNewest">Edit the newest member</button>
    <output data-slot="output">{{ status || "Not edited yet" }}</output>
  </div>
</template>
