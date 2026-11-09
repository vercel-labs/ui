import * as React from "react"
import * as ReactDOM from "react-dom"
import * as JSXRuntime from "react/jsx-runtime"

// The React examples import React from here, so they run on the page's copy:
// Next's, not the catalog's. examples/vite.config.ts lists the same modules.
Object.assign(globalThis, {
  __docsReact: {
    react: React,
    "react/jsx-runtime": JSXRuntime,
    "react-dom": ReactDOM,
  },
})
