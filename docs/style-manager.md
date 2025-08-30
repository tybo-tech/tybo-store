# Style Manager and Design Map (DM)

This app injects responsive CSS for company page sections at runtime.

## Class naming
- Section root: `sec-<sectionId>` (e.g., `sec-section-123`)
- Section container: `cont-<containerId>` (e.g., `cont-el-abc`)
- Elements: `el-<elementId>` (from DynamicElement)

Hero and Nine-Grid already apply `sec-*` and `cont-*` on their root nodes.

## Sources of styles
WebsitePageRendererComponent calls StyleManager after page data loads:
- Section styles: `section.styles.pc|tablet|mobile`
- Container styles: `section.container.styles.pc|tablet|mobile`
- Element styles: each element `styles.pc|tablet|mobile`

Notes:
- `className` (for Tailwind utilities) is ignored by the generator and should be added to HTML classes.
- Keys are converted to kebab-case (e.g., `backgroundColor` → `background-color`).

## Optional Design Map (DM)
File example: `src/app/styles/storefront.dm.json`
```json
[
  {
    "css_class": "section-hero-slider",
    "properties": {
      "pc": { "width": "100%", "padding": "0", "background-color": "#f3f4f6" },
      "tablet": { "padding": "40px 16px" },
      "mobile": { "padding": "30px 12px" }
    }
  },
  {
    "css_class": "section-nine-grid-category",
    "properties": {
      "pc": { "width": "100%", "padding": "60px 20px", "background-color": "#f3f4f6" },
      "tablet": { "padding": "40px 16px" },
      "mobile": { "padding": "30px 12px" }
    }
  }
]
```
Use `generateFromDesignMap(dm)` when you want static global classes in addition to per-section classes.

## API (StyleManagerService)
- `generateFromSections(sections: PageSection[], fonts?: { url: string }[])` — used automatically after page load.
- `generateFromDesignMap(dm: IStyleDM[], fonts?: { url: string }[])` — inject styles from a DM array.
- `clear()` — removes the injected `<style id="dynamic-styles">` tag.

Fonts: pass e.g. `[{ url: 'https://fonts.googleapis.com/css2?...' }]` to add `@import` at the top.

## Example (optional DM usage)
```ts
import { HttpClient } from '@angular/common/http';
import { StyleManagerService, IStyleDM } from '../../services/style-manager.service';

constructor(private http: HttpClient, private styles: StyleManagerService) {}

ngOnInit() {
  this.http.get<IStyleDM[]>('assets/storefront.dm.json').subscribe(dm => {
    this.styles.generateFromDesignMap(dm);
  });
}
```

## Scoping (optional)
To prevent leakage across pages, prefix selectors with `#page-<pageId>` in the service (can be enabled on request).
