<script setup lang="ts">
import { Check, Minus } from "@lucide/vue"
import { Checkbox, CheckboxGroup, CheckboxIndicator } from "@ui-sdk/vue/checkbox"
import { ref } from "vue"

const people = [
  { id: "sarah", name: "Sarah Chen", email: "sarah.chen@example.com", role: "Admin" },
  { id: "marcus", name: "Marcus Rodriguez", email: "marcus.rodriguez@example.com", role: "User" },
  { id: "priya", name: "Priya Patel", email: "priya.patel@example.com", role: "User" },
  { id: "david", name: "David Kim", email: "david.kim@example.com", role: "Editor" },
]
const selected = ref(["sarah"])
</script>

<template>
  <div data-slot="stack">
    <CheckboxGroup
      v-model:value="selected"
      aria-label="Team members"
      :all-values="people.map((person) => person.id)"
    >
      <table>
        <thead>
          <tr>
            <th>
              <Checkbox aria-label="Select all" parent>
                <CheckboxIndicator>
                  <Check aria-hidden="true" />
                  <Minus aria-hidden="true" />
                </CheckboxIndicator>
              </Checkbox>
            </th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="person in people" :key="person.id">
            <td>
              <Checkbox :value="person.id" :aria-label="`Select ${person.name}`">
                <CheckboxIndicator>
                  <Check aria-hidden="true" />
                </CheckboxIndicator>
              </Checkbox>
            </td>
            <td>{{ person.name }}</td>
            <td>
              {{ person.email }}
            </td>
            <td>{{ person.role }}</td>
          </tr>
        </tbody>
      </table>
    </CheckboxGroup>
    <output data-slot="output">{{ selected.length }} of {{ people.length }} selected</output>
  </div>
</template>
