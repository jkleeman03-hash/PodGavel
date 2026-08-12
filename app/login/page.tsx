import Link from "next/link";
import { LoginForm } from "./login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ confirm?: string }>;
}) {
  const { confirm } = await searchParams;

  return (
    <div className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-4">
      <h1 className="mb-6 text-2xl font-semibold">Log in</h1>

      {confirm && (
        <p className="mb-4 rounded bg-blue-50 px-3 py-2 text-sm text-blue-800">
          Check your email to confirm your account before logging in.
        </p>
      )}

      <LoginForm />

      <p className="mt-4 text-sm">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
