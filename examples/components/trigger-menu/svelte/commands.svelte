<script lang="ts">
  import {
    type TriggerMenuDataItem,
    TriggerMenu,
    TriggerMenuContent,
    TriggerMenuHint,
    TriggerMenuInput,
    TriggerMenuItem,
    TriggerMenuList,
  } from "@ui-sdk/svelte/trigger-menu"

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

  let last = $state("")

  function onSelect(value: string, details: { arguments: Record<string, string> }) {
    last = `/${value} ${JSON.stringify(details.arguments)}`
  }

  function send(event: Event) {
    event.preventDefault()
    last = `Sent: ${new FormData(event.currentTarget as HTMLFormElement).get("prompt")}`
  }
</script>

<form data-slot="stack" onsubmit={send}>
  <TriggerMenu triggers={[{ char: "/", boundary: "start", type: "command", items: commands }]} {onSelect}>
    <TriggerMenuInput name="prompt" aria-label="Prompt" placeholder="Try /model or /search" />
    <TriggerMenuHint />
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
  <p data-slot="hint">{last || "/send submits the form."}</p>
</form>
