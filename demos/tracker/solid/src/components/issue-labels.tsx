import { For, Show } from "solid-js"
import { labelOf } from "tracker-data"
import { Badge } from "@/components/ui/badge"

function IssueLabels(props: { labels: string[]; class?: string }) {
  return (
    <ul class={props.class} aria-label="Labels">
      <For each={props.labels}>
        {(id) => (
          <Show when={labelOf(id)}>
            {(label) => (
              <li>
                <Badge>
                  <span class="size-2 rounded-full" style={{ background: label().color }} />
                  {label().name}
                </Badge>
              </li>
            )}
          </Show>
        )}
      </For>
    </ul>
  )
}

export { IssueLabels }
