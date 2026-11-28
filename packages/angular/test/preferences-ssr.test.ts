// @vitest-environment node
import { Component } from "@angular/core"
import { createPreference, type PreferenceLike } from "@ui-sdk/core"
import { describe, expect, test } from "vitest"
import { Preferences, usePreference } from "../src/preferences"
import { render } from "./render"

const skinTone = createPreference({
  values: ["default", "dark"],
  defaultValue: "default",
  attribute: "data-skin-tone",
})

@Component({
  selector: "test-root",
  imports: [Preferences],
  template: `
    <div uiPreferences [preferences]="list" nonce="abc">
      <p>Tone: {{ tone().value }}</p>
    </div>
  `,
})
class Tones {
  readonly list: PreferenceLike[] = [skinTone]
  readonly tone = usePreference(skinTone)
}

describe("server rendering preferences", () => {
  test("renders one script first, with the nonce, and the defaults on its element", async () => {
    const html = await render(Tones)
    expect(html.match(/<script/g)).toHaveLength(1)
    expect(html).toMatch(
      /data-slot="preferences"[^>]*data-skin-tone="default"[^>]*><script data-preferences="" nonce="abc">\(function/
    )
    expect(html).toContain("Tone: default")
  })
})
