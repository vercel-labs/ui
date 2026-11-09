<script lang="ts">
  import {
    Menu,
    MenuCheckboxItem,
    MenuContent,
    MenuItem,
    MenuTrigger,
  } from "@ui-sdk/svelte"

  // Counts updates of each custom item, so specs can check what re-renders.
  // An update is the part's props changing, which the text reads so it
  // counts them, or a state key it read.
  const renders = { watched: 0, plain: 0 }
  ;(window as unknown as { __renders: typeof renders }).__renders = renders

  let action = $state("")
  const count = (key: "watched" | "plain", ...reads: unknown[]) => (
    renders[key]++,
    ""
  )
</script>

<div class="fixture">
  <button>Before</button>
  <Menu onAction={(value) => (action = value)}>
    <MenuTrigger>File</MenuTrigger>
    <MenuContent class="popup">
      <MenuItem class="item" value="docs" href="#docs">
        {#snippet render({ props })}
          <a {...props}>Docs</a>
        {/snippet}
      </MenuItem>
      <MenuItem class="item" value="watched">
        {#snippet render({ props, state })}
          <div {...props}>
            {count("watched", props, state.highlighted)}{state.highlighted
              ? "→ "
              : ""}Watched
          </div>
        {/snippet}
      </MenuItem>
      <MenuItem class="item" value="plain">
        {#snippet render({ props })}
          <div {...props}>{count("plain", props)}Plain</div>
        {/snippet}
      </MenuItem>
      <MenuCheckboxItem value="pinned" class="item">
        {#snippet children(state)}
          <span class={state.checked ? "is-checked" : "is-unchecked"}
            >Pinned</span
          >
        {/snippet}
      </MenuCheckboxItem>
    </MenuContent>
  </Menu>
  <button>After</button>
  <output role="status" aria-label="Last action">{action}</output>
</div>
