// src/components/SearchForm.tsx
'use client';

import React, { useState, FormEvent, JSX } from 'react';
import MangaCard from './MangaCard';

interface Manga {
  id: string;
  attributes: {
    title: {
      [key: string]: string | undefined;
    };
  };
  relationships: {
    id: string;
    type: string;
    attributes: {
      fileName: string;
    };
  }[];
}

export default function SearchForm(): JSX.Element {
  const [query, setQuery] = useState<string>('');
  const [mangaList, setMangaList] = useState<Manga[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetch(`/api/manga?query=${encodeURIComponent(query)}`);
      if (!res.ok) {
        throw new Error('Error fetching manga data');
      }
      const data = (await res.json()) as { data?: Manga[] };
      setMangaList(data.data ?? []);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Search for manga..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="flex-1 p-2 border rounded"
        />
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
          Search
        </button>
      </form>

      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {mangaList.map(manga => (
          <MangaCard key={String(manga.id)} manga={manga} />
        ))}
      </div>
    </div>
  );
}
