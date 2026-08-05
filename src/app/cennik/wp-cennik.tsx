"use client";
import React, { useEffect, useState } from 'react';
import { CSVLink } from 'react-csv';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import useSWR from 'swr';
import Slider from 'rc-slider';
import '@/rc-slider.css';
import { useTranslation } from 'next-i18next';

export type Service = {
  _ID: number;
  post_title: string;
  post_desc: string;
  post_category: string;
  post_subcategory: string;
  subcategory_title: string;
  post_price: string;
  post_duration: string;
  akcna_cena?: string;
  image_url?: string;
  reviews?: Array<{
    author: string;
    rating: number;
    text: string;
    date?: string;
  }>;
  availability?: string;
};

const bookingUrl = 'https://services.bookio.com/papi-hair-design/widget?lang=sk';
const adminUrl = 'https://api.all4all.sk/wp-admin';

function unique(arr: string[]) {
  return Array.from(new Set(arr.filter(Boolean)));
}

export default function WpCennik() {
  const { t } = useTranslation();
  const [filtered, setFiltered] = useState<Service[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [durationRange, setDurationRange] = useState<[number, number]>([0, 240]);
  const [showAkcia, setShowAkcia] = useState(false);
  const [multiSort, setMultiSort] = useState<string[]>([]);
  const fetcher = (url: string) => fetch(url).then(res => {
    if (!res.ok) throw new Error('Chyba pri načítaní dát');
    return res.json();
  });
  const { data: services = [], error, isLoading } = useSWR<Service[]>('https://api.all4all.sk/wp-json/query/services/', fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
  });
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [sort, setSort] = useState('');
  const [showDetail, setShowDetail] = useState<Service | null>(null);

  useEffect(() => {
    setFiltered(services);
  }, [services]);

  useEffect(() => {
    let data = [...services];
    if (search) {
      data = data.filter(s =>
        s.post_title.toLowerCase().includes(search.toLowerCase()) ||
        (s.post_desc && s.post_desc.toLowerCase().includes(search.toLowerCase()))
      );
    }
    if (category) {
      data = data.filter(s => s.post_category === category);
    }
    if (subcategory) {
      data = data.filter(s => s.subcategory_title === subcategory);
    }
    if (showAkcia) {
      data = data.filter(s => s.akcna_cena);
    }
    if (priceRange[0] > 0 || priceRange[1] < 200) {
      data = data.filter(s => {
        const price = parseFloat(s.akcna_cena || s.post_price);
        return price >= priceRange[0] && price <= priceRange[1];
      });
    }
    if (durationRange[0] > 0 || durationRange[1] < 240) {
      data = data.filter(s => {
        const duration = parseInt(s.post_duration);
        return duration >= durationRange[0] && duration <= durationRange[1];
      });
    }
    if (sort) {
      if (sort === 'price') {
        data.sort((a, b) => parseFloat(a.akcna_cena || a.post_price) - parseFloat(b.akcna_cena || b.post_price));
      } else if (sort === 'duration') {
        data.sort((a, b) => parseInt(a.post_duration) - parseInt(b.post_duration));
      } else if (sort === 'name') {
        data.sort((a, b) => a.post_title.localeCompare(b.post_title));
      }
    }
    setFiltered(data);
  }, [services, search, category, subcategory, priceRange, durationRange, showAkcia, sort]);

  const handleExportDetailPDF = (service: Service) => {
    const doc = new jsPDF();
    doc.text(service.post_title, 10, 10);
    doc.text(service.post_desc, 10, 20);
    doc.text(`Cena: ${service.akcna_cena || service.post_price} €`, 10, 30);
    doc.text(`Trvanie: ${service.post_duration} min`, 10, 40);
    doc.save(`${service.post_title}.pdf`);
  };

  const categories = unique(services.map(s => s.post_category));
  const subcategories = unique(services.map(s => s.subcategory_title));

  if (error) return <div>Chyba pri načítaní dát: {error.message}</div>;
  if (isLoading) return <div>Načítavam...</div>;

  return (
    <>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">{t('pricelist', 'Cenník služieb')}</h1>
        <div className="mb-4 flex flex-wrap gap-4">
          <input
            type="text"
            placeholder={t('search', 'Hľadať')}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border p-2 rounded"
          />
          <select value={category} onChange={e => setCategory(e.target.value)} className="border p-2 rounded" aria-label={t('all_categories', 'Všetky kategórie')}>
            <option value="">{t('all_categories', 'Všetky kategórie')}</option>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          <select value={subcategory} onChange={e => setSubcategory(e.target.value)} className="border p-2 rounded" aria-label={t('all_subcategories', 'Všetky podkategórie')}>
            <option value="">{t('all_subcategories', 'Všetky podkategórie')}</option>
            {subcategories.map(sub => <option key={sub} value={sub}>{sub}</option>)}
          </select>
          <label className="flex items-center">
            <input type="checkbox" checked={showAkcia} onChange={e => setShowAkcia(e.target.checked)} className="mr-2" />
            {t('show_akcia', 'Zobraziť akcie')}
          </label>
        </div>
        <div className="mb-4">
          <label>{t('price_range', 'Rozsah ceny')}: {priceRange[0]} - {priceRange[1]} €</label>
          <Slider range value={priceRange} onChange={(value) => setPriceRange(value as [number, number])} min={0} max={200} />
        </div>
        <div className="mb-4">
          <label>{t('duration_range', 'Rozsah trvania')}: {durationRange[0]} - {durationRange[1]} min</label>
          <Slider range value={durationRange} onChange={(value) => setDurationRange(value as [number, number])} min={0} max={240} />
        </div>
        <div className="mb-4">
          <label>{t('sort', 'Triediť')}</label>
          <select value={sort} onChange={e => setSort(e.target.value)} className="border p-2 rounded" aria-label={t('sort', 'Triediť')}>
            <option value="">{t('no_sort', 'Bez triedenia')}</option>
            <option value="price">{t('price', 'Cena')}</option>
            <option value="duration">{t('duration', 'Trvanie')}</option>
            <option value="name">{t('name', 'Názov')}</option>
          </select>
        </div>
        <div className="mb-4">
          <CSVLink data={filtered.map(s => ({ title: s.post_title, price: s.akcna_cena || s.post_price, duration: s.post_duration }))} filename="cennik.csv" className="bg-blue-500 text-white px-4 py-2 rounded">
            {t('export_csv', 'Export CSV')}
          </CSVLink>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(service => (
            <div key={service._ID} className="border p-4 rounded shadow">
              {service.image_url && <img src={service.image_url} alt={service.post_title} className="mb-2 rounded" />}
              <h2 className="text-xl font-bold">{service.post_title}</h2>
              <p>{service.post_desc}</p>
              <p><strong>{t('price', 'Cena')}:</strong> {service.akcna_cena ? <span className="text-red-600 font-bold">{service.akcna_cena} €</span> : `${service.post_price} €`}</p>
              <p><strong>{t('duration', 'Trvanie')}:</strong> {service.post_duration} min</p>
              <button onClick={() => setShowDetail(service)} className="bg-primary text-white px-3 py-1 rounded mt-2">
                {t('details', 'Detaily')}
              </button>
            </div>
          ))}
        </div>
        {showDetail && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded max-w-lg w-full max-h-96 overflow-y-auto relative">
              <button
                onClick={() => setShowDetail(null)}
                className="absolute top-2 right-2 text-xl"
                aria-label="Zatvoriť detail služby"
                tabIndex={0}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setShowDetail(null); }}
              >
                ×
              </button>
              <button
                onClick={() => handleExportDetailPDF(showDetail)}
                className="absolute top-2 left-2 text-xs bg-primary text-white px-2 py-1 rounded"
                aria-label="Exportovať detail služby do PDF"
              >
                Export PDF
              </button>
              <h2 className="text-2xl font-bold mb-2">{showDetail.post_title}</h2>
              {showDetail.image_url && <img src={showDetail.image_url} alt={showDetail.post_title} className="mb-2 rounded" />}
              <p className="mb-2">{showDetail.post_desc}</p>
              <p><strong>{t('category', 'Kategória')}:</strong> {showDetail.post_category}</p>
              <p><strong>{t('subcategory', 'Podkategória')}:</strong> {showDetail.subcategory_title}</p>
              <p><strong>{t('price', 'Cena')}:</strong> {showDetail.akcna_cena ? <span className="text-red-600 font-bold">{showDetail.akcna_cena} €</span> : `${showDetail.post_price} €`}</p>
              <p><strong>{t('duration', 'Trvanie')}:</strong> {showDetail.post_duration} min</p>
              <p><strong>Dostupnosť:</strong> {showDetail.availability === 'https://schema.org/InStock' ? 'Dostupné' : 'Nedostupné'}</p>
              {showDetail.reviews && showDetail.reviews.length > 0 && (
                <div className="mb-2">
                  <b>Recenzie:</b>
                  <ul className="list-disc ml-4">
                    {showDetail.reviews.map((r, idx) => (
                      <li key={idx}>
                        <span className="font-semibold">{r.author}</span>: {r.text} <span className="text-yellow-500">{'★'.repeat(r.rating)}</span> {r.date && <span className="text-xs text-gray-500">({r.date})</span>}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <a
                href={bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-primary text-white px-3 py-1 rounded mt-4 inline-block"
                aria-label={`Rezervovať službu ${showDetail.post_title}`}
              >
                {t('reserve', 'Rezervovať')}
              </a>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
