# Favicon and Metadata Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create brand favicons (SVG, ICO, PNG), web app manifest, social share OpenGraph card, and complete SEO metadata in Next.js layout.

**Architecture:** SVG brand icon and PWA icons created in `public/` and `app/`, Web App Manifest in `public/manifest.json`, and Next.js App Router metadata export in `app/layout.tsx`.

**Tech Stack:** Next.js 16 (App Router), TypeScript, SVG, Web App Manifest standard.

## Global Constraints
- Target language for user-facing metadata: Vietnamese (`vi_VN`).
- Main brand colors: Coral (`#E05D38`), Teal (`#0F766E`), Cream (`#FAF7F2`), Dark Ink (`#1E293B`).
- Strict TypeScript compatibility for Next.js `Metadata` type.

---

### Task 1: Create Vector Icon (`public/icon.svg` & `app/icon.svg`)

**Files:**
- Create: `public/icon.svg`
- Create: `app/icon.svg`

**Interfaces:**
- Consumes: Brand design spec (Steaming bowl + AI Spark ✨)
- Produces: SVG vector icon used by modern browsers as favicon

- [ ] **Step 1: Write `public/icon.svg`**

Create `public/icon.svg` containing a crisp vector illustration with coral rounded background, food bowl, rising steam, and AI spark:

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <rect width="512" height="512" rx="112" fill="#E05D38"/>
  <!-- Bowl -->
  <path d="M 128 270 C 128 370, 384 370, 384 270 Z" fill="#FFFFFF"/>
  <path d="M 112 250 C 112 240, 400 240, 400 250 C 400 260, 112 260, 112 250 Z" fill="#FFFFFF"/>
  <path d="M 192 355 L 320 355 C 310 375, 202 375, 192 355 Z" fill="#D94E28"/>
  <!-- Steam Lines -->
  <path d="M 180 220 Q 160 180 190 140" fill="none" stroke="#FAF7F2" stroke-width="18" stroke-linecap="round"/>
  <path d="M 256 220 Q 236 170 266 120" fill="none" stroke="#FAF7F2" stroke-width="18" stroke-linecap="round"/>
  <path d="M 332 220 Q 312 180 342 140" fill="none" stroke="#FAF7F2" stroke-width="18" stroke-linecap="round"/>
  <!-- AI Sparkle ✨ -->
  <path d="M 390 130 Q 390 160 420 160 Q 390 160 390 190 Q 390 160 360 160 Q 390 160 390 130 Z" fill="#FBBF24"/>
  <path d="M 130 110 Q 130 128 148 128 Q 130 128 130 146 Q 130 128 112 128 Q 130 128 130 110 Z" fill="#2DD4BF"/>
</svg>
```

- [ ] **Step 2: Copy `public/icon.svg` to `app/icon.svg`**

Ensure Next.js App Router auto-detects `app/icon.svg`.

- [ ] **Step 3: Commit Task 1**

```bash
git add public/icon.svg app/icon.svg
git commit -m "feat: add SVG brand icon for dinner-ai"
```

---

### Task 2: Create Web App Manifest (`public/manifest.json`)

**Files:**
- Create: `public/manifest.json`

**Interfaces:**
- Consumes: Icon paths (`/icon-192.png`, `/icon-512.png`, `/icon.svg`)
- Produces: Web App Manifest for browser mobile PWA support

- [ ] **Step 1: Write `public/manifest.json`**

```json
{
  "name": "Dinner AI — Tối nay ăn gì?",
  "short_name": "Dinner AI",
  "description": "Gợi ý thực đơn bữa tối ngon, chuẩn vị, vừa túi tiền trong vài giây với AI.",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#FAF7F2",
  "theme_color": "#E05D38",
  "icons": [
    {
      "src": "/icon.svg",
      "sizes": "any",
      "type": "image/svg+xml",
      "purpose": "any maskable"
    },
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

- [ ] **Step 2: Commit Task 2**

```bash
git add public/manifest.json
git commit -m "feat: add web app manifest file"
```

---

### Task 3: Generate PNG Favicons & OpenGraph Image Assets

**Files:**
- Create: `public/apple-icon.png`
- Create: `public/icon-192.png`
- Create: `public/icon-512.png`
- Create: `public/og-image.png`
- Modify: `public/favicon.ico` / `app/favicon.ico`

**Interfaces:**
- Consumes: SVG vector graphic
- Produces: PNG app icons & OpenGraph preview card image

- [ ] **Step 1: Generate PNG icons and OG preview card**

Create a helper script or canvas tool to generate sharp PNG icons (`icon-192.png`, `icon-512.png`, `apple-icon.png`) and `og-image.png` (1200x630).

- [ ] **Step 2: Verify created images exist in `public/`**

Run: `ls -la public/icon-192.png public/icon-512.png public/apple-icon.png public/og-image.png`
Expected: Files exist with non-zero size.

- [ ] **Step 3: Commit Task 3**

```bash
git add public/apple-icon.png public/icon-192.png public/icon-512.png public/og-image.png public/favicon.ico app/favicon.ico
git commit -m "feat: add PNG app icons and og-image social preview card"
```

---

### Task 4: Configure Next.js Metadata in `app/layout.tsx`

**Files:**
- Modify: `app/layout.tsx`

**Interfaces:**
- Consumes: `Metadata` interface from `next`
- Produces: SEO, OpenGraph, Twitter, Favicon, and PWA metadata in HTML document head

- [ ] **Step 1: Update `app/layout.tsx`**

Replace `metadata` object in `app/layout.tsx` with full metadata configuration:

```typescript
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
```

- [ ] **Step 2: Commit Task 4**

```bash
git add app/layout.tsx
git commit -m "feat: configure complete Next.js metadata and openGraph tags"
```

---

### Task 5: Build & Verification

**Files:**
- Test: Build output / Vitest suite

- [ ] **Step 1: Run linter and tests**

Run: `yarn test` and `yarn build` (or `npm run build`) to ensure all metadata types and static assets pass build verification.

- [ ] **Step 2: Commit Task 5**

```bash
git commit --allow-empty -m "chore: verify metadata and favicon build"
```
