import { Suspense } from "react";
import Link from "next/link";
import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <main className="container grid min-h-screen place-items-center py-10">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-6 block text-lg font-bold">PlaceIQ</Link>
        <h1 className="mb-4 text-3xl font-bold">Sign in</h1>
        <Suspense><LoginForm /></Suspense>
      </div>
    </main>
  );
}
