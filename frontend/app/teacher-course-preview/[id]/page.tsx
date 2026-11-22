import { getCourseById } from "@/app/actions/courses"
import { auth } from "@/lib/auth"
import { notFound, redirect } from "next/navigation"
import { TeacherCoursePreviewClient } from "./TeacherCoursePreviewClient"

interface Lesson {
    id: string
    title: string
    content?: string | null
    videoUrl?: string | null
    order?: number
    courseId?: string
    createdAt?: string | Date
    updatedAt?: string | Date
    [key: string]: any
}

export default async function TeacherCoursePreviewPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const session = await auth()
    if (!session?.user?.id) redirect("/login")

    const userRole = (session.user as any).role

    // Only allow teachers to access this preview
    if (userRole !== "TEACHER") {
        redirect("/student-dashboard")
    }

    const course = await getCourseById(id)
    if (!course) return notFound()

    // Only allow teachers to preview their own courses
    if (course.createdById && course.createdById !== session.user.id) {
        redirect("/teacher-dashboard")
    }

    // Safely serialize course data
    const serializedCourse = {
        ...course,
        price: course.price != null ? course.price.toString() : "0",
        createdAt: course.createdAt instanceof Date ? course.createdAt.toISOString() : (course.createdAt || new Date().toISOString()),
        updatedAt: course.updatedAt instanceof Date ? course.updatedAt.toISOString() : (course.updatedAt || new Date().toISOString()),
        lessons: (course.lessons || []).map((lesson: Lesson) => ({
            ...lesson,
            createdAt: lesson.createdAt instanceof Date ? lesson.createdAt.toISOString() : (lesson.createdAt || new Date().toISOString()),
            updatedAt: lesson.updatedAt instanceof Date ? lesson.updatedAt.toISOString() : (lesson.updatedAt || new Date().toISOString()),
        }))
    }

    return <TeacherCoursePreviewClient course={serializedCourse} />
}