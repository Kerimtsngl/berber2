import "../styles/globals.css";
import Header from "./components/Header";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <head>
        <title>Kuaför By Kerim</title>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="bg-gray-50 min-h-screen">
        <Header />
        <main className="max-w-3xl mx-auto p-4">{children}</main>
      </body>
    </html>
  );
}

export const metadata = {
  title: 'Kuaför By Kerim',
  description: 'Modern ve hızlı berber randevu sistemi',
  icons: {
    icon: '/uploads/kuaforbykerim-logo.png',
  },
}; 