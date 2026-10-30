"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import Button from "../../components/Button";
import { requireSupabase } from "../../config/supabase";
import { AuthContext } from "../../context/authContext";

export default function ResetPasswordScreen() {
  const { user, loading, finishRecovery } = useContext(AuthContext);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const resetPassword = async () => {
    if (saving || loading || !user) return;
    if (password.length < 6 || password !== confirmPassword) {
      setError("Use at least 6 characters and make sure both passwords match.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const { error: updateError } = await requireSupabase().auth.updateUser({ password });
      if (updateError) throw updateError;
      finishRecovery();
      router.replace("/profile");
    } catch (error) {
      setError(error.message || "Unable to reset your password.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Reset password</h1>
      {loading ? <p>Checking your reset link...</p> : !user ? (
        <p>This reset link is invalid or expired. <Link href="/forgot_password" className="text-green-600">Request another link</Link>.</p>
      ) : (
        <form className="flex flex-col gap-4" onSubmit={(event) => { event.preventDefault(); resetPassword(); }}>
          <label>New password
            <input className="w-full border rounded p-2" type="password" autoComplete="new-password" required minLength={6} value={password} onChange={(event) => setPassword(event.target.value)} />
          </label>
          <label>Confirm new password
            <input className="w-full border rounded p-2" type="password" autoComplete="new-password" required minLength={6} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} />
          </label>
          {error && <p role="alert" className="text-red-600">{error}</p>}
          <Button disabled={saving} onPress={resetPassword}>{saving ? "Saving..." : "Save password"}</Button>
        </form>
      )}
    </main>
  );
}
