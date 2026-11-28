import { Component } from "@angular/core"
import { useAsyncOptions } from "@ui-sdk/angular/async-options"
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
  CommandStatus,
} from "@ui-sdk/angular/command"

@Component({
  imports: [
    Command,
    CommandEmpty,
    CommandInput,
    CommandItem,
    CommandList,
    CommandStatus,
  ],
  template: `
    <div
      uiCommand
      [filter]="false"
      [status]="issues.state().status"
      (beforeQueryChange)="issues.setQuery($event.value)"
      (loadMore)="issues.loadMore()"
    >
      <input
        uiCommandInput
        aria-label="Search issues"
        placeholder="Search issues…"
      />
      <div uiCommandStatus #commandStatus="uiCommandStatus">
        {{
          commandStatus.state().loading
            ? "Searching…"
            : commandStatus.state().count +
              " " +
              (commandStatus.state().count === 1 ? "issue" : "issues")
        }}
      </div>
      <div uiCommandEmpty #commandEmpty="uiCommandEmpty">
        @if (commandEmpty.state().empty && !commandEmpty.state().loading) {
          No issues match “{{ commandEmpty.state().query }}”.
        }
      </div>
      <div uiCommandList>
        @for (issue of issues.state().items; track issue.value) {
          <div uiCommandItem [value]="issue.value" [label]="issue.label">
            {{ issue.label }}
          </div>
        }
      </div>
    </div>
  `,
})
class Example {
  readonly searchIssues = (
    query: string,
    { signal }: { signal: AbortSignal }
  ) => {
    const issues = [
      "Fix login redirect",
      "Dark mode flicker",
      "Add billing page",
      "Search is slow",
      "Update dependencies",
      "Crash on upload",
      "Export to CSV",
      "Keyboard shortcuts help",
    ]
    return new Promise<{ value: string; label: string }[]>(
      (resolve, reject) => {
        const timer = setTimeout(() => {
          const needle = query.trim().toLowerCase()
          resolve(
            issues
              .filter((issue) => issue.toLowerCase().includes(needle))
              .map((issue) => ({
                value: issue.toLowerCase().replaceAll(" ", "-"),
                label: issue,
              }))
          )
        }, 400)
        signal.addEventListener("abort", () => {
          clearTimeout(timer)
          reject(new DOMException("Aborted", "AbortError"))
        })
      }
    )
  }

  readonly issues = useAsyncOptions(this.searchIssues, {
    debounce: 250,
    immediate: true,
  })
}

export { Example }
