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

</script>

<Select defaultValue="1">
  <div data-slot="stack">
    <SelectLabel>Reviewer</SelectLabel>
    <SelectTrigger>
      {#snippet render({ props })}
        <button {...props}>
          <SelectValue>
            {#snippet children(selected)}
              <span data-slot="badge">
                {members.find((candidate) => String(candidate.id) === selected.value)?.name.slice(0, 1)}
              </span>
              {selected.label}
            {/snippet}
          </SelectValue>
          <ChevronDownIcon />
        </button>
      {/snippet}
    </SelectTrigger>
  </div>
  <SelectContent>
    {#each members as member (member.id)}
      <SelectItem value={String(member.id)} label={member.name} disabled={member.id === 4}>
        {#snippet render({ props, state })}
          <div {...props}>
            <span data-slot="badge">
              {member.name.slice(0, 1)}
            </span>
            <span data-slot="stack">
              {member.name}
              <span data-slot="hint">{state.disabled ? "Out of office" : member.email}</span>
            </span>
            <SelectItemIndicator>
              {#snippet render({ props: indicatorProps, state: indicator })}
                <span {...indicatorProps}>
                  {#if indicator.selected}
                    <CheckIcon />
                  {/if}
                </span>
              {/snippet}
            </SelectItemIndicator>
          </div>
        {/snippet}
      </SelectItem>
    {/each}
  </SelectContent>
</Select>
