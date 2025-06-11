"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(""); 
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        localStorage.setItem("token", data.token);
        setSuccess("Giriş yapıldı, yönlendiriliyorsunuz...");
        setTimeout(() => router.push("/"), 1500);
      } else {
        setError(data.error || "Giriş başarısız oldu");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Bir hata oluştu, lütfen tekrar deneyin");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Giriş Yap</h2>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input 
          type="email" 
          name="email" 
          placeholder="E-posta" 
          className="border p-2 rounded" 
          required 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
        />
        <input 
          type="password" 
          name="password" 
          placeholder="Şifre" 
          className="border p-2 rounded" 
          required 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
        />
        {error && <div className="text-red-600 text-sm">{error}</div>}
        {success && <div className="text-green-600 text-sm">{success}</div>}
        <button 
          type="submit" 
          className="bg-blue-600 text-white py-2 rounded disabled:opacity-50" 
          disabled={loading}
        >
          {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
        </button>
      </form>
    </div>
  );
} 