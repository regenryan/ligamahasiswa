import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // TODO: ToyyibPay membership callback in Phase 6
  return NextResponse.redirect(new URL("/#member", request.url));
}
