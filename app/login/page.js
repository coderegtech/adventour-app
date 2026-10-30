"use client";
import Link from "next/link";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ToastContainer } from "react-toastify";
import Button from "../../components/Button";
import { AppIcon } from "../../components/Icons";
import Loader from "../../components/Loader";
import SocialAuth from "../../components/SocialAuth";
import { requireSupabase } from "../../config/supabase";
import { ToastifyError, ToastifySuccess } from "../../config/functions";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingPage, setLoadingPage] = useState(false);

  const handleLogin = async () => {
    if (isLoading) return;
    if (!email.trim() || !password) {
      ToastifyError("Please fill up all fields");
      return;
    }
    setIsLoading(true);
    try {
      const { error } = await requireSupabase().auth.signInWithPassword({ email: email.trim(), password });
      if (error) throw error;
      ToastifySuccess("Logged in successfully");
    } catch (error) {
      ToastifyError(error.message || "Unable to sign in");
    } finally {
      setIsLoading(false);
    }
  };

  if (loadingPage) {
    return <Loader />;
  }

  return (
    <div className="w-full h-full bg-white p-6 relative">
      <ToastContainer
        position="bottom-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <div className="flex justify-center items-center">
        <AppIcon width={200} height={200} />
      </div>

      <form onSubmit={(event) => { event.preventDefault(); handleLogin(); }}>
        <p className="pb-4 text-base text-neutral-600">Login to your Account</p>

        <div className="w-full flex flex-col space-y-4">
          <div className="border border-neutral-300 rounded-xl p-2 px-3">
            <input
              className="w-full focus:outline-none"
              type="email"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              autoComplete="off"
              required
            />
          </div>

          <div
            className="border border-neutral-300 rounded-xl p-2 px-3
          flex items-center"
          >
            <input
              className="w-full focus:outline-none"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              autoComplete="off"
              required
            />

            <span onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? (
                <FaEye size={20} color="#333" />
              ) : (
                <FaEyeSlash size={20} color="#ccc" />
              )}
            </span>
          </div>

          <div>
            <Button disabled={isLoading} onPress={handleLogin}>
              {isLoading ? "Loading..." : "Sign In"}
            </Button>

            <Link
              href="/forgot_password"
              className="text-sm text-neutral-500 flex justify-end p-1"
            >
              forgot password?
            </Link>
          </div>

          <p className="text-sm text-neutral-500 text-center">
            or sign in with
          </p>

          <SocialAuth setLoading={(load) => setLoadingPage(load)} />

          <p className="text-sm text-neutral-500 text-center pt-5">
            Don't have an Account?{" "}
            <Link href="/signup" className="text-green-500 font-bold">
              Sign Up
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginScreen;
