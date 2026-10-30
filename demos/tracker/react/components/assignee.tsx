import { Avatar } from "@/components/ui/avatar"
import { personOf } from "tracker-data"

function Assignee({ id }: { id: string | null }) {
  const person = personOf(id)
  return person ? <Avatar name={person.name} /> : <span className="size-7 shrink-0" />
}

export { Assignee }
