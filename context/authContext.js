"use client";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { supabase } from "../config/supabase";
import Loader from "../components/Loader";
import { DataContext } from "./dataContext";

export const AuthContext = createContext({});
const publicRoutes = ["/", "/login", "/signup", "/forgot_password", "/reset_password", "/privacy-policy", "/account-deletion"];

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [profileError, setProfileError] = useState("");
  const [recoveryMode, setRecoveryMode] = useState(false);
  const { setData } = useContext(DataContext);
  const router = useRouter();
  const pathname = usePathname();
  const currentUserId = useRef(null);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    let active = true;
    let authEventReceived = false;
    const applySession = (session) => {
      if (!active) return;
      const nextUser = session?.user;
      currentUserId.current = nextUser?.id || null;
      setUser(nextUser ? { ...nextUser, uid: nextUser.id } : null);
      setLoading(false);
    };
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      authEventReceived = true;
      if (event === "PASSWORD_RECOVERY") setRecoveryMode(true);
      if (event === "SIGNED_OUT") setRecoveryMode(false);
      applySession(session);
    });
    supabase.auth.getSession().then(({ data, error }) => {
      if (!authEventReceived) applySession(error ? null : data.session);
    }).catch(() => {
      if (!authEventReceived) applySession(null);
    });
    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase.from("profiles").select("id, name, avatar_url").eq("id", user.id).maybeSingle();
    if (error) throw error;
    if (currentUserId.current !== user.id) return;
    const nextProfile = {
      id: user.id,
      uid: user.id,
      username: data?.name || user.user_metadata?.name || user.user_metadata?.full_name || "Traveler",
      photoUrl: data?.avatar_url || user.user_metadata?.avatar_url || "",
      email: user.email || "",
    };
    setProfile(nextProfile);
    setProfileError("");
    setData((previous) => ({ ...previous, user: nextProfile, userId: user.id }));
  }, [user, setData]);

  useEffect(() => {
    setProfile(null);
    setProfileError("");
    setData((previous) => ({ ...previous, user: null, userId: null }));
    if (user) refreshProfile().catch(() => {
      if (currentUserId.current === user.id) setProfileError("Your profile could not be loaded. Please reload to try again.");
    });
  }, [user, refreshProfile, setData]);

  const isPublic = publicRoutes.includes(pathname);
  useEffect(() => {
    if (loading) return;
    if (recoveryMode && pathname !== "/reset_password") router.replace("/reset_password");
    else if (!user && !isPublic) router.replace("/login");
    else if (user && ["/", "/login", "/signup"].includes(pathname)) router.replace("/home");
  }, [loading, user, pathname, isPublic, recoveryMode, router]);

  return (
    <AuthContext.Provider value={{ user, loading, profile, profileError, refreshProfile, recoveryMode, finishRecovery: () => setRecoveryMode(false) }}>
      {(!isPublic && (loading || !user)) || (recoveryMode && pathname !== "/reset_password") ? <Loader /> : children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
