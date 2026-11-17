/** @type {import('next').NextConfig} */
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://pagead2.googlesyndication.com https://*.googlesyndication.com https://www.googletagmanager.com https://*.google.com https://*.doubleclick.net https://*.adtrafficquality.google",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data: https://fonts.gstatic.com",
  "connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com https://*.googlesyndication.com https://*.doubleclick.net https://*.adtrafficquality.google",
  "frame-src https://player.twitch.tv https://clips.twitch.tv https://www.youtube.com https://*.googlesyndication.com https://*.doubleclick.net https://*.google.com https://googleads.g.doubleclick.net",
  "object-src 'none'",
  "base-uri 'self'",
  "frame-ancestors 'self'",
].join('; ');

const nextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  experimental: { inlineCss: true },
  compiler: {
    removeConsole: { exclude: ['error'] },
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Content-Security-Policy-Report-Only', value: CSP },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
        ],
      },
    ];
  },
};

export default nextConfig;
