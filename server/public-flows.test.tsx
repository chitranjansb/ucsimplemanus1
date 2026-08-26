import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Router } from "wouter";
import { ComparisonProvider } from "../client/src/contexts/ComparisonContext";
import { EnquiryProvider } from "../client/src/contexts/EnquiryContext";
import { getProduct } from "../client/src/lib/catalog";
import ProductDetail from "../client/src/pages/ProductDetail";

const testState = vi.hoisted(() => ({
  mutation: { mutate: vi.fn(), isPending: false },
  mutationOptions: undefined as { onSuccess?: () => void; onError?: () => void } | undefined,
}));

vi.mock("@/lib/trpc", () => ({
  trpc: {
    catalogue: {
      bySlug: { useQuery: () => ({ data: undefined }) },
      list: { useQuery: () => ({ data: [] }) },
    },
    inquiries: {
      create: { useMutation: (options: typeof testState.mutationOptions) => { testState.mutationOptions = options; return testState.mutation; } },
    },
  },
}));

function renderPublicProduct(id: string, onNavigate: (path: string) => void) {
  const hook = () => [`/collections/${id}`, onNavigate] as [string, (path: string) => void];
  return render(
    <Router hook={hook}>
      <EnquiryProvider>
        <ComparisonProvider>
          <ProductDetail id={id} />
        </ComparisonProvider>
      </EnquiryProvider>
    </Router>,
  );
}

describe("public product and RFQ flows", () => {
  beforeEach(() => {
    window.localStorage.clear();
    testState.mutation.mutate.mockReset();
    testState.mutationOptions = undefined;
  });

  afterEach(() => cleanup());

  it("mounts ProductDetail from a legacy URL and navigates to the imported product route", async () => {
    const navigated: string[] = [];
    renderPublicProduct("carved-storage-cabinet", (path) => navigated.push(path));
    await waitFor(() => expect(navigated).toContain("/collections/cabinet-with-two-drawer"));
    expect(screen.getByRole("heading", { name: "Cabinet With Two Drawer" })).toBeTruthy();
  });

  it("runs an imported product through RFQ selection, review, and successful submission", async () => {
    const user = userEvent.setup();
    renderPublicProduct("dining-table", () => undefined);

    await user.click(screen.getByRole("button", { name: /add to enquiry/i }));
    expect(screen.getAllByText("Dining Table").length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText(/1 selected reference/)).toBeTruthy();

    await user.click(screen.getByRole("button", { name: /continue to project details/i }));
    await user.type(screen.getByLabelText("Name"), "Ari Rossi");
    await user.type(screen.getByLabelText("Work email"), "ari@example.com");
    await user.selectOptions(screen.getByLabelText("Buyer type"), "Retailer / wholesaler");
    await user.type(screen.getByLabelText("Phone"), "+39 123456789");
    await user.type(screen.getByLabelText("Shipping destination"), "Italy");
    await user.selectOptions(screen.getByLabelText("Project type"), "Collection sourcing");
    await user.type(screen.getByLabelText("Project context"), "Please share the specification set for this dining table.");
    fireEvent.submit(screen.getByRole("button", { name: /review enquiry/i }).closest("form")!);
    await waitFor(() => expect(screen.getByRole("button", { name: /send enquiry/i })).toBeTruthy());

    expect(screen.getByText((content) => content.includes("Dining Table") && content.includes("× 1"))).toBeTruthy();
    expect(screen.getByText(/Retailer \/ wholesaler · Collection sourcing · Italy/)).toBeTruthy();
    await user.click(screen.getByRole("button", { name: /send enquiry/i }));
    expect(testState.mutation.mutate).toHaveBeenCalledWith(expect.objectContaining({ items: [{ productReference: "Dining Table", collectionName: "Stark", quantity: 1 }] }));

    testState.mutationOptions?.onSuccess?.();
    await waitFor(() => expect(screen.getByRole("heading", { name: "Thank you for your enquiry" })).toBeTruthy());
  });

  it("shows the existing RFQ error state when submission fails", async () => {
    const user = userEvent.setup();
    renderPublicProduct("dining-table", () => undefined);
    await user.click(screen.getByRole("button", { name: /add to enquiry/i }));
    await user.click(screen.getByRole("button", { name: /continue to project details/i }));
    await user.type(screen.getByLabelText("Name"), "Ari Rossi");
    await user.type(screen.getByLabelText("Work email"), "ari@example.com");
    await user.selectOptions(screen.getByLabelText("Buyer type"), "Retailer / wholesaler");
    await user.type(screen.getByLabelText("Phone"), "+39 123456789");
    await user.type(screen.getByLabelText("Shipping destination"), "Italy");
    await user.selectOptions(screen.getByLabelText("Project type"), "Collection sourcing");
    await user.type(screen.getByLabelText("Project context"), "Please share the specification set for this dining table.");
    fireEvent.submit(screen.getByRole("button", { name: /review enquiry/i }).closest("form")!);
    await waitFor(() => expect(screen.getByRole("button", { name: /send enquiry/i })).toBeTruthy());
    await user.click(screen.getByRole("button", { name: /send enquiry/i }));
    testState.mutationOptions?.onError?.();
    expect((await screen.findByRole("alert")).textContent).toMatch(/could not save your enquiry/i);
  });
});
