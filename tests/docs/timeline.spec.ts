import { expect } from "@playwright/test"
import { testExamples } from "./docs-helpers"

// Each example's check, in the order they appear on the Timeline page.
testExamples("timeline", {
  demo: async (preview) => {
    const activity = preview.getByRole("list", { name: "Activity" })
    await activity.getByRole("listitem").first().focus()
    await preview.page().keyboard.press("ArrowDown")
    await expect(
      activity.getByRole("listitem", { name: "Checks passed" })
    ).toBeFocused()
  },
  horizontal: async (preview) => {
    const roadmap = preview.getByRole("list", { name: "Roadmap" })
    await roadmap.getByRole("listitem", { name: "Beta" }).focus()
    await preview.page().keyboard.press("ArrowRight")
    await preview.page().keyboard.press("ArrowRight")
    await expect(
      roadmap.getByRole("listitem", { name: "Launch" })
    ).toBeFocused()
  },
  status: async (preview) => {
    const shipped = preview.getByRole("listitem", { name: "Shipped" })
    await expect(shipped).toHaveAttribute("aria-current", "step")
    await preview.getByRole("button", { name: "Go to Current Step" }).click()
    await expect(shipped).toBeFocused()
  },
  details: async (preview) => {
    const trigger = preview
      .getByRole("listitem", { name: "Version 2.4" })
      .getByRole("button", { name: "What Changed" })
    await trigger.click()
    await expect(trigger).toHaveAttribute("aria-expanded", "true")
    await expect(
      preview.getByText("Uploads resume after the connection drops.")
    ).toBeVisible()
  },
  feed: async (preview) => {
    const feed = preview.getByRole("feed", { name: "Team updates" })
    await expect(feed.getByRole("article")).toHaveCount(3)
    await preview.getByRole("button", { name: "Load More" }).click()
    await expect(feed.getByRole("article")).toHaveCount(6)
    await expect(feed).not.toHaveAttribute("aria-busy", /.*/)
  },
})
