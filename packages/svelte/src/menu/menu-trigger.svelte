<!--
@component
The button that opens the menu. A trigger outside the menu connects through `controller`.
@stable
-->
<script lang="ts">
  import {
    menu as menuPrimitive,
    type MenuTriggerProps,
    type MenuTriggerState,
  } from "@ui-sdk/core/menu"
  import { getContext } from "svelte"
  import Part from "../part.svelte"
  import { useControllerTarget } from "../popup.svelte"
  import { plainPart, type PartProps } from "../use-primitive.svelte"
  import type { MenuContext } from "./context"
  import TriggerBinding from "./menu-trigger-binding.svelte"

  let {
    disabled,
    payload,
    shortcut,
    controller,
    ...rest
  }: PartProps<"button", MenuTriggerState> & MenuTriggerProps = $props()

  const connected = useControllerTarget(
    () => controller,
    getContext<MenuContext | undefined>(menuPrimitive)
  )
  const menu = $derived(connected())
</script>

{#if menu}
  <TriggerBinding
    owner={menu}
    partName="trigger"
    tag="button"
    {disabled}
    {payload}
    {shortcut}
    {...rest}
  />
{:else}
  <!-- Until the menu it names mounts, a trigger outside the menu is a plain button. -->
  <Part
    tag="button"
    part={plainPart(
      { open: false, disabled: !!disabled },
      { type: "button", disabled }
    )}
    props={rest}
  />
{/if}
