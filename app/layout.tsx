import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  console.log('Root layout loaded');
  
  return (
    <html lang="en">
      <head>
        <title>Manga Search App</title>
      </head>
      <body>
        <header>
          <h1>Manga Search App</h1>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
