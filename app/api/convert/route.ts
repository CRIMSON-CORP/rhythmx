import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const amountStr = searchParams.get("amount") || "0";
  const amount = parseFloat(amountStr);

  // Simulate network latency (500ms delay)
  await new Promise((resolve) => setTimeout(resolve, 500));

  const converted = amount * 3000; // Mock rate $1 = ₦3,000
  const formatted = "₦" + converted.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return NextResponse.json({
    amount,
    converted,
    formatted,
  });
}
