<script lang="ts">
  import { CheckIcon, ChevronDownIcon } from "@lucide/svelte"
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectItemIndicator,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@ui-sdk/svelte/select"

  type Member = { id: number; name: string; email: string }

  const members: Member[] = [
    { id: 1, name: "Ada Lovelace", email: "ada@example.com" },
    { id: 2, name: "Grace Hopper", email: "grace@example.com" },
    { id: 3, name: "Alan Turing", email: "alan@example.com" },
    { id: 4, name: "Margaret Hamilton", email: "margaret@example.com" },
  ]

  let assignee = $state<Member | null>({ ...members[1] })
</script>

<div data-slot="stack">
  <Select
    bind:value={assignee}
    name="assignee"
    itemToValue={(member: Member) => String(member.id)}
    itemToLabel={(member: Member) => member.name}
    isItemEqualToValue={(item: Member, value: Member) => item.id === value.id}
    placeholder="Unassigned"
  >
    <div data-slot="stack">
      <SelectLabel>Assignee</SelectLabel>
      <SelectTrigger>
        <SelectValue />
        <ChevronDownIcon />
      </SelectTrigger>
    </div>
    <SelectContent>
      {#each members as member (member.id)}
        <SelectItem value={member}>
          <span>{member.name}</span>
          <span data-slot="hint">{member.email}</span>
          <SelectItemIndicator>
            <CheckIcon />
          </SelectItemIndicator>
        </SelectItem>
      {/each}
    </SelectContent>
  </Select>
  <output data-slot="output">Submits assignee={assignee ? assignee.id : ""}</output>
</div>
