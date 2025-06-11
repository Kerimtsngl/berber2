"use client";
import React, { useEffect, useState } from "react";
import {
  CalendarDaysIcon,
  ClockIcon,
  CheckCircleIcon,
  ChevronRightIcon,
  CurrencyDollarIcon,
  SparklesIcon,
  ArrowPathIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { addDays, format, isSameDay } from "date-fns";
import tr from "date-fns/locale/tr";

export default function AppointmentsPage() {
  const [services, setServices] = useState([]);
  const [slots, setSlots] = useState([]);
  const [serviceId, setServiceId] = useState("");
  const [slotId, setSlotId] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem("token");
    Promise.all([
      fetch("/api/services").then(res => res.json()),
      fetch("/api/timeslots").then(res => res.json()),
    ]).then(([services, slots]) => {
      setServices(services);
      setSlots(slots);
      if (token) {
        fetch("/api/appointments", { headers: { Authorization: `Bearer ${token}` } })
          .then(res => res.json()).then(setAppointments).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });
  }, []);

  useEffect(() => {
    if (!selectedDate) return;
    setLoading(true);
    fetch(`/api/timeslots?date=${selectedDate.toISOString().slice(0, 10)}`)
      .then(res => res.json())
      .then(setSlots)
      .finally(() => setLoading(false));
  }, [selectedDate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setSuccess("");
    setSubmitting(true);
    const token = localStorage.getItem("token");
    const res = await fetch("/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ serviceId, timeSlotId: slotId }),
    });
    setSubmitting(false);
    if (res.ok) {
      setSuccess("Randevu alındı!");
      setServiceId("");
      setSlotId("");
      setStep(1);
      // Randevuları güncelle
      fetch("/api/appointments", { headers: { Authorization: `Bearer ${token}` } })
        .then(res => res.json()).then(setAppointments);
    } else {
      const data = await res.json();
      setError(data.error || "Randevu alınamadı");
    }
  }

  async function handleCancelAppointment(id: number) {
    const token = localStorage.getItem("token");
    const res = await fetch("/api/appointments", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id, status: "REJECTED" }),
    });
    if (res.ok) {
      setAppointments((prev: any[]) => prev.map(a => a.id === id ? { ...a, status: "REJECTED" } : a));
    }
  }

  async function handleDeleteAppointment(id: number) {
    const token = localStorage.getItem("token");
    const res = await fetch("/api/appointments", {
      method: "DELETE",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      setAppointments((prev: any[]) => prev.filter(a => a.id !== id));
    }
  }

  function formatPrice(price: number) {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(price);
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 p-0 md:p-6">
      {/* Başlık ve açıklama */}
      <div className="bg-gradient-to-br from-blue-100 to-white rounded-2xl shadow-lg p-8 mb-8 flex flex-col items-center text-center relative overflow-hidden">
        <SparklesIcon className="w-12 h-12 text-blue-400 mb-2 animate-pulse" />
        <h2 className="text-3xl md:text-4xl font-extrabold text-blue-900 mb-2 tracking-tight">Randevu Al</h2>
        <p className="text-gray-600 max-w-xl mb-2">Kolayca hizmet seç, uygun saat bul ve randevunu oluştur. Modern ve hızlı berber randevu deneyimi!</p>
        <div className="absolute right-6 top-6 opacity-10 text-blue-300 text-7xl select-none pointer-events-none">💈</div>
      </div>

      {/* Adım göstergesi */}
      <div className="flex items-center justify-center gap-4 mb-8">
        <div className={`flex items-center gap-2 ${step === 1 ? 'text-blue-700 font-bold' : 'text-gray-400'}`}>
          <CalendarDaysIcon className="w-6 h-6" /> Tarih Seç
        </div>
        <ChevronRightIcon className="w-5 h-5 text-gray-300" />
        <div className={`flex items-center gap-2 ${step === 2 ? 'text-blue-700 font-bold' : 'text-gray-400'}`}>
          <CalendarDaysIcon className="w-6 h-6" /> Hizmet Seç
        </div>
        <ChevronRightIcon className="w-5 h-5 text-gray-300" />
        <div className={`flex items-center gap-2 ${step === 3 ? 'text-blue-700 font-bold' : 'text-gray-400'}`}>
          <ClockIcon className="w-6 h-6" /> Saat Seç
        </div>
        <ChevronRightIcon className="w-5 h-5 text-gray-300" />
        <div className={`flex items-center gap-2 ${step === 4 ? 'text-blue-700 font-bold' : 'text-gray-400'}`}>
          <CheckCircleIcon className="w-6 h-6" /> Onayla
        </div>
      </div>

      {/* Adım 1: Tarih seçimi */}
      {step === 1 && (
        <div className="mb-8 flex flex-col items-center">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            {Array.from({ length: 22 }) // 15 gün pazarlar hariç yaklaşık 22 güne bakılır
              .map((_, i) => addDays(new Date(), i))
              .filter(date => date.getDay() !== 0) // 0: Pazar
              .slice(0, 15)
              .map((date, idx) => (
                <button
                  key={idx}
                  className={`px-4 py-3 rounded-xl border-2 flex flex-col items-center gap-1 transition-all duration-200 focus:outline-none ${selectedDate && isSameDay(selectedDate, date) ? 'border-blue-500 bg-blue-50 shadow-lg text-blue-700 font-bold' : 'border-gray-200 bg-white hover:border-blue-400'}`}
                  onClick={() => { setSelectedDate(date); setStep(2); }}
                >
                  <span className="text-sm font-medium">{format(date, 'd MMMM', { locale: tr })}</span>
                  <span className="text-xs text-gray-500">{format(date, 'EEEE', { locale: tr })}</span>
                </button>
              ))}
          </div>
        </div>
      )}

      {/* Adım 2: Hizmet seçimi */}
      {step === 2 && (
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((s: any) => (
              <button
                key={s.id}
                className={`group bg-white border-2 ${serviceId === s.id ? 'border-blue-500 shadow-lg' : 'border-gray-200'} rounded-xl p-6 flex flex-col items-center gap-2 hover:border-blue-400 transition-all duration-200 focus:outline-none`}
                onClick={() => { setServiceId(s.id); setStep(3); }}
              >
                <CurrencyDollarIcon className="w-8 h-8 text-blue-400 group-hover:scale-110 transition-transform" />
                <span className="text-lg font-semibold text-gray-800">{s.name}</span>
                <span className="text-blue-700 font-bold text-xl">{formatPrice(s.price)}</span>
              </button>
            ))}
          </div>
          <button
            className="mt-6 text-sm text-gray-500 hover:text-blue-600 underline"
            onClick={() => setStep(1)}
          >
            &larr; Tarih seçimine geri dön
          </button>
        </div>
      )}

      {/* Adım 3: Saat seçimi */}
      {step === 3 && (
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {slots.length === 0 && (
              <div className="col-span-2 text-gray-500">Uygun saat bulunamadı.</div>
            )}
            {slots.map((s: any) => (
              <button
                key={s.id}
                className={`group bg-white border-2 ${slotId === s.id ? 'border-blue-500 shadow-lg' : 'border-gray-200'} rounded-xl p-5 flex flex-col items-center gap-2 transition-all duration-200 focus:outline-none relative ${s.isBooked ? 'opacity-50 cursor-not-allowed' : 'hover:border-blue-400'}`}
                onClick={() => { if (!s.isBooked) { setSlotId(s.id); setStep(4); } }}
                disabled={s.isBooked}
              >
                <ClockIcon className="w-7 h-7 text-blue-400 group-hover:scale-110 transition-transform" />
                <span className="text-base font-semibold text-gray-800">{new Date(s.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(s.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                {s.isBooked && (
                  <span className="absolute top-2 right-2 bg-red-100 text-red-600 px-2 py-0.5 rounded text-xs font-medium">Dolu</span>
                )}
              </button>
            ))}
          </div>
          <button
            className="mt-6 text-sm text-gray-500 hover:text-blue-600 underline"
            onClick={() => setStep(2)}
          >
            &larr; Hizmet seçimine geri dön
          </button>
        </div>
      )}

      {/* Adım 4: Onay ve gönder */}
      {step === 4 && (
        <form className="mb-8 flex flex-col items-center" onSubmit={handleSubmit}>
          <div className="bg-white border-2 border-blue-200 rounded-xl p-6 flex flex-col items-center gap-3 shadow-lg">
            <div className="flex items-center gap-2">
              <CurrencyDollarIcon className="w-6 h-6 text-blue-400" />
              <span className="font-semibold text-gray-800">{services.find((s: any) => s.id === serviceId)?.name}</span>
              <span className="ml-2 bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-medium">{formatPrice(services.find((s: any) => s.id === serviceId)?.price)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <ClockIcon className="w-5 h-5 text-gray-400" />
              <span>{selectedDate && format(selectedDate, 'd MMMM yyyy, EEEE', { locale: tr })} - {(() => {
                const slot = slots.find((s: any) => s.id === slotId);
                if (!slot) return "";
                return `${new Date(slot.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(slot.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
              })()}</span>
            </div>
          </div>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg mt-4 flex items-center gap-2">
              <XCircleIcon className="w-5 h-5" /> {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-600 p-3 rounded-lg mt-4 flex items-center gap-2">
              <CheckCircleIcon className="w-5 h-5" /> {success}
            </div>
          )}
          <div className="flex gap-4 mt-6">
            <button
              type="button"
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              onClick={() => setStep(3)}
            >
              &larr; Saat seçimine geri dön
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors disabled:opacity-60"
              disabled={submitting}
            >
              {submitting && <ArrowPathIcon className="w-5 h-5 animate-spin" />} Randevuyu Onayla
            </button>
          </div>
        </form>
      )}

      {/* Randevularım Timeline */}
      <div className="mt-12">
        <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <CalendarDaysIcon className="w-6 h-6 text-blue-500" /> Mevcut Randevularım
        </h3>
        {loading ? (
          <div className="flex justify-center py-8">
            <ArrowPathIcon className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : !Array.isArray(appointments) ? (
          <div className="flex flex-col items-center gap-2 text-red-500 py-8">
            <XCircleIcon className="w-6 h-6" />
            {appointments?.error ? appointments.error : "Randevular yüklenemedi."}
          </div>
        ) : appointments.length === 0 ? (
          <div className="flex flex-col items-center gap-2 text-gray-400 py-8">
            <CalendarDaysIcon className="w-10 h-10" />
            Henüz randevunuz yok.
          </div>
        ) : (
          <ol className="relative border-l-4 border-blue-200 ml-4 space-y-8">
            {appointments.map((a: any, i: number) => (
              <li key={a.id} className="ml-4">
                <div className="absolute -left-6 top-2 bg-blue-100 border-4 border-white rounded-full w-8 h-8 flex items-center justify-center shadow">
                  <CheckCircleIcon className="w-5 h-5 text-blue-500" />
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-200 rounded-xl p-5 shadow flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <CurrencyDollarIcon className="w-5 h-5 text-blue-400" />
                    <span className="font-semibold">{a.service?.name}</span>
                    <span className="ml-auto bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-medium">{formatPrice(a.service?.price)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <ClockIcon className="w-4 h-4 text-gray-400" />
                    <span>{new Date(a.timeSlot?.start).toLocaleString()} - {new Date(a.timeSlot?.end).toLocaleTimeString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <CheckCircleIcon className="w-4 h-4 text-green-500" />
                    <span>Oluşturulma: {new Date(a.createdAt).toLocaleString()}</span>
                  </div>
                  <div className="flex gap-2 mt-2 self-end">
                    {a.status !== "REJECTED" && (
                      <button
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors w-fit"
                        onClick={() => handleCancelAppointment(a.id)}
                      >
                        Randevuyu İptal Et
                      </button>
                    )}
                    <button
                      className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors w-fit"
                      onClick={() => handleDeleteAppointment(a.id)}
                    >
                      Sil
                    </button>
                  </div>
                  {a.status === "REJECTED" && (
                    <span className="mt-2 text-xs text-red-600 font-semibold self-end">Randevu İptal Edildi</span>
                  )}
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
} 