"use client";
import React, { useState } from 'react';
import { toast } from 'sonner';

export default function ReservationForm({ serviceTitle }: { serviceTitle: string }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [captcha, setCaptcha] = useState('');

  function validate() {
    if (!name || !phone) {
      setError('Vyplňte meno a telefón');
      toast.error('Vyplňte meno a telefón');
      return false;
    }
    if (!/^\+?\d{9,15}$/.test(phone)) {
      setError('Zadajte platné telefónne číslo');
      toast.error('Zadajte platné telefónne číslo');
      return false;
    }
    if (!captcha || captcha.toLowerCase() !== 'papi') {
      setError('Overte, že nie ste robot (napíšte "papi")');
      toast.error('Overte, že nie ste robot (napíšte "papi")');
      return false;
    }
    setError('');
    return true;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    toast.success('Rezervácia odoslaná!');
    setName('');
    setPhone('');
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 p-4 border rounded bg-gray-50" aria-label="Rezervačný formulár">
      <h3 className="text-lg font-bold mb-2">Rezervácia: {serviceTitle}</h3>
      <input
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Vaše meno"
        className="border rounded px-3 py-2 w-full mb-2"
        aria-label="Meno"
      />
      <input
        type="tel"
        value={phone}
        onChange={e => setPhone(e.target.value)}
        placeholder="Telefón"
        className="border rounded px-3 py-2 w-full mb-2"
        aria-label="Telefón"
      />
      <input
        type="text"
        value={captcha}
        onChange={e => setCaptcha(e.target.value)}
        placeholder="Napíšte 'papi' pre overenie"
        className="border rounded px-3 py-2 w-full mb-2"
        aria-label="Captcha"
      />
      <button type="submit" className="bg-primary text-white px-3 py-1 rounded w-full">Odoslať rezerváciu</button>
      {error && <div className="text-red-600 mt-2 text-sm">{error}</div>}
    </form>
  );
}
