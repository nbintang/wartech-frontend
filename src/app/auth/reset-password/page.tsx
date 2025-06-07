"use client";
import AuthCard from "@/components/AuthCard";
import ResetPasswordForm from "@/features/auth/reset-password/components/ResetPasswordForm";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") as string;
  const isTokenMissing = !token;
  return (
    <AuthCard
      title="Reset your password"
      description="Enter your new password below"
    >
      <ResetPasswordForm token={token} isTokenMissing={isTokenMissing} />
      <div className="mt-4 text-center">
        <Link
          href="/auth/sign-in"
          className="text-sm text-blue-600 hover:underline"
        >
          Back to sign in
        </Link>
      </div>
    </AuthCard>
  );
}
