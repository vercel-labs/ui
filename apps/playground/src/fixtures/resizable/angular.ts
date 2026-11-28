import { Component } from "@angular/core"
import {
  createResizableController,
  Resizable,
  ResizableHandle,
  ResizablePanel,
  type ResizableLayoutChange,
  type ResizableLayoutCommit,
} from "@ui-sdk/angular/resizable"
import {
  formatLayout,
  resizableFixture,
  resizableOptions,
} from "../../../../../tests/fixtures/resizable"
import { mountAngular, state } from "../../angular-mount"

@Component({
  imports: [Resizable, ResizableHandle, ResizablePanel],
  template: `
    <div class="fixture">
      <button>Before</button>
      <div
        uiResizable
        class="resizable"
        [orientation]="options.orientation"
        [disabled]="options.disabled"
        [step]="options.step"
        [largeStep]="options.largeStep"
        [autoSaveId]="options.autoSaveId"
        [defaultLayout]="options.defaultLayout"
        [controller]="controller"
        [layout]="options.controlled ? layout() : undefined"
        (beforeLayoutChange)="report(f.editor.id, $event)"
        (layoutCommit)="commit(f.editor.id, $event)"
      >
        <div
          uiResizablePanel
          class="resizable-panel"
          role="group"
          [id]="sidebar.id"
          [defaultSize]="sidebar.defaultSize"
          [minSize]="sidebar.minSize"
          [maxSize]="sidebar.maxSize"
          [collapsible]="sidebar.collapsible"
          [attr.aria-label]="sidebar.label"
        >
          <button>Sidebar action</button>
        </div>
        <div
          uiResizableHandle
          class="resizable-handle"
          [attr.aria-label]="f.editor.handles[0]"
          [disabled]="options.locked"
        ></div>
        <div
          uiResizablePanel
          class="resizable-panel"
          role="group"
          [id]="main.id"
          [minSize]="main.minSize"
          [attr.aria-label]="main.label"
        >
          <div
            uiResizable
            class="resizable-nested"
            orientation="vertical"
            (beforeLayoutChange)="report(f.main.id, $event)"
            (layoutCommit)="commit(f.main.id, $event)"
          >
            <div
              uiResizablePanel
              class="resizable-panel"
              role="group"
              [id]="code.id"
              [defaultSize]="code.defaultSize"
              [minSize]="code.minSize"
              [attr.aria-label]="code.label"
            ></div>
            <div
              uiResizableHandle
              class="resizable-handle"
              [attr.aria-label]="f.main.handle"
            ></div>
            <div
              uiResizablePanel
              class="resizable-panel"
              role="group"
              [id]="terminal.id"
              [minSize]="terminal.minSize"
              [collapsible]="terminal.collapsible"
              [attr.aria-label]="terminal.label"
            ></div>
          </div>
        </div>
        <div
          uiResizableHandle
          class="resizable-handle"
          [attr.aria-label]="f.editor.handles[1]"
        ></div>
        <div
          uiResizablePanel
          class="resizable-panel"
          role="group"
          [id]="preview.id"
          [defaultSize]="preview.defaultSize"
          [minSize]="preview.minSize"
          [attr.aria-label]="preview.label"
        ></div>
      </div>
      <div class="row">
        <button (click)="controller.collapse(sidebar.id)">
          {{ f.buttons.collapse }}
        </button>
        <button (click)="controller.expand(sidebar.id)">
          {{ f.buttons.expand }}
        </button>
        <button (click)="controller.resize(preview.id, f.previewSize)">
          {{ f.buttons.resize }}
        </button>
      </div>
      <button>After</button>
      <output role="status" aria-label="Last action">{{ action() }}</output>
      <output role="status" aria-label="Committed">{{
        committed().join(" ")
      }}</output>
    </div>
  `,
})
class Fixture {
  readonly f = resizableFixture
  readonly sidebar = resizableFixture.editor.panels.sidebar
  readonly main = resizableFixture.editor.panels.main
  readonly preview = resizableFixture.editor.panels.preview
  readonly code = resizableFixture.main.panels.code
  readonly terminal = resizableFixture.main.panels.terminal
  readonly options = resizableOptions()
  readonly controller = createResizableController()
  readonly action = state("")
  readonly committed = state<string[]>([])
  readonly layout = state([25, 50, 25])

  report(group: string, change: ResizableLayoutChange) {
    const { editor } = resizableFixture
    if (group === editor.id && this.options.cancel) {
      return change.cancel()
    }
    this.action.set(formatLayout(group, change.value, change.reason))
    if (
      group === editor.id &&
      this.options.controlled &&
      !this.options.ignore
    ) {
      this.layout.set(change.value)
    }
  }

  commit(group: string, change: ResizableLayoutCommit) {
    this.committed.update((list) => [
      ...list,
      formatLayout(group, change.value, change.reason),
    ])
  }
}

function mount(root: HTMLElement) {
  return mountAngular(Fixture, root)
}

export { Fixture, mount }
