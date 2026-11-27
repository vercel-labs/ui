<script lang="ts">
  import { Tree, TreeItem, TreeItemLabel } from "../../src/tree"

  let value = $state("a")
</script>

<Tree aria-label="Files" bind:value>
  <TreeItem value="a"><TreeItemLabel>a.ts</TreeItemLabel></TreeItem>
  <TreeItem value="b">
    <TreeItemLabel>
      <input
        aria-label="Rename b.ts"
        value="b.ts"
        onkeydown={(event) => event.stopPropagation()}
        onclick={(event) => event.stopPropagation()}
      />
    </TreeItemLabel>
  </TreeItem>
  <TreeItem value="c"><TreeItemLabel>c.ts</TreeItemLabel></TreeItem>
</Tree>
<output>{value}</output>
