"use client";
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import AdminAuth from './AdminAuth';
import { fetchServices, addService, updateService, deleteService, type Service } from './admin-api';

export default function AdminPanel() {
  const [authed, setAuthed] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState<number|null>(null);
  const [form, setForm] = useState<Service>({ id: 0, post_title: '', post_price: 0, post_duration: '' });

  useEffect(() => {
    if (authed) {
      setLoading(true);
      fetchServices().then((data: Service[]) => {
        setServices(data);
        setLoading(false);
      }).catch(() => {
        toast.error('Chyba pri načítaní služieb');
        setLoading(false);
      });
    }
  }, [authed]);

  function handleEdit(s: Service) {
    setEditId(s.id);
    setForm({ ...s });
    toast.info(`Editujete službu: ${s.post_title}`);
  }
  function handleDelete(id: number) {
    deleteService(id).then(() => {
      toast.success('Služba bola zmazaná!');
      setServices(services.filter(s => s.id !== id));
      if (editId === id) {
        setEditId(null);
        toast.info('Editácia bola zrušená.');
      }
    });
  }
  function validateForm(f: Service) {
    if (!f.post_title || f.post_price === undefined || !f.post_duration) {
      toast.error('Vyplňte všetky polia');
      return false;
    }
    if (isNaN(Number(f.post_price))) {
      toast.error('Cena musí byť číslo');
      return false;
    }
    return true;
  }
  function handleSave() {
    if (!validateForm(form)) {
      toast.error('Vyplňte správne všetky polia!');
      return;
    }
    updateService(form).then(() => {
      toast.success('Služba bola uložená!');
      setServices(services.map(s => s.id === form.id ? form : s));
      setEditId(null);
      toast.info('Editácia ukončená.');
    });
  }
  function handleAdd() {
    if (!validateForm(form)) {
      toast.error('Vyplňte správne všetky polia!');
      return;
    }
    addService({ post_title: form.post_title, post_price: Number(form.post_price), post_duration: form.post_duration }).then(res => {
      toast.success('Nová služba bola pridaná!');
      setServices([...services, res]);
      setForm({ id: 0, post_title: '', post_price: 0, post_duration: '' });
      toast.info('Pridanie služby ukončené.');
    });
  }

  if (!authed) return <AdminAuth onAuth={() => setAuthed(true)} />;
  if (loading) return <div>Načítavam služby...</div>;

  return (
    <div className="border p-4 rounded bg-gray-50 mt-8">
      <h2 className="text-xl font-bold mb-2">Admin rozhranie</h2>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Názov služby"
          value={form.post_title}
          onChange={e => setForm(f => ({ ...f, post_title: e.target.value }))}
          className="border rounded px-3 py-2 mr-2"
        />
        <input
          type="number"
          placeholder="Cena (€)"
          value={form.post_price}
          onChange={e => setForm(f => ({ ...f, post_price: Number(e.target.value) }))}
          className="border rounded px-3 py-2 mr-2"
        />
        <input
          type="text"
          placeholder="Trvanie (min)"
          value={form.post_duration}
          onChange={e => setForm(f => ({ ...f, post_duration: e.target.value }))}
          className="border rounded px-3 py-2 mr-2"
        />
        {editId ? (
          <>
            <button onClick={handleSave} className="bg-secondary text-white px-3 py-1 rounded mr-2">Uložiť zmeny</button>
            <button onClick={() => { setEditId(null); toast.info('Editácia bola zrušená.'); }} className="bg-gray-400 text-white px-3 py-1 rounded">Zrušiť</button>
          </>
        ) : (
          <button onClick={handleAdd} className="bg-primary text-white px-3 py-1 rounded">Pridať službu</button>
        )}
      </div>
      <table className="min-w-full border rounded mb-2" role="table" aria-label="Tabuľka služieb">
        <thead>
          <tr>
            <th className="p-2" scope="col">Názov</th>
            <th className="p-2" scope="col">Cena (€)</th>
            <th className="p-2" scope="col">Trvanie (min)</th>
            <th className="p-2" scope="col">Akcie</th>
          </tr>
        </thead>
        <tbody>
          {services.map(s => (
            <tr key={s.id}>
              <td className="p-2">{s.post_title}</td>
              <td className="p-2">{s.post_price}</td>
              <td className="p-2">{s.post_duration}</td>
              <td className="p-2">
                <button
                  onClick={() => handleEdit(s)}
                  className="bg-secondary text-white px-2 py-1 rounded mr-2"
                  aria-label={`Editovať službu ${s.post_title}`}
                  tabIndex={0}
                  onKeyDown={e => { if (e.key === 'Enter') handleEdit(s); }}
                >
                  Editovať
                </button>
                <button
                  onClick={() => handleDelete(s.id)}
                  className="bg-red-600 text-white px-2 py-1 rounded"
                  aria-label={`Zmazať službu ${s.post_title}`}
                  tabIndex={0}
                  onKeyDown={e => { if (e.key === 'Enter') handleDelete(s.id); }}
                >
                  Zmazať
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
