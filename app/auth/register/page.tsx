"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setSuccess("");
    if (!phone.match(/^\d{10,15}$/)) {
      setError("Geçerli bir telefon numarası giriniz (sadece rakam, 10-15 hane)");
      return;
    }
    // Önce kayıt ol
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, phone }),
    });
    if (res.ok) {
      setSuccess("Başarıyla kayıt oldunuz, yönlendiriliyorsunuz...");
      setTimeout(() => router.push("/auth/login"), 1500);
    } else {
      const data = await res.json();
      setError(data.error || "Kayıt başarısız oldu");
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Kayıt Ol</h2>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Ad Soyad" className="border p-2 rounded" required value={name} onChange={e => setName(e.target.value)} />
        <input type="email" name="email" placeholder="E-posta" className="border p-2 rounded" required value={email} onChange={e => setEmail(e.target.value)} />
        <input type="password" name="password" placeholder="Şifre" className="border p-2 rounded" required value={password} onChange={e => setPassword(e.target.value)} />
        <input type="tel" name="phone" placeholder="Telefon Numarası" className="border p-2 rounded" required value={phone} onChange={e => setPhone(e.target.value)} />
        {error && <div className="text-red-600 text-sm">{error}</div>}
        {success && <div className="text-green-600 text-sm">{success}</div>}
        <button type="submit" className="bg-blue-600 text-white py-2 rounded">Kayıt Ol</button>
      </form>
    </div>
  );
} 