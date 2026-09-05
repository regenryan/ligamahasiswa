/**
 * ToyyibPay Mock Payment Integration
 * 
 * In production, replace with real ToyyibPay API calls:
 * - POST https://dev.toyyibpay.com/v1/bills
 * - POST https://dev.toyyibpay.com/v1/bills/{code}
 * 
 * Mock: simulates bill creation and redirect to success page.
 */

const TOYYIBPAY_SECRET = process.env.TOYYIBPAY_SECRET || "mock-secret";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export interface CreateBillParams {
  orderId: string;
  amount: number; // in MYR (no cents)
  buyerName: string;
  buyerEmail: string;
  description: string;
}

export interface BillResponse {
  ok: boolean;
  billCode?: string;
  error?: string;
  redirectUrl?: string;
}

/**
 * Create a bill on ToyyibPay (mock implementation)
 * Returns a redirect URL to the mock payment page
 */
export async function createBill(params: CreateBillParams): Promise<BillResponse> {
  const { orderId, amount, buyerName, buyerEmail, description } = params;

  // Mock: generate a bill code
  const billCode = `MOCK-${orderId.slice(0, 8)}-${Date.now().toString(36).toUpperCase()}`;

  // In production:
  // const response = await fetch("https://dev.toyyibpay.com/v1/bills", {
  //   method: "POST",
  //   headers: {
  //     Authorization: `Bearer ${TOYYIBPAY_SECRET}`,
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify({
  //     userSecretKey: TOYYIBPAY_SECRET,
  //     formdata: {
  //       billName: description.slice(0, 50),
  //       billDescription: description,
  //       billAmount: amount * 100, // ToyyibPay uses cents
  //       billPayorName: buyerName,
  //       billPayorEmail: buyerEmail,
  //       billReferenceNo: orderId,
  //       billExternalReferenceNo: orderId,
  //       billTo: buyerEmail,
  //     },
  //   }),
  // });
  // const data = await response.json();
  // if (data.code === 200) {
  //   return {
  //     ok: true,
  //     billCode: data.data.billCode,
  //     redirectUrl: `https://dev.toyyibpay.com/${data.data.billCode}`,
  //   };
  // }
  // return { ok: false, error: "Failed to create bill" };

  // Mock: return success with a redirect URL to our mock success page
  const redirectUrl = `${BASE_URL}/shop/payment-success?orderId=${orderId}&billCode=${billCode}&amount=${amount}`;

  return {
    ok: true,
    billCode,
    redirectUrl,
  };
}

/**
 * Verify payment status from ToyyibPay callback
 * Mock: always returns paid
 */
export async function verifyPayment(billCode: string, orderId: string): Promise<{ paid: boolean; transactionId?: string }> {
  void billCode;
  void orderId;

  // In production:
  // const response = await fetch(`https://dev.toyyibpay.com/v1/bills/${billCode}/verify`, {
  //   headers: { Authorization: `Bearer ${TOYYIBPAY_SECRET}` },
  // });
  // const data = await response.json();
  // return { paid: data.status === "completed", transactionId: data.transactionId };

  // Mock: always successful
  return {
    paid: true,
    transactionId: `MOCK-TXN-${Date.now()}`,
  };
}

/**
 * Generate a mock tracking URL
 */
export function generateTrackingUrl(orderId: string): string {
  // In production: integrate with shipping provider API
  return `https://tracking.example.com/order/${orderId}`;
}

/**
 * Generate a mock tracking code
 */
export function generateTrackingCode(): string {
  return `SK${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
}
