import { Component, ElementRef, signal, viewChild } from "@angular/core"
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from "@ui-sdk/angular/command"

const commands = Array.from({ length: 10_000 }, (_, index) => ({
  value: `command-${index + 1}`,
  label: `Command ${index + 1}`,
}))

@Component({
  imports: [Command, CommandInput, CommandItem, CommandList],
  template: `
    <div
      uiCommand
      [items]="commands"
      (beforeValueChange)="onValueChange($event.value, $event)"
    >
      <input
        uiCommandInput
        aria-label="Search 10,000 commands"
        placeholder="Search 10,000 commands…"
      />
      <div #scroller (scroll)="scrollTop.set(scroller.scrollTop)">
        <div uiCommandList #commandList="uiCommandList">
          <div [style.height.px]="commandList.state().items.length * row">
            @for (
              entry of visible(commandList.state().items);
              track entry.item.value
            ) {
              <div
                uiCommandItem
                [value]="entry.item.value"
                [label]="entry.item.label"
                [index]="entry.index"
                [style.top.px]="entry.index * row"
              >
                {{ entry.item.label }}
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
})
class Example {
  readonly commands = commands

  readonly row = 32

  readonly height = 256

  readonly scroller = viewChild<ElementRef<HTMLDivElement>>("scroller")

  readonly scrollTop = signal(0)

  onValueChange(_value: string | null, { index }: { index: number }) {
    const el = this.scroller()?.nativeElement
    if (!el || index < 0) {
      return
    }
    const top = index * this.row
    if (top < el.scrollTop) {
      el.scrollTop = top
    } else if (top + this.row > el.scrollTop + el.clientHeight) {
      el.scrollTop = top + this.row - el.clientHeight
    }
  }

  visible(list: readonly unknown[]) {
    const items = list as typeof commands
    const start = Math.max(0, Math.floor(this.scrollTop() / this.row) - 4)
    const end = Math.min(
      items.length,
      Math.ceil((this.scrollTop() + this.height) / this.row) + 4
    )
    return items
      .slice(start, end)
      .map((item, offset) => ({ item, index: start + offset }))
  }
}

export { Example }
