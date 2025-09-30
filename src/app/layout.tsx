import "./globals.css";
import  { Header} from "@/components/header";
import { Metadata } from "next"

export const metadata: Metadata = {
    title: 'CONECTA.AO',
    icons: '/material/link.png',
    description: 'Transforme o seu negócio com soluções tecnológicas personalizadas',
    openGraph: {
        title: 'CONECTA.AO',
        description: 'Transforme o seu negócio com soluções tecnológicas personalizadas',
        images: [
            {
                url: '/material/link.png',
                width: 800,
                height: 600,
                alt: 'Logo da CONECTA.AO'
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        <Header/>
        {children}
      </body>
    </html>
  );
}