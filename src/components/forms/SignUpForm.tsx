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

export default function SignUpForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const { execute, isPending } = useServerAction(signUp);

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
          message: "Email already exists",
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
              <FormMessage />
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
                  {watchPassword?.match(/[A-Z]/) && (
                    <CheckIcon size={16} className="text-emerald-600" />
                  )}
                  <p
                    className={cn(
                      "text-sm text-slate-500",
                      watchPassword?.match(/[A-Z]/) &&
                        "font-medium text-slate-900",
                    )}
                  >
                    One upper-case letter
                  </p>
                </div>
                <div className="mt-2 flex items-center gap-1">
                  {watchPassword?.match(/[a-z]/) && (
                    <CheckIcon size={16} className="text-emerald-600" />
                  )}
                  <p
                    className={cn(
                      "text-sm text-slate-500",
                      watchPassword?.match(/[a-z]/) &&
                        "font-medium text-slate-900",
                    )}
                  >
                    One lower-case letter
                  </p>
                </div>
                <div className="mt-2 flex items-center gap-1">
                  {watchPassword?.match(/\d/) && (
                    <CheckIcon size={16} className="text-emerald-600" />
                  )}
                  <p
                    className={cn(
                      "text-sm text-slate-500",
                      watchPassword?.match(/\d/) &&
                        "font-medium text-slate-900",
                    )}
                  >
                    One digit
                  </p>
                </div>
                <div className="mt-2 flex items-center gap-1">
                  {watchPassword.length >= 8 && (
                    <CheckIcon size={16} className="text-emerald-600" />
                  )}
                  <p
                    className={cn(
                      "text-sm text-slate-500",
                      watchPassword.length >= 8 && "font-medium text-slate-900",
                    )}
                  >
                    8 characters or more
                  </p>
                </div>
              </div>
            </FormItem>
          )}
        />
        <Button className="!mt-6 w-full" type="submit">
          Sign Up
        </Button>
      </form>
    </Form>
  );
}
