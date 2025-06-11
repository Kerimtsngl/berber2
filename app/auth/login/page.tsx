"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setSuccess("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) {
      const data = await res.json();
      localStorage.setItem("token", data.token);
      setSuccess("Giriş yapıldı, yönlendiriliyorsunuz...");
      setTimeout(() => router.push("/"), 1500);
    } else {
      const data = await res.json();
      setError(data.error || "Giriş başarısız oldu");
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Giriş Yap</h2>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input type="email" name="email" placeholder="E-posta" className="border p-2 rounded" required value={email} onChange={e => setEmail(e.target.value)} />
        <input type="password" name="password" placeholder="Şifre" className="border p-2 rounded" required value={password} onChange={e => setPassword(e.target.value)} />
        {error && <div className="text-red-600 text-sm">{error}</div>}
        {success && <div className="text-green-600 text-sm">{success}</div>}
        <button type="submit" className="bg-blue-600 text-white py-2 rounded">Giriş Yap</button>
      </form>
    </div>
  );
} 