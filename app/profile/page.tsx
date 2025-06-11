"use client";
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { UserCircleIcon, PencilSquareIcon, DevicePhoneMobileIcon, EnvelopeIcon, KeyIcon } from "@heroicons/react/24/solid";

export default function ProfilePage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
      return;
    }
    fetch("/api/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        setName(data.name);
        setEmail(data.email);
        setPhone(data.phone || "");
        setProfileImage(data.profileImage || null);
      });
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setSuccess("");
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    if (imageFile) formData.append("profileImage", imageFile);
    const res = await fetch("/api/profile", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    } as any);
    if (res.ok) {
      setSuccess("Profil güncellendi");
    } else {
      const data = await res.json();
      setError(data.error || "Güncelleme başarısız oldu");
    }
  }

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setSuccess("");
    const token = localStorage.getItem("token");
    const res = await fetch("/api/profile/password", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    if (res.ok) {
      setSuccess("Şifre güncellendi");
      setCurrentPassword(""); setNewPassword("");
    } else {
      const data = await res.json();
      setError(data.error || "Şifre güncellenemedi");
    }
  }

  return (
    <div className="max-w-lg mx-auto mt-10 p-0 md:p-6 bg-white rounded-3xl shadow-2xl flex flex-col gap-8">
      <div className="flex flex-col items-center gap-4 py-8 border-b">
        <div className="relative group">
          {profileImage || imageFile ? (
            <img
              src={imageFile ? URL.createObjectURL(imageFile) : profileImage || "/default-avatar.png"}
              alt="Profil"
              className="w-32 h-32 rounded-full object-cover border-4 border-blue-200 shadow-lg transition duration-200 group-hover:brightness-90"
            />
          ) : (
            <UserCircleIcon className="w-32 h-32 text-blue-300 bg-blue-50 rounded-full border-4 border-blue-100 shadow-lg" />
          )}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-2 right-2 bg-white border border-gray-300 rounded-full p-2 shadow hover:bg-gray-100 transition"
            title="Fotoğrafı değiştir"
          >
            <PencilSquareIcon className="w-5 h-5 text-blue-600" />
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={e => setImageFile(e.target.files?.[0] || null)}
            className="hidden"
          />
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-800">{name}</div>
          <div className="text-gray-500">{email}</div>
          <div className="text-gray-500">{phone}</div>
        </div>
      </div>
      <form className="flex flex-col gap-4 px-4 md:px-0" onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="flex items-center gap-2">
          <UserCircleIcon className="w-5 h-5 text-blue-400" />
          <input type="text" name="name" placeholder="Ad Soyad" className="border p-2 rounded flex-1" value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div className="flex items-center gap-2">
          <EnvelopeIcon className="w-5 h-5 text-blue-400" />
          <input type="email" name="email" placeholder="E-posta" className="border p-2 rounded flex-1" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div className="flex items-center gap-2">
          <DevicePhoneMobileIcon className="w-5 h-5 text-blue-400" />
          <input type="tel" name="phone" placeholder="Telefon Numarası" className="border p-2 rounded flex-1" value={phone} onChange={e => setPhone(e.target.value)} />
        </div>
        {error && !error.toLowerCase().includes("şifre") && (
          <div className="text-red-600 text-sm">{error}</div>
        )}
        {success && !success.toLowerCase().includes("şifre") && (
          <div className="text-green-600 text-sm">{success}</div>
        )}
        <button type="submit" className="bg-green-600 text-white py-2 rounded font-semibold shadow hover:bg-green-700 transition">Profili Güncelle</button>
      </form>
      <form className="flex flex-col gap-4 px-4 md:px-0 pb-8" onSubmit={handlePasswordChange}>
        <div className="flex items-center gap-2 mb-2">
          <KeyIcon className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-bold text-blue-800">Şifre Değiştir</h3>
        </div>
        <input type="password" name="currentPassword" placeholder="Mevcut Şifre" className="border p-2 rounded" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
        <input type="password" name="newPassword" placeholder="Yeni Şifre" className="border p-2 rounded" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
        {error && error.toLowerCase().includes("şifre") && (
          <div className="text-red-600 text-sm">{error}</div>
        )}
        {success && success.toLowerCase().includes("şifre") && (
          <div className="text-green-600 text-sm">{success}</div>
        )}
        <button type="submit" className="bg-blue-600 text-white py-2 rounded font-semibold shadow hover:bg-blue-700 transition">Şifreyi Güncelle</button>
      </form>
    </div>
  );
} 