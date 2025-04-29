'use client'

// Module: ChapterPage Component
// Author: Afolabi Williams (Frontend Team)
// Description: Displays individual manga chapter pages with navigation to previous/next chapters.
// Responsible: Frontend Team

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import axios from 'axios'

/**
 * Interface: AtHomeResponse
 * Represents the response shape from the /at-home/server endpoint.
 * Responsible: Frontend Team (Type definitions).
 */
interface AtHomeResponse {
  baseUrl: string
  chapter: {
    hash: string
    data: string[]       // Full-resolution image filenames
    dataSaver: string[]  // Low-resolution filenames (unused)
  }
}

/**
 * Interface: ChapterEntry
 * Defines each chapter's metadata in the feed listing.
 * Responsible: Frontend Team (Type definitions).
 */
interface ChapterEntry {
  id: string
  attributes: {
    chapter: string | null
    title: string       // Chapter title, may be unused in nav
  }
}

/**
 * Interface: FeedResponse
 * Represents paginated feed response shape from the /manga/:id/feed endpoint.
 * Responsible: Frontend Team (Type definitions).
 */
interface FeedResponse {
  data: ChapterEntry[]  // Array of chapters
  total: number         // Total chapters available
  limit: number         // Limit per request
  offset: number        // Offset of current batch
}

/**
 * ChapterPage Component
 *
 * - Fetches and displays all page images for a given chapter.
 * - Fetches the full list of chapters to enable prev/next navigation.
 * - Renders a sticky nav bar with links to previous and next chapters if available.
 *
 * Responsible: Frontend Team
 */
export default function ChapterPage() {
  // Extract mangaId and chapterId from the URL
  const { id: mangaId, chapterId } = useParams() as {
    id: string
    chapterId: string
  }

  // State: host URL for image server
  const [host, setHost] = useState<string>()
  // State: hash used in image URLs
  const [hash, setHash] = useState<string>()
  // State: list of image filenames for the chapter
  const [pages, setPages] = useState<string[]>([])
  // State: list of all chapter entries for navigation
  const [chaptersList, setChaptersList] = useState<ChapterEntry[]>([])
  // State: loading indicator for initial chapter fetch
  const [loading, setLoading] = useState(true)
  // State: error message if fetch fails
  const [error, setError] = useState<string>()

  /**
   * useEffect: Fetch chapter image data
   * - Calls Mangadex 'at-home' API to retrieve server host, hash, and page list
   * - Updates state accordingly and toggles loading/error states
   * Responsible: Frontend Team (Data fetching).
   */
  useEffect(() => {
    if (!chapterId) return
    ;(async () => {
      try {
        const response = await axios.get<AtHomeResponse>(
          `https://api.mangadex.org/at-home/server/${chapterId}`
        )
        const { baseUrl, chapter } = response.data
        setHost(baseUrl)
        setHash(chapter.hash)
        setPages(chapter.data)
      } catch (e) {
        console.error(e)
        setError('Could not load chapter pages.')
      } finally {
        setLoading(false)
      }
    })()
  }, [chapterId])

  /**
   * useEffect: Fetch full chapters list for nav
   * - Paginates through the feed endpoint to retrieve all chapters
   * - Aggregates into chaptersList state
   * Responsible: Frontend Team (Data fetching).
   */
  useEffect(() => {
    if (!mangaId) return
    ;(async () => {
      try {
        const allChapters: ChapterEntry[] = []
        // Initial request to get total and first batch
        const first = await axios.get<FeedResponse>(
          `https://api.mangadex.org/manga/${mangaId}/feed`,
          {
            params: {
              'translatedLanguage[]': ['en'],
              'order[chapter]': 'asc',
              limit: 100,
              offset: 0,
            },
          }
        )
        allChapters.push(...first.data.data)
        const { total, limit } = first.data

        // Request remaining pages in series based on total
        for (let offset = limit; offset < total; offset += limit) {
          const resp = await axios.get<FeedResponse>(
            `https://api.mangadex.org/manga/${mangaId}/feed`,
            {
              params: {
                'translatedLanguage[]': ['en'],
                'order[chapter]': 'asc',
                limit,
                offset,
              },
            }
          )
          allChapters.push(...resp.data.data)
        }

        setChaptersList(allChapters)
      } catch (e) {
        console.error('Failed to load chapters list', e)
      }
    })()
  }, [mangaId])

  // Determine index of current chapter in chaptersList
  const idx = chaptersList.findIndex(c => c.id === chapterId)
  // Identify previous entry if exists
  const prev = idx > 0 ? chaptersList[idx - 1] : null
  // Identify next entry if exists
  const next = idx >= 0 && idx < chaptersList.length - 1
    ? chaptersList[idx + 1]
    : null

  // Render loading, error, or chapter pages
  if (loading) return <p className="p-4">Loading…</p>
  if (error) return <p className="p-4 text-red-500">{error}</p>

  return (
    <div className="relative">
      {/* Sticky navigation bar for previous/next chapters */}
      <div className="sticky top-0 z-10 flex justify-between items-center bg-transparent backdrop-blur-md px-6 py-3">
        {prev ? (
          <Link
            href={`/manga/${mangaId}/chapter/${prev.id}`}
            className="inline-block px-4 py-1 text-sm font-semibold rounded-full shadow-md bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            ← {prev.attributes.chapter ?? 'Oneshot'}
          </Link>
        ) : <div />}

        {next ? (
          <Link
            href={`/manga/${mangaId}/chapter/${next.id}`}
            className="inline-block px-4 py-1 text-sm font-semibold rounded-full shadow-md bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {next.attributes.chapter ?? 'Oneshot'} →
          </Link>
        ) : <div />}
      </div>

      {/* Chapter page images */}
      <div className="flex flex-col items-center gap-6 p-4">
        {/* Map over pages array and render each image */}
        {host && hash && pages.map((filename, index) => (
          <img
            key={index}
            src={`${host}/data/${hash}/${filename}`}
            alt={`Page ${index + 1}`}
            className="max-w-full rounded-lg shadow-sm"
          />
        ))}
      </div>
    </div>
  )
}
