const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080"

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  turbopack: {},
  async rewrites() {
    return [
      {
        source: "/api/auth/login",
        destination: `${BACKEND_URL}/api/auth/login`,
      },
      {
        source: "/api/auth/register",
        destination: `${BACKEND_URL}/api/auth/register`,
      },
      {
        source: "/api/auth/me",
        destination: `${BACKEND_URL}/api/auth/me`,
      },
      {
        source: "/api/user/:path*",
        destination: `${BACKEND_URL}/api/user/:path*`,
      },
      {
        source: "/api/courses",
        destination: `${BACKEND_URL}/api/courses`,
      },
      {
        source: "/api/courses/:path*",
        destination: `${BACKEND_URL}/api/courses/:path*`,
      },
      {
        source: "/api/lessons",
        destination: `${BACKEND_URL}/api/lessons`,
      },
      {
        source: "/api/lessons/:path*",
        destination: `${BACKEND_URL}/api/lessons/:path*`,
      },
      {
        source: "/api/enrollments",
        destination: `${BACKEND_URL}/api/enrollments`,
      },
      {
        source: "/api/enrollments/:path*",
        destination: `${BACKEND_URL}/api/enrollments/:path*`,
      },
      {
        source: "/api/progress",
        destination: `${BACKEND_URL}/api/progress`,
      },
      {
        source: "/api/progress/:path*",
        destination: `${BACKEND_URL}/api/progress/:path*`,
      },
      {
        source: "/api/forum/:path*",
        destination: `${BACKEND_URL}/api/forum/:path*`,
      },
      {
        source: "/api/announcements",
        destination: `${BACKEND_URL}/api/announcements`,
      },
      {
        source: "/api/announcements/:path*",
        destination: `${BACKEND_URL}/api/announcements/:path*`,
      },
      {
        source: "/api/quiz",
        destination: `${BACKEND_URL}/api/quiz`,
      },
      {
        source: "/api/quiz/public",
        destination: `${BACKEND_URL}/api/quiz/public`,
      },
      {
        source: "/api/quiz/my",
        destination: `${BACKEND_URL}/api/quiz/my`,
      },
      {
        source: "/api/quiz/:path*",
        destination: `${BACKEND_URL}/api/quiz/:path*`,
      },
      {
        source: "/api/gamification/:path*",
        destination: `${BACKEND_URL}/api/gamification/:path*`,
      },
      {
        source: "/api/dashboard/:path*",
        destination: `${BACKEND_URL}/api/dashboard/:path*`,
      },
      {
        source: "/api/learning-time",
        destination: `${BACKEND_URL}/api/learning-time`,
      },
      {
        source: "/api/learning-time/:path*",
        destination: `${BACKEND_URL}/api/learning-time/:path*`,
      },
      {
        source: "/api/ai-tutor",
        destination: `${BACKEND_URL}/api/ai-tutor`,
      },
      {
        source: "/api/quiz/generate",
        destination: `${BACKEND_URL}/api/quiz/generate`,
      },
      {
        source: "/api/health",
        destination: `${BACKEND_URL}/api/health`,
      },
    ]
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "geolocation=(), microphone=(), camera=()" },
        ],
      },
    ]
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
}

export default nextConfig
