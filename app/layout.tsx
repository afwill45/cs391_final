import './globals.css';
import Link from 'next/link';
import { Metadata } from 'next';



export const metadata: Metadata = {
  title: 'Manga Explorer',
  description: 'Discover, search, and bookmark your favorite manga',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col font-sans bg-white text-black dark:bg-black dark:text-white transition-colors duration-300">
        <header className="bg-indigo-600 text-white shadow">
          <div className="container mx-auto flex justify-between items-center p-4">
            <h1 className="text-2xl font-semibold">Manga Explorer</h1>
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

        <main className="flex-grow container mx-auto p-8">
          {children}
        </main>

        <footer className="bg-gray-100 dark:bg-gray-800 text-center py-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            &copy; {new Date().getFullYear()} Manga Explorer. All rights reserved.
          </p>
        </footer>
      </body>
    </html>
  );
}