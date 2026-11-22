"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  ArrowRight,
  Users,
  BookOpen,
  Zap,
  Globe,
  Award,
  Clock,
  Star,
  CheckCircle,
  Menu,
  X,
  Sparkles,
  ShieldCheck,
  Brain,
  WifiOff,
  Flame,
} from "lucide-react"
import { useState } from "react"
import { ManualInstall } from "./manual-install"
import Image from "next/image"

interface LandingPageProps {
  onNavigate: (page: string) => void
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/20 selection:text-primary">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-xl transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => onNavigate("landing")}
            >
              <div className="relative flex items-center justify-center">
                <div className="w-10 h-10 sm:w-11 sm:h-11 bg-gradient-to-tr from-primary via-primary/90 to-violet-500 rounded-xl flex items-center justify-center shadow-md shadow-primary/25 group-hover:scale-105 transition-all duration-300">
                  <Sparkles className="w-5 h-5 text-primary-foreground animate-pulse" />
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-violet-600 rounded-xl blur-sm opacity-30 group-hover:opacity-75 transition duration-300 -z-10" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight bg-gradient-to-r from-primary via-violet-600 to-indigo-500 bg-clip-text text-transparent">
                  EduNexus
                </h1>
                <span className="hidden sm:block text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
                  Intelligent Learning
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  onClick={() => onNavigate("student-dashboard")}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
                >
                  Courses
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => onNavigate("community-forum")}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
                >
                  Community
                </Button>
              </div>

              <div className="h-5 w-px bg-border/60 mx-1" />

              <div className="flex items-center gap-3">
                <ManualInstall />
                <Button
                  variant="ghost"
                  onClick={() => router.push("/login")}
                  className="text-sm font-medium text-foreground hover:text-primary hover:bg-primary/5 transition-all duration-200"
                >
                  Log In
                </Button>
                <Button
                  onClick={() => router.push("/signup")}
                  className="relative overflow-hidden bg-gradient-to-r from-primary via-indigo-600 to-violet-600 text-primary-foreground font-medium shadow-md shadow-primary/25 hover:shadow-lg hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                >
                  Get Started
                </Button>
              </div>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2.5 rounded-xl border border-border/50 hover:bg-muted/60 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-foreground" />
              ) : (
                <Menu className="w-5 h-5 text-foreground" />
              )}
            </button>
          </div>

          {/* Mobile Navigation Dropdown */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-3 pt-3 pb-4 border-t border-border/50 animate-in slide-in-from-top-2 duration-200">
              <div className="flex flex-col gap-2.5">
                <Button
                  variant="ghost"
                  onClick={() => {
                    onNavigate("student-dashboard")
                    setMobileMenuOpen(false)
                  }}
                  className="justify-start text-sm"
                >
                  Browse Courses
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    onNavigate("community-forum")
                    setMobileMenuOpen(false)
                  }}
                  className="justify-start text-sm"
                >
                  Community Forum
                </Button>
                <div className="h-px bg-border/50 my-1" />
                <div className="flex items-center justify-between gap-2">
                  <ManualInstall />
                  <Button
                    variant="outline"
                    onClick={() => {
                      router.push("/login")
                      setMobileMenuOpen(false)
                    }}
                    className="flex-1 text-sm"
                  >
                    Log In
                  </Button>
                </div>
                <Button
                  onClick={() => {
                    router.push("/signup")
                    setMobileMenuOpen(false)
                  }}
                  className="w-full bg-gradient-to-r from-primary to-indigo-600 text-primary-foreground shadow-md font-medium text-sm"
                >
                  Get Started Free
                </Button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-16 sm:pt-14 sm:pb-24 lg:pt-20 lg:pb-32">
        {/* Modern Ambient Mesh Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-primary/15 via-violet-500/10 to-emerald-400/10 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-10 left-5 sm:left-12 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-10 right-5 sm:right-12 w-72 h-72 bg-violet-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-10 sm:gap-14 lg:gap-16 items-center">
            {/* Left Column: Headline & Value Prop */}
            <div className="space-y-6 sm:space-y-8 text-center md:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs sm:text-sm font-semibold tracking-wide backdrop-blur-sm shadow-sm hover:bg-primary/10 transition-colors">
                <span className="flex h-2 w-2 rounded-full bg-primary animate-ping" />
                <span>Next-Gen Offline-First Learning Platform</span>
              </div>

              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.12]">
                Learn{" "}
                <span className="bg-gradient-to-r from-primary via-indigo-600 to-violet-600 bg-clip-text text-transparent">
                  Anywhere
                </span>
                .<br className="hidden sm:inline" />
                Anytime.{" "}
                <span className="bg-gradient-to-r from-violet-600 via-fuchsia-600 to-primary bg-clip-text text-transparent">
                  Together
                </span>
                .
              </h2>

              <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-xl mx-auto md:mx-0 leading-relaxed font-normal">
                EduNexus bridges educational divides with personalized AI tutoring, offline-first course synchronization, gamified skill mastery, and an inclusive global community.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3.5 pt-2 justify-center md:justify-start">
                <Button
                  size="lg"
                  onClick={() => onNavigate("student-dashboard")}
                  className="w-full sm:w-auto px-7 py-6 text-base font-semibold bg-gradient-to-r from-primary via-indigo-600 to-violet-600 text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 group"
                >
                  Start Learning Now
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1.5 transition-transform" />
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => onNavigate("teacher-dashboard")}
                  className="w-full sm:w-auto px-6 py-6 text-base font-semibold border-border hover:bg-muted/70 hover:text-foreground transition-all duration-200"
                >
                  Join as Instructor
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="pt-4 flex flex-wrap items-center justify-center md:justify-start gap-5 sm:gap-6 text-xs text-muted-foreground font-medium">
                <div className="flex items-center gap-1.5">
                  <WifiOff className="w-4 h-4 text-emerald-500" />
                  <span>100% Offline Capable</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Brain className="w-4 h-4 text-primary" />
                  <span>Spring AI Powered</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-violet-500" />
                  <span>Secure & Free Access</span>
                </div>
              </div>
            </div>

            {/* Right Column: Dynamic Visual Showcase */}
            <div className="relative mt-4 md:mt-0 flex items-center justify-center">
              <div className="relative w-full max-w-lg">
                {/* Glow ring */}
                <div className="absolute -inset-2 bg-gradient-to-tr from-primary/30 to-violet-600/30 rounded-3xl blur-2xl opacity-60" />

                <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-border/80 bg-card shadow-2xl p-2 sm:p-3">
                  <Image
                    src="/global-learning-platform.png"
                    alt="EduNexus Global Learning Platform"
                    width={520}
                    height={420}
                    className="w-full h-auto object-cover rounded-xl sm:rounded-2xl"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent pointer-events-none rounded-xl" />
                </div>

                {/* Floating Interactive Badge: Completed Course */}
                <div className="absolute -top-3 -right-2 sm:-top-5 sm:-right-4 bg-card/95 backdrop-blur-md rounded-2xl p-3 sm:p-4 shadow-xl border border-border/80 flex items-center gap-2.5 animate-bounce [animation-duration:4s]">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-500">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">Interactive Quiz Ace</p>
                    <p className="text-[11px] text-muted-foreground">100% Score • +150 XP</p>
                  </div>
                </div>

                {/* Floating Interactive Badge: AI Assistant */}
                <div className="absolute -bottom-3 -left-2 sm:-bottom-5 sm:-left-4 bg-card/95 backdrop-blur-md rounded-2xl p-3 sm:p-4 shadow-xl border border-border/80 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-primary/15 flex items-center justify-center text-primary">
                    <Brain className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">EduNexus AI Tutor</p>
                    <p className="text-[11px] text-muted-foreground">Always Ready Offline & Online</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Strip */}
      <section className="border-y border-border/60 bg-muted/30 backdrop-blur-sm py-8 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight">100%</p>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1 font-medium">Offline IndexedDB Access</p>
            </div>
            <div>
              <p className="text-2xl sm:text-4xl font-extrabold text-primary tracking-tight">3-Tier</p>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1 font-medium">Spring AI Fallback Pipeline</p>
            </div>
            <div>
              <p className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight">5,000+</p>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1 font-medium">Interactive Practice Quizzes</p>
            </div>
            <div>
              <p className="text-2xl sm:text-4xl font-extrabold text-violet-600 dark:text-violet-400 tracking-tight">Zero</p>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1 font-medium">Connectivity Barriers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-16 sm:py-24 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-semibold mb-3">
              <Zap className="w-3.5 h-3.5" />
              Engineered for Real Impact
            </div>
            <h3 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground">
              Why Learn with{" "}
              <span className="bg-gradient-to-r from-primary via-indigo-600 to-violet-600 bg-clip-text text-transparent">
                EduNexus
              </span>
              ?
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground mt-3 leading-relaxed">
              Every detail is architected for resilience, accessibility, and high student engagement regardless of device or internet quality.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, idx) => (
              <Card
                key={idx}
                className="group p-6 sm:p-7 rounded-2xl border border-border/70 bg-card hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between"
              >
                <div>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${feature.bgColor} transition-transform duration-300 group-hover:scale-110 shadow-sm`}>
                    <feature.icon className={`w-6 h-6 ${feature.iconColor}`} />
                  </div>
                  <h4 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-border/40 flex items-center text-xs font-semibold text-primary opacity-80 group-hover:opacity-100 transition-opacity">
                  Learn more <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-12 sm:py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden p-8 sm:p-12 lg:p-16 text-center border border-primary/30 shadow-2xl bg-gradient-to-br from-primary via-indigo-900 to-violet-950 text-white">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-violet-400/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-3xl mx-auto space-y-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
                <Sparkles className="w-3.5 h-3.5" /> Start Free Today
              </span>

              <h3 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                Empower Your Mind with <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-sky-200">EduNexus</span>
              </h3>

              <p className="text-sm sm:text-base lg:text-lg text-indigo-100/90 leading-relaxed font-normal">
                Join students and instructors building a smarter, borderless future. Experience uninterrupted offline learning and next-gen AI assistance.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2">
                <Button
                  size="lg"
                  onClick={() => onNavigate("student-dashboard")}
                  className="w-full sm:w-auto px-8 py-6 bg-white text-primary hover:bg-slate-100 font-bold shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200"
                >
                  Get Started for Free
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => onNavigate("teacher-dashboard")}
                  className="w-full sm:w-auto px-8 py-6 border-white/40 bg-white/10 text-white hover:bg-white/20 font-semibold backdrop-blur-sm transition-all duration-200"
                >
                  Create Course Content
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-border/60 bg-muted/20 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 mb-10">
            {/* Brand column */}
            <div className="space-y-4 sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-gradient-to-br from-primary to-violet-600 rounded-xl flex items-center justify-center text-primary-foreground shadow-sm">
                  <Sparkles className="w-4.5 h-4.5" />
                </div>
                <span className="text-xl font-black bg-gradient-to-r from-primary to-violet-600 bg-clip-text text-transparent">
                  EduNexus
                </span>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Empowering learners worldwide through resilient offline-first tech, adaptive AI tutoring, and open community learning.
              </p>
              <div className="flex gap-3 pt-1">
                <div className="w-8 h-8 rounded-lg border border-border/70 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors cursor-pointer">
                  <Globe className="w-4 h-4" />
                </div>
                <div className="w-8 h-8 rounded-lg border border-border/70 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors cursor-pointer">
                  <Users className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Platform */}
            <div>
              <h4 className="font-bold text-sm tracking-wide text-foreground uppercase mb-4">Platform</h4>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                <li>
                  <button onClick={() => onNavigate("student-dashboard")} className="hover:text-primary transition-colors">
                    Student Portal
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate("teacher-dashboard")} className="hover:text-primary transition-colors">
                    Instructor Studio
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate("courses")} className="hover:text-primary transition-colors">
                    Course Catalog
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate("ai-tutor")} className="hover:text-primary transition-colors">
                    AI Revision Tutor
                  </button>
                </li>
              </ul>
            </div>

            {/* Community */}
            <div>
              <h4 className="font-bold text-sm tracking-wide text-foreground uppercase mb-4">Community</h4>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                <li>
                  <button onClick={() => onNavigate("community-forum")} className="hover:text-primary transition-colors">
                    Discussion Forums
                  </button>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Peer Leaderboard
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Knowledge Base
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Feedback & Roadmap
                  </a>
                </li>
              </ul>
            </div>

            {/* Technology */}
            <div>
              <h4 className="font-bold text-sm tracking-wide text-foreground uppercase mb-4">Technology</h4>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" /> Next.js 16 App Router
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Spring Boot 3.4.2 REST
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-500" /> Spring AI (Gemini & Groq)
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Dexie IndexedDB PWA
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border/50 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
            <p>© 2026 EduNexus. All rights reserved. Crafted for resilient learning.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-primary transition-colors">Privacy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms</a>
              <a href="#" className="hover:text-primary transition-colors">Security</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

const features = [
  {
    icon: WifiOff,
    bgColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    title: "Offline-First Engine",
    description: "Download full courses and complete quizzes without internet. Changes auto-synchronize to cloud once reconnected.",
  },
  {
    icon: Brain,
    bgColor: "bg-primary/10 text-primary",
    iconColor: "text-primary",
    title: "Spring AI Multi-Tier Tutoring",
    description: "Intelligent AI tutor powered by Gemini 1.5 Flash and Groq Llama 3.3 with local technical fallback for instant guidance.",
  },
  {
    icon: Flame,
    bgColor: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    iconColor: "text-amber-600 dark:text-amber-400",
    title: "Gamification & XP Streaks",
    description: "Stay motivated with daily streaks, level progression, real-time leaderboard rankings, and achievement rewards.",
  },
  {
    icon: Users,
    bgColor: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
    iconColor: "text-violet-600 dark:text-violet-400",
    title: "Collaborative Community",
    description: "Threaded forum discussions, instructor announcements, and peer support to ensure nobody learns in isolation.",
  },
  {
    icon: Award,
    bgColor: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
    iconColor: "text-indigo-600 dark:text-indigo-400",
    title: "Interactive Quiz Generation",
    description: "Dynamic AI-generated assessments that test comprehension, explain incorrect options, and track topic mastery.",
  },
  {
    icon: ShieldCheck,
    bgColor: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
    iconColor: "text-rose-600 dark:text-rose-400",
    title: "Enterprise Grade Security",
    description: "Built with Spring Security 6 stateless JWT tokens, role-based protection for Students & Teachers, and cloud backups.",
  },
]
