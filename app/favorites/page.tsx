// FavoritesPage.tsx
// Author: [Chiron]
// Purpose: Displays a page where users can view and manage their favorited manga titles stored in localStorage.
// Built by: [Chiron]

"use client"; // Mark this as a Client Component because it uses localStorage and hooks

import { useEffect, useState } from "react";
import Link from "next/link";

// Type definition for how manga favorites are stored in localStorage
interface StoredManga {
  id: string;
  title: string;
  coverFilename: string;
}

export default function FavoritesPage() {
  // Local state to store list of favorited mangas
  const [favorites, setFavorites] = useState<StoredManga[]>([]);
  // State to manage loading state during initial render
  const [loading, setLoading] = useState(true);

  // Load favorites from localStorage when component mounts
  useEffect(() => {
    const stored = localStorage.getItem("favorites");
    if (stored) {
      setFavorites(JSON.parse(stored));
    }
    setLoading(false); // Done loading after checking storage
  }, []);

  // Handle removal of a manga from favorites
  const handleRemove = (id: string) => {
    const updatedFavorites = favorites.filter((fav) => fav.id !== id);
    setFavorites(updatedFavorites); // Update local state
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites)); // Persist updated list
  };

  // If loading, show a loading screen
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg text-gray-400">Loading your favorites...</p>
      </div>
    );
  }

  // Render the page content
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Favorite Mangas</h1>
      </div>

      {/* If there are no favorites */}
      {favorites.length === 0 ? (
        <div className="text-center text-gray-400 space-y-4">
          <p>You haven't added any favorites yet.</p>
          <Link href="/" className="text-blue-500 hover:underline">
            Continue Searching
          </Link>
        </div>
      ) : (
        // If there are favorites, show them in a responsive grid
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {favorites.map((manga) => (
            <div
              key={manga.id}
              className="border rounded-lg p-4 flex flex-col items-center shadow hover:shadow-lg transition"
            >
              {/* Link to manga detail page */}
              <Link
                href={`/manga/${manga.id}`}
                className="block hover:scale-105 transition-transform"
              >
                {/* Manga cover image */}
                {manga.coverFilename ? (
                  <img
                    src={`https://uploads.mangadex.org/covers/${manga.id}/${manga.coverFilename}.256.jpg`}
                    alt={`${manga.title} Cover`}
                    className="w-32 h-48 object-cover rounded mb-2"
                  />
                ) : (
                  // If no cover available
                  <div className="w-32 h-48 flex items-center justify-center bg-gray-200 text-gray-500 rounded mb-2">
                    No Image
                  </div>
                )}
                {/* Manga title */}
                <h2 className="text-sm font-semibold text-center">{manga.title}</h2>
              </Link>

              {/* Remove from favorites button */}
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
3