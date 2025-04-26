"use client";

import Link from "next/link";

/**
 sample for now
 */

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Welcome to Manga Explorer!</h1>
      
      <div className="space-y-4">
        <Link href="/favorites" className="text-blue-600 hover:underline text-lg">
          View Your Favorites
        </Link>
        
        <Link href="/search" className="text-blue-600 hover:underline text-lg">
          Search for Manga
        </Link>
      </div>
    </div>
  );
}
