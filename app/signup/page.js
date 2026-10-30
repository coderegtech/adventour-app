"use client";

import Link from "next/link";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ToastContainer } from "react-toastify";
import Button from "../../components/Button";
import { AppIcon } from "../../components/Icons";
import Loader from "../../components/Loader";
import SocialAuth from "../../components/SocialAuth";
import TermsAndCondition from "../../components/TermsAndCondition";
import { requireSupabase } from "../../config/supabase";
import { ToastifyError, ToastifySuccess } from "../../config/functions";

const SignupScreen = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isTermsChecked, setIsTermsChecked] = useState(false);
  const [activeTermsAndCondition, setActiveTermsAndCondition] = useState(false);
  const [errMsg, setErrMsg] = useState({
    error: true,
    msg: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [loadingPage, setLoadingPage] = useState(false);

  const handleRegisterAccount = async () => {
    if (isLoading) return;
    if (!username.trim() || !email.trim() || !password || !confirmPassword) {
      ToastifyError("Please fill up all fields");
      setIsLoading(false);

      return;
    }

    if (password !== confirmPassword) {
      ToastifyError("Password not match");
      setIsLoading(false);
      return;
    }

    if (!isTermsChecked) {
      // ToastifyError("Please agree to the Terms and Conditions");
      setErrMsg({
        error: true,
        msg: "Please agree to the Terms and Conditions",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await requireSupabase().auth.signUp({
        email: email.trim(),
        password,
        options: { data: { name: username.trim() }, emailRedirectTo: window.location.origin + "/home" },
      });
      if (error) throw error;
      ToastifySuccess(data.session ? "Account created successfully" : "Check your email to confirm your account before signing in.");
      clearInputs();
    } catch (error) {
      ToastifyError(error.message || "Unable to create account");
    } finally {
      setIsLoading(false);
    }
  };

  const clearInputs = () => {
    // clear inputs
    setUsername("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
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

      <Link href="/login">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          id="Outline"
          viewBox="0 0 24 24"
          width="40"
          height="40"
          fill="#16a34a"
        >
          <path d="M19,11H9l3.29-3.29a1,1,0,0,0,0-1.42,1,1,0,0,0-1.41,0l-4.29,4.3A2,2,0,0,0,6,12H6a2,2,0,0,0,.59,1.4l4.29,4.3a1,1,0,1,0,1.41-1.42L9,13H19a1,1,0,0,0,0-2Z" />
        </svg>
      </Link>

      <div className="flex justify-center items-center">
        <AppIcon width={180} height={180} />
      </div>

      <form onSubmit={(event) => { event.preventDefault(); handleRegisterAccount(); }}>
        <p className="pb-4 text-sm text-neutral-600">Create your Account</p>

        <div className="w-full flex flex-col space-y-4">
          <div className="border border-neutral-300 rounded-xl p-2 px-3">
            <input
              className="w-full focus:outline-none"
              type="text"
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
              value={username}
              autoComplete="off"
              required
            />
          </div>

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

          <div
            className="border border-neutral-300 rounded-xl p-2 px-3
          flex items-center"
          >
            <input
              className="w-full focus:outline-none"
              type={showPassword ? "text" : "password"}
              placeholder="Confirm Password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              value={confirmPassword}
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

          <div className="">
            <div className="flex space-x-2 items-center">
              <input
                type="checkbox"
                checked={isTermsChecked}
                className="w-4 h-4"
                onChange={() => setIsTermsChecked(!isTermsChecked)}
              />
              <p className="text-sm text-neutral-500 whitespace-nowrap">
                I agree to the{" "}
                <span
                  onClick={() => setActiveTermsAndCondition(true)}
                  className="text-green-500"
                >
                  Terms and Conditions
                </span>
              </p>
            </div>

            {errMsg.error && !isTermsChecked && (
              <p className="text-xs text-red-500 text-left">{errMsg.msg}</p>
            )}
          </div>

          <Button
            disabled={isLoading || !username || !email || !password || !confirmPassword}
            onPress={handleRegisterAccount}
          >
            {isLoading ? "Loading..." : "Create Account"}
          </Button>

          <p className="text-xs text-neutral-500 text-center">
            Or sign in with
          </p>

          <SocialAuth setLoading={(load) => setLoadingPage(load)} />
        </div>
      </form>

      {activeTermsAndCondition && (
        <TermsAndCondition close={() => setActiveTermsAndCondition(false)} />
      )}
    </div>
  );
};

export default SignupScreen;
