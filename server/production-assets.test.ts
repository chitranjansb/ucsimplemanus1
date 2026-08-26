import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { products } from "../client/src/lib/catalog";

describe("production catalogue assets", () => {
  it("uses committed public image files instead of Manus-preview storage paths", () => {
    expect(products).toHaveLength(5);

    for (const product of products) {
      expect(product.image).toMatch(/^\/images\/official-[a-z-]+\.jpg$/);
      expect(product.image).not.toContain("/manus-storage/");
      expect(existsSync(path.resolve(process.cwd(), "client/public", product.image.slice(1)))).toBe(true);
    }
  });
});
