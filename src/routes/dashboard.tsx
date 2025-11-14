import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: ({ context }) => {
    // Require authentication
    if (!context.userId) {
      throw redirect({ to: "/login" });
    }
  },
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome to blogo Dashboard
          </h1>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Your account has been created successfully! This is a placeholder
            dashboard page.
          </p>
          <div className="mt-6">
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Dashboard features will be implemented in future epics.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
