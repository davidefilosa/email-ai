import { exchabheCodeForAccessToken, getAccountDetails } from "@/lib/aurinko";
import { prismadb } from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const { userId } = auth();
  if (!userId)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const params = req.nextUrl.searchParams;
  const status = params.get("status");

  if (status !== "success")
    return NextResponse.json(
      { message: "Failed to link account" },
      { status: 401 }
    );

  const code = params.get("code");
  if (!code)
    return NextResponse.json({ message: "No code provided" }, { status: 400 });
  const token = await exchabheCodeForAccessToken(code);
  if (!token)
    return NextResponse.json(
      { message: "Failed to exchange code for access token" },
      { status: 400 }
    );

  const accountDetails = await getAccountDetails(token.accessToken);

  const account = await prismadb.account.upsert({
    where: { id: token.accountId.toString() },
    update: {
      accessToken: token.accessToken,
    },
    create: {
      id: token.accountId.toString(),
      userId,
      accessToken: token.accessToken,
      emailAddress: accountDetails.email,
      name: accountDetails.name,
    },
  });

  return NextResponse.redirect(new URL("/mail", req.url));
};
