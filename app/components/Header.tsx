"use client";
import React from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [role, setRole] = React.useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    if (!token) {
      setRole(null);
      return;
    }
    fetch("/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setRole(data.role || null))
      .catch(() => setRole(null));
  }, [pathname]);

  function logout() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      router.push("/auth/login");
    }
  }

  return (
    <header className="bg-white shadow p-4 flex items-center justify-between">
      <div className="font-bold text-xl cursor-pointer">
        <Link href="/">Anasayfa</Link>
      </div>
      <nav className="flex gap-4">
        {!isLoggedIn ? (
          <>
            <Link href="/auth/login"><button type="button">Giriş</button></Link>
            <Link href="/auth/register"><button type="button">Kayıt</button></Link>
          </>
        ) : (
          <>
            <button type="button" onClick={() => router.push("/profile")}>Profil</button>
            <button type="button" onClick={() => router.push("/appointments")}>Randevu</button>
            <button type="button" onClick={() => router.push("/messages")}>Mesajlar</button>
            {role === "ADMIN" && (
              <>
                <button type="button" onClick={() => router.push("/admin")}>Admin Paneli</button>
              </>
            )}
            <button type="button" onClick={logout}>Çıkış</button>
          </>
        )}
      </nav>
    </header>
  );
} 