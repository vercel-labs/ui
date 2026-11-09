<script lang="ts">
  import type { Snippet } from "svelte"

  // A client-side router's link: it navigates without a page load, unless a
  // handler before it prevented that.
  let {
    href,
    children,
    ...rest
  }: { href?: string; children?: Snippet; [attribute: string]: unknown } =
    $props()

  function navigate(event: MouseEvent) {
    if (event.defaultPrevented) {
      return
    }
    event.preventDefault()
    history.pushState(null, "", href)
  }
</script>

<a {href} {...rest} onclick={navigate}>{@render children?.()}</a>
