import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect";
import { env } from "@/env";
import { db } from "@/server/db";
import { userTable } from "@/server/db/schema";
import { lucia } from "@/auth";

export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        {
          error: "Token does not exist",
        },
        {
          status: 400,
        },
      );
    }

    // Will throw an error if token expired
    const decoded = jwt.verify(token, env.JWT_SECRET) as {
      email: string;
      code: string;
      userId: string;
    };

    // Check if verification exists using code
    const emailVerificationQueryResult =
      await db.query.emailVerificationTable.findFirst({
        where: (table, { eq }) => eq(table.code, decoded.code),
      });

    if (!emailVerificationQueryResult)
      return NextResponse.json(
        {
          error: "Invalid token",
        },
        {
          status: 400,
        },
      );

    // Check if user exists
    const userQueryResult = await db.query.userTable.findFirst({
      where: (table, { eq }) => eq(table.id, decoded.userId),
    });

    if (!userQueryResult)
      return NextResponse.json(
        {
          error: "Invalid token",
        },
        {
          status: 400,
        },
      );

    // Check if email is already verified
    // Rare case as jwt expired error will be more likely to be thrown
    // If the email is already verified then it's likely that the jwt itself is expired
    if (!!userQueryResult.emailVerified) {
      redirect(`/sign-up/email-verification/used?code=${decoded.code}`);
    }

    await db
      .update(userTable)
      .set({
        emailVerified: new Date(),
      })
      .where(eq(userTable.email, decoded.email));

    const session = await lucia.createSession(decoded.userId, {
      expiresIn: 60 * 60 * 24 * 30,
    });

    const sessionCookie = lucia.createSessionCookie(session.id);

    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );

    return Response.redirect("http://localhost:3000/email-verified", 302);
  } catch (error) {
    // https://nextjs.org/docs/app/building-your-application/routing/redirecting#redirect-function
    if (isRedirectError(error)) {
      throw error;
    }
    if (error instanceof jwt.TokenExpiredError) {
      const { searchParams } = new URL(req.url);
      const token = searchParams.get("token");
      const { code, userId } = jwt.decode(token!) as {
        code: string;
        userId: string;
      };

      const userQueryResult = await db.query.userTable.findFirst({
        where: (table, { eq }) => eq(table.id, userId),
      });

      if (!userQueryResult)
        return NextResponse.json(
          {
            error: "Invalid token",
          },
          {
            status: 400,
          },
        );

      if (!!userQueryResult.emailVerified) {
        redirect(`/sign-up/email-verification/used?code=${code}`);
      }

      redirect(`/sign-up/email-verification/expired?code=${code}`);
    }
    return Response.json({ error }, { status: 400 });
  }
};
