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

      {/* 2) Your existing welcome section */}
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
