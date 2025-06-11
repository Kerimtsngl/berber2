import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const Navbar: React.FC = () => {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setRole(null);
      return;
    }
    fetch("/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setRole(data.role || null))
      .catch(() => setRole(null));
  }, []);

  return (
    <div className="flex items-center justify-between p-4">
      {role === "ADMIN" && (
        <Link href="/admin" className="px-4 py-2 rounded hover:bg-gray-100">Admin Paneli</Link>
      )}
    </div>
  );
};

export default Navbar; 