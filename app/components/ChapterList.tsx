'use client'

// Module: ChapterList Component
// Author: Afolabi Williams (Frontend Team)
// Description: Displays a list of chapters for a manga and updates the 'currentlyReading' localStorage entry when a chapter is clicked.
// Responsible: Frontend Team

import Link from 'next/link'

/**
 * Interface representing the shape of each chapter's data.
 * Responsible: Frontend Team (Type definitions).
 */
interface ChapterData {
  id: string
  attributes: {
    chapter: string | null
    title: string
    publishAt: string
  }
}

/**
 * Props for the ChapterList component.
 * Responsible: Frontend Team (Type definitions).
 */
interface ChapterListProps {
  mangaId: string
  title: string
  coverFilename: string
  chapters: ChapterData[]
}

/**
 * ChapterList Component
 *
 * Renders a list of manga chapters and handles updating the 'currentlyReading'
 * list in localStorage when a chapter link is clicked.
 *
 * Responsible: Frontend Team
 * Logic: onClick of a chapter link, update localStorage entry or add new one.
 */
export default function ChapterList({
  mangaId,
  title,
  coverFilename,
  chapters,
}: ChapterListProps) {
  /**
   * handleClick
   *
   * Updates the 'currentlyReading' entry in localStorage with the selected manga and chapter.
   * If the manga already exists in the list, update the entry; otherwise, append a new entry.
   *
   * @param chapId - The unique ID of the clicked chapter.
   * @param chapNum - The chapter number or 'Oneshot' if null.
   * Responsible: Frontend Team (Event handling logic).
   */
  const handleClick = (chapId: string, chapNum: string) => {
    // Retrieve existing 'currentlyReading' list from localStorage, or initialize to empty array.
    const stored = localStorage.getItem('currentlyReading')
    const list = stored ? (JSON.parse(stored) as any[]) : []

    // Find if this manga is already in the currentlyReading list.
    const idx = list.findIndex((e) => e.id === mangaId)

    // Construct the new or updated entry for this manga.
    const entry = {
      id: mangaId,
      title,
      coverFilename,
      lastChapter: chapNum,
    }

    // If the manga exists, replace the entry; otherwise, append it.
    if (idx > -1) {
      list[idx] = entry
    } else {
      list.push(entry)
    }

    // Persist the updated list back to localStorage.
    localStorage.setItem('currentlyReading', JSON.stringify(list))
  }

  // Render the list of chapters.
  return (
    <ul className="divide-y">
      {chapters.map((chap) => {
        const chapNum = chap.attributes.chapter ?? 'Oneshot'
        return (
          <li
            key={chap.id}
            className="py-2 flex justify-between items-center"
          >
            {/* Clicking this link will navigate and update localStorage */}
            <Link
              href={`/manga/${mangaId}/chapter/${chap.id}`}
              className="text-blue-600 hover:underline"
              onClick={() => handleClick(chap.id, chapNum)}
            >
              {chap.attributes.chapter
                ? `Ch. ${chap.attributes.chapter}`
                : 'Oneshot'}
              {chap.attributes.title
                ? ` — ${chap.attributes.title}`
                : ''}
            </Link>
            {/* Display the publish date in user's locale */}
            <time className="text-sm text-gray-500">
              {new Date(chap.attributes.publishAt).toLocaleDateString()}
            </time>
          </li>
        )
      })}
    </ul>
  )
}
