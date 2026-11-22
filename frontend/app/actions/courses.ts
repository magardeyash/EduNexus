"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redis } from "@/lib/redis"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const COURSE_LIST_KEY = "courses:list:v1"
const COURSE_KEY = (id: string) => `courses:${id}:v1`

const courseInput = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  price: z.coerce.number().nonnegative(),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
})

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080"

export async function getCourses() {
  const cached = await redis.get(COURSE_LIST_KEY)
  if (cached) return cached

  try {
    const res = await fetch(`${BACKEND_URL}/api/courses/public`, { cache: "no-store" })
    if (!res.ok) return []
    const data = await res.json()
    await redis.set(COURSE_LIST_KEY, data, { ex: 60 })
    return data
  } catch (err) {
    console.error("Failed to fetch courses from backend:", err)
    return []
  }
}

export async function getCourseById(id: string) {
  const key = COURSE_KEY(id)
  const cached = await redis.get(key)
  if (cached) return cached

  try {
    const courseRes = await fetch(`${BACKEND_URL}/api/courses/${id}`, { cache: "no-store" })
    if (!courseRes.ok) return null
    const course = await courseRes.json()

    // Fetch lessons for this course
    const lessonsRes = await fetch(`${BACKEND_URL}/api/lessons?courseId=${id}`, { cache: "no-store" })
    const lessons = lessonsRes.ok ? await lessonsRes.json() : []

    const data = {
      ...course,
      lessons: lessons || [],
    }

    if (data) await redis.set(key, data, { ex: 60 })
    return data
  } catch (err) {
    console.error(`Failed to fetch course ${id} from backend:`, err)
    return null
  }
}

export async function createCourse(input: unknown) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const { title, description, price, status } = courseInput.parse(input)

  const course = await prisma.course.create({
    data: {
      title,
      description,
      price,
      status,
      createdById: session.user.id,
    },
  })

  await redis.del(COURSE_LIST_KEY)
  revalidatePath("/courses")
  return course
}

export async function updateCourse(id: string, input: unknown) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const existing = await prisma.course.findUnique({ where: { id } })
  if (!existing) throw new Error("Not found")
  if (existing.createdById !== session.user.id) throw new Error("Forbidden")

  const { title, description, price, status } = courseInput.partial().parse(input)

  const course = await prisma.course.update({
    where: { id },
    data: {
      ...(title !== undefined ? { title } : {}),
      ...(description !== undefined ? { description } : {}),
      ...(price !== undefined ? { price } : {}),
      ...(status !== undefined ? { status } : {}),
    },
  })

  await redis.del(COURSE_LIST_KEY)
  await redis.del(COURSE_KEY(id))
  revalidatePath("/courses")
  revalidatePath(`/courses/${id}`)
  return course
}

export async function deleteCourse(id: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const existing = await prisma.course.findUnique({ where: { id } })
  if (!existing) throw new Error("Not found")
  if (existing.createdById !== session.user.id) throw new Error("Forbidden")

  await prisma.course.delete({ where: { id } })
  await redis.del(COURSE_LIST_KEY)
  await redis.del(COURSE_KEY(id))
  revalidatePath("/courses")
  revalidatePath(`/courses/${id}`)
  return { ok: true }
}