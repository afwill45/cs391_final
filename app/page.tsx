'use client'

// Module: HomePage Component
// Author: Afolabi Williams (Frontend Team)
// Description: Renders the home page with optional "Currently Reading" section and the welcome call-to-action.
// Responsible: Frontend Team

import React, { useEffect, useState } from 'react'
import Link from 'next/link'

/**
 * Interface: CurrentlyReadingEntry
 * Defines the shape of each entry in the "currentlyReading" list stored in localStorage.
 * Responsible: Frontend Team (Type definitions).
 */
interface CurrentlyReadingEntry {
  id: string // Manga ID
  title: string // Manga title
  coverFilename: string // Filename for cover image
  lastChapter: string // Most recently read chapter number or "Oneshot"
}

/**
 * HomePage Component
 *
 * - Loads and displays the "currentlyReading" list from localStorage if present.
 * - Provides navigation to search and favorites pages.
 *
 * Responsible: Frontend Team
 */
export default function HomePage() {
  // State: currentlyReading
  // Holds the list of manga entries the user is actively reading.
  // Initialized to empty array until mounted.
  // Responsible: Frontend Team (State management).
  const [currentlyReading, setCurrentlyReading] = useState<CurrentlyReadingEntry[]>([])

  /**
   * useEffect: Load currentlyReading from localStorage on initial mount.
   * - Retrieves JSON string and attempts to parse it.
   * - Silently fails to empty array if parse error or missing.
   * Responsible: Frontend Team (Side effects).
   */
  useEffect(() => {
    try {
      const stored = localStorage.getItem('currentlyReading')
      if (stored) {
        setCurrentlyReading(JSON.parse(stored) as CurrentlyReadingEntry[])
      }
    } catch (error) {
      console.error('Error parsing currentlyReading from localStorage:', error)
      // Fallback: leave currentlyReading as empty array
    }
  }, [])

  return (
    <>
      {/* Currently Reading Section: only render if there are entries */}
      {currentlyReading.length > 0 && (
        <section className="px-4 py-8 bg-gray-50">
          {/* Section Header */}
          <h2 className="text-2xl font-semibold mb-4">Currently Reading</h2>
          {/* Grid of entries */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {currentlyReading.map((entry) => (
              <Link
                key={entry.id}
                href={`/manga/${entry.id}`}
                className="group block">
                {/* Cover Thumbnail */}
                <img
                  src={`/covers/${entry.coverFilename}`}
                  alt={`Cover of ${entry.title}`}
                  className="w-full h-40 object-cover rounded-lg shadow-sm group-hover:opacity-90 transition"
                />
                {/* Title and Last Chapter */}
                <div className="mt-2">
                  <p className="font-medium truncate">{entry.title}</p>
                  <p className="text-sm text-gray-600">Last: {entry.lastChapter}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Welcome Section: existing content unchanged */}
      <section className="text-center py-16">
        <h1 className="text-5xl font-extrabold text-indigo-600 mb-4">
          Welcome to Manga Explorer
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 max-w-xl mx-auto mb-8">
          Dive into a world of manga—search titles, explore details, and save your
          favorites all in one place.
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
    </>
  )
}
