export type Service = {
  id: number;
  post_title: string;
  post_price: number;
  post_duration?: string;
};

const API_BASE = process.env.NEXT_PUBLIC_CENNIK_API ?? 'http://localhost:3000/api/cennik';

export async function fetchServices(): Promise<Service[]> {
  const res = await fetch(`${API_BASE}/services`, { cache: 'no-store' });
  if (!res.ok) return [];
  return res.json();
}

export async function addService(data: Omit<Service, 'id'>): Promise<Service> {
  const res = await fetch(`${API_BASE}/services`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Chyba pri vytváraní služby');
  return res.json();
}

export async function updateService(service: Service): Promise<Service> {
  const { id, ...rest } = service;
  const res = await fetch(`${API_BASE}/services/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(rest),
  });
  if (!res.ok) throw new Error('Chyba pri úprave služby');
  return res.json();
}

export async function deleteService(id: number): Promise<{ ok: boolean }> {
  const res = await fetch(`${API_BASE}/services/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Chyba pri mazaní služby');
  return { ok: true };
}
