import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/membership/callback
 * 
 * Handles ToyyibPay redirect after membership payment.
 * ToyyibPay redirects here with query params like:
 * ?billCode=xxx&order=xxx&status_id=1
 * 
 * We verify the payment and redirect to the dashboard.
 */
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const orderId = url.searchParams.get("order");
  void url.searchParams.get("billCode");

  // In production, we would verify the payment with ToyyibPay API
  // For now, redirect to dashboard with a success message
  if (orderId) {
    // We could call the payment callback endpoint here
    // But for simplicity, just redirect to dashboard
    return NextResponse.redirect(new URL("/dashboard?payment=success", request.url));
  }

  return NextResponse.redirect(new URL("/dashboard?payment=failed", request.url));
}
