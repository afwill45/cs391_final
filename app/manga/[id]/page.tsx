// app/manga/[id]/page.tsx
import React from 'react'
import axios from 'axios'
import Link from 'next/link'
import { getAccessToken } from '@/lib/auth'
import MangaStatistics from '../../components/MangaStatistics'
import FavoriteButton from '../../components/FavoriteButton'

interface MangaDetailPageProps {
  params: Promise<{ id: string }>
}

interface MangaData {
  id: string
  attributes: {
    title: { [key: string]: string }
    description?: { [key: string]: string }
  }
  relationships: {
    id: string
    type: string
    attributes: { fileName: string }
  }[]
}

interface ChapterData {
  id: string
  attributes: {
    chapter: string | null
    title: string
    publishAt: string
    translatedLanguage: string
  }
}

interface PagedFeedResponse {
  data: ChapterData[]
  total: number
  limit: number
  offset: number
}

export default async function MangaDetail({ params }: MangaDetailPageProps) {
  const { id } = await params
  const baseUrl = 'https://api.mangadex.org'
  const accessToken = await getAccessToken()

  // 1) Fetch manga metadata (with cover art)
  const mangaResp = await axios.get<{ data: MangaData }>(
    `${baseUrl}/manga/${id}`,
    {
      params: { 'includes[]': ['cover_art'] },
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  )
  const manga = mangaResp.data.data
  const title =
    manga.attributes.title.en ?? Object.values(manga.attributes.title)[0]
  const description =
    manga.attributes.description?.en ?? 'No description available.'
  const coverRel = manga.relationships.find(r => r.type === 'cover_art')
  const coverUrl = coverRel
    ? `https://uploads.mangadex.org/covers/${id}/${coverRel.attributes.fileName}`
    : null

  // 2) Fetch statistics
  const statResp = await axios.get<{
    statistics: Record<string, { rating: { average: number | string; bayesian: number | string }; follows: number }>
  }>(`${baseUrl}/statistics/manga/${id}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  const stats = statResp.data.statistics[id]
  const rating = {
    average: +stats.rating.average || 0,
    bayesian: +stats.rating.bayesian || 0,
  }
  const follows = stats.follows

  // 3) Fetch full chapter list via pagination
  let allChapters: ChapterData[] = []
  let offset = 0
  const limit = 500

  while (true) {
    const resp = await axios.get<PagedFeedResponse>(
      `${baseUrl}/manga/${id}/feed`,
      {
        params: {
          'translatedLanguage[]': ['en'],
          'order[chapter]': 'asc',
          limit,
          offset,
        },
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    )
    allChapters.push(...resp.data.data)
    if (allChapters.length >= resp.data.total || resp.data.data.length === 0) {
      break
    }
    offset += resp.data.data.length
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{title}</h1>
      <FavoriteButton manga={manga} />
      {coverUrl && (
        <img
          src={coverUrl}
          alt={`${title} Cover`}
          className="mb-4 max-w-full h-auto rounded"
        />
      )}
      <p className="mb-6">{description}</p>
      <MangaStatistics rating={rating} follows={follows} />

      <section className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">All Chapters</h2>
        <ul className="divide-y">
          {allChapters.map(chap => (
            <li key={chap.id} className="py-2 flex justify-between">
              <Link
                href={`/manga/${id}/chapter/${chap.id}`}
                className="text-blue-600 hover:underline"
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
          ))}
        </ul>
      </section>
    </div>
  )
}
