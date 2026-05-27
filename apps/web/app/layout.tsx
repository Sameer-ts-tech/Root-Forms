import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { GlobalProviders } from "~/providers/global";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: {
    default: "Root Forms — Nature-Themed Form Builder",
    template: "%s | Root Forms",
  },
  description: "Build beautiful, nature-inspired forms with Root Forms. Create, share, and analyze responses with our Typeform-style form builder featuring forest, ocean, fire and snow themes.",
  keywords: ["form builder", "typeform alternative", "nature themes", "forms", "survey", "analytics"],
  openGraph: {
    type: "website",
    title: "Root Forms — Nature-Themed Form Builder",
    description: "Build beautiful forms with nature-inspired themes. Collect responses, view analytics.",
    siteName: "Root Forms",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <GlobalProviders>{children}</GlobalProviders>
      </body>
    </html>
  );
}
