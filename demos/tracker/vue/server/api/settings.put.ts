import { readSettings } from "tracker-data"
import { updateSettings } from "tracker-data/store"

export default defineEventHandler(async (event) => {
  updateSettings(readSettings(Object.fromEntries(await readFormData(event))))
})
