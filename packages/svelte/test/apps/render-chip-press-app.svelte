<script lang="ts">
  import { definePrimitive } from "@ui-sdk/core"
  import { Menu, MenuContent, MenuItem, MenuTrigger } from "../../src/menu"
  import { createParts } from "../../src/primitive"

  const chip = definePrimitive({
    name: "chip",
    options: {},
    asleep: () => true,
    state: () => ({}),
    sync: () => ({}),
    api: () => ({}),
    slots: (slot) => ({ root: slot({}) }),
    agent: { actions: [], shown: () => true },
  })
  const Chip = createParts(chip, { root: "span" }).Root
</script>

<Menu>
  <MenuTrigger aria-label="Chip trigger">
    {#snippet render({ props, state, children })}
      <Chip {...props}>
        {#snippet render({ props: chipProps })}
          <button type="button" {...chipProps}
            >{@render children?.(state)}</button
          >
        {/snippet}
      </Chip>
    {/snippet}
    Status
  </MenuTrigger>
  <MenuContent><MenuItem value="a">A</MenuItem></MenuContent>
</Menu>
