<!--
@component
The button that opens the list: a combobox named by the label. Typing on it selects the item that matches.
@stable
-->
<script lang="ts">
  import {
    select as selectPrimitive,
    type SelectTriggerProps,
    type SelectTriggerState,
  } from "@ui-sdk/core/select"
  import { getContext } from "svelte"
  import Part from "../part.svelte"
  import { useControllerTarget } from "../popup.svelte"
  import { plainPart, type PartProps } from "../use-primitive.svelte"
  import type { SelectContext } from "./context"
  import TriggerBinding from "./select-trigger-binding.svelte"

  let {
    disabled,
    controller,
    ...rest
  }: PartProps<"button", SelectTriggerState> &
    SelectTriggerProps = $props()

  const connected = useControllerTarget(() => controller, getContext<SelectContext | undefined>(selectPrimitive))
  const select = $derived(connected())
</script>

{#if select}
  <TriggerBinding owner={select} {disabled} {...rest} />
{:else}
  <!-- Until the select it names mounts, a trigger outside the select is a plain button. -->
  <Part
    tag="button"
    part={plainPart({ open: false, disabled: !!disabled, readOnly: false, required: false, placeholder: true }, { type: "button" })}
    props={rest}
  />
{/if}
