"use client";
import React, { useEffect, useState } from "react";
import { 
  WrenchScrewdriverIcon, 
  PlusIcon, 
  TrashIcon, 
  PencilSquareIcon,
  CurrencyDollarIcon,
  TagIcon
} from "@heroicons/react/24/outline";

export default function AdminServicesPage() {
  const [services, setServices] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");

  function fetchServices() {
    setLoading(true);
    fetch("/api/services")
      .then(res => res.json())
      .then(setServices)
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchServices();
  }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setSuccess("");
    const res = await fetch("/api/admin/services", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, price: Number(price) }),
    });
    if (res.ok) {
      setSuccess("Hizmet eklendi");
      setName(""); setPrice("");
      fetchServices();
    } else {
      const data = await res.json();
      setError(data.error || "Eklenemedi");
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Bu hizmeti silmek istediğinizden emin misiniz?")) return;
    setError(""); setSuccess("");
    const res = await fetch("/api/admin/services", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      setSuccess("Hizmet silindi");
      fetchServices();
    } else {
      const data = await res.json();
      setError(data.error || "Silinemedi");
    }
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!editingId) return;
    setError(""); setSuccess("");
    const res = await fetch("/api/admin/services", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        id: editingId, 
        name: editName, 
        price: Number(editPrice) 
      }),
    });
    if (res.ok) {
      setSuccess("Hizmet güncellendi");
      setEditingId(null);
      fetchServices();
    } else {
      const data = await res.json();
      setError(data.error || "Güncellenemedi");
    }
  }

  function startEdit(service: any) {
    setEditingId(service.id);
    setEditName(service.name);
    setEditPrice(service.price.toString());
  }

  function formatPrice(price: number) {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(price);
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <WrenchScrewdriverIcon className="w-6 h-6 text-green-500" />
          <h2 className="text-2xl font-bold text-gray-800">Hizmet Yönetimi</h2>
        </div>

        <form className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6" onSubmit={handleAdd}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hizmet Adı</label>
              <div className="relative">
                <TagIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Hizmet Adı"
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fiyat</label>
              <div className="relative">
                <CurrencyDollarIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="number"
                  placeholder="Fiyat"
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                  required
                  min={0}
                  step="0.01"
                />
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-green-700 transition-colors"
          >
            <PlusIcon className="w-5 h-5" />
            Hizmet Ekle
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
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((s: any) => (
              <div key={s.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                {editingId === s.id ? (
                  <form onSubmit={handleUpdate} className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Hizmet Adı</label>
                      <input
                        type="text"
                        className="w-full border border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        value={editName}
                        onChange={e => setEditName(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Fiyat</label>
                      <input
                        type="number"
                        className="w-full border border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        value={editPrice}
                        onChange={e => setEditPrice(e.target.value)}
                        required
                        min={0}
                        step="0.01"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Kaydet
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors"
                      >
                        İptal
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="font-semibold text-gray-800">{s.name}</div>
                        <div className="text-lg font-bold text-green-600 mt-1">
                          {formatPrice(s.price)}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEdit(s)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Düzenle"
                        >
                          <PencilSquareIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(s.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Sil"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 