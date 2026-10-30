import { Badge } from "@/components/ui/badge"
import { labelOf } from "tracker-data"

function IssueLabels({ labels, className }: { labels: string[]; className?: string }) {
  return (
    <ul className={className} aria-label="Labels">
      {labels.map((id) => {
        const label = labelOf(id)
        if (!label) return null
        return (
          <li key={id}>
            <Badge>
              <span className="size-2 rounded-full" style={{ background: label.color }} />
              {label.name}
            </Badge>
          </li>
        )
      })}
    </ul>
  )
}

export { IssueLabels }
