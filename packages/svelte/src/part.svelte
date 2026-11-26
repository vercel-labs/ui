<!--
@component
Renders a part: the `render` snippet with its props, state and content,
or the tag. `children` receives the state. `props` are the user's, `render`
and `children` included, which `slot()` leaves out when it merges the rest
with the part's attributes, so most parts need no more than
`<Part tag="div" part={item} {props} />`.
@stable
-->
<script module lang="ts">
  // Names only SVG uses. `a`, `title`, `style` and `script` are HTML too, so
  // they stay HTML, as a tag outside an `<svg>` of the same component does.
  const svgTags = new Set(
    "animate animateMotion animateTransform circle clipPath defs desc ellipse feBlend feColorMatrix feComponentTransfer feComposite feConvolveMatrix feDiffuseLighting feDisplacementMap feDistantLight feDropShadow feFlood feFuncA feFuncB feFuncG feFuncR feGaussianBlur feImage feMerge feMergeNode feMorphology feOffset fePointLight feSpecularLighting feSpotLight feTile feTurbulence filter foreignObject g image line linearGradient marker mask metadata mpath path pattern polygon polyline radialGradient rect set stop svg switch symbol text textPath tspan use view".split(
      " "
    )
  )
</script>

<script lang="ts" generics="State">
  import type { Snippet } from "svelte"
  import type { PartBinding, SlotAttributes } from "./use-primitive.svelte"

  let {
    tag,
    part,
    props,
  }: {
    tag: string
    part: PartBinding<State>
    props: {
      render?: Snippet<
        [{ props: SlotAttributes; state: State; children?: Snippet<[State]> }]
      >
      children?: Snippet<[State]>
      [attribute: string]: unknown
    }
  } = $props()

  const attributes = $derived(part.slot(props))
  const xmlns = $derived(
    svgTags.has(tag) ? "http://www.w3.org/2000/svg" : undefined
  )
</script>

{#if props.render}
  {@render props.render({
    props: attributes,
    state: part.state,
    children: props.children,
  })}
{:else if props.children}
  <svelte:element this={tag} {xmlns} {...attributes}
    >{@render props.children(part.state)}</svelte:element
  >
{:else}
  <svelte:element this={tag} {xmlns} {...attributes} />
{/if}
