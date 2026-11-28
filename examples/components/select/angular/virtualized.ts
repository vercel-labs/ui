import { Component, ElementRef, signal, viewChild } from "@angular/core"
import { LucideChevronDown } from "@lucide/angular"
import { Field, FieldLabel } from "@ui-sdk/angular/field"
import {
  Select,
  SelectContent,
  type SelectHighlight,
  SelectItem,
  SelectList,
  SelectTrigger,
  SelectValue,
} from "@ui-sdk/angular/select"

type Item = { value: string; label: string }

const manyItems: Item[] = Array.from({ length: 10_000 }, (_, index) => ({
  value: `item-${index + 1}`,
  label: `Item ${index + 1}`,
}))

function visibleRows(
  scrollTop: number,
  height: number,
  count: number,
  row: number
) {
  const start = Math.max(0, Math.floor(scrollTop / row) - 4)
  const end = Math.min(count, Math.ceil((scrollTop + height) / row) + 4)
  return { start, end }
}

function scrollForRow(
  index: number,
  scrollTop: number,
  height: number,
  row: number
) {
  const top = index * row
  if (top < scrollTop) {
    return top
  }
  if (top + row > scrollTop + height) {
    return top + row - height
  }
  return scrollTop
}

@Component({
  imports: [
    Field,
    FieldLabel,
    Select,
    SelectContent,
    SelectItem,
    SelectList,
    SelectTrigger,
    SelectValue,
    LucideChevronDown,
  ],
  template: `
    <div uiField>
      <label uiFieldLabel>Item</label>
      <ng-container
        uiSelect
        [items]="manyItems"
        placeholder="Select an item"
        (highlight)="scrollToRow($event)"
      >
        <button uiSelectTrigger>
          <span uiSelectValue></span>
          <svg lucideChevronDown></svg>
        </button>
        <div *uiSelectContent>
          <div
            #scroller
            [style.height.px]="height"
            (scroll)="scrollTop.set(scroller.scrollTop)"
          >
            <div uiSelectList #list="uiSelectList">
              <div [style.height.px]="list.state().items.length * row">
                @for (
                  entry of visible(list.state().items);
                  track entry.item.value
                ) {
                  <div
                    uiSelectItem
                    [value]="entry.item.value"
                    [label]="entry.item.label"
                    [index]="entry.index"
                    [style.top.px]="entry.index * row"
                    [style.height.px]="row"
                  >
                    {{ entry.item.label }}
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      </ng-container>
    </div>
  `,
})
class Example {
  readonly manyItems = manyItems
  readonly row = 32
  readonly height = 288
  readonly scrollTop = signal(0)
  readonly scroller = viewChild<ElementRef<HTMLDivElement>>("scroller")

  scrollToRow(highlight: SelectHighlight) {
    const el = this.scroller()?.nativeElement
    if (el && highlight.index >= 0) {
      el.scrollTop = scrollForRow(
        highlight.index,
        el.scrollTop,
        el.clientHeight,
        this.row
      )
    }
  }

  visible(items: readonly unknown[]) {
    const { start, end } = visibleRows(
      this.scrollTop(),
      this.height,
      items.length,
      this.row
    )
    return (items as Item[])
      .slice(start, end)
      .map((item, offset) => ({ item, index: start + offset }))
  }
}

export { Example }
