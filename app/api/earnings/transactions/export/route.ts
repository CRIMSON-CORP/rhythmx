import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const BACKEND_API_URL =
  process.env.BACKEND_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND_API_URL ||
  "https://rhythmx.tushcode.com";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.access_token) {
    return NextResponse.json(
      { status: false, message: "Unauthorized. Please log in." },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(request.url);
  const queryString = searchParams.toString();
  const backendUrl = `${BACKEND_API_URL}/api/earnings/transactions/export${
    queryString ? `?${queryString}` : ""
  }`;

  try {
    const backendRes = await fetch(backendUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });

    if (!backendRes.ok) {
      const errorText = await backendRes.text();
      return new NextResponse(errorText, {
        status: backendRes.status,
        headers: { "Content-Type": "application/json" },
      });
    }

    const contentDisposition =
      backendRes.headers.get("content-disposition") ||
      'attachment; filename="rhythmx-transactions.csv"';
    const contentType =
      backendRes.headers.get("content-type") || "text/csv; charset=utf-8";

    const data = await backendRes.arrayBuffer();

    return new NextResponse(data, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": contentDisposition,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: false,
        message: error.message || "Failed to export transactions",
      },
      { status: 500 }
    );
  }
}
