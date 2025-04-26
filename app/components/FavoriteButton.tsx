"use client";

import { useState, useEffect } from "react";

interface Manga {
  id: string;
  attributes: {
    title: { [key: string]: string | undefined };
  };
  relationships: {
    id: string;
    type: string;
    attributes: {
      fileName: string;
    };
  }[];
}

export default function FavoriteButton({ manga }: { manga: Manga }) {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("favorites");
    if (stored) {
      const favorites = JSON.parse(stored) as StoredManga[];
      const exists = favorites.some((fav) => fav.id === manga.id);
      setIsFavorite(exists);
    }
  }, [manga.id]);

  const toggleFavorite = () => {
    const stored = localStorage.getItem("favorites");
    let favorites: StoredManga[] = stored ? JSON.parse(stored) : [];

    if (isFavorite) {
      favorites = favorites.filter((fav) => fav.id !== manga.id);
      setIsFavorite(false);
    } else {
      const coverRel = manga.relationships.find((rel) => rel.type === "cover_art");
      favorites.push({
        id: manga.id,
        title: manga.attributes.title.en || Object.values(manga.attributes.title)[0] || "No Title",
        coverFilename: coverRel?.attributes.fileName || "",
      });
      setIsFavorite(true);
    }

    localStorage.setItem("favorites", JSON.stringify(favorites));
  };

  return (
    <button
      onClick={toggleFavorite}
      className="text-2xl hover:scale-110 transition-transform"
      aria-label={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
    >
      {isFavorite ? "💔" : "❤️"}
    </button>
  );
}

// LocalStorage Stored Type
interface StoredManga {
  id: string;
  title: string;
  coverFilename: string;
}
