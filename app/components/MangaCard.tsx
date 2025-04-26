'use client';
import Link from 'next/link';

interface Manga {
  id: string;
  attributes: {
    title: {
       [key: string]: string | undefined;
    };
  };
  relationships: {
    id: string;
    type: string;
    attributes: {
      fileName: string;
    };
  }[];
}

export default function MangaCard({ manga }: { manga: Manga }) {
  const { id, attributes, relationships } = manga;
  const title = attributes.title.en || Object.values(attributes.title)[0];
  const coverRel = relationships.find((rel) => rel.type === 'cover_art');
  const coverUrl = coverRel
    ? `https://uploads.mangadex.org/covers/${id}/${coverRel.attributes.fileName}`
    : null;

  return (
    <Link href={`/manga/${id}`} className="block p-2 border rounded hover:shadow-md transition">
      {coverUrl && (
        <img
          src={coverUrl}
          alt={`${title} Cover`}
          className="w-full h-32 object-cover mb-2 rounded"
        />
      )}
      <h2 className="text-sm font-semibold text-center">{title}</h2>
    </Link>
  );
}
