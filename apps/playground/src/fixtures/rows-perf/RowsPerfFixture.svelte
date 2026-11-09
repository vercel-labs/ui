<script lang="ts">
  import {
    Menu,
    MenuContent,
    MenuItem,
    MenuTrigger,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Tooltip,
    TooltipContent,
    TooltipTrigger,
  } from "@ui-sdk/svelte"
  import {
    countRender,
    perfItems,
    perfOptions,
    perfSize,
  } from "tests/fixtures/perf.ts"

  // Rows like a table's, each with a closed menu, select and tooltip, for the
  // counts specs. Every part counts its updates by kind, so
  // specs can tell what mounting a row renders. An update is the part's props
  // changing, which the text reads so it counts them, or a state key it read.
  const rows = perfItems(perfSize(200)).map((row) => row.label.slice(5))
  const options = perfItems(perfOptions())
  const actions = ["Rename", "Duplicate", "Delete"]
  type Kind = "trigger" | "menuItem" | "value" | "option" | "tooltip"
  const count = (kind: Kind, ...reads: unknown[]) => (countRender(kind), "")
</script>

<div class="fixture" style="flex-direction: column; align-items: start">
  <button>Before</button>
  {#each rows as label (label)}
    <div class="row" style="display: flex; gap: 8px">
      <Menu>
        <MenuTrigger>
          {#snippet render({ props })}
            <button {...props}>{count("trigger", props)}Menu {label}</button>
          {/snippet}
        </MenuTrigger>
        <MenuContent class="popup">
          {#each actions as action (action)}
            <MenuItem class="item" value={action}>
              {#snippet render({ props })}
                <div {...props}>{count("menuItem", props)}{action}</div>
              {/snippet}
            </MenuItem>
          {/each}
        </MenuContent>
      </Menu>
      <Select defaultValue={options[0].value}>
        <SelectTrigger aria-label={`Select ${label}`} class="trigger">
          {#snippet render({ props })}
            <button {...props}>
              {count("trigger", props)}
              <SelectValue>
                {#snippet render({ props: valueProps, state })}
                  <span {...valueProps}
                    >{count(
                      "value",
                      valueProps,
                      state.label
                    )}{state.label}</span
                  >
                {/snippet}
              </SelectValue>
            </button>
          {/snippet}
        </SelectTrigger>
        <SelectContent class="popup list-popup">
          {#each options as option (option.value)}
            <SelectItem class="item" value={option.value} label={option.label}>
              {#snippet render({ props })}
                <div {...props}>{count("option", props)}{option.label}</div>
              {/snippet}
            </SelectItem>
          {/each}
        </SelectContent>
      </Select>
      <Tooltip>
        <TooltipTrigger>
          {#snippet render({ props })}
            <button {...props}>{count("trigger", props)}Tip {label}</button>
          {/snippet}
        </TooltipTrigger>
        <TooltipContent class="tooltip">
          {#snippet render({ props })}
            <div {...props}>{count("tooltip", props)}Hint {label}</div>
          {/snippet}
        </TooltipContent>
      </Tooltip>
    </div>
  {/each}
  <button>After</button>
</div>
