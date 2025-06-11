"use client";
import React, { useEffect, useState } from "react";
import {
  UserGroupIcon,
  UserCircleIcon,
  EnvelopeIcon,
  ShieldCheckIcon,
  TrashIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [roleLoadingId, setRoleLoadingId] = useState<number | null>(null);
  const [deleteLoadingId, setDeleteLoadingId] = useState<number | null>(null);

  function fetchUsers() {
    setLoading(true);
    fetch("/api/admin/users")
      .then(res => res.json())
      .then(setUsers)
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  async function handleDelete(id: number) {
    if (!confirm("Bu kullanıcıyı silmek istediğinizden emin misiniz?")) return;
    setError(""); setSuccess("");
    setDeleteLoadingId(id);
    const res = await fetch("/api/admin/users", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setDeleteLoadingId(null);
    if (res.ok) {
      setSuccess("Kullanıcı silindi");
      fetchUsers();
    } else {
      const data = await res.json();
      setError(data.error || "Silinemedi");
    }
  }

  async function handleRoleChange(id: number, role: string) {
    setError(""); setSuccess("");
    setRoleLoadingId(id);
    const res = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, role }),
    });
    setRoleLoadingId(null);
    if (res.ok) {
      setSuccess("Rol değiştirildi");
      fetchUsers();
    } else {
      const data = await res.json();
      setError(data.error || "Rol değiştirilemedi");
    }
  }

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <UserGroupIcon className="w-6 h-6 text-blue-500" />
          <h2 className="text-2xl font-bold text-gray-800">Kullanıcı Yönetimi</h2>
        </div>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-600 p-4 rounded-lg mb-6">
            {success}
          </div>
        )}
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {users.map((u: any) => (
              <div key={u.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex flex-col gap-2">
                <div className="flex items-center gap-3 mb-2">
                  <UserCircleIcon className="w-8 h-8 text-gray-400" />
                  <div>
                    <div className="font-semibold text-gray-800">{u.name}</div>
                    <div className="flex items-center gap-1 text-gray-500 text-sm">
                      <EnvelopeIcon className="w-4 h-4" />
                      {u.email}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheckIcon className="w-5 h-5 text-green-500" />
                  <select
                    value={u.role}
                    onChange={e => handleRoleChange(u.id, e.target.value)}
                    className="border rounded-lg px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={roleLoadingId === u.id}
                  >
                    <option value="NORMAL">Normal</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                  {roleLoadingId === u.id && (
                    <ArrowPathIcon className="w-4 h-4 animate-spin text-blue-500 ml-2" />
                  )}
                </div>
                <button
                  className="flex items-center gap-2 bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors justify-center disabled:opacity-60"
                  onClick={() => handleDelete(u.id)}
                  disabled={deleteLoadingId === u.id}
                >
                  <TrashIcon className="w-5 h-5" />
                  {deleteLoadingId === u.id ? "Siliniyor..." : "Sil"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 