'use client'; //tOLD nextjs this a client-side component 

{/*Fahim Uddin*/}

import Link from 'next/link'; 

// Fahim Uddin: I defined the interface of the Manga object type 
interface Manga {
  id: string;
  attributes: {
    title: {
      [key: string]: string | undefined; // title can have multiple data types
};
  };
  relationships: {
    id: string;
    type: string;
    attributes: {
      fileName: string; // used to construct the cover image URL
    };
  }[];
}

// I displayed an individuals manga's cover and title
export default function MangaCard({ manga }: { manga: Manga }) {
  const { id, attributes, relationships } = manga;
  
  // Grabs the English title if available, otherwise defaults only to the first available title
  const title = attributes.title.en || Object.values(attributes.title)[0];
  
  // Finds the relationship object that holds the cover image information
  const coverRel = relationships.find((rel) => rel.type === 'cover_art');
  
  // Constructs the cover image URL 
  const coverUrl = coverRel
    ? `https://uploads.mangadex.org/covers/${id}/${coverRel.attributes.fileName}`
    : null;

  return (
    // Clicking on the card navigates to the manga's detail page
    <Link href={`/manga/${id}`} className="block p-2 border rounded hover:shadow-md transition">
      {/*Displays the cover image if it exists */}
      {coverUrl && (
        <img
          src={coverUrl}
          alt={`${title} Cover`}
          className="w-full h-32 object-cover mb-2 rounded"
        />
      )}
      {/*Displays the manga title below the image */}
      <h2 className="text-sm font-semibold text-center">{title}</h2>
    </Link>
  );
}
