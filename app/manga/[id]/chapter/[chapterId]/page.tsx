// app/manga/[id]/chapter/[chapterId]/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import axios from 'axios'

interface AtHomeResponse {
  baseUrl: string
  chapter: {
    hash: string
    data: string[]       // high-res pages
    dataSaver: string[]  // low-res pages
  }
}

export default function ChapterPage() {
  const { id: mangaId, chapterId } = useParams() as { id: string; chapterId: string }
  const [host, setHost]         = useState<string>()
  const [hash, setHash]         = useState<string>()
  const [pages, setPages]       = useState<string[]>([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState<string>()

  useEffect(() => {
    if (!chapterId) return

    ;(async () => {
      setLoading(true)
      try {
        const resp = await axios.get<AtHomeResponse>(
          `https://api.mangadex.org/at-home/server/${chapterId}`
        )
        setHost(resp.data.baseUrl)
        setHash(resp.data.chapter.hash)
        // choose dataSaver for low-res if you like:
        setPages(resp.data.chapter.data)
      } catch (err: any) {
        console.error(err)
        setError('Could not load chapter pages.')
      } finally {
        setLoading(false)
      }
    })()
  }, [chapterId])

  if (loading) return <p>Loading pages…</p>
  if (error)   return <p className="text-red-500">{error}</p>

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      {pages.map((filename, idx) => {
        const url = `${host}/data/${hash}/${filename}`
        return (
          <img
            key={idx}
            src={url}
            alt={`Page ${idx + 1}`}
            className="max-w-full"
          />
        )
      })}
    </div>
  )
}
