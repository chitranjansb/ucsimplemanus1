import { describe, expect, it } from "vitest";
import { getManagedStorageFallbackUrl } from "./_core/storageProxy";

describe("managed storage fallback", () => {
  it("routes a Vercel media request through the project Manus asset proxy", () => {
    expect(getManagedStorageFallbackUrl("stark--Dining Table.jpg")).toBe(
      "https://umaidcraft-idbrw5ms.manus.space/manus-storage/stark--Dining%20Table.jpg",
    );
  });

  it("preserves nested managed-storage keys", () => {
    expect(getManagedStorageFallbackUrl("media/catalogue/cabinet.jpg")).toBe(
      "https://umaidcraft-idbrw5ms.manus.space/manus-storage/media/catalogue/cabinet.jpg",
    );
  });
});
