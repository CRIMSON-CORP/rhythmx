import { NextResponse } from "next/server";


const dummyArtists: Artist[] = [
  { id: "1", name: "Liam", location: "Los Angeles", image: "/images/release-3.png", balance: 512000.00 },
  { id: "2", name: "Olivia", location: "Chicago", image: "/images/release-14.png", balance: 278500.00 },
  { id: "3", name: "Noah", location: "Austin", image: "/images/release-10.png", balance: 450300.00 },
  { id: "4", name: "Emma", location: "Miami", image: "/images/release-13.png", balance: 625000.00 },
  { id: "5", name: "Ava", location: "Seattle", image: "/images/release-4.png", balance: 345750.00 },
  { id: "6", name: "Elijah", location: "San Francisco", image: "/images/release-5.png", balance: 700000.00 },
  { id: "7", name: "Sophia", location: "Boston", image: "/images/release-6.png", balance: 560200.00 },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search")?.toLowerCase() || "";

  // Simulate network latency (1000ms delay)
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const filtered = dummyArtists.filter(
    (artist) =>
      artist.name.toLowerCase().includes(search) ||
      artist.location.toLowerCase().includes(search)
  );

  return NextResponse.json(filtered);
}
