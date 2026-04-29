"use client";

import { useActionState } from "react";
import type { ActionState } from "@/lib/actions";

type Props = {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  children: React.ReactNode;
  className?: string;
  submitLabel?: string;
};

const initialState: ActionState = {};

export function ActionForm({ action, children, className, submitLabel = "Save" }: Props) {
  const [state, formAction, pending] = useActionState(action, initialState);
  return (
    <form action={formAction} className={className}>
      {children}
      {state.message ? (
        <p className={state.ok ? "text-sm font-semibold text-[#8dffd8]" : "text-sm font-semibold text-[#ffd166]"}>{state.message}</p>
      ) : null}
      <button className="btn" disabled={pending} type="submit">
        {pending ? "Working..." : submitLabel}
      </button>
    </form>
  );
}
