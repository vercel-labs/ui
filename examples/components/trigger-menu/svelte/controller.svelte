<script lang="ts">
  import {
    type TriggerMenuDataItem,
    TriggerMenu,
    TriggerMenuContent,
    TriggerMenuInput,
    TriggerMenuItem,
    TriggerMenuList,
    createTriggerMenuController,
  } from "@ui-sdk/svelte/trigger-menu"

  const people = [
    { value: "ada", label: "Ada Lovelace", keywords: ["ada"] },
    { value: "alan", label: "Alan Turing" },
    { value: "grace", label: "Grace Hopper" },
    { value: "katherine", label: "Katherine Johnson" },
    { value: "linus", label: "Linus Torvalds", disabled: true },
    { value: "margaret", label: "Margaret Hamilton" },
  ]

  const menu = createTriggerMenuController()
  let result = $state("")

  async function mention() {
    const closed = await menu.open({ trigger: "@" })
    result = `Closed with ${closed.reason}`
  }

  function insertDate() {
    const match = menu.getMatch()
    result = match ? `Query “${menu.getQuery()}” at ${match.start}` : `Open: ${menu.isOpen()}`
    menu.insert(new Date().toLocaleDateString())
  }

  function toggle() {
    if (menu.isOpen()) {
      menu.close()
    } else {
      menu.setOpen(true)
    }
  }
</script>

<TriggerMenu controller={menu} triggers={[{ char: "@", items: people }]}>
  <div data-slot="stack">
    <TriggerMenuInput aria-label="Message" />
    <div data-slot="row">
      <button
        type="button"
        data-variant="secondary"
        onmousedown={(event) => event.preventDefault()}
        onclick={mention}
      >
        Mention
      </button>
      <button
        type="button"
        data-variant="secondary"
        onmousedown={(event) => event.preventDefault()}
        onclick={insertDate}
      >
        Insert date
      </button>
      <button
        type="button"
        data-variant="secondary"
        onmousedown={(event) => event.preventDefault()}
        onclick={toggle}
      >
        Toggle
      </button>
    </div>
    <p data-slot="hint">{result}</p>
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
