"use client";

import Image from "next/image";
import { useState } from "react";
import defaultProfile from "../assets/default-profile.png";

export { defaultProfile };
const Profile = ({ photoUrl, size }) => {
  const [failedUrl, setFailedUrl] = useState(null);
  const validUrl = typeof photoUrl === "string" && /^https?:\/\//i.test(photoUrl);
  const profileImg = validUrl && failedUrl !== photoUrl ? photoUrl : defaultProfile;

  return (
    <div className="rounded-full overflow-hidden">
      <Image alt="Profile picture" src={profileImg} width={size || 35} height={size || 35}
        className="rounded-full border object-cover" unoptimized onError={() => setFailedUrl(photoUrl)} />
    </div>
  );
};

export default Profile;
