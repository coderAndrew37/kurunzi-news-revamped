import { NextRequest, NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next-cache";

export async function POST(request: NextRequest) {
  // Check both searchParams (from add_query_arg) and Headers/Body for flexibility
  const secret = request.nextUrl.searchParams.get("secret");
  const tag = request.nextUrl.searchParams.get("tag");
  const path = request.nextUrl.searchParams.get("path");

  // 1. Security Check
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  try {
    // 2. The Tag Flex: This is much faster for Headless
    if (tag) {
      revalidateTag(tag);
      return NextResponse.json({ revalidated: true, type: "tag", target: tag });
    }

    // 3. The Path Flex: Useful for manual purges
    if (path) {
      revalidatePath(path);
      return NextResponse.json({
        revalidated: true,
        type: "path",
        target: path,
      });
    }

    return NextResponse.json(
      { message: "No tag or path provided" },
      { status: 400 },
    );
  } catch (err) {
    return NextResponse.json(
      { message: "Revalidation failed" },
      { status: 500 },
    );
  }
}
