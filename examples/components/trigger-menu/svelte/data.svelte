<script lang="ts">
  import {
    type TriggerDefinition,
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

  const channels = ["general", "random", "design", "engineering", "marketing", "support"]

  function searchChannels(query: string, { signal }: { signal: AbortSignal }) {
    return new Promise<{ value: string; label: string }[]>((resolve, reject) => {
      const timer = setTimeout(
        () =>
          resolve(
            channels
              .filter((channel) => channel.includes(query.toLowerCase()))
              .map((channel) => ({ value: channel, label: channel })),
          ),
        400,
      )
      signal.addEventListener("abort", () => {
        clearTimeout(timer)
        reject(signal.reason)
      })
    })
  }

  const triggers: TriggerDefinition[] = [
    { char: "@", items: people },
    { char: "/", boundary: "start", items: commands },
    { char: "#", items: searchChannels },
  ]
</script>

<TriggerMenu {triggers}>
  <TriggerMenuInput aria-label="Message" placeholder="Type @, / or #" />
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
