import { Toggle, ToggleGroup, ToggleIcon } from "@ui-sdk/react/toggle"
import { BoldIcon, BookmarkIcon, HeartIcon, ItalicIcon, StarIcon, UnderlineIcon } from "lucide-react"

const formatting = [
  { value: "bold", label: "Bold", icon: BoldIcon },
  { value: "italic", label: "Italic", icon: ItalicIcon },
  { value: "underline", label: "Underline", icon: UnderlineIcon },
]

const favorites = [
  { value: "star", label: "Star", icon: StarIcon },
  { value: "heart", label: "Heart", icon: HeartIcon },
  { value: "bookmark", label: "Bookmark", icon: BookmarkIcon },
]

export function Example() {
  return (
    <div data-slot="stack">
      <ToggleGroup multiple aria-label="Text formatting">
        {formatting.map((item) => (
          <Toggle key={item.value} value={item.value} aria-label={item.label}>
            <ToggleIcon>
              <item.icon />
            </ToggleIcon>
          </Toggle>
        ))}
      </ToggleGroup>
      <ToggleGroup multiple data-variant="spaced" aria-label="Favorites">
        {favorites.map((item) => (
          <Toggle key={item.value} value={item.value} data-variant="outline">
            <ToggleIcon data-variant="fill">
              <item.icon />
            </ToggleIcon>
            {item.label}
          </Toggle>
        ))}
      </ToggleGroup>
    </div>
  )
}
