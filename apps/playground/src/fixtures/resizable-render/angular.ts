import { Component, computed, viewChild } from "@angular/core"
import {
  Resizable,
  ResizableHandle,
  ResizablePanel,
  type ResizableLayoutCommit,
} from "@ui-sdk/angular/resizable"
import { mountAngular, state } from "../../angular-mount"

// How often the first panel's text was worked out, for specs that check a drag
// renders nothing that doesn't read the size.
const counts = { renders: 0 }
Object.assign(window, { panelRenders: counts })

@Component({
  imports: [Resizable, ResizableHandle, ResizablePanel],
  template: `
    <div class="fixture">
      <button>Before</button>
      <div uiResizable class="resizable" (layoutCommit)="onCommit($event)">
        <div
          uiResizablePanel
          #files="uiResizablePanel"
          class="resizable-panel"
          role="group"
          aria-label="Files"
          collapsible
          [defaultSize]="30"
          [minSize]="10"
        >
          <span class="panel-state">{{ panelState() }}</span>
        </div>
        <span
          uiResizableHandle
          #handle="uiResizableHandle"
          class="resizable-handle"
          aria-label="Resize files"
          [class.is-dragging]="handle.state().dragging"
          [class.is-idle]="!handle.state().dragging"
        ></span>
        <div
          uiResizablePanel
          #editor="uiResizablePanel"
          class="resizable-panel"
          role="group"
          aria-label="Editor"
        >
          <span class="panel-size">{{ round(editor.state().size) }}</span>
        </div>
      </div>
      <button>After</button>
      <output role="status" aria-label="Last action">{{ action() }}</output>
    </div>
  `,
})
class Fixture {
  readonly files = viewChild<ResizablePanel>("files")
  readonly collapsed = computed(() => !!this.files()?.state().collapsed)
  readonly panelState = computed(() => {
    counts.renders++
    return this.collapsed() ? "Collapsed" : "Open"
  })
  readonly round = Math.round
  readonly action = state("")

  onCommit(commit: ResizableLayoutCommit) {
    this.action.set(`layout:${commit.value.map(Math.round)}`)
  }
}

function mount(root: HTMLElement) {
  return mountAngular(Fixture, root)
}

export { Fixture, mount }
