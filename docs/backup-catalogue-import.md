# Backup catalogue import provenance

Source supplied by the user: `/home/ubuntu/upload/index.zip`, a static export of `www.umaidcraftorium.com`.

The extracted source contains 23 collection/category pages and 436 product card references. Product names and dimensions were parsed from the collection-page labels in the exported HTML. Product imagery was selected from the original-size files under `wp-content/uploads/2020/10/` and `wp-content/uploads/2020/11/`; WordPress thumbnail variants and brand/plugin UI assets were excluded.

The original source URL pattern retained in the extracted manifest is `https://www.umaidcraftorium.com/wp-content/uploads/{year}/{month}/{filename}`. The web app uses the corresponding WebDev-managed `/manus-storage/` paths for runtime delivery. Missing trade fields remain explicitly `Specifications available on request`; no pricing, ratings, shipping terms, lead times, duties, taxes, or unsupported commercial claims were added.

Inventory summary:

| Measure | Value |
|---|---:|
| Product references | 436 |
| Collection pages represented | 23 |
| Original product images | 436 |
| Source image bytes before managed upload | 49.86 MB |
| Derived categories | Bathroom 49; Bedroom 26; Dining 93; Living 72; Storage 196 |

The extracted source manifests were generated from the user-provided attachment and used only as import inputs; they are not treated as live customer or review data.

QA record after integration:

- Desktop and mobile previews were reviewed for `/`, `/collections`, and `/collections/dining-table`. Imported product images remain contained within their cards and gallery frames, with the existing focal-point rules preserved.
- The mounted public-flow tests exercise a legacy `/collections/carved-storage-cabinet` ProductDetail route and verify navigation to `/collections/cabinet-with-two-drawer`.
- The mounted RFQ drawer test adds the imported `Dining Table`, advances through project details and review, verifies the persisted submission payload, and covers both the existing success and error mutation states. The network mutation is intentionally mocked in tests; no real customer enquiry is created during automated QA.
