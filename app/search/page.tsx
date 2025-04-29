// app/search/page.tsx
// Author: [Chiron]
// Purpose: Renders the Search page where users can search for manga titles using the SearchForm component.

import SearchForm from '../components/SearchForm'; // Import the manga search form component

// Main page component for "/search" route
export default function SearchPage() {
  return (
    <main className="p-8">
      {/* Page Title */}
      <h1 className="text-2xl mb-4">Manga Search</h1>

      {/* Render the search form */}
      <SearchForm />
    </main>
  );
}
