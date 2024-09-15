import CheckEmailActions from "@/components/CheckEmailActions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { db } from "@/server/db";
import { emailVerificationTable, userTable } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { ExternalLinkIcon, MailIcon } from "lucide-react";
import { redirect } from "next/navigation";

export default async function CheckEmailPage({
  searchParams,
}: {
  searchParams: { code?: string };
}) {
  const { code } = searchParams;

  if (!code) redirect("/sign-up");

  const emailVerificationQuery =
    await db.query.emailVerificationTable.findFirst({
      where: eq(emailVerificationTable.code, code),
    });

  if (!emailVerificationQuery) return redirect("/sign-up");

  const userQuery = await db.query.userTable.findFirst({
    where: eq(userTable.id, emailVerificationQuery.userId),
  });

  if (!userQuery) {
    // Faulty data.
    // TODO: Add log here
    return redirect("/sign-up");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Check Your Email
          </CardTitle>
          <CardDescription className="text-center">
            We've sent a verification link to your email
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <MailIcon className="mx-auto mb-4 h-12 w-12" />
          <p className="mb-4">
            We've sent an email to:
            <br />
            <strong>{userQuery.email}</strong>
          </p>
          <p className="mb-4 text-sm text-gray-500">
            Click the link in the email to verify your account. If you don't see
            the email, check your spam folder.
          </p>
          <Button variant="outline" className="mb-2 w-full">
            Open Gmail
            <ExternalLinkIcon className="ml-2 h-4 w-4" />
          </Button>
          <p className="text-xs text-gray-400">
            (Opens Gmail in a new tab. If you use a different email provider,
            please check that inbox.)
          </p>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <CheckEmailActions code={code} />
        </CardFooter>
      </Card>
    </div>
  );
}
