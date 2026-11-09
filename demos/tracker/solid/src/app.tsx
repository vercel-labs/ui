import { createRouter } from "@solidjs/router"
import { useHead } from "@solidjs/web"
import { Errored } from "solid-js"
import { Header } from "@/components/header"
import { Confirmer } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Toaster } from "@/components/ui/toast"
import { IssuesPage } from "@/pages/issues"
import { SettingsPage } from "@/pages/settings"

const Router = createRouter({
  routes: [
    { path: "/", component: IssuesPage },
    { path: "/settings", component: SettingsPage },
  ],
})

function Failed(props: { retry: () => void }) {
  return (
    <main class="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
      <h1 class="text-base font-semibold">Something went wrong</h1>
      <p class="text-muted-foreground">
        The tracker couldn't load. Try again in a moment.
      </p>
      <Button onClick={props.retry}>Try again</Button>
    </main>
  )
}

function App() {
  useHead({ tag: "title", props: { children: "Tracker" } })
  return (
    <Router>
      {(props) => (
        <>
          <Header />
          <Errored fallback={(_, reset) => <Failed retry={reset} />}>
            {props.children}
          </Errored>
          <Toaster />
          <Confirmer />
        </>
      )}
    </Router>
  )
}

export { App }
