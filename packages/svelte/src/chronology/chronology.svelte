<!--
@component
A list of dated events, like an activity feed or an order's history, with
one tab stop and arrow keys between events. `feed` makes it a feed of
articles that loads more as people scroll.
@experimental
-->
<script lang="ts">
  import {
    chronology as chronologyPrimitive,
    type ChronologyController,
    type ChronologyOrientation,
    type ChronologyState,
  } from "@ui-sdk/core/chronology"
  import Part from "../part.svelte"
  import { provideInstance } from "../instance"
  import {
    useHandlePart,
    usePrimitive,
    type PartProps,
  } from "../use-primitive.svelte"

  let {
    orientation,
    loop,
    feed,
    busy,
    controller,
    debug,
    ...rest
  }: PartProps<"div", ChronologyState> & {
    /** Which arrow keys move between events: up and down, or left and right. */
    orientation?: ChronologyOrientation
    /** Whether arrow keys wrap from the last event to the first. */
    loop?: boolean
    /** Whether the events are a feed that loads more as people scroll, rather than a list. Each event becomes an article with its position, and Page Down and Page Up move between them from anywhere inside one. */
    feed?: boolean
    /** Whether a feed is loading or changing events, which sets `aria-busy` so screen readers wait until it's done. Only a feed reads it. */
    busy?: boolean
    /** Focuses an event from anywhere. Create one with `createChronologyController()`. */
    controller?: ChronologyController
    /** Logs every state change. */
    debug?: boolean
  } = $props()

  const id = $props.id()
  const chronology = usePrimitive(chronologyPrimitive, () => ({
    id,
    orientation,
    loop,
    feed,
    busy,
    controller,
    debug,
  }))
  provideInstance(chronologyPrimitive, chronology)
  const root = useHandlePart(chronology, "root")
</script>

<Part tag="div" part={root} props={rest} />
