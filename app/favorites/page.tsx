"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface StoredManga {
  id: string;
  title: string;
  coverFilename: string;
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<StoredManga[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("favorites");
    if (stored) {
      setFavorites(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  const handleRemove = (id: string) => {
    const updatedFavorites = favorites.filter((fav) => fav.id !== id);
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg text-gray-400">Loading your favorites...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Favorite Mangas</h1>
        <Link href="/" className="text-blue-400 hover:underline text-sm">
          ← Go Home
        </Link>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center text-gray-400 space-y-4">
          <p>You haven't added any favorites yet.</p>
          <Link href="/" className="text-blue-500 hover:underline">
            Continue Searching
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {favorites.map((manga) => (
            <div key={manga.id} className="border rounded-lg p-4 flex flex-col items-center shadow hover:shadow-lg transition">
              <Link href={`/manga/${manga.id}`} className="block hover:scale-105 transition-transform">
                {manga.coverFilename ? (
                  <img
                    src={`https://uploads.mangadex.org/covers/${manga.id}/${manga.coverFilename}.256.jpg`}
                    alt={`${manga.title} Cover`}
                    className="w-32 h-48 object-cover rounded mb-2"
                  />
                ) : (
                  <div className="w-32 h-48 flex items-center justify-center bg-gray-200 text-gray-500 rounded mb-2">
                    No Image
                  </div>
                )}
                <h2 className="text-sm font-semibold text-center">{manga.title}</h2>
              </Link>
              <button
                onClick={() => handleRemove(manga.id)}
                className="mt-2 text-red-500 hover:underline text-sm"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
