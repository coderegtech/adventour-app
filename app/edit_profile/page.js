"use client";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import Button from "../../components/Button";
import Profile from "../../components/Profile";
import { requireSupabase } from "../../config/supabase";
import { AuthContext } from "../../context/authContext";

const EditProfileScreen = () => {
  const { user, profile, refreshProfile } = useContext(AuthContext);

  const [username, setUsername] = useState(profile?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setUsername(profile?.username || "");
    setEmail(user?.email || "");
  }, [profile?.username, user?.email]);

  const handleUpdate = async () => {
    if (!user || isLoading || !username.trim() || !email.trim()) return;
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      const emailChanged = email.trim() !== user.email;
      const changes = { data: { name: username.trim() } };
      if (emailChanged) changes.email = email.trim();
      if (password) changes.password = password;
      const { error: authError } = await requireSupabase().auth.updateUser(changes, {
        emailRedirectTo: window.location.origin + "/profile",
      });
      if (authError) throw authError;
      const { error: profileError } = await requireSupabase().from("profiles").update({
        name: username.trim(),
        avatar_url: profile?.photoUrl || user.user_metadata?.avatar_url || "",
      }).eq("id", user.id).select("id").single();
      if (profileError) throw profileError;
      await refreshProfile();
      alert(emailChanged ? "Profile saved. Check your email addresses to confirm the email change." : "Profile updated successfully.");
      router.push("/profile");
    } catch (error) {
      alert(error.message);
    } finally {
      setIsLoading(false);
      setPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <div className="w-full h-full bg-white p-4">
      <header className="w-full flex space-x-3 justify-start items-center px-4 py-3 bg-white fixed top-0 left-0 z-50">
        <span onClick={() => router.back()}>
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
        </span>
        <span>
          <b className="text-2xl text-black">Edit Profile</b>
        </span>
      </header>

      <form className="w-full pt-12" onSubmit={(event) => { event.preventDefault(); handleUpdate(); }}>
        <div className="relative flex justify-center p-4">
          <Profile photoUrl={profile?.photoUrl} size={150} />
        </div>

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

          <div className="border border-neutral-300 rounded-xl p-2 px-3 flex items-center">
            <input
              className="w-full focus:outline-none"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              autoComplete="off"
            />
            <span onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? (
                <FaEye size={20} color="#333" />
              ) : (
                <FaEyeSlash size={20} color="#ccc" />
              )}
            </span>
          </div>

          <div className="border border-neutral-300 rounded-xl p-2 px-3 flex items-center">
            <input
              className="w-full focus:outline-none"
              type={showPassword ? "text" : "password"}
              placeholder="Confirm Password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              value={confirmPassword}
              autoComplete="off"
            />
            <span onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? (
                <FaEye size={20} color="#333" />
              ) : (
                <FaEyeSlash size={20} color="#ccc" />
              )}
            </span>
          </div>

          <Button
            disabled={isLoading || !username.trim() || !email.trim()}
            onPress={handleUpdate}
          >
            {isLoading ? "Loading..." : "Update Account"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditProfileScreen;
