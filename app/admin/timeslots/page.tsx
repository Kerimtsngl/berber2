"use client";
import React, { useEffect, useState } from "react";
import { 
  ClockIcon, 
  PlusIcon, 
  TrashIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  CalendarIcon
} from "@heroicons/react/24/outline";

export default function AdminTimeslotsPage() {
  const [slots, setSlots] = useState([]);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);

  function fetchSlots() {
    setLoading(true);
    fetch("/api/timeslots")
      .then(res => res.json())
      .then(setSlots)
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchSlots();
  }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setSuccess("");
    const res = await fetch("/api/admin/timeslots", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ start, end }),
    });
    if (res.ok) {
      setSuccess("Saat eklendi");
      setStart(""); setEnd("");
      fetchSlots();
    } else {
      const data = await res.json();
      setError(data.error || "Eklenemedi");
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Bu randevu saatini silmek istediğinizden emin misiniz?")) return;
    setError(""); setSuccess("");
    const res = await fetch("/api/admin/timeslots", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      setSuccess("Saat silindi");
      fetchSlots();
    } else {
      const data = await res.json();
      setError(data.error || "Silinemedi");
    }
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6">
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <ClockIcon className="w-6 h-6 text-orange-500" />
          <h2 className="text-2xl font-bold text-gray-800">Randevu Saatleri Yönetimi</h2>
        </div>

        <form className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6" onSubmit={handleAdd}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Başlangıç Zamanı</label>
              <div className="relative">
                <CalendarIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="datetime-local"
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  value={start}
                  onChange={e => setStart(e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bitiş Zamanı</label>
              <div className="relative">
                <CalendarIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="datetime-local"
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  value={end}
                  onChange={e => setEnd(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-orange-600 text-white py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-orange-700 transition-colors"
          >
            <PlusIcon className="w-5 h-5" />
            Randevu Saati Ekle
          </button>
        </form>

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
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {slots.map((s: any) => (
              <div key={s.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    {s.isAvailable ? (
                      <CheckCircleIcon className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircleIcon className="w-5 h-5 text-red-500" />
                    )}
                    <span className={`text-sm font-medium ${
                      s.isAvailable ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {s.isAvailable ? "Müsait" : "Dolu"}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDelete(s.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Sil"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-2">
                  <div>
                    <div className="text-sm text-gray-600">Başlangıç</div>
                    <div className="font-medium text-gray-800">
                      {new Date(s.start).toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Bitiş</div>
                    <div className="font-medium text-gray-800">
                      {new Date(s.end).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 