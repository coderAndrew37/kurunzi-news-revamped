import { NextRequest, NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");
  const tag = request.nextUrl.searchParams.get("tag");
  const path = request.nextUrl.searchParams.get("path");

  // 1. Security Check
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  try {
    // 2. Performance Flex: Targeted Revalidation
    if (tag) {
      revalidateTag(tag, "layout");
      return NextResponse.json({ revalidated: true, now: Date.now(), tag });
    }

    if (path) {
      revalidatePath(path, "layout");
      return NextResponse.json({ revalidated: true, now: Date.now(), path });
    }

    // 3. Fallback: Revalidate the whole site (use sparingly)
    revalidatePath("/", "layout");
    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (err) {
    return NextResponse.json(
      { message: "Error revalidating" },
      { status: 500 },
    );
  }
}
