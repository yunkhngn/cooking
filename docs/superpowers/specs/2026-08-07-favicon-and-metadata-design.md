# Favicon and Metadata Design Document

**Date:** 2026-08-07  
**Project:** Dinner AI (`yunkhngn/cooking`)  
**Status:** Approved  

---

## 1. Overview

Dinner AI requires a complete visual branding asset suite (Favicon, Apple Touch Icon, PWA icons, OpenGraph card) and an optimized Next.js App Router metadata setup to enhance search engine indexing, social media sharing (Zalo, Facebook, Twitter, iMessage), and mobile home-screen installation.

---

## 2. Icon Design Specification

**Theme Concept:** Steaming Dinner Bowl + AI Spark ✨  
- **Visual Elements:**
  - Curved ceramic bowl base in deep dark ink / warm coral gradient.
  - Rising steam lines stylized with a bright golden-teal ✨ AI sparkle icon.
  - Background: Warm cream/off-white badge or transparent SVG for multi-theme compatibility.
- **Color Palette:**
  - Coral: `#E05D38`
  - Teal: `#0F766E`
  - Accent / Gold: `#F59E0B`
  - Cream Background: `#FAF7F2`

---

## 3. Generated Assets & Specifications

1. **`public/icon.svg` / `app/icon.svg`**  
   - Vector SVG icon scalable to any resolution.
   - Clean vector paths for sharp rendering at 16px, 32px, 64px, and larger display sizes.

2. **`public/favicon.ico` & `app/favicon.ico`**  
   - Standard Multi-resolution ICO format (16x16, 32x32, 48x48) for web browser tab compatibility.

3. **`public/apple-icon.png`**  
   - 180x180 PNG icon formatted for iOS Safari "Add to Home Screen".

4. **`public/icon-192.png` & `public/icon-512.png`**  
   - High-res PNG icons for Android Chrome home screen shortcuts and PWA installations.

5. **`public/manifest.json`**  
   - Web App Manifest defining:
     - `name`: `"Dinner AI — Tối nay ăn gì?"`
     - `short_name`: `"Dinner AI"`
     - `description`: `"Gợi ý thực đơn bữa tối ngon, vừa túi tiền trong vài giây với AI."`
     - `start_url`: `"/"`
     - `display`: `"standalone"`
     - `background_color`: `"#FAF7F2"`
     - `theme_color`: `"#E05D38"`
     - Icons mapping to 192x192 and 512x512 images.

6. **`public/og-image.png`**  
   - 1200x630 Social Sharing Preview banner.
   - Design: Warm gradient banner with Dinner AI brand mark, main headline `"Tối nay nhà mình ăn gì?"`, subheadline `"Lên thực đơn ngon, vừa túi tiền trong 3 giây"`.

---

## 4. Metadata Configuration (`app/layout.tsx`)

Next.js `Metadata` configuration export:

```typescript
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
```

---

## 5. Verification Plan

1. Verify SVG & PNG asset generation.
2. Run `npm run build` or `npm run lint` / `npx vitest run` to ensure layout metadata passes TypeScript & Next.js validations without errors.
3. Validate HTML head output (favicons, og meta tags, manifest link).
