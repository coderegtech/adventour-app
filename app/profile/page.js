"use client";

import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { GoBell } from "react-icons/go";
import { GrNotes } from "react-icons/gr";
import { LuPencilLine } from "react-icons/lu";
import { RiSettings2Line } from "react-icons/ri";
import { TbLogout2, TbNotes } from "react-icons/tb";
import BottomNavbar from "../../components/BottomNavbar";
import Loader from "../../components/Loader";
import Profile from "../../components/Profile";
import TermsAndCondition from "../../components/TermsAndCondition";
import { requireSupabase } from "../../config/supabase";
import { AuthContext } from "../../context/authContext";

const ProfileScreen = () => {
  const { user, profile } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTermsAndCondition, setActiveTermsAndCondition] = useState(false);
  const router = useRouter();

  const logoutUser = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const { error } = await requireSupabase().auth.signOut();
      if (error) throw error;
      router.replace("/");
    } catch (error) {
      alert(error.message || "Unable to log out. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-screen relative bg-white p-4">
      <div className="w-full flex flex-col justify-center items-center pt-12">
        <div
          style={{
            background: `url('https://wallpaperaccess.com/full/8540106.jpg')`,
            backgroundPosition: "bottom",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
          }}
          className="w-full h-40 bg-green-500 rounded-b-3xl absolute top-0 left-0"
        ></div>

        <div className="z-50">
          <Profile photoUrl={profile?.photoUrl} size={150} />
        </div>

        <span className="py-4">
          <p className="text-2xl font-bold text-black text-center">
            {profile?.username || user?.user_metadata?.name || "Traveler"}
          </p>
          <p className="text-sm text-neutral-500 text-center">
            {user?.email}
          </p>
        </span>
      </div>

      <div className="py-10">
        <ul>
          <li
            onClick={() => router.push("/booking_history")}
            className="flex space-x-2 items-center p-2"
          >
            <span>
              <TbNotes size={25} color="#333" />
            </span>
            <p className="text-lg">Bookings</p>
          </li>
          <li
            onClick={() => router.push("/edit_profile")}
            className="flex space-x-2 items-center p-2"
          >
            <span>
              <LuPencilLine size={25} color="#333" />
            </span>
            <p className="text-lg">Edit Profile</p>
          </li>
          <li
            onClick={() => router.push("/notifications")}
            className="flex space-x-2 items-center p-2"
          >
            <span>
              <GoBell size={25} color="#333" />
            </span>
            <p className="text-lg">Notifications</p>
          </li>
          <li className="flex space-x-2 items-center p-2">
            <span>
              <RiSettings2Line size={25} color="#333" />
            </span>
            <p className="text-lg">Settings</p>
          </li>
          <li
            className="flex space-x-2 items-center p-2"
            onClick={() => setActiveTermsAndCondition(true)}
          >
            <span>
              <GrNotes size={25} color="#333" />
            </span>
            <p className="text-lg">Terms and Conditions</p>
          </li>
          <li onClick={logoutUser} className="flex space-x-2 items-center p-2">
            <span>
              <TbLogout2 size={25} color="#333" />
            </span>
            <p className="text-lg">Logout</p>
          </li>
        </ul>
      </div>

      <BottomNavbar />

      {isLoading && <Loader />}
      {activeTermsAndCondition && (
        <TermsAndCondition close={() => setActiveTermsAndCondition(false)} />
      )}
    </div>
  );
};

export default ProfileScreen;
