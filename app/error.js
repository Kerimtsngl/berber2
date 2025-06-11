'use client';
export default function Error({ error }) {
  return <div style={{ color: 'red', padding: 32 }}>Hata: {error?.message || String(error)}</div>;
} 