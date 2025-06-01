
import ForgotPasswordForm from "@/features/auth/forgot-password/components/ForgotPasswordForm";

export default function ForgotPassword() {
  return (
    <section className="mb-12 grid place-items-center min-h-screen">
      <div className="flex flex-col flex-wrap items-center justify-between gap-4">
        <div className="text-center md:text-left">
          <h3 className="text-xl font-bold mb-2">
            Reset Password
          </h3>
          <p className="text-sm text-gray-600">
            fill out the form below to reset your password
          </p>
        </div>
        <ForgotPasswordForm />
      </div>
    </section>
  );
}
