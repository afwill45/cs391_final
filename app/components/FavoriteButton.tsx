// FavoriteButton.tsx
// Author: [Chiron]
// Purpose: Allows users to "heart ❤️" a manga and save it to their favorites (stored in localStorage).
// Component: standalone React component, client-side logic, TailwindCSS styling used for button.
// Built by: [Chiron]

"use client"; // This marks the file as a Client Component (since localStorage and event handlers are used)

import { useState, useEffect } from "react";

// Type definition for the manga object passed as props
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

// Type definition for how manga is stored in localStorage
interface StoredManga {
  id: string;
  title: string;
  coverFilename: string;
}

// FavoriteButton component
export default function FavoriteButton({ manga }: { manga: Manga }) {
  // Local state to track if the current manga is already favorited
  const [isFavorite, setIsFavorite] = useState(false);

  // On initial render, check if the manga is already in the list of favorites
  useEffect(() => {
    const stored = localStorage.getItem("favorites");
    if (stored) {
      const favorites = JSON.parse(stored) as StoredManga[];
      const exists = favorites.some((fav) => fav.id === manga.id);
      setIsFavorite(exists); // Set state based on whether the manga already exists
    }
  }, [manga.id]);

  // Function to toggle a manga as favorite / unfavorite
  const toggleFavorite = () => {
    const stored = localStorage.getItem("favorites");
    let favorites: StoredManga[] = stored ? JSON.parse(stored) : [];

    if (isFavorite) {
      // If already a favorite, remove it
      favorites = favorites.filter((fav) => fav.id !== manga.id);
      setIsFavorite(false);
    } else {
      // If not yet a favorite, add it
      const coverRel = manga.relationships.find((rel) => rel.type === "cover_art");
      favorites.push({
        id: manga.id,
        title: manga.attributes.title.en || Object.values(manga.attributes.title)[0] || "No Title",
        coverFilename: coverRel?.attributes.fileName || "",
      });
      setIsFavorite(true);
    }

    // Save the updated favorites list back to localStorage
    localStorage.setItem("favorites", JSON.stringify(favorites));
  };

  // Button UI to toggle favorite
  return (
    <button
      onClick={toggleFavorite}
      className="text-2xl hover:scale-110 transition-transform" // TailwindCSS styling
      aria-label={isFavorite ? "Remove from Favorites" : "Add to Favorites"} // Accessibility label
    >
      {isFavorite ? "💔" : "❤️"} {/* Show a broken heart if unfavoriting, a full heart if favoriting */}
    </button>
  );
}


// LocalStorage Stored Type
interface StoredManga {
  id: string;
  title: string;
  coverFilename: string;
}
