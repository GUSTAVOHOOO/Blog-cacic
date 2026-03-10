/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // HSTS: force HTTPS for 1 year, include subdomains
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
          // Prevent clickjacking
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          // Prevent MIME sniffing
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          // Limit referrer info on cross-origin requests
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          // Disable browser features not used by the app
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          // CSP: restrictive policy — no inline scripts, only same-origin + Supabase
          // NOTE: Chakra UI v3 uses CSS-in-JS; if inline styles fail, add 'unsafe-inline' to style-src only
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              // Supabase API calls
              `connect-src 'self' ${process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://*.supabase.co'} wss://*.supabase.co`,
              // Scripts: self + Next.js inline scripts needed for hydration
              "script-src 'self' 'unsafe-inline'",
              // Styles: self + inline (Chakra CSS-in-JS)
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              // Fonts
              "font-src 'self' https://fonts.gstatic.com",
              // Images: self + Supabase Storage + data URIs
              `img-src 'self' data: blob: ${process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://*.supabase.co'}`,
              // No iframes
              "frame-ancestors 'none'",
              // No form submissions to external sites
              "form-action 'self'",
            ].join('; '),
          },
        ],
      },
      // SEC-02: CORS — only allow app domain and localhost
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PATCH, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
