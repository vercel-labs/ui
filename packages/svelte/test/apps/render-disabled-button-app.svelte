<script lang="ts">
  import { Button } from "../../src/button"
  import { FileInput, FileInputTrigger } from "../../src/file-input"
  import { Popover, PopoverContent, PopoverTrigger } from "../../src/popover"
</script>

<Popover>
  <PopoverTrigger disabled>
    {#snippet render({ props })}<Button {...props}>Open</Button>{/snippet}
  </PopoverTrigger>
  <PopoverContent>Content</PopoverContent>
</Popover>
<FileInput disabled>
  <FileInputTrigger>
    {#snippet render({ props })}<Button {...props}>Choose files</Button
      >{/snippet}
  </FileInputTrigger>
</FileInput>
