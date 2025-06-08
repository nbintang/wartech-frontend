import AuthCard from "@/features/auth/components/AuthCardLayout";
import ForgotPasswordForm from "@/features/auth/forgot-password/components/ForgotPasswordForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ForgotPassword() {
  return (
    <AuthCard
      title="Forgot Password"
      description="Enter your email address and we'll send you a link to reset your password."
    >
      <ForgotPasswordForm />
      <div className="mt-4 text-center">
        <Link
          href="/auth/sign-in"
          className="inline-flex items-center text-sm text-blue-600 hover:underline"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to sign in
        </Link>
      </div>
    </AuthCard>
  );
}
