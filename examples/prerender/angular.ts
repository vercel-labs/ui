import {
  APP_ID,
  provideZonelessChangeDetection,
  type Type,
} from "@angular/core"
import { bootstrapApplication } from "@angular/platform-browser"
import { renderApplication } from "@angular/platform-server"

const examples = import.meta.glob<{ Example: Type<unknown> }>([
  "../*/angular/*.ts",
  "../components/*/angular/*.ts",
  "!../shared/**",
])

async function render(module: { Example: Type<unknown> }) {
  const html = await renderApplication(
    (context) =>
      bootstrapApplication(
        module.Example,
        {
          providers: [
            provideZonelessChangeDetection(),
            { provide: APP_ID, useValue: "example" },
          ],
        },
        context
      ),
    { document: "<ng-component></ng-component>" }
  )
  return html.match(/<ng-component[^>]*>([^]*)<\/ng-component>/)?.[1] ?? ""
}

export { examples, render }
