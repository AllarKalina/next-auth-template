import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircleIcon } from "lucide-react";

export default function EmailVerifiedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Email Verified!
          </CardTitle>
          <CardDescription className="text-center">
            Your account has been successfully verified
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <CheckCircleIcon className="mx-auto mb-4 h-12 w-12 text-green-500" />
          <p>
            Thank you for verifying your email address. Your account is now
            fully activated.
          </p>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            // onClick={() => (window.location.href = "/dashboard")}
          >
            Go to Dashboard
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
