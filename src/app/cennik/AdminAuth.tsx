"use client";
import React, { useState } from 'react';
import { toast } from 'sonner';

export default function AdminAuth({ onAuth }: { onAuth: () => void }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    // Demo: heslo je "admin2026"
    if (password === 'admin2026') {
      toast.success('Admin prihlásenie úspešné!');
      setError('');
      onAuth();
    } else {
      setError('Nesprávne heslo');
      toast.error('Nesprávne heslo');
    }
  }

  return (
    <form onSubmit={handleLogin} className="max-w-xs mx-auto p-4 border rounded bg-gray-50 mt-8">
      <h2 className="text-lg font-bold mb-2">Admin prihlásenie</h2>
      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Zadajte heslo"
        className="border rounded px-3 py-2 w-full mb-2"
        aria-label="Admin heslo"
      />
      <button type="submit" className="bg-primary text-white px-3 py-1 rounded w-full">Prihlásiť sa</button>
      {error && <div className="text-red-600 mt-2 text-sm">{error}</div>}
    </form>
  );
}
