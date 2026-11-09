<script lang="ts">
  import { Toolbar, ToolbarButton, ToolbarSeparator } from "@ui-sdk/svelte"

  // How many times each item's content rendered, so specs can check that
  // moving focus renders only the items whose tab stop moved. Content that
  // reads nothing reactive renders once, so Svelte's counts stay at one.
  const renders: Record<string, number> = {}
  ;(window as unknown as { __renders: typeof renders }).__renders = renders
  const counted = (name: string) => {
    renders[name] = (renders[name] ?? 0) + 1
    return name
  }
  let action = $state("")
</script>

<div class="fixture">
  <button>Before</button>
  <Toolbar class="toolbar" aria-label="Tools">
    <ToolbarButton onclick={() => (action = "span")}>
      {#snippet render({ props })}
        <span {...props}>{counted("Span tool")}</span>
      {/snippet}
    </ToolbarButton>
    <ToolbarButton onclick={() => (action = "cut")}
      >{counted("Cut")}</ToolbarButton
    >
    <ToolbarButton onclick={() => (action = "copy")}
      >{counted("Copy")}</ToolbarButton
    >
    <ToolbarSeparator class="rule">
      {#snippet render({ props })}
        <hr {...props} />
      {/snippet}
    </ToolbarSeparator>
    <ToolbarButton disabled href="#old">
      {#snippet render({ props, state })}
        <a
          {...props}
          href="#old"
          class={state.disabled ? "is-disabled" : "is-enabled"}>Old docs</a
        >
      {/snippet}
    </ToolbarButton>
  </Toolbar>
  <button>After</button>
  <output role="status" aria-label="Last action">{action}</output>
</div>
