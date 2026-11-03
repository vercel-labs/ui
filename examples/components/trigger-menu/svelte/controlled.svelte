<script lang="ts">
  import {
    type TriggerMenuDataItem,
    TriggerMenu,
    TriggerMenuContent,
    TriggerMenuInput,
    TriggerMenuItem,
    TriggerMenuList,
  } from "@ui-sdk/svelte/trigger-menu"

  const people = [
    { value: "ada", label: "Ada Lovelace", keywords: ["ada"] },
    { value: "alan", label: "Alan Turing" },
    { value: "grace", label: "Grace Hopper" },
    { value: "katherine", label: "Katherine Johnson" },
    { value: "linus", label: "Linus Torvalds", disabled: true },
    { value: "margaret", label: "Margaret Hamilton" },
  ]

  const commands = [
    {
      value: "model",
      label: "model",
      arguments: [
        { name: "model", hint: "<model>", required: true, items: ["opus", "sonnet", "haiku"] },
        { name: "effort", hint: "[effort]", items: ["low", "medium", "high"], allowCustomValue: false },
      ],
    },
    { value: "search", label: "search", arguments: [{ name: "query", hint: "<query>", required: true }] },
    { value: "clear", label: "clear" },
    { value: "send", label: "send", after: "submit" as const },
  ]

  let open = $state(false)
  let log = $state<string[]>([])
  const note = (line: string) => (log = [line, ...log].slice(0, 4))
  const triggers = [
    { char: "@", items: people },
    { char: "/", boundary: "start" as const, items: commands },
  ]
</script>

<TriggerMenu
  bind:open
  {triggers}
  autoHighlight={false}
  loop={false}
  shortcut="ctrl+j"
  status="idle"
  onOpenChange={(next, details) => note(`${next ? "opened" : "closed"} ${details.trigger ?? ""} (${details.reason})`)}
  onOpenChangeComplete={(next) => note(next ? "finished opening" : "finished closing")}
  onQueryChange={(query, details) => note(`query “${query}”${details.argument ? ` for ${details.argument}` : ""}`)}
>
  <div data-slot="stack">
    <TriggerMenuInput aria-label="Message" placeholder="Type @ or /" />
    <ul data-slot="output">
      {#each log as line, index (index)}
        <li>{line}</li>
      {/each}
    </ul>
  </div>
  <TriggerMenuContent>
    <TriggerMenuList>
      {#snippet children(state)}
        {#each (state.items as TriggerMenuDataItem[]) as item (item.value)}
          <TriggerMenuItem value={item.value} label={item.label} disabled={item.disabled}>
            {item.label}
          </TriggerMenuItem>
        {/each}
      {/snippet}
    </TriggerMenuList>
  </TriggerMenuContent>
</TriggerMenu>
