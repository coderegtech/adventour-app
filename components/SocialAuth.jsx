"use client";
import { useState } from "react";
import { requireSupabase } from "../config/supabase";
import { ToastifyError } from "../config/functions";
import { IconFacebook, IconGoogle } from "./Icons";

const SocialAuth = ({ setLoading }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSocialSignIn = async (provider) => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const { error } = await requireSupabase().auth.signInWithOAuth({
        provider,
        options: { redirectTo: window.location.origin + "/home" },
      });
      if (error) throw error;
    } catch (error) {
      ToastifyError(error.message || "Unable to sign in with this provider");
    } finally {
      setIsLoading(false);
      setLoading?.(false);
    }
  };

  return (
    <div className="flex flex-col space-y-2 justify-center items-center">
      <button type="button" disabled={isLoading}
        className="w-full flex justify-center items-center space-x-4 px-2 py-1 bg-white border border-neutral-200 rounded-md"
        onClick={() => handleSocialSignIn("google")}>
        <IconGoogle width={30} height={30} />
        <p className="text-base text-neutral-500">Sign in with Google</p>
      </button>
      <button type="button" disabled={isLoading}
        className="w-full flex justify-center items-center space-x-4 px-2 py-1 bg-white border border-neutral-200 rounded-md"
        onClick={() => handleSocialSignIn("facebook")}>
        <IconFacebook width={35} height={35} />
        <p className="text-base text-neutral-500">Sign in with Facebook</p>
      </button>
    </div>
  );
};

export default SocialAuth;
