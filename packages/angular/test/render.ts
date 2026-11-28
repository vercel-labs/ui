import "@angular/compiler"
import { provideZonelessChangeDetection, type Type } from "@angular/core"
import {
  bootstrapApplication,
  type BootstrapContext,
} from "@angular/platform-browser"
import {
  provideServerRendering,
  renderApplication,
} from "@angular/platform-server"

const render = (component: Type<unknown>) =>
  renderApplication(
    (context: BootstrapContext) =>
      bootstrapApplication(
        component,
        {
          providers: [
            provideServerRendering(),
            provideZonelessChangeDetection(),
          ],
        },
        context
      ),
    { document: "<test-root></test-root>", url: "/" }
  )

// The opening tag of the element whose text is `text`.
const tagWith = (html: string, text: string) =>
  html.match(new RegExp(`<[^>]*>\\s*${text}\\s*<`))?.[0] ?? ""

export { render, tagWith }
