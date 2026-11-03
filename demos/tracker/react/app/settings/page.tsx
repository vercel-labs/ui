import type { Metadata } from "next"
import { getSettings } from "@/app/data"
import { SettingsForm } from "@/components/settings-form"

const metadata: Metadata = {
  title: "Settings · Tracker",
}

async function Page() {
  const settings = await getSettings()
  return (
    <main className="min-h-0 flex-1 overflow-y-auto">
      <div className="mx-auto grid max-w-xl gap-8 px-4 py-10">
        <div className="grid gap-1">
          <h1 className="text-xl font-semibold">Settings</h1>
          <p className="text-muted-foreground">How the tracker works for the Acme workspace.</p>
        </div>
        <SettingsForm settings={settings} />
      </div>
    </main>
  )
}

export default Page
export { metadata }
