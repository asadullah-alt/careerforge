import { NextRequest, NextResponse } from 'next/server';
import { GenerateResumeRequestSchema, StructuredResumeSchema } from '@/lib/schemas/resume';

/**
 * Mock AI Resume Generator API
 * Accepts raw resume text and returns a StructuredResume object
 * This is a mock implementation that returns sample data
 */

const MOCK_RESUME_DATA = {
  personal_data: {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    linkedin: "https://linkedin.com/in/johndoe",
    portfolio: "https://johndoe.dev",
    location: {
      city: "San Francisco",
      country: "United States",
    },
  },
  experiences: [
    {
      job_title: "Senior Full Stack Engineer",
      company: "Tech Company Inc.",
      location: "San Francisco, CA",
      start_date: "2021-01-15",
      end_date: "2024-11-13",
      description: [
        "Led development of microservices architecture serving 1M+ users",
        "Mentored junior developers and conducted code reviews",
        "Reduced API response time by 45% through optimization",
        "Implemented CI/CD pipeline reducing deployment time by 60%",
      ],
      technologies_used: ["TypeScript", "Node.js", "React", "PostgreSQL", "Docker", "Kubernetes"],
    },
    {
      job_title: "Full Stack Developer",
      company: "Startup XYZ",
      location: "Remote",
      start_date: "2019-06-01",
      end_date: "2020-12-31",
      description: [
        "Built entire product from scratch using modern web technologies",
        "Designed and implemented RESTful APIs",
        "Created responsive UI components with React",
      ],
      technologies_used: ["JavaScript", "React", "Node.js", "MongoDB"],
    },
  ],
  projects: [
    {
      project_name: "AI Resume Builder",
      description: "A full-stack web application that uses AI to parse and structure resume data",
      technologies_used: ["TypeScript", "Next.js", "Zod", "React Hook Form", "Tailwind CSS"],
      link: "https://github.com/johndoe/ai-resume-builder",
      start_date: "2024-08-01",
      end_date: "2024-11-13",
    },
    {
      project_name: "Real-time Chat Application",
      description: "WebSocket-based chat app with end-to-end encryption",
      technologies_used: ["WebSocket", "React", "Node.js", "MongoDB"],
      link: "https://github.com/johndoe/chat-app",
      start_date: "2024-03-01",
      end_date: "2024-06-30",
    },
  ],
  skills: [
    { category: "Frontend", skill_name: "React" },
    { category: "Frontend", skill_name: "TypeScript" },
    { category: "Frontend", skill_name: "Tailwind CSS" },
    { category: "Backend", skill_name: "Node.js" },
    { category: "Backend", skill_name: "PostgreSQL" },
    { category: "Backend", skill_name: "MongoDB" },
    { category: "DevOps", skill_name: "Docker" },
    { category: "DevOps", skill_name: "Kubernetes" },
    { category: "DevOps", skill_name: "CI/CD" },
  ],
  education: [
    {
      institution: "University of California, Berkeley",
      degree: "Bachelor of Science",
      field_of_study: "Computer Science",
      start_date: "2015-09-01",
      end_date: "2019-05-31",
      grade: "3.8",
      description: "Specialized in distributed systems and machine learning",
    },
  ],
  research_work: [
    {
      title: "Optimizing Distributed Systems Performance",
      publication: "IEEE Conference on System Optimization",
      date: "2023-06-01",
      link: "https://example.com/research/paper1",
      description: "Research on improving latency in distributed computing environments",
    },
  ],
  achievements: [
    "Published 3 technical articles on Medium with 50K+ combined views",
    "Speaker at React Conference 2023",
    "Contributed to 5+ open-source projects with 2K+ GitHub stars",
    "AWS Certified Solutions Architect - Professional",
  ],
  extracted_keywords: [
    "Full Stack Development",
    "Microservices Architecture",
    "Cloud Infrastructure",
    "Team Leadership",
    "API Design",
    "Performance Optimization",
    "System Design",
  ],
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validatedInput = GenerateResumeRequestSchema.parse(body);

    // In a real implementation, this would call an AI service like OpenAI's GPT
    // For now, we'll return mock data
    // You can implement real parsing here by uncommenting and configuring an AI service

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Validate the mock data against the schema
    const validatedResume = StructuredResumeSchema.parse(MOCK_RESUME_DATA);

    return NextResponse.json(
      {
        success: true,
        data: validatedResume,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[Resume Generate API] Error:', error);

    if (error instanceof Error) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to generate resume',
      },
      { status: 500 }
    );
  }
}

/**
 * Example: Integration with OpenAI GPT API
 * 
 * import OpenAI from 'openai';
 * 
 * const openai = new OpenAI({
 *   apiKey: process.env.OPENAI_API_KEY,
 * });
 * 
 * async function parseResumeWithAI(text: string) {
 *   const response = await openai.chat.completions.create({
 *     model: 'gpt-4-turbo-preview',
 *     messages: [
 *       {
 *         role: 'system',
 *         content: 'You are an expert resume parser. Extract and structure resume data into JSON format.',
 *       },
 *       {
 *         role: 'user',
 *         content: `Parse this resume and return structured JSON:\n\n${text}`,
 *       },
 *     ],
 *   });
 * 
 *   const content = response.choices[0].message.content;
 *   if (!content) throw new Error('No response from AI');
 * 
 *   return JSON.parse(content);
 * }
 */
