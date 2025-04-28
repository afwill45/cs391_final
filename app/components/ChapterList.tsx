'use client'

import Link from 'next/link'

interface ChapterData {
  id: string
  attributes: {
    chapter: string | null
    title: string
    publishAt: string
  }
}

interface ChapterListProps {
  mangaId: string
  title: string
  coverFilename: string
  chapters: ChapterData[]
}

export default function ChapterList({
  mangaId,
  title,
  coverFilename,
  chapters,
}: ChapterListProps) {
  const handleClick = (chapId: string, chapNum: string) => {
    const stored = localStorage.getItem('currentlyReading')
    const list = stored ? JSON.parse(stored) as any[] : []
    const idx = list.findIndex((e) => e.id === mangaId)
    const entry = {
      id: mangaId,
      title,
      coverFilename,
      lastChapter: chapNum,
    }
    if (idx > -1) list[idx] = entry
    else list.push(entry)
    localStorage.setItem('currentlyReading', JSON.stringify(list))
  }

  return (
    <ul className="divide-y">
      {chapters.map((chap) => {
        const chapNum = chap.attributes.chapter ?? 'Oneshot'
        return (
          <li
            key={chap.id}
            className="py-2 flex justify-between items-center"
          >
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
            <time className="text-sm text-gray-500">
              {new Date(chap.attributes.publishAt).toLocaleDateString()}
            </time>
          </li>
        )
      })}
    </ul>
  )
}
