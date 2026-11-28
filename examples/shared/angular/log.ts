import { inject, InjectionToken } from "@angular/core"

const LogKey = new InjectionToken<(message: string) => void>("log")

function useLog() {
  return (
    inject(LogKey, { optional: true }) ??
    ((message: string) => console.log(message))
  )
}

export { LogKey, useLog }
