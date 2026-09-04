import { describe, it, expect, vi, afterEach } from "vitest";

const ORIGINAL = process.env.NEXT_PUBLIC_BASE_URL;

afterEach(() => {
  if (ORIGINAL === undefined) {
    delete process.env.NEXT_PUBLIC_BASE_URL;
  } else {
    process.env.NEXT_PUBLIC_BASE_URL = ORIGINAL;
  }
});

async function load() {
  vi.resetModules();
  const { createBill, verifyPayment, generateTrackingUrl, generateTrackingCode } =
    await import("@/lib/toyyibpay");
  return { createBill, verifyPayment, generateTrackingUrl, generateTrackingCode };
}

describe("ToyyibPay mock integration", () => {
  it("createBill returns a success response with a redirect URL to the success page", async () => {
    process.env.NEXT_PUBLIC_BASE_URL = "https://ligamahasiswa.vercel.app";
    const { createBill } = await load();

    const res = await createBill({
      orderId: "ord_abc123",
      amount: 10,
      buyerName: "Adam",
      buyerEmail: "adam@example.com",
      description: "Liga Mahasiswa Membership - 10 MYR",
    });

    expect(res.ok).toBe(true);
    expect(res.billCode).toMatch(/^MOCK-/);
    expect(res.redirectUrl).toContain("https://ligamahasiswa.vercel.app/shop/payment-success");
    expect(res.redirectUrl).toContain("orderId=ord_abc123");
    expect(res.redirectUrl).toContain("amount=10");
  });

  it("createBill encodes the order, bill code, and amount into the redirect URL", async () => {
    const { createBill } = await load();
    const res = await createBill({
      orderId: "ord_xyz",
      amount: 50,
      buyerName: "B",
      buyerEmail: "b@example.com",
      description: "Shop order",
    });

    const url = new URL(res.redirectUrl!);
    expect(url.pathname).toBe("/shop/payment-success");
    expect(url.searchParams.get("orderId")).toBe("ord_xyz");
    expect(url.searchParams.get("billCode")).toBe(res.billCode);
    expect(url.searchParams.get("amount")).toBe("50");
  });

  it("falls back to localhost when NEXT_PUBLIC_BASE_URL is unset", async () => {
    delete process.env.NEXT_PUBLIC_BASE_URL;
    const { createBill } = await load();
    const res = await createBill({
      orderId: "ord_local",
      amount: 10,
      buyerName: "C",
      buyerEmail: "c@example.com",
      description: "d",
    });
    expect(res.redirectUrl).toContain("http://localhost:3000/shop/payment-success");
  });

  it("verifyPayment reports paid with a transaction id", async () => {
    const { verifyPayment } = await load();
    const res = await verifyPayment("MOCK-123", "ord_abc");
    expect(res.paid).toBe(true);
    expect(res.transactionId).toMatch(/^MOCK-TXN-/);
  });

  it("generateTrackingCode returns a stable-shaped SK code", async () => {
    const { generateTrackingCode } = await load();
    const a = generateTrackingCode();
    const b = generateTrackingCode();
    expect(a).toMatch(/^SK[A-Z0-9]+$/);
    expect(a).not.toBe(b);
  });

  it("generateTrackingUrl builds the tracking link from the order id", async () => {
    const { generateTrackingUrl } = await load();
    expect(generateTrackingUrl("ord_1")).toBe("https://tracking.example.com/order/ord_1");
  });
});
