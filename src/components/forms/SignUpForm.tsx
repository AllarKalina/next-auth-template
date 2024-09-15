"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { type z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useState } from "react";
import { CheckIcon, EyeIcon, EyeOffIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { signUpSchema } from "@/lib/formSchemas";
import { useServerAction } from "zsa-react";
import { signUp } from "@/actions/auth.actions";
import { AuthError } from "@/actions/types";
import { useRouter } from "next/navigation";
import { ButtonLoading } from "../ui/button-loading";
import Link from "next/link";

export default function SignUpForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const { execute, isPending, isSuccess } = useServerAction(signUp);

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof signUpSchema>) {
    const [data, error] = await execute(values);

    if (error) {
      if (error.data === AuthError.EMAIL_USED) {
        form.setError("email", {
          type: "custom",
          message: "Email already exists.",
        });
      }
    } else if (data) {
      router.push(`/check-email?code=${data.code}`);
    }
  }

  const watchPassword = form.watch("password");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input required placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input required placeholder="name@example.com" {...field} />
              </FormControl>
              <div className="flex items-center gap-1">
                <FormMessage />
                {form.getFieldState("email").error?.message ===
                  "Email already exists." && (
                  <Link
                    href="/sign-in"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Sign in instead
                  </Link>
                )}
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    required
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    {...field}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-1/2 -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOffIcon className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <EyeIcon className="h-4 w-4" aria-hidden="true" />
                    )}
                    <span className="sr-only">
                      {showPassword ? "Hide password" : "Show password"}
                    </span>
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
              <div className="grid sm:grid-cols-2">
                <div className="mt-2 flex items-center gap-1">
                  {watchPassword?.match(/[A-Z]/) ? (
                    <div className="rounded-full bg-emerald-50 p-1">
                      <CheckIcon
                        size={12}
                        strokeWidth={3}
                        className="font-bold text-emerald-600"
                      />
                    </div>
                  ) : (
                    <div className="mx-2 h-1 w-1 rounded-full bg-slate-300" />
                  )}
                  <p
                    className={cn(
                      "text-sm text-slate-500",
                      watchPassword?.match(/[A-Z]/) &&
                        "font-medium text-slate-900 line-through",
                    )}
                  >
                    One upper-case letter
                  </p>
                </div>
                <div className="mt-2 flex items-center gap-1">
                  {watchPassword?.match(/[a-z]/) ? (
                    <div className="rounded-full bg-emerald-50 p-1">
                      <CheckIcon
                        size={12}
                        strokeWidth={3}
                        className="font-bold text-emerald-600"
                      />
                    </div>
                  ) : (
                    <div className="mx-2 h-1 w-1 rounded-full bg-slate-300" />
                  )}
                  <p
                    className={cn(
                      "text-sm text-slate-500",
                      watchPassword?.match(/[a-z]/) &&
                        "font-medium text-slate-900 line-through",
                    )}
                  >
                    One lower-case letter
                  </p>
                </div>
                <div className="mt-2 flex items-center gap-1">
                  {watchPassword?.match(/\d/) ? (
                    <div className="rounded-full bg-emerald-50 p-1">
                      <CheckIcon
                        size={12}
                        strokeWidth={3}
                        className="font-bold text-emerald-600"
                      />
                    </div>
                  ) : (
                    <div className="mx-2 h-1 w-1 rounded-full bg-slate-300" />
                  )}
                  <p
                    className={cn(
                      "text-sm text-slate-500",
                      watchPassword?.match(/\d/) &&
                        "font-medium text-slate-900 line-through",
                    )}
                  >
                    One digit
                  </p>
                </div>
                <div className="mt-2 flex items-center gap-1">
                  {watchPassword.length >= 8 ? (
                    <div className="rounded-full bg-emerald-50 p-1">
                      <CheckIcon
                        size={12}
                        strokeWidth={3}
                        className="font-bold text-emerald-600"
                      />
                    </div>
                  ) : (
                    <div className="mx-2 h-1 w-1 rounded-full bg-slate-300" />
                  )}
                  <p
                    className={cn(
                      "text-sm text-slate-500",
                      watchPassword.length >= 8 &&
                        "font-medium text-slate-900 line-through",
                    )}
                  >
                    8 characters or more
                  </p>
                </div>
              </div>
            </FormItem>
          )}
        />
        {isPending || isSuccess ? (
          <ButtonLoading className="!mt-6 w-full">Sign up</ButtonLoading>
        ) : (
          <Button className="!mt-6 w-full" type="submit">
            Sign Up
          </Button>
        )}
      </form>
    </Form>
  );
}
