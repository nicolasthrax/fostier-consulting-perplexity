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
          // No script-src here: it would need a nonce per request, which would make every static
          // page dynamic. The admin pages, which show what candidates typed, get a full nonce
          // policy from middleware.ts. These directives need no nonce: no plugins, no <base>
          // pointing elsewhere, forms only post to this site, and no framing by other sites.
          { key: "Content-Security-Policy", value: "frame-ancestors 'self'; object-src 'none'; base-uri 'self'; form-action 'self'" },
        ],
      },
      {
        // Recruitment portal: never cached by shared caches.
        source: "/careers/:path*",
        headers: [{ key: "Cache-Control", value: "private, no-store" }],
      },
      // Its landing and job pages are indexable; the rest stays out of search results,
      // with the same values as the middleware (see careersRobots in middleware.ts).
      // Admin and API come second so they win over /careers/api/apply matching ".../apply".
      ...["/careers/:path*/apply", "/careers/:path*/privacy"].map((source) => ({
        source,
        headers: [{ key: "X-Robots-Tag", value: "noindex, noarchive" }],
      })),
      ...["/careers/admin/:path*", "/careers/api/:path*"].map((source) => ({
        source,
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" }],
      })),
      {
        // Candidates' CVs: a crafted file runs nothing on this origin (no scripts, forms or
        // same-origin access). Listed last so it replaces the site-wide policy above.
        source: "/careers/api/admin/cv/:id",
        headers: [{ key: "Content-Security-Policy", value: "frame-ancestors 'self'; sandbox" }],
      },
    ];
  },
};

// BotID: proxies its challenge script through this origin (started by components/careers/BotIdInit.tsx).
export default withBotId(nextConfig);
