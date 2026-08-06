import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";

const sans = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
});

export const viewport: Viewport = {
  themeColor: "#E05D38",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://dinner-ai.vercel.app"),
  title: {
    default: "Dinner AI — Tối nay ăn gì?",
    template: "%s | Dinner AI",
  },
  description: "Gợi ý thực đơn bữa tối ngon, chuẩn vị, vừa túi tiền trong vài giây với AI.",
  keywords: [
    "thực đơn bữa tối",
    "tối nay ăn gì",
    "dinner ai",
    "gợi ý món ăn",
    "lên thực đơn",
    "món ngon mỗi ngày",
    "đi chợ",
    "nấu ăn gia đình",
  ],
  authors: [{ name: "Dinner AI Team" }],
  creator: "Dinner AI",
  publisher: "Dinner AI",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "Dinner AI — Tối nay ăn gì?",
    description: "Gợi ý thực đơn bữa tối ngon, vừa túi tiền, trong vài giây với AI.",
    url: "https://dinner-ai.vercel.app",
    siteName: "Dinner AI",
    locale: "vi_VN",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Dinner AI — Tối nay ăn gì?",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dinner AI — Tối nay ăn gì?",
    description: "Gợi ý thực đơn bữa tối ngon, vừa túi tiền, trong vài giây với AI.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={sans.variable}>
      <body className="font-[family-name:var(--font-sans)] antialiased">{children}</body>
    </html>
  );
}

