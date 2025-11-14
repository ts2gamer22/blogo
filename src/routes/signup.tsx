import { createFileRoute, redirect } from "@tanstack/react-router";
import { SignupForm } from "~/components/auth/SignupForm";

export const Route = createFileRoute("/signup")({
  beforeLoad: ({ context }) => {
    // If already logged in, redirect to home
    if (context.userId) {
      throw redirect({ to: "/" });
    }
  },
  component: SignupPage,
});

function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <SignupForm />
    </div>
  );
}
