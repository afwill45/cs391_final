import axios from 'axios';
import { getAccessToken } from '../../../lib/auth';
import MangaStatistics from '../../components/MangaStatistics';
import FavoriteButton from '../../components/FavoriteButton';
import Link from 'next/link';

interface MangaDetailPageProps {
  params: { id: string };
}

interface MangaData {
  id: string;
  attributes: {
    title: { [key: string]: string };
    description?: { [key: string]: string };
  };
  relationships: {
    id: string;
    type: string;
    attributes: { fileName: string };
  }[];
}

interface ChapterData {
  id: string;
  attributes: {
    title: string;
    chapter: string | null;
    translatedLanguage: string;
    publishAt: string;
  };
}

export default async function MangaDetail({ params: { id } }: MangaDetailPageProps) {
  const baseUrl = 'https://api.mangadex.org';
  try {
    const accessToken = await getAccessToken();

    // 1) Fetch manga metadata & cover
    const mangaResp = await axios.get<{ data: MangaData }>(
      `${baseUrl}/manga/${id}`,
      {
        params: { 'includes[]': ['cover_art'] },
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    const manga = mangaResp.data.data;
    const title = manga.attributes.title.en ?? Object.values(manga.attributes.title)[0];
    const description = manga.attributes.description?.en ?? 'No description available.';
    const coverRel = manga.relationships.find(rel => rel.type === 'cover_art');
    const coverUrl = coverRel
      ? `https://uploads.mangadex.org/covers/${id}/${coverRel.attributes.fileName}`
      : null;

    // 2) Fetch statistics
    const statResp = await axios.get<{
      statistics: Record<string, { rating: { average: number | string; bayesian: number | string }; follows: number }>
    }>(`${baseUrl}/statistics/manga/${id}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const stats = statResp.data.statistics[id];
    const rating = {
      average: +stats.rating.average || 0,
      bayesian: +stats.rating.bayesian || 0,
    };
    const follows = stats.follows;

    // 3) Fetch chapter feed
    const feedResp = await axios.get<{ data: ChapterData[] }>(
      `${baseUrl}/manga/${id}/feed`,
      {
        params: {
          'translatedLanguage[]': ['en'],
          'order[chapter]': 'asc',  // ← sort by chapter number
        },
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    const chapters = feedResp.data.data;
    // 4) Render everything
    return (
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">{title}</h1>
        <FavoriteButton manga={manga} />
        {coverUrl && <img src={coverUrl} alt={`${title} Cover`} className="mb-4 rounded" />}
        <p className="mb-6">{description}</p>
        <MangaStatistics rating={rating} follows={follows} />

        <section className="mt-8">
          <h2 className="text-2xl font-semibold mb-2">Chapters</h2>
          {chapters.length ? (
            <ul className="divide-y">
              {chapters.map(chap => (
 <li key={chap.id} className="py-2 flex justify-between">
 <Link
   href={`/manga/${id}/chapter/${chap.id}`}
   className="text-blue-600 hover:underline"
 >
   {chap.attributes.chapter
     ? `Ch. ${chap.attributes.chapter}`
     : 'Oneshot'}
   {chap.attributes.title ? ` — ${chap.attributes.title}` : ''}
 </Link>
 <time className="text-sm text-gray-500">
   {new Date(chap.attributes.publishAt).toLocaleDateString()}
 </time>
</li>

              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No chapters found.</p>
          )}
        </section>
      </div>
    );
  } catch (err: any) {
    console.error('Error fetching manga or chapters:', err.response?.data || err);
    return (
      <div className="max-w-4xl mx-auto p-4">
        <p className="text-red-500">Error: Couldn’t load manga details or chapters.</p>
      </div>
    );
  }
}
