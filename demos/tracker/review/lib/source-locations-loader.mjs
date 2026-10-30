import { jsxLocations } from "./source-locations.mjs"

// A Turbopack loader for the React tracker. Options: { root }, the tracker's folder.
function sourceLocationsLoader(source) {
  return jsxLocations(source, this.resourcePath, this.getOptions().root) ?? source
}

export default sourceLocationsLoader
