import { describe, expect, it } from "vitest";
import { collections, getCanonicalProductPath, getProduct, productCategories, products, resolveProductId } from "../client/src/lib/catalog";
import { addEnquiryItem } from "../client/src/lib/enquirySelection";

describe("Umaid Craftorium catalogue", () => {
  it("exposes the imported backup catalogue with an honest specification boundary", () => {
    expect(products.length).toBe(436);
    expect(products.every((product) => product.image.startsWith("/manus-storage/"))).toBe(true);
    expect(products.every((product) => product.description.includes("Specifications available on request"))).toBe(true);
    expect(products.some((product) => product.dimensions !== "Specifications available on request")).toBe(true);
  });

  it("retrieves an individual backup product and exposes collection/category filters", () => {
    expect(getProduct("sideboard-with-two-door-and-drawers")?.collection).toBe("Stark");
    expect(getProduct("wooden-bed-with-shelf")?.collection).toBe("Mosaic");
    expect(collections.find((collection) => collection.slug === "stark")?.productCount).toBe(21);
    expect(productCategories).toContain("Storage");
    expect(getProduct("missing-product")).toBeUndefined();
  });

  it("keeps legacy product links pointed at real imported references", () => {
    expect(resolveProductId("carved-storage-cabinet")).toBe("cabinet-with-two-drawer");
    expect(getProduct("carved-storage-cabinet")?.id).toBe("cabinet-with-two-drawer");
    expect(getCanonicalProductPath("carved-storage-cabinet")).toBe("/collections/cabinet-with-two-drawer");
    expect(resolveProductId("missing-product")).toBe("missing-product");
  });

  it("transfers an imported backup product into the RFQ selection with its real asset reference", () => {
    const product = getProduct("dining-table");
    expect(product).toBeDefined();
    const selected = addEnquiryItem([], { id: product!.id, name: product!.name, collection: product!.collection, image: product!.image, quantity: 2 });
    expect(selected).toEqual([{ id: "dining-table", name: "Dining Table", collection: "Stark", image: product!.image, quantity: 2 }]);
  });
});
