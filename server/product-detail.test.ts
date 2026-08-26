import { describe, expect, it } from "vitest";
import { getProduct } from "../client/src/lib/catalog";
import { getProductDetailRedirect } from "../client/src/pages/ProductDetail";

describe("ProductDetail legacy route behavior", () => {
  it("redirects a legacy product URL to the mapped imported product route", () => {
    const importedProduct = getProduct("carved-storage-cabinet");
    expect(importedProduct?.id).toBe("cabinet-with-two-drawer");
    expect(getProductDetailRedirect("carved-storage-cabinet", importedProduct)).toBe("/collections/cabinet-with-two-drawer");
  });

  it("does not redirect an already canonical or missing product path", () => {
    expect(getProductDetailRedirect("cabinet-with-two-drawer", getProduct("cabinet-with-two-drawer"))).toBeNull();
    expect(getProductDetailRedirect("missing-product", undefined)).toBeNull();
  });
});
