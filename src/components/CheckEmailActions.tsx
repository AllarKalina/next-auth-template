"use client";
import React from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export default function CheckEmailActions({ code }: { code: string }) {
  const router = useRouter();
  const handleResendEmail = () => {
    // Implement resend email logic here
    console.log("Resending verification email to:", code);
  };
  return (
    <>
      <Button className="w-full" onClick={() => handleResendEmail()}>
        Resend Email
      </Button>
      <Button
        variant="outline"
        className="w-full"
        onClick={() => router.push("/sign-up")}
      >
        Back to Home
      </Button>
    </>
  );
}
