import "./globals.css";
import { Metadata } from "next"
import "./globals.css";

import Providers from "@/components/Providers"; // wrapper client

export const metadata: Metadata = {
  metadataBase: new URL('https://my-rotine.vercel.app'),
    title: 'MyRotine - Gerencie suas finanças pessoais com facilidade',
    icons: '../img/icon.png',
    description: 'Gerencie suas finanças pessoais com facilidade',
    openGraph: {
        title: 'MyRotine',
        description: 'Gerencie suas finanças pessoais com facilidade',
        images: [
            {
                url: '../img/icon.png',
                width: 800,
                height: 600,
                alt: 'Logo da MyRotine'
            }
        ]
    },
    robots: {
        index: true,
        follow: true,
        nocache: true,
        googleBot: {
            index: true,
            follow: true
        }
    }
} 

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt">
      <body>
        <Providers>
          <main className="pt-14">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}

