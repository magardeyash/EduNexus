import { getCourseById } from "@/app/actions/courses"
import { auth } from "@/lib/auth"
import { notFound, redirect } from "next/navigation"
import { CoursePlayerClient } from "./CoursePlayerClient"

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080"

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const course = await getCourseById(id)
  if (!course) return notFound()

  // Check enrollment: teachers/creators always have access; students verify via enrollments
  let isEnrolled = course.createdById === session.user.id || (session.user as any).role === "TEACHER"
  if (!isEnrolled) {
    try {
      const headers: Record<string, string> = {}
      if ((session as any).accessToken) {
        headers["Authorization"] = `Bearer ${(session as any).accessToken}`
      }
      const enrollRes = await fetch(`${BACKEND_URL}/api/enrollments?courseId=${id}`, {
        headers,
        cache: "no-store"
      })
      if (enrollRes.ok) {
        const enrollments = await enrollRes.json()
        isEnrolled = Array.isArray(enrollments) && enrollments.some((e: any) => e.courseId === id)
      } else {
        // Fallback for demo/offline access
        isEnrolled = true
      }
    } catch {
      isEnrolled = true
    }
  }

  if (!isEnrolled) {
    redirect(`/courses/${id}`)
  }

  // Safely serialize course data
  const serializedCourse = {
    ...course,
    price: course.price != null ? course.price.toString() : "0",
    createdAt: course.createdAt instanceof Date ? course.createdAt.toISOString() : (course.createdAt || new Date().toISOString()),
    updatedAt: course.updatedAt instanceof Date ? course.updatedAt.toISOString() : (course.updatedAt || new Date().toISOString()),
    lessons: (course.lessons || []).map((lesson: any) => ({
      ...lesson,
      createdAt: lesson.createdAt instanceof Date ? lesson.createdAt.toISOString() : (lesson.createdAt || new Date().toISOString()),
      updatedAt: lesson.updatedAt instanceof Date ? lesson.updatedAt.toISOString() : (lesson.updatedAt || new Date().toISOString()),
    }))
  }

  return <CoursePlayerClient course={serializedCourse} />
}