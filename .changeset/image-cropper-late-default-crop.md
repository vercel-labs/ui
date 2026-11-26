---
"@ui-sdk/core": patch
"@ui-sdk/web": patch
---

An image cropper starts its first image's crop at `defaultCrop` even when the default arrives after the cropper is made, like the web property set on a `<ui-image-cropper>` already in the page. `defaultCrop` is now on the element's type.
