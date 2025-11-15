import { createFileRoute, redirect } from "@tanstack/react-router";
import { LoginForm } from "~/components/auth/LoginForm";

export const Route = createFileRoute("/login")({
  beforeLoad: ({ context }) => {
    // If already logged in, redirect to home
    if (context.userId) {
      throw redirect({ to: "/" });
    }
  },
  component: LoginPage,
});

function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <LoginForm />
    </div>
  );
}
