import React from "react";
import SignUpForm from "../../../features/auth/signup/components/SignUpForm";
import Link from "next/link";

export default function SignUp() {
  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Welcome to Warta Technologies</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Fill out the form below to create your account
          </p>
        </div>
        <SignUpForm />
        <div className="text-center text-sm">
          Already have an account?{" "}
          <Link href="/sign-in" className="underline underline-offset-4">
            Sign in
          </Link>
        </div>
      </div>

    </>
  );
}
