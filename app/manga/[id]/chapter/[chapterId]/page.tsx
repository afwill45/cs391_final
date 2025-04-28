'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import axios from 'axios'

interface AtHomeResponse {
  baseUrl: string
  chapter: {
    hash: string
    data: string[]
    dataSaver: string[]
  }
}

interface ChapterEntry {
  id: string
  attributes: {
    chapter: string | null
    title: string
  }
}

interface FeedResponse {
  data: ChapterEntry[]
  total: number
  limit: number
  offset: number
}

export default function ChapterPage() {
  const { id: mangaId, chapterId } = useParams() as {
    id: string
    chapterId: string
  }

  const [host, setHost]               = useState<string>()
  const [hash, setHash]               = useState<string>()
  const [pages, setPages]             = useState<string[]>([])
  const [chaptersList, setChaptersList] = useState<ChapterEntry[]>([])
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState<string>()

  // 1) fetch pages…
  useEffect(() => {
    if (!chapterId) return
    ;(async () => {
      try {
        const { data } = await axios.get<AtHomeResponse>(
          `https://api.mangadex.org/at-home/server/${chapterId}`
        )
        setHost(data.baseUrl)
        setHash(data.chapter.hash)
        setPages(data.chapter.data)
      } catch (e) {
        console.error(e)
        setError('Could not load chapter pages.')
      } finally {
        setLoading(false)
      }
    })()
  }, [chapterId])

  // 2) fetch **all** chapters by paging via total/limit/offset
  useEffect(() => {
    if (!mangaId) return
    ;(async () => {
      try {
        const all: ChapterEntry[] = []
        // first request to get total + first batch
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
        all.push(...first.data.data)
        const { total, limit } = first.data

        // schedule remaining requests in series
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
          all.push(...resp.data.data)
        }

        setChaptersList(all)
      } catch (e) {
        console.error('Failed to load chapters list', e)
      }
    })()
  }, [mangaId])

  

  // determine prev/next
  const idx  = chaptersList.findIndex(c => c.id === chapterId)
  const prev = idx > 0              ? chaptersList[idx - 1] : null
  const next = idx >= 0 && idx < chaptersList.length - 1
    ? chaptersList[idx + 1]
    : null

  if (loading) return <p className="p-4">Loading…</p>
  if (error)   return <p className="p-4 text-red-500">{error}</p>

  return (
    <div className="relative">
      {/* transparent sticky nav */}
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

      {/* pages */}
      <div className="flex flex-col items-center gap-6 p-4">
        {host && hash && pages.map((fn, i) => (
          <img
            key={i}
            src={`${host}/data/${hash}/${fn}`}
            alt={`Page ${i + 1}`}
            className="max-w-full rounded-lg shadow-sm"
          />
        ))}
      </div>
    </div>
  )
  
}

