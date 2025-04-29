// layout.tsx
// Author: [Chiron, Afolabi, Fahim]
// Purpose: Root layout file for the Manga Explorer app. Applies global structure (header, footer, theme classes) and wraps all pages with a consistent layout.


import './globals.css'; // Tailwind + global transitions/fonts
import Link from 'next/link';
import { Metadata } from 'next';

// Global metadata for the app (used in <head>)
export const metadata: Metadata = {
  title: 'Manga Explorer',
  description: 'Discover, search, and bookmark your favorite manga',
};

// Root layout wraps every route in the app
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col font-sans bg-white text-black dark:bg-black dark:text-white transition-colors duration-300">
        {/* App Header with Navigation */}
        <header className="bg-indigo-600 text-white shadow">
          <div className="container mx-auto flex justify-between items-center p-4">
            <h1 className="text-2xl font-semibold">Manga Explorer</h1>

            {/* Navigation Links to Pages */}
            <nav className="space-x-6">
              <Link href="/" className="hover:underline">
                Home
              </Link>
              <Link href="/search" className="hover:underline">
                Search
              </Link>
              <Link href="/favorites" className="hover:underline">
                Favorites
              </Link>
            </nav>
          </div>
        </header>

        {/* Main Page Content */}
        <main className="flex-grow container mx-auto p-8">
          {children} {/* Inject route-specific content here */}
        </main>

        {/* Footer (global across site) */}
        <footer className="bg-gray-100 dark:bg-gray-800 text-center py-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            &copy; {new Date().getFullYear()} Manga Explorer. All rights reserved.
          </p>
        </footer>
      </body>
    </html>
  );
}
