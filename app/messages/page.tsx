"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  UserCircleIcon,
  PaperAirplaneIcon,
  ChatBubbleLeftEllipsisIcon,
  ArrowPathIcon,
  FaceSmileIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/solid";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export default function MessagesPage() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [content, setContent] = useState("");
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const [myId, setMyId] = useState<number | null>(null);
  const [myProfile, setMyProfile] = useState<{ id: number, name: string, profileImage?: string } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Giriş yapan kullanıcının id'sini ve profilini al
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetch("/api/auth/me", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => {
        setMyId(data.id);
        setMyProfile({ id: data.id, name: data.name, profileImage: data.profileImage });
      });
  }, []);

  useEffect(() => {
    setLoading(true);
    fetch("/api/users").then(res => res.json()).then(users => {
      setUsers(users);
      setLoading(false);
    });
  }, []);

  // Seçili kullanıcı değişince sadece onunla olan mesajlar çekilir
  useEffect(() => {
    if (!selectedUser) return;
    setChatLoading(true);
    const token = localStorage.getItem("token");
    fetch(`/api/messages?userId=${selectedUser.id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(setMessages)
      .finally(() => setChatLoading(false));
  }, [selectedUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedUser || !content.trim()) return;
    setError("");
    setSending(true);
    const token = localStorage.getItem("token");
    const res = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ receiverId: selectedUser.id, content }),
    });
    setSending(false);
    if (res.ok) {
      setContent("");
      // Mesajları güncelle
      fetch(`/api/messages?userId=${selectedUser.id}`, { headers: { Authorization: `Bearer ${token}` } })
        .then(res => res.json()).then(setMessages);
    } else {
      const data = await res.json();
      setError(data.error || "Mesaj gönderilemedi");
    }
  }

  // Mesajları tarihe göre grupla
  function groupMessagesByDate(msgs: any[]) {
    const groups: { [date: string]: any[] } = {};
    msgs.forEach(m => {
      const date = new Date(m.createdAt).toLocaleDateString();
      if (!groups[date]) groups[date] = [];
      groups[date].push(m);
    });
    return groups;
  }

  // Sohbet listesi filtreleme ve kendini çıkarma
  const filteredUsers = users.filter((u: any) =>
    (myId === null || u.id !== myId) &&
    (u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="w-full h-[80vh] max-w-5xl mx-auto mt-10 bg-white rounded-2xl shadow-lg flex overflow-hidden">
      {/* Sol Panel: Sohbetler */}
      <div className="w-1/3 min-w-[220px] border-r bg-gradient-to-b from-blue-50 to-white flex flex-col">
        <div className="flex items-center gap-2 px-4 py-4 border-b">
          <ChatBubbleLeftEllipsisIcon className="w-6 h-6 text-blue-500" />
          <span className="font-bold text-blue-900 text-lg">Sohbetler</span>
        </div>
        <div className="p-3">
          <div className="relative">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Kişi ara..."
              className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-400"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <ArrowPathIcon className="w-6 h-6 animate-spin text-blue-400" />
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-gray-400 flex flex-col items-center gap-2 py-8">
              <FaceSmileIcon className="w-8 h-8" />
              Kişi bulunamadı.
            </div>
          ) : (
            <ul>
              {filteredUsers.map((u: any) => (
                <li
                  key={u.id}
                  className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-blue-100 transition-colors ${selectedUser?.id === u.id ? 'bg-blue-100' : ''}`}
                  onClick={() => setSelectedUser(u)}
                >
                  {u.profileImage ? (
                    <img src={u.profileImage} alt={u.name} className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-bold text-lg">
                      {getInitials(u.name)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-800 truncate">{u.name}</div>
                    <div className="text-xs text-gray-500 truncate">{u.email}</div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      {/* Sağ Panel: Chat */}
      <div className="flex-1 flex flex-col h-full relative">
        {/* Üst bar */}
        <div className="flex items-center gap-3 px-6 py-4 border-b bg-gradient-to-r from-white to-blue-50 min-h-[64px]">
          {selectedUser?.profileImage ? (
            <img src={selectedUser.profileImage} alt={selectedUser.name} className="w-10 h-10 rounded-full object-cover" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-bold text-lg">
              {selectedUser ? getInitials(selectedUser.name) : <UserCircleIcon className="w-7 h-7" />}
            </div>
          )}
          <div>
            <div className="font-semibold text-gray-800">{selectedUser?.name || "Kişi seçin"}</div>
            <div className="text-xs text-gray-500">{selectedUser?.email}</div>
          </div>
        </div>
        {/* Chat alanı */}
        <div className="flex-1 overflow-y-auto px-4 py-6 bg-gradient-to-br from-blue-50 to-white relative">
          {!selectedUser ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
              <FaceSmileIcon className="w-12 h-12" />
              Sohbet başlatmak için bir kişi seçin.
            </div>
          ) : chatLoading ? (
            <div className="flex justify-center items-center h-full">
              <ArrowPathIcon className="w-8 h-8 animate-spin text-blue-400" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center gap-2 text-gray-400 py-8">
              <FaceSmileIcon className="w-10 h-10" />
              Henüz mesaj yok. İlk mesajı gönderin!
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {Object.entries(groupMessagesByDate(messages)).map(([date, msgs]: any) => (
                <div key={date}>
                  <div className="flex items-center justify-center mb-2">
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold shadow">{date}</span>
                  </div>
                  <div className="flex flex-col gap-4">
                    {msgs.map((m: any) => {
                      const isMine = m.isMine || m.senderId === myId;
                      return (
                        <div key={m.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                          <div className={`flex items-end gap-2 max-w-[80%] ${isMine ? 'flex-row-reverse' : ''}`}>
                            {isMine ? (
                              <>
                                {myProfile?.profileImage ? (
                                  <img src={myProfile.profileImage} alt={myProfile.name} className="w-8 h-8 rounded-full object-cover" />
                                ) : (
                                  <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-bold text-base">
                                    {getInitials(myProfile?.name || "?")}
                                  </div>
                                )}
                              </>
                            ) : (
                              <>
                                {selectedUser?.profileImage ? (
                                  <img src={selectedUser.profileImage} alt={selectedUser.name} className="w-8 h-8 rounded-full object-cover" />
                                ) : (
                                  <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-bold text-base">
                                    {getInitials(selectedUser?.name || "?")}
                                  </div>
                                )}
                              </>
                            )}
                            <div className={`rounded-2xl px-4 py-2 shadow text-base ${isMine ? 'bg-blue-600 text-white rounded-br-sm' : 'bg-white border border-blue-200 text-gray-800 rounded-bl-sm'}`}>
                              <div className="mb-1 text-xs flex gap-2 items-center">
                                <span className={`font-semibold ${isMine ? 'text-white' : 'text-blue-700'}`}>{isMine ? "Siz" : selectedUser?.name || "Bilinmeyen"}</span>
                                <span className="text-gray-300">•</span>
                                <span className="text-gray-300">{new Date(m.createdAt).toLocaleTimeString()}</span>
                              </div>
                              <div className="whitespace-pre-line break-words">{m.content}</div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
        {/* Hata mesajı */}
        {error && (
          <div className="absolute left-1/2 -translate-x-1/2 top-4 z-50 px-6 py-3 rounded-lg shadow-lg text-center text-white bg-red-500">
            {error}
          </div>
        )}
        {/* Mesaj gönderme kutusu */}
        {selectedUser && (
          <form
            className="flex gap-2 px-6 py-4 border-t bg-white z-10 sticky bottom-0"
            onSubmit={handleSubmit}
            style={{ boxShadow: "0 -2px 16px 0 rgba(0,0,0,0.04)" }}
          >
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              className="border p-2 rounded-lg flex-1 resize-none focus:ring-2 focus:ring-blue-400"
              placeholder="Mesajınızı yazın..."
              rows={1}
              required
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors disabled:opacity-60"
              disabled={sending || !selectedUser || !content.trim()}
            >
              {sending ? <ArrowPathIcon className="w-5 h-5 animate-spin" /> : <PaperAirplaneIcon className="w-5 h-5" />} Gönder
            </button>
          </form>
        )}
      </div>
    </div>
  );
} 