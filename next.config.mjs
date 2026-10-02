import { withBotId } from "botid/next/config";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: { formats: ["image/avif", "image/webp"] },
  async redirects() {
    return [
      // Retired job listing: send old links to the current one.
      { source: "/careers/jobs/financial-advisor", destination: "/careers/jobs/financial-consultant", permanent: false },
      { source: "/careers/en/jobs/financial-advisor", destination: "/careers/en/jobs/financial-consultant", permanent: false },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Two years, subdomains included, eligible for the browser preload lists.
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          // Only frame-ancestors: a script/style CSP would need nonces for Next's inline scripts.
          { key: "Content-Security-Policy", value: "frame-ancestors 'self'" },
        ],
      },
      {
        // Unlisted recruitment portal: never indexed, never cached by shared caches.
        source: "/careers/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
          { key: "Cache-Control", value: "private, no-store" },
        ],
      },
      {
        // Candidates' CVs: a crafted file runs nothing on this origin (no scripts, forms or
        // same-origin access). Listed last so it replaces the site-wide policy above.
        source: "/careers/api/admin/cv/:id",
        headers: [{ key: "Content-Security-Policy", value: "frame-ancestors 'self'; sandbox" }],
      },
    ];
  },
};

// BotID: proxies its challenge script through this origin (see components/careers/CareersShell.tsx).
export default withBotId(nextConfig);
