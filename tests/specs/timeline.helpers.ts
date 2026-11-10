import type { Page } from "@playwright/test"
import { timelineFixture as f } from "../fixtures/timeline"

// The events, as list items, or as articles in a feed.
const eventNamed = (page: Page, name: string, role = "listitem") =>
  page.getByRole(role as "listitem" | "article", { name, exact: true })

const timeline = (page: Page, role = "list") =>
  page.getByRole(role as "list" | "feed", { name: f.label })

const titles = f.events.map((event) => event.title)

export { timeline, eventNamed, titles }
