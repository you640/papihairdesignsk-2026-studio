
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
  const [filtered, setFiltered] = useState<Service[]>(services);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [sort, setSort] = useState('');
  const [showDetail, setShowDetail] = useState<Service | null>(null);



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
    // Filter podľa ceny
    data = data.filter(s => {
      const price = Number(s.akcna_cena || s.post_price);
      return price >= priceRange[0] && price <= priceRange[1];
    });
    // Filter podľa trvania
    data = data.filter(s => {
      const duration = Number(s.post_duration);
      return duration >= durationRange[0] && duration <= durationRange[1];
    });
    // Filter podľa akcie
    if (showAkcia) {
      data = data.filter(s => !!s.akcna_cena);
    }
    // Multi-sort
    if (multiSort.length > 0) {
      data = data.sort((a, b) => {
        for (const key of multiSort) {
          if (key === 'price') {
            const diff = Number(a.akcna_cena || a.post_price) - Number(b.akcna_cena || b.post_price);
            if (diff !== 0) return diff;
          }
          if (key === 'duration') {
            const diff = Number(a.post_duration) - Number(b.post_duration);
            if (diff !== 0) return diff;
          }
          if (key === 'title') {
            const diff = a.post_title.localeCompare(b.post_title);
            if (diff !== 0) return diff;
          }
        }
        return 0;
      });
    } else if (sort) {
      data = data.sort((a, b) => {
        if (sort === 'price') return Number(a.akcna_cena || a.post_price) - Number(b.akcna_cena || b.post_price);
        if (sort === 'duration') return Number(a.post_duration) - Number(b.post_duration);
        if (sort === 'title') return a.post_title.localeCompare(b.post_title);
        return 0;
      });
    }
    setFiltered(data);
  }, [search, category, subcategory, sort, services, priceRange, durationRange, showAkcia, multiSort]);

  const categories = unique(services.map(s => s.post_category));
  const subcategories = unique(services.filter(s => s.post_category === category).map(s => s.subcategory_title));

  if (isLoading) return <div>{t('loading', 'Načítavam cenník...')}</div>;
  if (error) {
    toast.error(t('error', 'Chyba') + ': ' + error.message);
    return <div>{t('error', 'Chyba')}: {error.message}</div>;
  }

  // SEO meta tagy a JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Cenník služieb",
    "provider": {
      "@type": "Organization",
      "name": "PAPI Hair DESIGN Studio"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Služby",
      "itemListElement": filtered.map(s => ({
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": s.post_title,
          "description": s.post_desc,
        },
        "price": s.akcna_cena || s.post_price,
        "priceCurrency": "EUR"
      }))
    }
  };

  // Export do PDF – pokročilý layout
  const handleExportPDF = () => {
    try {
      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text('Cenník služieb', 10, 10);
      doc.setFontSize(10);
      // Tabuľka hlavička
      doc.text('Názov', 10, 20);
      doc.text('Kategória', 60, 20);
      doc.text('Podkategória', 100, 20);
      doc.text('Cena', 140, 20);
      doc.text('Trvanie', 160, 20);
      let y = 28;
      filtered.forEach((s, i) => {
        doc.text(s.post_title, 10, y);
        doc.text(s.post_category, 60, y);
        doc.text(s.subcategory_title, 100, y);
        doc.text(`${s.akcna_cena || s.post_price} €`, 140, y);
        doc.text(`${s.post_duration} min`, 160, y);
        y += 8;
      });
      doc.save('cennik.pdf');
      toast.success('PDF export bol úspešný!');
    } catch (err) {
      toast.error('Chyba pri exporte do PDF!');
    }
  };

  // Export detailu služby do PDF
  const handleExportDetailPDF = (service: any) => {
    try {
      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text(service.post_title, 10, 10);
      doc.setFontSize(12);
      doc.text(`Kategória: ${service.post_category}`, 10, 20);
      doc.text(`Podkategória: ${service.subcategory_title}`, 10, 28);
      doc.text(`Cena: ${service.akcna_cena || service.post_price} €`, 10, 36);
      doc.text(`Trvanie: ${service.post_duration} min`, 10, 44);
      doc.text(`Dostupnosť: ${service.availability === 'https://schema.org/InStock' ? 'Dostupné' : 'Nedostupné'}`, 10, 52);
      if (service.post_desc) doc.text(service.post_desc, 10, 60);
      // Obrázok (ak je k dispozícii)
      if (service.image_url) {
        doc.text('Obrázok:', 10, 68);
        doc.text(service.image_url, 10, 76);
      }
      // Recenzie
      if (service.reviews && service.reviews.length > 0) {
        doc.text('Recenzie:', 10, 84);
        let y = 92;
        service.reviews.forEach((r: {author: string; rating: number; text: string; date?: string}, idx: number) => {
          doc.text(`${r.author}: ${r.text} ${'★'.repeat(r.rating)}${r.date ? ' (' + r.date + ')' : ''}`, 12, y);
          y += 8;
        });
      }
      doc.save(`${service.post_title}.pdf`);
      toast.success('PDF detail služby bol exportovaný!');
    } catch (err) {
      toast.error('Chyba pri exporte detailu do PDF!');
    }
  };

  return (
    <>
      <div className="max-w-6xl mx-auto p-4">
  <h1 className="text-3xl font-bold mb-4">{t('priceListTitle', 'Cenník služieb')}</h1>
        <div className="flex flex-wrap gap-4 mb-6">
          <input
            type="text"
            placeholder={t('searchPlaceholder', 'Vyhľadať službu...')}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border rounded px-3 py-2"
            aria-label={t('searchAria', 'Vyhľadávanie')}
          />
          <select value={category} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCategory(e.target.value)} className="border rounded px-3 py-2" aria-label={t('categoryAria', 'Kategória')}>
            <option value="">{t('allCategories', 'Všetky kategórie')}</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={subcategory} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSubcategory(e.target.value)} className="border rounded px-3 py-2" aria-label={t('subcategoryAria', 'Podkategória')}>
            <option value="">{t('allSubcategories', 'Všetky podkategórie')}</option>
            {subcategories.map(sc => <option key={sc} value={sc}>{sc}</option>)}
          </select>
          <select value={sort} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSort(e.target.value)} className="border rounded px-3 py-2" aria-label={t('sortAria', 'Triedenie')}>
            <option value="">{t('noSort', 'Netriediť')}</option>
            <option value="price">{t('sortPrice', 'Cena')}</option>
            <option value="duration">{t('sortDuration', 'Trvanie')}</option>
            <option value="title">{t('sortTitle', 'Názov služby')}</option>
          </select>
          {/* Rozšírené filtre */}
          <div className="flex flex-col gap-2 min-w-[200px]">
            <label className="text-sm">{t('priceRange', 'Rozsah ceny (€)')}</label>
            <Slider
              range
              min={0}
              max={200}
              defaultValue={[0, 200]}
              value={priceRange}
              onChange={v => setPriceRange(v as [number, number])}
              marks={{0:'0',50:'50',100:'100',150:'150',200:'200'}}
            />
            <div className="text-xs">{priceRange[0]} € - {priceRange[1]} €</div>
          </div>
          <div className="flex flex-col gap-2 min-w-[200px]">
            <label className="text-sm">{t('durationRange', 'Rozsah trvania (min)')}</label>
            <Slider
              range
              min={0}
              max={240}
              defaultValue={[0, 240]}
              value={durationRange}
              onChange={v => setDurationRange(v as [number, number])}
              marks={{0:'0',60:'60',120:'120',180:'180',240:'240'}}
            />
            <div className="text-xs">{durationRange[0]} - {durationRange[1]} min</div>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" checked={showAkcia} onChange={e => setShowAkcia(e.target.checked)} id="akcia-filter" />
            <label htmlFor="akcia-filter" className="text-sm">{t('showAkcia', 'Len akčné ceny')}</label>
          </div>
          <div className="flex flex-col gap-2 min-w-[200px]">
            <label className="text-sm">{t('multiSort', 'Triedenie podľa viacerých stĺpcov')}</label>
            <select
              multiple
              value={multiSort}
              onChange={e => setMultiSort(Array.from(e.target.selectedOptions, o => o.value))}
              className="border rounded px-3 py-2"
              title={t('multiSortTitle', 'Vyberte stĺpce na triedenie (Ctrl/Command pre viac)')}
              aria-label={t('multiSortAria', 'Triedenie podľa viacerých stĺpcov')}
            >
              <option value="price">{t('sortPrice', 'Cena')}</option>
              <option value="duration">{t('sortDuration', 'Trvanie')}</option>
              <option value="title">{t('sortTitle', 'Názov služby')}</option>
            </select>
            <div className="text-xs">{multiSort.length ? multiSort.join(', ') : t('noSort', 'Netriediť')}</div>
          </div>
          {/* Exporty a admin link */}
          <CSVLink data={filtered} filename="cennik.csv" className="border rounded px-3 py-2 bg-primary text-white">{t('exportCSV', 'Export CSV')}</CSVLink>
          <button onClick={handleExportPDF} className="border rounded px-3 py-2 bg-primary text-white">{t('exportPDF', 'Export PDF')}</button>
          <a href={adminUrl} target="_blank" rel="noopener noreferrer" className="border rounded px-3 py-2 bg-secondary text-white">{t('admin', 'Administrácia')}</a>
        </div>
      <div className="overflow-x-auto">
          <table className="min-w-full border rounded" role="table" aria-label="Tabuľka cenníka služieb">
          <thead>
            <tr>
              <th className="p-2">{t('serviceName', 'Názov služby')}</th>
              <th className="p-2">{t('category', 'Kategória')}</th>
              <th className="p-2">{t('subcategory', 'Podkategória')}</th>
              <th className="p-2">{t('price', 'Cena')}</th>
              <th className="p-2">{t('duration', 'Trvanie (min)')}</th>
              <th className="p-2">{t('action', 'Akcia')}</th>
              <th className="p-2">{t('reservation', 'Rezervácia')}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(service => (
              <tr
                key={service._ID}
                className="hover:bg-gray-100 cursor-pointer"
                onClick={() => setShowDetail(service)}
                aria-label={`Detail služby ${service.post_title}`}
                tabIndex={0}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') setShowDetail(service);
                }}
              >
                <td className="p-2">{service.post_title}</td>
                <td className="p-2">{service.post_category}</td>
                <td className="p-2">{service.subcategory_title}</td>
                <td className="p-2">{service.akcna_cena ? <span className="text-red-600 font-bold">{service.akcna_cena} €</span> : `${service.post_price} €`}</td>
                <td className="p-2">{service.post_duration}</td>
                <td className="p-2">{service.akcna_cena ? <span className="bg-red-100 text-red-700 px-2 py-1 rounded">{t('action', 'Akcia')}</span> : null}</td>
                <td className="p-2">
                  <a
                    href={bookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-primary text-white px-3 py-1 rounded"
                    onClick={e => {
                      e.preventDefault();
                      const w = window as any;
                      if (w.lastReservation && Date.now() - w.lastReservation < 10000) {
                        toast.error(t('rateLimit', 'Rezervovať môžete len raz za 10 sekúnd.'));
                        return;
                      }
                      w.lastReservation = Date.now();
                      window.open(bookingUrl, '_blank');
                      toast.success(t('reservationSuccess', 'Rezervácia bola úspešná!'));
                    }}
                  >
                    {t('reserve', 'Rezervovať')}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showDetail && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          role="dialog"
          aria-modal="true"
          aria-label={`Detail služby ${showDetail.post_title}`}
          tabIndex={-1}
          onKeyDown={e => {
            if (e.key === 'Escape') setShowDetail(null);
          }}
        >
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full relative" role="document">
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
