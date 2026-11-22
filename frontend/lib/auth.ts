import NextAuth, { type AuthOptions, type DefaultSession } from "next-auth"
import { getServerSession } from "next-auth/next"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"

// Extend built-in session types
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string
      role?: string
    } & DefaultSession["user"]
  }

  interface User {
    role?: string
  }
}

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080"

const providers: AuthOptions['providers'] = [
  Credentials({
    name: "Credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) return null
      try {
        const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        })
        if (!res.ok) return null
        const data = await res.json()
        if (data && data.user) {
          return {
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            role: data.user.role,
            image: data.user.image,
            accessToken: data.token,
          }
        }
        return null
      } catch (err) {
        console.error("Auth error with Spring Boot backend:", err)
        return null
      }
    },
  }),
]

if (process.env.GITHUB_ID && process.env.GITHUB_SECRET) {
  providers.push(
    GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    })
  )
}

if (process.env.GOOGLE_ID && process.env.GOOGLE_SECRET) {
  providers.push(
    Google({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    })
  )
}

export const authConfig: AuthOptions = {
  providers,
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role ?? null
        token.accessToken = (user as any).accessToken ?? null
      }
      return token
    },
    async session({ session, token }: any) {
      if (session?.user) {
        ;(session.user as any).id = token.id
        ;(session.user as any).role = token.role ?? null
        ;(session as any).accessToken = token.accessToken ?? null
      }
      return session
    },
  },
}

const handler = NextAuth(authConfig)

export const { GET, POST } = handler.handlers || { GET: handler, POST: handler }

export async function auth() {
  return await getServerSession(authConfig)
}

export const signIn = (handler as any).signIn
export const signOut = (handler as any).signOut