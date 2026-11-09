<script lang="ts">
  import {
    createResizableController,
    Resizable,
    ResizableHandle,
    ResizablePanel,
    type ResizableLayoutCommitDetails,
    type ResizableLayoutChangeDetails,
  } from "@ui-sdk/svelte"
  import {
    formatLayout,
    resizableFixture as f,
    resizableOptions,
  } from "tests/fixtures/resizable.ts"

  const options = resizableOptions()
  const controller = createResizableController()
  const { sidebar, main, preview } = f.editor.panels
  const { code, terminal } = f.main.panels
  let action = $state("")
  let committed = $state<string[]>([])
  let layout = $state([25, 50, 25])

  // Records a change, or cancels it when the URL asks. The bound layout follows unless canceled.
  function report(
    group: string,
    next: number[],
    details: ResizableLayoutChangeDetails
  ) {
    if (group === f.editor.id && options.cancel) {
      return details.cancel()
    }
    action = formatLayout(group, next, details.reason)
  }

  function commit(
    group: string,
    next: number[],
    details: ResizableLayoutCommitDetails
  ) {
    committed = [...committed, formatLayout(group, next, details.reason)]
  }

  const editor = {
    change: (next: number[], details: ResizableLayoutChangeDetails) =>
      report(f.editor.id, next, details),
    complete: (next: number[], details: ResizableLayoutCommitDetails) =>
      commit(f.editor.id, next, details),
  }
  const area = {
    change: (next: number[], details: ResizableLayoutChangeDetails) =>
      report(f.main.id, next, details),
    complete: (next: number[], details: ResizableLayoutCommitDetails) =>
      commit(f.main.id, next, details),
  }
</script>

<div class="fixture">
  <button>Before</button>
  <!-- A function binding: controlled when the URL asks, and with ?ignore the change is never passed back. -->
  <Resizable
    bind:layout={
      () => (options.controlled ? layout : undefined),
      (next) => !options.ignore && (layout = next!)
    }
    class="resizable"
    orientation={options.orientation}
    disabled={options.disabled}
    step={options.step}
    largeStep={options.largeStep}
    autoSaveId={options.autoSaveId}
    defaultLayout={options.defaultLayout}
    {controller}
    onLayoutChange={editor.change}
    onLayoutCommit={editor.complete}
  >
    <ResizablePanel
      id={sidebar.id}
      defaultSize={sidebar.defaultSize}
      minSize={sidebar.minSize}
      maxSize={sidebar.maxSize}
      collapsible={sidebar.collapsible}
      class="resizable-panel"
      role="group"
      aria-label={sidebar.label}
    >
      <button>Sidebar action</button>
    </ResizablePanel>
    <ResizableHandle
      class="resizable-handle"
      aria-label={f.editor.handles[0]}
      disabled={options.locked}
    />
    <ResizablePanel
      id={main.id}
      minSize={main.minSize}
      class="resizable-panel"
      role="group"
      aria-label={main.label}
    >
      <Resizable
        class="resizable-nested"
        orientation="vertical"
        onLayoutChange={area.change}
        onLayoutCommit={area.complete}
      >
        <ResizablePanel
          id={code.id}
          defaultSize={code.defaultSize}
          minSize={code.minSize}
          class="resizable-panel"
          role="group"
          aria-label={code.label}
        />
        <ResizableHandle class="resizable-handle" aria-label={f.main.handle} />
        <ResizablePanel
          id={terminal.id}
          minSize={terminal.minSize}
          collapsible={terminal.collapsible}
          class="resizable-panel"
          role="group"
          aria-label={terminal.label}
        />
      </Resizable>
    </ResizablePanel>
    <ResizableHandle
      class="resizable-handle"
      aria-label={f.editor.handles[1]}
    />
    <ResizablePanel
      id={preview.id}
      defaultSize={preview.defaultSize}
      minSize={preview.minSize}
      class="resizable-panel"
      role="group"
      aria-label={preview.label}
    />
  </Resizable>
  <div class="row">
    <button onclick={() => controller.collapse(sidebar.id)}
      >{f.buttons.collapse}</button
    >
    <button onclick={() => controller.expand(sidebar.id)}
      >{f.buttons.expand}</button
    >
    <button onclick={() => controller.resize(preview.id, f.previewSize)}
      >{f.buttons.resize}</button
    >
  </div>
  <button>After</button>
  <output role="status" aria-label="Last action">{action}</output>
  <output role="status" aria-label="Committed">{committed.join(" ")}</output>
</div>
