import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { products } from "../client/src/lib/catalog";

describe("production catalogue assets", () => {
  it("uses verified managed-storage image paths instead of repository copies", () => {
    expect(products).toHaveLength(436);

    for (const product of products) {
      expect(product.image).toMatch(/^\/manus-storage\/.+\.(jpg|jpeg|png|webp)$/i);
    }
  });
});
