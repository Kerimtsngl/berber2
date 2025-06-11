"use client";
import { useEffect, useState } from "react";
import { 
  BellIcon, 
  UserGroupIcon, 
  WrenchScrewdriverIcon, 
  ClockIcon, 
  ChatBubbleLeftRightIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
  TrashIcon,
  UserPlusIcon,
  UserMinusIcon,
  ShieldCheckIcon,
  ShieldExclamationIcon,
  PlusIcon,
  XMarkIcon,
  CheckIcon
} from "@heroicons/react/24/outline";

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [userLoading, setUserLoading] = useState(false);
  const [userError, setUserError] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("");

  // HİZMET YÖNETİMİ
  const [services, setServices] = useState<any[]>([]);
  const [serviceName, setServiceName] = useState("");
  const [servicePrice, setServicePrice] = useState("");
  const [serviceLoading, setServiceLoading] = useState(false);
  const [serviceError, setServiceError] = useState("");
  const [editingServiceId, setEditingServiceId] = useState<number | null>(null);
  const [editServiceName, setEditServiceName] = useState("");
  const [editServicePrice, setEditServicePrice] = useState("");

  // RANDEVU SAATLERİ YÖNETİMİ
  const [slots, setSlots] = useState<any[]>([]);
  const [slotStart, setSlotStart] = useState("");
  const [slotEnd, setSlotEnd] = useState("");
  const [slotLoading, setSlotLoading] = useState(false);
  const [slotError, setSlotError] = useState("");

  // MESAJ YÖNETİMİ
  const [messages, setMessages] = useState<any[]>([]);
  const [messageLoading, setMessageLoading] = useState(false);
  const [messageError, setMessageError] = useState("");

  // BİLDİRİMLER YÖNETİMİ
  const [events, setEvents] = useState<any[]>([]);
  const [eventLoading, setEventLoading] = useState(false);
  const [eventError, setEventError] = useState("");

  // RANDEVU YÖNETİMİ
  const [appointments, setAppointments] = useState<any[]>([]);
  const [appointmentLoading, setAppointmentLoading] = useState(false);
  const [appointmentError, setAppointmentError] = useState("");
  const [appointmentSearch, setAppointmentSearch] = useState("");
  const [appointmentStatusFilter, setAppointmentStatusFilter] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    fetch("/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        if (data.role === "ADMIN") {
          setIsAdmin(true);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!isAdmin) return;
    setUserLoading(true);
    fetch("/api/admin/users", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(() => setUserError("Kullanıcılar yüklenemedi"))
      .finally(() => setUserLoading(false));
  }, [isAdmin]);

  useEffect(() => {
    if (!isAdmin) return;
    setServiceLoading(true);
    fetch("/api/admin/services", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then(res => res.json())
      .then(data => setServices(data))
      .catch(() => setServiceError("Hizmetler yüklenemedi"))
      .finally(() => setServiceLoading(false));
  }, [isAdmin]);

  useEffect(() => {
    if (!isAdmin) return;
    setSlotLoading(true);
    fetch("/api/admin/timeslots", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then(res => res.json())
      .then(data => setSlots(data))
      .catch(() => setSlotError("Saatler yüklenemedi"))
      .finally(() => setSlotLoading(false));
  }, [isAdmin]);

  useEffect(() => {
    if (!isAdmin) return;
    setMessageLoading(true);
    fetch("/api/admin/messages", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then(res => res.json())
      .then(data => setMessages(data))
      .catch(() => setMessageError("Mesajlar yüklenemedi"))
      .finally(() => setMessageLoading(false));
  }, [isAdmin]);

  useEffect(() => {
    if (!isAdmin) return;
    setEventLoading(true);
    fetch("/api/admin/events", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then(res => res.json())
      .then(data => setEvents(data))
      .catch(() => setEventError("Bildirimler yüklenemedi"))
      .finally(() => setEventLoading(false));
  }, [isAdmin]);

  useEffect(() => {
    if (!isAdmin) return;
    setAppointmentLoading(true);
    fetch("/api/admin/appointments", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then(res => res.json())
      .then(data => setAppointments(data))
      .catch(() => setAppointmentError("Randevular yüklenemedi"))
      .finally(() => setAppointmentLoading(false));
  }, [isAdmin]);

  async function handleDeleteUser(id: number) {
    if (!confirm("Kullanıcı silinsin mi?")) return;
    await fetch("/api/admin/users", {
      method: "DELETE",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
      body: JSON.stringify({ id }),
    });
    setUsers(users => users.filter(u => u.id !== id));
  }

  async function handleChangeRole(id: number, role: string) {
    await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
      body: JSON.stringify({ id, role }),
    });
    setUsers(users => users.map(u => u.id === id ? { ...u, role } : u));
  }

  async function handleBanUser(id: number, isBanned: boolean) {
    await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
      body: JSON.stringify({ id, isBanned: !isBanned }),
    });
    setUsers(users => users.map(u => u.id === id ? { ...u, isBanned: !isBanned } : u));
  }

  async function handleAddService(e: React.FormEvent) {
    e.preventDefault();
    setServiceLoading(true);
    await fetch("/api/admin/services", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
      body: JSON.stringify({ name: serviceName, price: parseFloat(servicePrice) }),
    });
    setServiceName(""); setServicePrice("");
    // Yeniden yükle
    const res = await fetch("/api/admin/services", { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
    setServices(await res.json());
    setServiceLoading(false);
  }

  async function handleDeleteService(id: number) {
    await fetch("/api/admin/services", {
      method: "DELETE",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
      body: JSON.stringify({ id }),
    });
    setServices(services => services.filter(s => s.id !== id));
  }

  async function handleAddSlot(e: React.FormEvent) {
    e.preventDefault();
    setSlotLoading(true);
    await fetch("/api/admin/timeslots", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
      body: JSON.stringify({ start: slotStart, end: slotEnd }),
    });
    setSlotStart(""); setSlotEnd("");
    // Yeniden yükle
    const res = await fetch("/api/admin/timeslots", { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
    setSlots(await res.json());
    setSlotLoading(false);
  }

  async function handleDeleteSlot(id: number) {
    await fetch("/api/admin/timeslots", {
      method: "DELETE",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
      body: JSON.stringify({ id }),
    });
    setSlots(slots => slots.filter(s => s.id !== id));
  }

  function startEditService(service: any) {
    setEditingServiceId(service.id);
    setEditServiceName(service.name);
    setEditServicePrice(service.price.toString());
  }

  async function handleUpdateService(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/admin/services", {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
      body: JSON.stringify({ id: editingServiceId, name: editServiceName, price: parseFloat(editServicePrice) }),
    });
    setServices(services => services.map(s => s.id === editingServiceId ? { ...s, name: editServiceName, price: parseFloat(editServicePrice) } : s));
    setEditingServiceId(null);
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      user.email.toLowerCase().includes(userSearch.toLowerCase());
    const matchesRole = userRoleFilter ? user.role === userRoleFilter : true;
    return matchesSearch && matchesRole;
  });

  async function handleDeleteMessage(id: number) {
    await fetch("/api/admin/messages", {
      method: "DELETE",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
      body: JSON.stringify({ id }),
    });
    setMessages(messages => messages.filter(m => m.id !== id));
  }

  const filteredAppointments = appointments.filter(app => {
    const matchesSearch =
      app.user?.name.toLowerCase().includes(appointmentSearch.toLowerCase()) ||
      app.service?.name.toLowerCase().includes(appointmentSearch.toLowerCase());
    const matchesStatus = appointmentStatusFilter ? app.status === appointmentStatusFilter : true;
    return matchesSearch && matchesStatus;
  });

  async function handleApproveAppointment(id: number) {
    await fetch("/api/admin/appointments", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
      body: JSON.stringify({ id, status: "APPROVED" }),
    });
    setAppointments(appointments => appointments.map(a => a.id === id ? { ...a, status: "APPROVED" } : a));
  }

  async function handleRejectAppointment(id: number) {
    await fetch("/api/admin/appointments", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
      body: JSON.stringify({ id, status: "REJECTED" }),
    });
    setAppointments(appointments => appointments.map(a => a.id === id ? { ...a, status: "REJECTED" } : a));
  }

  async function handleDeleteAppointment(id: number) {
    await fetch("/api/admin/appointments", {
      method: "DELETE",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
      body: JSON.stringify({ id }),
    });
    setAppointments(appointments => appointments.filter(a => a.id !== id));
  }

  // Panelden kaldır fonksiyonu
  async function handleHideMessage(id: number) {
    await fetch("/api/admin/messages", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
      body: JSON.stringify({ id, isHidden: true }),
    });
    setMessages(messages => messages.filter(m => m.id !== id));
  }

  // Bildirimler için gizle ve sil fonksiyonları
  async function handleHideEvent(id: number) {
    await fetch("/api/admin/events", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
      body: JSON.stringify({ id, isHidden: true }),
    });
    setEvents(events => events.filter(ev => ev.id !== id));
  }
  async function handleDeleteEvent(id: number) {
    await fetch("/api/admin/events", {
      method: "DELETE",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
      body: JSON.stringify({ id }),
    });
    setEvents(events => events.filter(ev => ev.id !== id));
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
  if (!isAdmin) return null;

  return (
    <div className="max-w-5xl mx-auto mt-10 p-4 space-y-8">
      {/* Bildirimler */}
      <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col gap-4 w-full">
        <div className="flex items-center gap-4 mb-2">
          <BellIcon className="w-8 h-8 text-blue-500" />
          <h3 className="text-2xl font-bold text-gray-800">Bildirimler</h3>
        </div>
        {eventLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : eventError ? (
          <div className="text-red-600 bg-red-50 p-4 rounded-lg">{eventError}</div>
        ) : (
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {events.length === 0 && <div className="text-gray-400">Henüz bildirim yok.</div>}
            {events.map(ev => (
              <div key={ev.id} className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex flex-col gap-1 relative">
                <div className="absolute right-2 top-2 flex gap-2">
                  <button onClick={() => handleHideEvent(ev.id)} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors" title="Panelden Kaldır"><XMarkIcon className="w-5 h-5" /></button>
                  <button onClick={() => handleDeleteEvent(ev.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Sil"><TrashIcon className="w-5 h-5" /></button>
                </div>
                <div className="text-xs text-gray-500">{new Date(ev.createdAt).toLocaleString()}</div>
                <div className="text-gray-800 font-medium">{ev.message}</div>
                {ev.user && <div className="text-sm text-blue-600">{ev.user.name}</div>}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Kullanıcı Yönetimi */}
      <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col gap-4 w-full">
        <div className="flex items-center gap-4 mb-2">
          <UserGroupIcon className="w-8 h-8 text-purple-500" />
          <h3 className="text-2xl font-bold text-gray-800">Kullanıcı Yönetimi</h3>
        </div>
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Ad veya e-posta ara"
              value={userSearch}
              onChange={e => setUserSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <select
            value={userRoleFilter}
            onChange={e => setUserRoleFilter(e.target.value)}
            className="border border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">Tüm Roller</option>
            <option value="ADMIN">Admin</option>
            <option value="NORMAL">Normal</option>
          </select>
        </div>
        {userLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : userError ? (
          <div className="text-red-600 bg-red-50 p-4 rounded-lg">{userError}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredUsers.length === 0 && <div className="text-gray-400 col-span-2">Kullanıcı bulunamadı.</div>}
            {filteredUsers.map(user => (
              <div key={user.id} className={`p-4 rounded-lg border flex flex-col gap-2 ${user.isBanned ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-100'}`}>
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <div className="font-semibold text-gray-800">{user.name}</div>
                    <div className="text-sm text-gray-600">{user.email}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>{user.role}</span>
                    {user.isBanned && <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">Engelli</span>}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleDeleteUser(user.id)} className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors" title="Kullanıcıyı Sil">
                    <TrashIcon className="w-5 h-5 inline" /> Sil
                  </button>
                  <button onClick={() => handleChangeRole(user.id, user.role === "ADMIN" ? "NORMAL" : "ADMIN")} className="flex-1 bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 transition-colors" title={user.role === "ADMIN" ? "Normal Yap" : "Admin Yap"}>
                    <ShieldCheckIcon className="w-5 h-5 inline" /> {user.role === "ADMIN" ? "Normal Yap" : "Admin Yap"}
                  </button>
                  <button onClick={() => handleBanUser(user.id, user.isBanned)} className={`flex-1 py-2 rounded-lg transition-colors ${user.isBanned ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-500 text-white hover:bg-gray-600'}`} title={user.isBanned ? "Engeli Kaldır" : "Engelle"}>
                    {user.isBanned ? <UserPlusIcon className="w-5 h-5 inline" /> : <UserMinusIcon className="w-5 h-5 inline" />} {user.isBanned ? "Engeli Kaldır" : "Engelle"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Hizmet Yönetimi */}
      <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col gap-4 w-full">
        <div className="flex items-center gap-4 mb-2">
          <WrenchScrewdriverIcon className="w-8 h-8 text-green-500" />
          <h3 className="text-2xl font-bold text-gray-800">Hizmet Yönetimi</h3>
        </div>
        <form className="flex flex-col md:flex-row gap-4 mb-4" onSubmit={handleAddService}>
          <input
            type="text"
            placeholder="Hizmet Adı"
            value={serviceName}
            onChange={e => setServiceName(e.target.value)}
            className="flex-1 border border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            required
          />
          <input
            type="number"
            placeholder="Fiyat"
            value={servicePrice}
            onChange={e => setServicePrice(e.target.value)}
            className="flex-1 border border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            required
            min="0"
            step="0.01"
          />
          <button
            type="submit"
            className="bg-green-600 text-white py-2 px-6 rounded-lg flex items-center justify-center gap-2 hover:bg-green-700 transition-colors"
          >
            <PlusIcon className="w-5 h-5" /> Hizmet Ekle
          </button>
        </form>
        {serviceLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : serviceError ? (
          <div className="text-red-600 bg-red-50 p-4 rounded-lg">{serviceError}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.length === 0 && <div className="text-gray-400 col-span-2">Hizmet bulunamadı.</div>}
            {services.map(service => (
              <div key={service.id} className="bg-gray-50 p-4 rounded-lg border border-gray-100 flex flex-col gap-2">
                {editingServiceId === service.id ? (
                  <form onSubmit={handleUpdateService} className="space-y-3">
                    <input
                      type="text"
                      className="w-full border border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      value={editServiceName}
                      onChange={e => setEditServiceName(e.target.value)}
                      required
                    />
                    <input
                      type="number"
                      className="w-full border border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      value={editServicePrice}
                      onChange={e => setEditServicePrice(e.target.value)}
                      required
                      min={0}
                      step="0.01"
                    />
                    <div className="flex gap-2">
                      <button type="submit" className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"><CheckIcon className="w-5 h-5 inline" /> Kaydet</button>
                      <button type="button" onClick={() => setEditingServiceId(null)} className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors"><XMarkIcon className="w-5 h-5 inline" /> İptal</button>
                    </div>
                  </form>
                ) : (
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-gray-800">{service.name}</div>
                      <div className="text-sm text-gray-600">{service.price} ₺</div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => startEditService(service)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Düzenle"><PencilSquareIcon className="w-5 h-5" /></button>
                      <button onClick={() => handleDeleteService(service.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Sil"><TrashIcon className="w-5 h-5" /></button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Randevu Yönetimi */}
      <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col gap-4 w-full">
        <div className="flex items-center gap-4 mb-2">
          <ClockIcon className="w-8 h-8 text-orange-500" />
          <h3 className="text-2xl font-bold text-gray-800">Randevu Yönetimi</h3>
        </div>
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <input
            type="text"
            placeholder="Kullanıcı veya hizmet ara..."
            value={appointmentSearch}
            onChange={e => setAppointmentSearch(e.target.value)}
            className="flex-1 border border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
          <select
            value={appointmentStatusFilter}
            onChange={e => setAppointmentStatusFilter(e.target.value)}
            className="border border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="">Tüm Durumlar</option>
            <option value="PENDING">Bekliyor</option>
            <option value="APPROVED">Onaylandı</option>
            <option value="REJECTED">Reddedildi</option>
          </select>
        </div>
        {appointmentLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        ) : appointmentError ? (
          <div className="text-red-600 bg-red-50 p-4 rounded-lg">{appointmentError}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredAppointments.length === 0 && <div className="text-gray-400 col-span-2">Randevu bulunamadı.</div>}
            {filteredAppointments.map(app => (
              <div key={app.id} className="bg-gray-50 p-4 rounded-lg border border-gray-100 flex flex-col gap-2">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <div className="font-semibold text-gray-800">{app.user?.name} ({app.user?.email})</div>
                    <div className="text-sm text-gray-600">{app.service?.name} - {app.service?.price}₺</div>
                    <div className="text-xs text-gray-500">{new Date(app.createdAt).toLocaleString()}</div>
                    <div className="text-xs text-gray-500">Saat: {app.timeSlotId}</div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${app.status === 'PENDING' ? 'bg-orange-100 text-orange-700' : app.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{app.status === 'PENDING' ? 'Bekliyor' : app.status === 'APPROVED' ? 'Onaylandı' : 'Reddedildi'}</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleApproveAppointment(app.id)} className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"><CheckIcon className="w-5 h-5 inline" /> Onayla</button>
                  <button onClick={() => handleRejectAppointment(app.id)} className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors"><XMarkIcon className="w-5 h-5 inline" /> Reddet</button>
                  <button onClick={() => handleDeleteAppointment(app.id)} className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors"><TrashIcon className="w-5 h-5 inline" /> Sil</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Mesaj Yönetimi */}
      <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col gap-4 w-full">
        <div className="flex items-center gap-4 mb-2">
          <ChatBubbleLeftRightIcon className="w-8 h-8 text-indigo-500" />
          <h3 className="text-2xl font-bold text-gray-800">Mesaj Yönetimi</h3>
        </div>
        {messageLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : messageError ? (
          <div className="text-red-600 bg-red-50 p-4 rounded-lg">{messageError}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {messages.length === 0 && <div className="text-gray-400 col-span-2">Mesaj bulunamadı.</div>}
            {messages.map(msg => {
              return (
                <div key={msg.id} className="bg-gray-50 p-4 rounded-lg border border-gray-100 flex flex-col gap-2 relative">
                  <div className="absolute right-2 top-2 flex gap-2">
                    <button onClick={() => handleHideMessage(msg.id)} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors" title="Panelden Kaldır"><XMarkIcon className="w-5 h-5" /></button>
                    <button onClick={() => handleDeleteMessage(msg.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Sil"><TrashIcon className="w-5 h-5" /></button>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <div className="text-sm text-gray-600">Gönderen</div>
                      <div className="font-semibold text-gray-800">{msg.sender?.name} ({msg.sender?.email})</div>
                      <div className="text-sm text-gray-600 mt-2">Alıcı</div>
                      <div className="font-semibold text-gray-800">{msg.receiver?.name} ({msg.receiver?.email})</div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">Mesaj</div>
                  <div className="bg-white p-3 rounded-lg border border-gray-200 mt-1">{msg.content}</div>
                  <div className="text-xs text-gray-500 mt-2">{new Date(msg.createdAt).toLocaleString()}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
} 