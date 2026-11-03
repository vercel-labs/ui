<script lang="ts">
  import { Separator } from "@ui-sdk/svelte/separator"
</script>

<div data-slot="stack">
  <dl>
    <dt>Item 1</dt>
    <dd>Value 1</dd>
  </dl>
  <Separator />
  <dl>
    <dt>Item 2</dt>
    <dd>Value 2</dd>
  </dl>
  <Separator />
  <dl>
    <dt>Item 3</dt>
    <dd>Value 3</dd>
  </dl>
</div>
