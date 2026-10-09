import type { Metadata } from "next";
import { Inter, Noto_Serif_JP } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const notoSerifJP = Noto_Serif_JP({ 
  weight: ['400', '700'],
  subsets: ["latin"],
  variable: "--font-noto-serif-jp"
});

export const metadata: Metadata = {
  title: "Fortune Teller - 運命の道標",
  description: "四柱推命と九星気学を用いた占いアプリケーション",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${inter.variable} ${notoSerifJP.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
