import { Show } from "solid-js"
import { personOf } from "tracker-data"
import { Avatar } from "@/components/ui/avatar"

function Assignee(props: { id: string | null }) {
  return (
    <Show when={personOf(props.id)} fallback={<span class="size-7 shrink-0" />}>
      {(person) => <Avatar name={person().name} />}
    </Show>
  )
}

export { Assignee }
