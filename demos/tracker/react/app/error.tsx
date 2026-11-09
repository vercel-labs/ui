"use client"

import { Button } from "@/components/ui/button"

function ErrorPage({ retry }: { error: unknown; retry: () => void }) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
      <h1 className="text-base font-semibold">Something went wrong</h1>
      <p className="text-muted-foreground">
        The tracker couldn't load. Try again in a moment.
      </p>
      <Button onClick={retry}>Try again</Button>
    </main>
  )
}

export default ErrorPage
