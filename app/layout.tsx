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
        <div className="min-h-screen bg-gray-50">
          <nav className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex">
                  <div className="flex-shrink-0 flex items-center">
                    <img
                      className="h-8 w-auto"
                      src="/resim1.jpg"
                      alt="Kuaför By Kerim"
                    />
                  </div>
                </div>
              </div>
            </div>
          </nav>
          <main className="max-w-3xl mx-auto p-4">{children}</main>
        </div>
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