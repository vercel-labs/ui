import {
  Component,
  ElementRef,
  computed,
  signal,
  viewChild,
} from "@angular/core"
import { LucideChevronRight } from "@lucide/angular"
import {
  Tree,
  TreeItem,
  TreeItemIndicator,
  TreeItemLabel,
  visibleTreeRows,
  type TreeItemData,
} from "@ui-sdk/angular/tree"

@Component({
  imports: [
    Tree,
    TreeItem,
    TreeItemIndicator,
    TreeItemLabel,
    LucideChevronRight,
  ],
  template: `
    <div
      data-slot="scroll"
      #scroller
      (scroll)="scrollTop.set(scroller.scrollTop)"
    >
      <div
        uiTree
        aria-label="Archive"
        [items]="items"
        [(expanded)]="expanded"
        (highlight)="onHighlight($event.value, $event)"
        style="height: {{ rows().length * row }}px"
      >
        @for (entry of rows().slice(start(), end()); track entry.item.value) {
          <div
            uiTreeItem
            [value]="entry.item.value"
            style="top: {{ entry.index * row }}px"
          >
            <span uiTreeItemLabel>
              @if (entry.item.children) {
                <span uiTreeItemIndicator>
                  <svg lucideChevronRight></svg>
                </span>
              }
              {{ entry.item.label }}
            </span>
          </div>
        }
      </div>
    </div>
  `,
})
class Example {
  readonly items: TreeItemData[] = Array.from({ length: 100 }, (_, folder) => ({
    value: `folder-${folder + 1}`,
    label: `Folder ${folder + 1}`,
    children: Array.from({ length: 100 }, (_, file) => ({
      value: `folder-${folder + 1}/file-${file + 1}`,
      label: `File ${file + 1}.txt`,
    })),
  }))

  readonly row = 32

  readonly height = 288

  readonly scroller = viewChild<ElementRef<HTMLDivElement>>("scroller")

  readonly scrollTop = signal(0)

  readonly expanded = signal(["folder-1"])

  readonly rows = computed(() => visibleTreeRows(this.items, this.expanded()))

  readonly start = computed(() =>
    Math.max(0, Math.floor(this.scrollTop() / this.row) - 4)
  )

  readonly end = computed(() =>
    Math.min(
      this.rows().length,
      Math.ceil((this.scrollTop() + this.height) / this.row) + 4
    )
  )

  onHighlight(_value: string, { index }: { index: number }) {
    const el = this.scroller()?.nativeElement
    if (!el) {
      return
    }
    const top = index * this.row
    if (top < el.scrollTop) {
      el.scrollTop = top
    } else if (top + this.row > el.scrollTop + el.clientHeight - 10) {
      el.scrollTop = top + this.row - el.clientHeight + 10
    }
    this.scrollTop.set(el.scrollTop)
  }
}

export { Example }
