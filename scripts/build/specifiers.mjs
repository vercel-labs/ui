import { existsSync } from "node:fs"
import path from "node:path"

/**
 * Turns an extensionless relative import like `./menu`, `./dom` or `.` into
 * the path Node's ESM resolver needs: `./menu.js`, `./dom/index.js` or
 * `./index.js`. Sources import without extensions, which only bundlers
 * accept. `extensions` are the files that may sit behind the specifier, like
 * `[".ts", ".tsx"]` in `src` or `[".d.ts"]` in `dist`. Code Node loads from
 * `src`, like a Vite plugin, imports with `.ts`, which becomes `.js` too.
 */
function withJsExtension(specifier, fromDir, extensions) {
  if (/\.tsx?$/.test(specifier)) return specifier.replace(/\.tsx?$/, ".js")
  const target = path.resolve(fromDir, specifier)
  const namesDirectory = /(^|\/)\.\.?$|\/$/.test(specifier)
  if (!namesDirectory && extensions.some((extension) => existsSync(target + extension)))
    return `${specifier}.js`
  if (extensions.some((extension) => existsSync(path.join(target, `index${extension}`))))
    return `${specifier.replace(/\/$/, "")}/index.js`
  throw new Error(`Can't resolve "${specifier}" from ${fromDir}.`)
}

function isRelative(specifier) {
  return /^\.{1,2}(\/|$)/.test(specifier)
}

export { isRelative, withJsExtension }
