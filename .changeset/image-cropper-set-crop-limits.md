---
"@ui-sdk/core": patch
---

An image cropper's `setCrop`, from a controller, an agent or the web element's `crop` property, keeps the crop inside the image, at `aspectRatio`, and no smaller than `minWidth`, `minHeight` and `maxZoom` allow, as a key or a drag does. A crop saved under other limits is enlarged to fit the current ones.
