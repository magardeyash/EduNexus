import { Suspense } from 'react'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { QuizDetailView } from '@/components/quiz/quiz-detail-view'

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080"

interface QuizPageProps {
  params: Promise<{ id: string }>
}

export default async function QuizPage({ params }: QuizPageProps) {
  const session = await auth()
  
  if (!session) {
    redirect('/login')
  }

  const { id } = await params

  // Fetch quiz data from Spring Boot backend
  let quiz: any = null
  try {
    const res = await fetch(`${BACKEND_URL}/api/quiz/${id}`, { cache: 'no-store' })
    if (res.ok) {
      const data = await res.json()
      quiz = {
        ...data,
        questions: data.questions || [],
        createdBy: data.createdBy || { name: 'EduNexus Instructor', image: null },
        _count: { attempts: data.attempts?.length ?? data._count?.attempts ?? 0 },
        createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
      }
    }
  } catch (err) {
    console.error(`Failed to fetch quiz ${id}:`, err)
  }

  if (!quiz) {
    redirect('/quiz')
  }

  // Check access permissions
  if (!quiz.isPublic && quiz.createdById && session.user?.id && quiz.createdById !== session.user.id) {
    redirect('/quiz')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <Suspense fallback={<div>Loading quiz...</div>}>
          <QuizDetailView quiz={quiz} />
        </Suspense>
      </div>
    </div>
  )
}