"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import Button from "../../components/Button";
import { requireSupabase } from "../../config/supabase";
import { ToastifyError, ToastifySuccess } from "../../config/functions";

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsloading] = useState(false);

  const handleForgotPassword = async () => {
    if (isLoading || !email.trim()) return;
    setIsloading(true);
    try {
      const { error } = await requireSupabase().auth.resetPasswordForEmail(email.trim(), {
        redirectTo: window.location.origin + "/reset_password",
      });
      if (error) throw error;
      ToastifySuccess("If an account exists, a password reset link will be sent to your email.");
    } catch (error) {
      ToastifyError(error.message || "Unable to send password reset email");
    } finally {
      setIsloading(false);
    }
  };
  return (
    <div className="w-full h-full bg-white p-6">
      <ToastContainer
        position="bottom-right"
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
          width="30"
          height="30"
          fill="#16a34a"
        >
          <path d="M19,11H9l3.29-3.29a1,1,0,0,0,0-1.42,1,1,0,0,0-1.41,0l-4.29,4.3A2,2,0,0,0,6,12H6a2,2,0,0,0,.59,1.4l4.29,4.3a1,1,0,1,0,1.41-1.42L9,13H19a1,1,0,0,0,0-2Z" />
        </svg>
      </Link>
      <p className="pb-4 text-2xl text-center text-black">Forgot Password</p>
      <div className="p-4 mx-auto flex justify-center">
        <Image
          src={require("../../assets/lock.png")}
          width={130}
          height={130}
          alt=""
        />
      </div>
      <form className="mt-5" onSubmit={(event) => { event.preventDefault(); handleForgotPassword(); }}>
        <p className="pb-4 text-sm text-neutral-600">
          Enter you email to reset password
        </p>

        <div className="w-full flex flex-col space-y-4">
          <div className="border border-neutral-300 rounded-xl p-2 ">
            <input
              className="w-full focus:outline-none"
              type="email"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>

          <Button disabled={isLoading || !email.trim()} onPress={handleForgotPassword}>
            {isLoading ? "Loading..." : "Send Verification"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ForgotPasswordScreen;
