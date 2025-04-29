'use client'

// Module: SearchForm Component
// Author: Afolabi Williams (Frontend Team)
// Description: Provides a search interface to query manga titles and display results using MangaCard components.
// Responsible: Frontend Team

import React, { useState, FormEvent, JSX } from 'react'
import MangaCard from './MangaCard'

/**
 * Interface: Manga
 * Defines the structure of manga data returned from the API.
 * Responsible: Frontend Team (Type definitions).
 */
interface Manga {
  id: string
  attributes: {
    title: {
      [key: string]: string | undefined
    }
  }
  relationships: {
    id: string
    type: string
    attributes: {
      fileName: string
    }
  }[]
}

/**
 * SearchForm Component
 * Renders a search input and displays a grid of manga results.
 * Handles API fetch logic and error states.
 * Responsible: Frontend Team
 */
export default function SearchForm(): JSX.Element {
  // State: query
  // Holds the current search query string entered by the user.
  // Responsible: Frontend Team (State management).
  const [query, setQuery] = useState<string>('')

  // State: mangaList
  // Stores the list of manga results fetched from the API.
  // Responsible: Frontend Team (State management).
  const [mangaList, setMangaList] = useState<Manga[]>([])

  // State: error
  // Tracks any error message to display to the user.
  // Responsible: Frontend Team (Error handling).
  const [error, setError] = useState<string | null>(null)

  /**
   * handleSearch
   * Performs the API call to fetch manga data based on the query.
   * - Prevents default form submission behavior
   * - Clears existing errors
   * - Encodes query and fetches from /api/manga
   * - Updates mangaList state or sets error accordingly
   * Responsible: Frontend Team (Fetch logic & error handling).
   */
  const handleSearch = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    setError(null)

    try {
      // Fetch manga data from backend API
      const res = await fetch(`/api/manga?query=${encodeURIComponent(query)}`)
      if (!res.ok) {
        // API error: throw to be caught below
        throw new Error('Error fetching manga data')
      }

      // Parse JSON response and update state
      const data = (await res.json()) as { data?: Manga[] }
      setMangaList(data.data ?? [])
    } catch (err: unknown) {
      // Set error message based on exception type
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('An unknown error occurred')
      }
    }
  }

  // Render search form and results
  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Search form: input and submit button */}
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

      {/* Display error message if one exists */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Manga results grid: maps over mangaList to render MangaCard components */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {mangaList.map(manga => (
          <MangaCard key={manga.id} manga={manga} />
        ))}
      </div>
    </div>
  )
}
