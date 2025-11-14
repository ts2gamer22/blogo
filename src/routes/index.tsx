import { Link, createFileRoute } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { convexQuery } from '@convex-dev/react-query'
import { api } from '../../convex/_generated/api'
import { authClient } from '~/lib/auth-client'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  
  // Get current user from Better Auth
  const { data: user } = useSuspenseQuery(
    convexQuery(api.auth.safeGetCurrentUser, {})
  )

  const handleSignOut = async () => {
    await authClient.signOut()
    window.location.reload()
  }

  return (
    <main className="min-h-screen p-8 flex flex-col gap-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto w-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              blogo
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              AI-Powered Blog Generator
            </p>
          </div>
          
          {user ? (
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {user.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {user.email}
                </p>
              </div>
              {user.image && (
                <img
                  src={user.image}
                  alt={user.name}
                  className="w-10 h-10 rounded-full"
                />
              )}
              <button
                onClick={handleSignOut}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-md hover:bg-gray-700"
            >
              Sign In with GitHub
            </Link>
          )}
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          {user ? (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  ✅ Authentication Working!
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  You're successfully logged in via GitHub OAuth. Better Auth + Convex integration is working perfectly!
                </p>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Your GitHub Info:
                </h3>
                <dl className="grid grid-cols-2 gap-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      User ID
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white font-mono">
                      {user._id}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Email
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                      {user.email}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Name
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                      {user.name}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Email Verified
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                      {user.emailVerified ? "✅ Yes" : "❌ No"}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Story 1.3 Complete! ✅
                </h3>
                <ul className="list-disc list-inside space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li>Better Auth + GitHub OAuth configured</li>
                  <li>Convex component registered</li>
                  <li>Session management working (7-day expiry)</li>
                  <li>SSR authentication implemented</li>
                  <li>User data stored in Convex betterAuth/user table</li>
                </ul>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Next: Story 1.4 - Create Database Schema
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Welcome to blogo
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Sign in with GitHub to get started with AI-powered blog generation.
                </p>
              </div>

              <Link
                to="/login"
                className="inline-block px-6 py-3 text-base font-medium text-white bg-gray-800 rounded-md hover:bg-gray-700"
              >
                Sign In with GitHub →
              </Link>

              <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Testing Story 1.3: Better Auth + GitHub OAuth Integration
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
