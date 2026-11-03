<script lang="ts">
  import { CheckIcon, ChevronRightIcon, ClockIcon, CodeIcon, FileIcon, PlusIcon, XIcon } from "@lucide/svelte"
  import {
    TokenInput,
    TokenInputEditor,
    TokenInputToken,
    TokenInputTokenRemove,
    type TokenInputValue,
    createTokenInputController,
    toText,
  } from "@ui-sdk/svelte/token-input"
  import {
    type TriggerMenuDataItem,
    TriggerMenu,
    TriggerMenuContent,
    TriggerMenuEmpty,
    TriggerMenuHint,
    TriggerMenuItem,
    TriggerMenuList,
    type TriggerMenuSelectDetails,
  } from "@ui-sdk/svelte/trigger-menu"

  import { onDestroy } from "svelte"

  const files = [
    { value: "src/app.tsx", label: "app.tsx", keywords: ["src"] },
    { value: "src/routes.ts", label: "routes.ts", keywords: ["src"] },
    { value: "src/styles.css", label: "styles.css", keywords: ["src"] },
    { value: "README.md", label: "README.md" },
    { value: "package.json", label: "package.json" },
  ]

  const skills = [
    { value: "search", label: "search", arguments: [{ name: "query", hint: "<query>", required: true }] },
    { value: "review", label: "review" },
    { value: "summarize", label: "summarize" },
  ]

  const loadFile = () => new Promise<void>((resolve) => setTimeout(resolve, 800))

  const prompt = createTokenInputController()
  let sent = $state<string[]>([])
  let running = $state(false)
  let sendTimer: ReturnType<typeof setTimeout> | undefined

  onDestroy(() => clearTimeout(sendTimer))

  function send(value: TokenInputValue) {
    if (running || !prompt.getLabel().trim()) return
    running = true
    const skillTokens = value.filter((segment) => typeof segment !== "string" && segment.type === "skill")
    for (const skill of skillTokens)
      if (typeof skill !== "string") prompt.updateToken(skill.id!, { data: { ...skill.data, run: "running" } })
    sendTimer = setTimeout(() => {
      for (const skill of skillTokens)
        if (typeof skill !== "string") prompt.updateToken(skill.id!, { data: { ...skill.data, run: "done" } })
      sent = [...sent, toText(prompt.getValue())]
      prompt.clear()
      running = false
    }, 1500)
  }

  const onSelect = (value: string, details: TriggerMenuSelectDetails<string>) =>
    details.trigger === "@" ? loadFile() : undefined

  function attachReadme() {
    prompt.insert({ type: "file", value: "README.md", label: "README.md" }, { resolve: loadFile() })
  }
</script>

<div data-slot="stack">
  <ul>
    {#each sent as text, index (index)}
      <li>{text}</li>
    {/each}
  </ul>
  <TokenInput controller={prompt} onSubmit={send}>
    <div data-slot="card">
      <TokenInputEditor aria-label="Prompt" placeholder="Ask anything. @ adds a file, / runs a skill" />
      <div data-slot="row">
        <button type="button" onmousedown={(event) => event.preventDefault()} onclick={attachReadme}>
          <PlusIcon aria-hidden="true" />
          README
        </button>
        <button
          type="button"
          aria-label={running ? "Running" : "Send"}
          disabled={running}
          onclick={() => send(prompt.getValue())}
        >
          {#if running}
            <ClockIcon aria-hidden="true" />
          {:else}
            <ChevronRightIcon aria-hidden="true" />
          {/if}
        </button>
      </div>
    </div>
    <TriggerMenu
      triggers={[
        { char: "@", type: "file", items: files },
        { char: "/", boundary: "start", type: "skill", items: skills },
      ]}
      {onSelect}
    >
      <TriggerMenuHint />
      <TriggerMenuContent>
        <TriggerMenuEmpty>No matches</TriggerMenuEmpty>
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
    {#snippet token(token)}
      <TokenInputToken>
        {#if token.type === "skill"}
          <CodeIcon aria-hidden="true" />
        {:else}
          <FileIcon aria-hidden="true" />
        {/if}
        {token.type === "skill" ? `/${token.label}` : token.label}
        {#if token.data?.run === "running"}
          <ClockIcon aria-hidden="true" />
        {/if}
        {#if token.data?.run === "done"}
          <CheckIcon aria-hidden="true" />
        {/if}
        <TokenInputTokenRemove>
          <XIcon aria-hidden="true" />
        </TokenInputTokenRemove>
      </TokenInputToken>
    {/snippet}
  </TokenInput>
</div>
