"use client";

import { SetupPasswordSchema } from "@/lib/schemas";
import { finalizeInviteAction } from "@/lib/actions/auth";
import { useSearchParams } from "next/navigation";

export default function SetupPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  return (
    <form action={finalizeInviteAction}>
      {/* Hidden input to pass the token to the server action */}
      <input type="hidden" name="token" value={token ?? ""} />

      <input name="password" type="password" placeholder="New Password" />
      <input
        name="confirmPassword"
        type="password"
        placeholder="Confirm Password"
      />

      <button type="submit">Activate Account</button>
    </form>
  );
}
