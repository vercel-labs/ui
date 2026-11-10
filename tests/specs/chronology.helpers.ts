import type { Page } from "@playwright/test"
import { chronologyFixture as f } from "../fixtures/chronology"

// The events, as list items, or as articles in a feed.
const eventNamed = (page: Page, name: string, role = "listitem") =>
  page.getByRole(role as "listitem" | "article", { name, exact: true })

const chronology = (page: Page, role = "list") =>
  page.getByRole(role as "list" | "feed", { name: f.label })

const titles = f.events.map((event) => event.title)

export { chronology, eventNamed, titles }
