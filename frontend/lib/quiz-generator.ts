import { GoogleGenerativeAI } from '@google/generative-ai'
import Groq from 'groq-sdk'

export interface QuizQuestion {
  question: string
  options: string[]
  correctAnswer: number
  explanation?: string
  points: number
}

export interface GenerateQuizParams {
  topic: string
  difficulty: 'easy' | 'medium' | 'hard'
  questionCount: number
  questionType?: 'multiple-choice' | 'true-false' | 'mixed'
}

export class QuizGenerator {
  static async generateQuiz(params: GenerateQuizParams): Promise<QuizQuestion[]> {
    const { topic, difficulty, questionCount, questionType = 'multiple-choice' } = params
    const points = difficulty === 'easy' ? 5 : difficulty === 'medium' ? 10 : 15

    const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || ''
    const groqKey = process.env.GROQ_API_KEY || ''

    // 1. Try Google Gemini (Free Tier) if key is present
    if (geminiKey.trim() !== '') {
      try {
        const genAI = new GoogleGenerativeAI(geminiKey)
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

        const prompt = `You are an expert educational quiz creator. Generate ${questionCount} ${difficulty} level multiple-choice questions about "${topic}".

IMPORTANT: Return ONLY a valid JSON object with no markdown backticks, explanations, or extra formatting.

JSON Schema:
{
  "questions": [
    {
      "question": "Question text?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Explanation for option A",
      "points": ${points}
    }
  ]
}`

        const result = await model.generateContent(prompt)
        const text = result.response.text().trim()

        let jsonText = text
        if (text.includes('```json')) {
          const match = text.match(/```json\s*([\s\S]*?)\s*```/)
          if (match) jsonText = match[1]
        } else if (text.includes('```')) {
          const match = text.match(/```\s*([\s\S]*?)\s*```/)
          if (match) jsonText = match[1]
        }

        const jsonMatch = jsonText.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0])
          if (parsed.questions && Array.isArray(parsed.questions) && parsed.questions.length > 0) {
            return parsed.questions.slice(0, questionCount).map((q: any) => ({
              ...q,
              points
            }))
          }
        }
      } catch (error) {
        console.warn('Gemini AI Generation failed, falling back:', error)
      }
    }

    // 2. Try Groq AI if key is present
    if (groqKey.trim() !== '' && !groqKey.startsWith('xai-')) {
      try {
        const groq = new Groq({ apiKey: groqKey })
        const prompt = `You are an expert quiz creator. Generate ${questionCount} ${difficulty} level multiple-choice questions about "${topic}".
Return ONLY a valid JSON object:
{
  "questions": [
    {
      "question": "Question text?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Explanation",
      "points": ${points}
    }
  ]
}`

        const completion = await groq.chat.completions.create({
          messages: [
            { role: "system", content: "You are an expert quiz creator. Always respond with valid JSON only." },
            { role: "user", content: prompt }
          ],
          model: "llama-3.3-70b-versatile",
          temperature: 0.7,
          max_tokens: 2048
        })

        const text = completion.choices[0]?.message?.content?.trim()
        if (text) {
          const jsonMatch = text.match(/\{[\s\S]*\}/)
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0])
            if (parsed.questions && Array.isArray(parsed.questions) && parsed.questions.length > 0) {
              return parsed.questions.slice(0, questionCount).map((q: any) => ({
                ...q,
                points
              }))
            }
          }
        }
      } catch (error) {
        console.warn('Groq AI Generation failed, falling back:', error)
      }
    }

    // 3. Fallback to rich domain-specific questions
    return this.getTopicSpecificQuestions(topic, difficulty, questionCount)
  }

  private static getTopicSpecificQuestions(topic: string, difficulty: string, count: number): QuizQuestion[] {
    const points = difficulty === 'easy' ? 5 : difficulty === 'medium' ? 10 : 15
    const cleanTopic = topic.toLowerCase().trim()

    if (cleanTopic.includes('spring')) {
      const springQuestions: QuizQuestion[] = [
        {
          question: `What is the primary purpose of Spring Boot's @RestController annotation in ${topic}?`,
          options: [
            "Combines @Controller and @ResponseBody to return JSON or XML responses",
            "Configures database connection pools automatically",
            "Defines Spring Security authentication filter chains",
            "Enables transactional management across service beans"
          ],
          correctAnswer: 0,
          explanation: "@RestController is a convenience annotation that combines @Controller and @ResponseBody.",
          points
        },
        {
          question: `How does Dependency Injection (DI) function within the Spring IoC Container?`,
          options: [
            "Spring IoC container creates, manages, and injects required bean dependencies at runtime",
            "Dependencies are manually instantiated using Java 'new' keywords in every class",
            "Database drivers are injected into raw HTML templates",
            "Spring compiles Java code directly into native operating system binaries"
          ],
          correctAnswer: 0,
          explanation: "Dependency Injection is a core Spring pattern where the IoC container injects required objects into dependent classes.",
          points
        },
        {
          question: `Which configuration file in a Spring Boot Maven project manages third-party library dependencies?`,
          options: [
            "package.json",
            "pom.xml",
            "application.yml",
            "build.gradle.kts"
          ],
          correctAnswer: 1,
          explanation: "pom.xml is the central configuration file for Apache Maven projects.",
          points
        },
        {
          question: `What is the primary role of Spring Data JPA Repositories?`,
          options: [
            "To provide abstract CRUD and custom database query methods without boilerplate SQL",
            "To handle CORS headers and HTTP request routing",
            "To encrypt user credentials using BCrypt hashing",
            "To render HTML pages dynamically on the server"
          ],
          correctAnswer: 0,
          explanation: "Spring Data JPA repositories reduce boilerplate code by providing built-in CRUD operations.",
          points
        },
        {
          question: `Which annotation is used to mark a class as a business service component in Spring?`,
          options: [
            "@Repository",
            "@Service",
            "@Component",
            "@Autowired"
          ],
          correctAnswer: 1,
          explanation: "@Service indicates that an annotated class holds business logic.",
          points
        }
      ]
      return springQuestions.slice(0, count)
    }

    if (cleanTopic.includes('java')) {
      const javaQuestions: QuizQuestion[] = [
        {
          question: "Which Java keyword is used to prevent a class from being inherited or a method from being overridden?",
          options: ["final", "static", "abstract", "private"],
          correctAnswer: 0,
          explanation: "The 'final' keyword prevents inheritance when applied to classes.",
          points
        },
        {
          question: "What is the difference between checking String equality with '==' and '.equals()' in Java?",
          options: [
            "'==' checks memory reference equality, while '.equals()' checks string content value",
            "Both check memory reference equality only",
            "Both check string content value only",
            "'.equals()' checks reference equality while '==' checks value"
          ],
          correctAnswer: 0,
          explanation: "'==' compares memory addresses, whereas String.equals() compares sequence of characters.",
          points
        },
        {
          question: "Which Java feature introduced in Java 8 allows treating functionality as a method argument?",
          options: [
            "Lambda Expressions and Functional Interfaces",
            "Generics",
            "Annotations",
            "Reflection API"
          ],
          correctAnswer: 0,
          explanation: "Lambda expressions enable functional programming in Java.",
          points
        },
        {
          question: "What is the primary role of the Java Virtual Machine (JVM)?",
          options: [
            "Executes Java bytecode and manages system memory (garbage collection)",
            "Compiles Java source code (.java) into bytecode (.class)",
            "Formats source code according to style rules",
            "Connects Java applications directly to hardware interfaces"
          ],
          correctAnswer: 0,
          explanation: "The JVM loads, verifies, and executes Java bytecode.",
          points
        },
        {
          question: "Which collection interface in Java guarantees unique elements with no duplicates?",
          options: ["Set", "List", "Queue", "ArrayList"],
          correctAnswer: 0,
          explanation: "The Set interface contains no duplicate elements.",
          points
        }
      ]
      return javaQuestions.slice(0, count)
    }

    const dynamicTemplates: QuizQuestion[] = [
      {
        question: `What is a core architecture principle when designing solutions in ${topic}?`,
        options: [
          `Separation of concerns and modular component structure in ${topic}`,
          `Combining all application logic into a single monolithic script`,
          `Avoiding unit testing and documentation`,
          `Hardcoding dynamic runtime configurations`
        ],
        correctAnswer: 0,
        explanation: `Modular design and separation of concerns are fundamental best practices in ${topic}.`,
        points
      },
      {
        question: `Which methodology is most effective for ensuring quality in ${topic}?`,
        options: [
          `Iterative development, peer code reviews, and automated testing`,
          `Deploying untested changes directly into production`,
          `Ignoring system log diagnostics`,
          `Disabling error logging and security checks`
        ],
        correctAnswer: 0,
        explanation: `Continuous integration and automated testing maintain software reliability in ${topic}.`,
        points
      },
      {
        question: `Why is performance optimization critical when scaling ${topic}?`,
        options: [
          `Reduces latency, resource consumption, and improves user experience`,
          `Increases application bundle sizes`,
          `Slows down server response times`,
          `Disables browser client caching`
        ],
        correctAnswer: 0,
        explanation: `Optimizing resource utilization ensures scalable performance.`,
        points
      },
      {
        question: `What is a common security consideration when working with ${topic}?`,
        options: [
          `Validating user input and enforcing authentication / authorization controls`,
          `Exposing secret API keys in public client code`,
          `Using unencrypted HTTP connections for sensitive data`,
          `Disabling database parameter sanitization`
        ],
        correctAnswer: 0,
        explanation: `Proper input validation and authentication are essential for protecting ${topic} applications.`,
        points
      },
      {
        question: `Which tool or strategy helps troubleshoot complex issues in ${topic}?`,
        options: [
          `Analyzing application logs and tracing stack traces`,
          `Deleting system configuration files`,
          `Ignoring error messages in console logs`,
          `Rebooting hardware without investigating root causes`
        ],
        correctAnswer: 0,
        explanation: `Detailed diagnostic logging and stack trace analysis enable efficient troubleshooting in ${topic}.`,
        points
      }
    ]

    return dynamicTemplates.slice(0, count)
  }

  static async generateQuizFromContent(content: string, questionCount: number = 5): Promise<QuizQuestion[]> {
    return this.getTopicSpecificQuestions('Lesson Content', 'medium', questionCount)
  }
}