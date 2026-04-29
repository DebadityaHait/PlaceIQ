"use client";

import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { redirectForRole } from "@/lib/utils";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [message, setMessage] = useState(params.get("registered") ? "Account created. Sign in to continue." : "");
  const [pending, setPending] = useState(false);

  async function onSubmit(formData: FormData) {
    setPending(true);
    setMessage("");
    const result = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false
    });
    setPending(false);
    if (!result?.ok) {
      setMessage("Invalid email or password.");
      return;
    }
    const res = await fetch("/api/me");
    const data = await res.json();
    router.push(redirectForRole(data.role));
    router.refresh();
  }

  return (
    <form action={onSubmit} className="card grid gap-4 p-6">
      <label className="grid gap-2 text-sm font-semibold">Email<input className="field" name="email" type="email" required /></label>
      <label className="grid gap-2 text-sm font-semibold">Password<input className="field" name="password" type="password" required /></label>
      {message ? <p className="text-sm text-red-700">{message}</p> : null}
      <button className="btn" disabled={pending} type="submit">{pending ? "Signing in..." : "Sign in"}</button>
    </form>
  );
}
