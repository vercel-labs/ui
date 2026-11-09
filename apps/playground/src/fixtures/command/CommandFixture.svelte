<script lang="ts">
  import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandGroupLabel,
    CommandInput,
    CommandItem,
    CommandItemText,
    CommandList,
    CommandPage,
    CommandSeparator,
    CommandShortcut,
    CommandStatus,
    type CommandData,
    type CommandDataItem,
  } from "@ui-sdk/svelte"
  import {
    commandData,
    commandFixture as f,
    commandOptions,
    runAction,
  } from "tests/fixtures/command.ts"
  import { longItems } from "tests/fixtures/select.ts"

  let { data = false }: { data?: boolean } = $props()

  const { slow, fail, long, highlight, unvalued, ...options } = commandOptions()
  let action = $state("")
  let lastHighlight = $state("")
  const items = $derived(long ? longItems() : data ? commandData() : undefined)

  function onAction(value: string) {
    action = `action:${value}`
    return runAction(slow, fail)
  }

  function onValueChange(value: string | null, details: { reason: string }) {
    lastHighlight = `${value}:${details.reason}`
  }
</script>

<!-- The data's commands, groups and separators, styled like the composed ones. -->
{#snippet dataCommands(entries: CommandData)}
  {#each entries as entry, index (typeof entry === "string" ? entry : "type" in entry ? `${entry.type}-${index}` : entry.value)}
    {#if typeof entry !== "string" && "type" in entry}
      {#if entry.type === "separator"}
        <CommandSeparator class="separator" />
      {:else}
        <CommandGroup>
          {#if entry.label}<CommandGroupLabel class="label"
              >{entry.label}</CommandGroupLabel
            >{/if}
          {@render dataCommands(entry.items)}
        </CommandGroup>
      {/if}
    {:else}
      {@render dataCommand(
        typeof entry === "string" ? { value: entry, label: entry } : entry
      )}
    {/if}
  {/each}
{/snippet}

{#snippet dataCommand(command: CommandDataItem)}
  <CommandItem
    class="item"
    value={command.value}
    label={command.label}
    keywords={command.keywords}
    disabled={command.disabled}
    shortcut={command.shortcut}
  >
    {#if highlight}<CommandItemText>{command.label}</CommandItemText
      >{:else}{command.label}{/if}
    {#if command.shortcut}<CommandShortcut class="shortcut" />{/if}
  </CommandItem>
{/snippet}

<div class="fixture">
  <button>Before</button>
  <Command {...options} class="command" {items} {onAction} {onValueChange}>
    <CommandInput class="input" aria-label={f.input} />
    <CommandEmpty class="empty">{f.empty}</CommandEmpty>
    <CommandStatus class="status">
      {#snippet children(state)}{state.loading ? "Loading…" : ""}{/snippet}
    </CommandStatus>
    {#if items}
      <CommandList class="command-list">
        {#snippet children(state)}
          {@render dataCommands(state.items)}
        {/snippet}
      </CommandList>
    {:else}
      <CommandList class="command-list">
        <CommandPage>
          {#each f.groups as group, index (group.label)}
            {#if index > 0}<CommandSeparator class="separator" />{/if}
            <CommandGroup>
              <CommandGroupLabel class="label">{group.label}</CommandGroupLabel>
              {#each group.items as item (item.value)}
                <CommandItem
                  class="item"
                  value={unvalued ? undefined : item.value}
                  keywords={"keywords" in item ? item.keywords : undefined}
                  disabled={"disabled" in item ? item.disabled : undefined}
                  shortcut={"shortcut" in item ? item.shortcut : undefined}
                  page={"page" in item ? item.page : undefined}
                >
                  {#if highlight}<CommandItemText>{item.label}</CommandItemText
                    >{:else}{item.label}{/if}
                  {#if "shortcut" in item}<CommandShortcut
                      class="shortcut"
                    />{/if}
                </CommandItem>
              {/each}
            </CommandGroup>
          {/each}
        </CommandPage>
        <CommandPage value="theme">
          {#each f.theme as item (item.value)}
            <CommandItem class="item" value={item.value}
              >{item.label}</CommandItem
            >
          {/each}
        </CommandPage>
      </CommandList>
    {/if}
  </Command>
  <button>After</button>
  <output role="status" aria-label="Last action">{action}</output>
  <output role="status" aria-label="Last highlight">{lastHighlight}</output>
</div>
