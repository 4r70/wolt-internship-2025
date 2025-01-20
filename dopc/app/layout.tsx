import type { Metadata } from "next";
import { Coiny, Nunito_Sans } from "next/font/google";
import "@/styles/globals.css";

const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
});

const coiny = Coiny({
  weight: ['400'],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DOPC",
  description: "Delivery Order Price Calculator UI - calculating the total price and price breakdown of a delivery order. Made with Next.js for Wolt 2025 frontend engineering internship.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${nunitoSans.className} ${coiny.className}`}>
        {children}
      </body>
    </html>
  );
}
