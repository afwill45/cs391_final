'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <section className="text-center py-16">
      <h1 className="text-5xl font-extrabold text-indigo-600 mb-4">
        Welcome to Manga Explorer
      </h1>
      <p className="text-lg text-gray-700 dark:text-gray-300 max-w-xl mx-auto mb-8">
        Dive into a world of manga—search titles, explore details, and save your favorites all in one place.
      </p>
      <div className="flex justify-center gap-6">
        <Link
          href="/search"
          className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg shadow hover:bg-indigo-500 transition"
        >
          Search Manga
        </Link>
        <Link
          href="/favorites"
          className="inline-block border-2 border-indigo-600 text-indigo-600 px-6 py-3 rounded-lg hover:bg-indigo-50 transition"
        >
          View Favorites
        </Link>
      </div>
    </section>
  );
}