# AI Resume Builder Module Documentation

## Overview

The AI Resume Builder is a comprehensive Next.js module integrated into your CareerForge application. It allows users to create, edit, and export professional resumes using AI-powered parsing and a beautiful, intuitive interface.

## Features

✅ **AI-Powered Resume Parsing** - Generate structured resume data from raw text
✅ **Multi-Section Forms** - Edit personal data, experiences, projects, skills, and education
✅ **Live Preview** - Real-time resume preview with professional styling
✅ **Multiple Export Formats** - Export as HTML (printable), JSON, or PDF
✅ **State Persistence** - Resume data is saved to browser localStorage
✅ **Responsive Design** - Works perfectly on desktop and tablet
✅ **Dark Mode Support** - Fully compatible with your existing theme system
✅ **ATS-Friendly Output** - Resume preview is designed for Applicant Tracking Systems

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── resume/
│   │       ├── generate/route.ts      # AI resume generation endpoint
│   │       ├── save/route.ts          # Save resume to database
│   │       └── load/route.ts          # Load resume from database
│   └── dashboard/
│       └── resume/
│           └── page.tsx                # Main resume builder page
├── components/
│   └── resume/
│       ├── personal-data-form.tsx     # Personal information form
│       ├── experiences-form.tsx       # Work experience form
│       ├── projects-form.tsx          # Projects form
│       ├── skills-form.tsx            # Skills form
│       ├── education-form.tsx         # Education form
│       ├── resume-preview.tsx         # Live resume preview
│       ├── generate-resume-dialog.tsx # AI generation dialog
│       └── export-resume-dialog.tsx   # Export options dialog
├── lib/
│   ├── schemas/
│   │   └── resume.ts                  # Zod validation schemas
│   └── resume-pdf.ts                  # PDF/export utilities
└── store/
    └── resume-store.ts                # Zustand state management
```

## Installation & Setup

### 1. Install Dependencies

The module uses `react-textarea-autosize` for dynamic text areas. Install it with:

```bash
cd front
npm install react-textarea-autosize
# If not already installed:
npm install zustand
```

### 2. Access the Resume Builder

Navigate to `/dashboard/resume` in your application:

```
http://localhost:3000/dashboard/resume
```

## Usage Guide

### Create a New Resume

1. **Generate with AI** (Recommended)
   - Click "Generate with AI" button
   - Paste your resume text or description
   - Click "Generate Resume"
   - AI will parse and structure your data automatically

2. **Manual Entry**
   - Fill in personal information
   - Add work experiences, projects, skills, and education
   - Use the tabs to navigate between sections
   - Click "Save" after each section

### Edit Resume Data

- Use the tabs at the top to navigate between sections
- Each section has a form with clear labels
- Changes are automatically synced to the preview
- For repeating items (experiences, projects, skills), click "Add" to add more

### Live Preview

- The right panel shows a real-time preview of your resume
- Updates as you type
- Responsive design shows how it looks when printed
- Click anywhere on the preview to see how it would print

### Export Your Resume

Click the "Export" button to choose from:

- **HTML (Printable)** - Opens in your browser, print to PDF using Ctrl+P or Cmd+P
- **JSON** - For backup or import into other tools
- **PDF** - Coming soon! (Requires `@react-pdf/renderer`)

### Save to Database

Click "Save" to save your resume to the database:

```
POST /api/resume/save
```

Current implementation is a mock. To integrate with your backend:

1. Update `src/app/api/resume/save/route.ts`
2. Add authentication check
3. Save to your database
4. Return resume ID

## Data Model

The resume follows this structure (defined in `src/lib/schemas/resume.ts`):

```typescript
{
  personal_data: {
    firstName: string           // Required
    lastName?: string
    email?: string
    phone?: string
    linkedin?: string           // URL
    portfolio?: string          // URL
    location: {
      city?: string
      country?: string
    }
  },
  experiences: [{
    job_title: string           // Required
    company?: string
    location?: string
    start_date: string          // Required
    end_date: string            // Required
    description: string[]       // Array of bullet points
    technologies_used?: string[]
  }],
  projects: [{
    project_name: string        // Required
    description?: string
    technologies_used: string[] // Required
    link?: string               // URL
    start_date?: string
    end_date?: string
  }],
  skills: [{
    category?: string
    skill_name: string          // Required
  }],
  education: [{
    institution?: string
    degree?: string
    field_of_study?: string
    start_date?: string
    end_date?: string
    grade?: string
    description?: string
  }],
  research_work: [{
    title?: string
    publication?: string
    date?: string
    link?: string              // URL
    description?: string
  }],
  achievements: string[],
  extracted_keywords: string[]
}
```

## State Management

Uses **Zustand** for client-side state management:

```typescript
import { useResumeStore } from '@/store/resume-store'

// In your component
const resume = useResumeStore((state) => state.resume)
const updatePersonalData = useResumeStore((state) => state.updatePersonalData)
```

Available actions:
- `initializeResume(resume)` - Set complete resume
- `resetResume()` - Clear all data
- `updatePersonalData(data)` - Update personal info
- `addExperience(experience)` - Add work experience
- `updateExperience(index, experience)` - Update experience
- `removeExperience(index)` - Remove experience
- `reorderExperiences(fromIndex, toIndex)` - Reorder experiences
- Similar methods for projects, skills, education, etc.

Data is automatically persisted to `localStorage` with key `resume-store`.

## API Routes

### Generate Resume with AI
```
POST /api/resume/generate
Content-Type: application/json

{
  "text": "Raw resume text or description"
}

Response:
{
  "success": true,
  "data": { ...structured resume data... }
}
```

**Current Implementation**: Returns mock data. To integrate with OpenAI:

```typescript
// In src/app/api/resume/generate/route.ts
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const response = await openai.chat.completions.create({
  model: 'gpt-4-turbo-preview',
  messages: [{
    role: 'user',
    content: `Parse this resume and return structured JSON...\n\n${text}`
  }]
});
```

### Save Resume
```
POST /api/resume/save
Content-Type: application/json

{ ...complete resume data... }

Response:
{
  "success": true,
  "id": "resume_123456"
}
```

### Load Resume
```
GET /api/resume/load?id=resume_123456

Response:
{
  "success": true,
  "data": { ...resume data... }
}
```

### Delete Resume
```
DELETE /api/resume/load?id=resume_123456

Response:
{
  "success": true,
  "message": "Resume deleted successfully"
}
```

## Customization

### Styling

All components use your existing Tailwind CSS configuration and Shadcn UI components. To customize:

1. **Colors** - Edit `tailwind.config.js`
2. **Typography** - Modify base styles in `src/app/globals.css`
3. **Component Styles** - Edit individual component files in `src/components/resume/`

### Form Validation

All forms use React Hook Form + Zod. To modify validation rules:

Edit `src/lib/schemas/resume.ts`:

```typescript
export const PersonalDataSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  // ... modify validation here
})
```

### Resume Preview Design

To change the resume preview layout:

Edit `src/components/resume/resume-preview.tsx`:

```typescript
export function ResumePreview({ data }: ResumePreviewProps) {
  // Modify the JSX to change layout
  // Add CSS classes to customize styling
}
```

## Advanced Features

### Enable PDF Export

1. Install `@react-pdf/renderer`:
```bash
npm install @react-pdf/renderer
```

2. Uncomment the implementation in `src/lib/resume-pdf.ts`

3. Update `src/components/resume/export-resume-dialog.tsx` to enable PDF button

### Integration with Backend

To save resumes to your database:

1. **Add Authentication**:
```typescript
// src/app/api/resume/save/route.ts
const token = request.headers.get('authorization');
const userId = await verifyToken(token);
```

2. **Database Schema**:
```sql
CREATE TABLE resumes (
  id STRING PRIMARY KEY,
  user_id STRING,
  data JSON,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
)
```

3. **Save Implementation**:
```typescript
await db.resumes.create({
  userId,
  data: validatedResume,
  createdAt: new Date(),
  updatedAt: new Date()
});
```

### Custom AI Service

To use a different AI service for resume parsing:

1. Update `src/app/api/resume/generate/route.ts`
2. Call your preferred API (Claude, Google's Gemini, etc.)
3. Return data in the StructuredResume format
4. Validate with `StructuredResumeSchema.parse()`

Example with Anthropic Claude:
```typescript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();
const response = await client.messages.create({
  model: 'claude-3-sonnet-20240229',
  messages: [{
    role: 'user',
    content: `Parse this resume text and return structured JSON...`
  }]
});
```

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers with localStorage support
- IE11+ (with polyfills)

## Performance Optimization

- Component code splitting with dynamic imports
- Local state with Zustand (lightweight, ~2KB)
- Lazy loading of heavy UI components
- Memoized preview rendering

## Security Considerations

- All data is validated with Zod schemas
- No sensitive data sent to third-party services (unless configured)
- localStorage data is unencrypted (consider adding encryption for production)
- CSRF protection on API routes

## Troubleshooting

### Resume Data Not Persisting
- Check browser localStorage is enabled
- Check browser dev tools > Application > Local Storage
- Look for `resume-store` key

### AI Generation Fails
- Check API endpoint is accessible
- Verify API key environment variables
- Check browser console for error messages

### Export Not Working
- Ensure all required data is filled
- Check for JavaScript errors in console
- For HTML export, verify pop-ups aren't blocked

### Dark Mode Not Working
- Verify ThemeProvider is wrapping app
- Check `dark` class on `<html>` element
- Clear browser cache and reload

## Future Enhancements

- [ ] Real PDF export with @react-pdf/renderer
- [ ] Resume templates (multiple styles)
- [ ] Collaboration/sharing features
- [ ] ATS optimization analyzer
- [ ] Resume version history
- [ ] Mobile app integration
- [ ] Interview prep integration
- [ ] Job matching based on resume

## Support & Contributing

For issues or feature requests, please create an issue in the repository.

## License

This module is part of CareerForge and follows the same license as the main project.
