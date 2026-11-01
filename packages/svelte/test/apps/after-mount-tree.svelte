<script lang="ts">
  import type { Component } from "svelte"
  import type { Built } from "../../../core/test/after-mount"
  import Self from "./after-mount-tree.svelte"

  let { nodes, components }: { nodes: Built[]; components: Map<string, Component<any>> } = $props()
</script>

{#each nodes as node}
  {#if typeof node === "string"}
    {node}
  {:else if node.part}
    {@const Part = components.get(node.part)!}
    {#if node.children.length}
      <Part {...node.props}><Self nodes={node.children} {components} /></Part>
    {:else}
      <Part {...node.props} />
    {/if}
  {:else if node.tag}
    {#if node.children.length}
      <svelte:element this={node.tag} {...node.props}><Self nodes={node.children} {components} /></svelte:element>
    {:else}
      <svelte:element this={node.tag} {...node.props} />
    {/if}
  {:else}
    <Self nodes={node.children} {components} />
  {/if}
{/each}
