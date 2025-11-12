'use client'

import React from 'react'
import { StructuredResume } from './types'
import { Badge } from '@/components/ui/badge'
import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react'

interface ResumeViewerProps {
  resume: StructuredResume
}

export function ResumeViewer({ resume }: ResumeViewerProps) {
  return (
    <div className="w-full max-w-4xl mx-auto bg-white dark:bg-slate-900 p-8 rounded-lg shadow-lg">
      {/* Personal Data Section */}
      <div className="mb-6">
        <h1 className="text-4xl font-bold">
          {resume.personalData.firstName} {resume.personalData.lastName}
        </h1>
        <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-600 dark:text-gray-300">
          {resume.personalData.email && (
            <a href={`mailto:${resume.personalData.email}`} className="flex items-center gap-1 hover:text-primary">
              <Mail className="w-4 h-4" />
              {resume.personalData.email}
            </a>
          )}
          {resume.personalData.phone && (
            <a href={`tel:${resume.personalData.phone}`} className="flex items-center gap-1 hover:text-primary">
              <Phone className="w-4 h-4" />
              {resume.personalData.phone}
            </a>
          )}
          {resume.personalData.location && (
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {resume.personalData.location.city && resume.personalData.location.city}
              {resume.personalData.location.city && resume.personalData.location.country && ', '}
              {resume.personalData.location.country && resume.personalData.location.country}
            </div>
          )}
          {resume.personalData.linkedin && (
            <a href={resume.personalData.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-primary">
              <Linkedin className="w-4 h-4" />
              LinkedIn
            </a>
          )}
          {resume.personalData.portfolio && (
            <a href={resume.personalData.portfolio} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-primary">
              <Globe className="w-4 h-4" />
              Portfolio
            </a>
          )}
        </div>
      </div>

      <div className="border-b-2 border-gray-300 dark:border-gray-600 my-4" />

      {/* Education Section */}
      {resume.education && resume.education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-3">Education</h2>
          {resume.education.map((edu, idx) => (
            <div key={idx} className="mb-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{edu.degree}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{edu.institution}</p>
                  {edu.fieldOfStudy && <p className="text-sm text-gray-500 dark:text-gray-400">{edu.fieldOfStudy}</p>}
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {edu.startDate && edu.endDate && `${edu.startDate} - ${edu.endDate}`}
                </span>
              </div>
              {edu.description && <p className="text-sm mt-1 text-gray-600 dark:text-gray-300">{edu.description}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Experience Section */}
      {resume.experiences && resume.experiences.length > 0 && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-3">Experience</h2>
          {resume.experiences.map((exp, idx) => (
            <div key={idx} className="mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{exp.jobTitle}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{exp.company}</p>
                  {exp.location && <p className="text-sm text-gray-500 dark:text-gray-400">{exp.location}</p>}
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {exp.startDate} - {exp.endDate}
                </span>
              </div>
              <ul className="list-disc list-inside mt-2 space-y-1">
                {exp.description.map((desc, i) => (
                  <li key={i} className="text-sm text-gray-700 dark:text-gray-200">{desc}</li>
                ))}
              </ul>
              {exp.technologiesUsed && exp.technologiesUsed.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {exp.technologiesUsed.map((tech, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">{tech}</Badge>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Projects Section */}
      {resume.projects && resume.projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-3">Projects</h2>
          {resume.projects.map((project, idx) => (
            <div key={idx} className="mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{project.projectName}</h3>
                  {project.description && <p className="text-gray-600 dark:text-gray-300 text-sm">{project.description}</p>}
                </div>
                {project.link && (
                  <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm">
                    View Project
                  </a>
                )}
              </div>
              {project.technologiesUsed && project.technologiesUsed.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {project.technologiesUsed.map((tech, i) => (
                    <Badge key={i} variant="outline" className="text-xs">{tech}</Badge>
                  ))}
                </div>
              )}
              {(project.startDate || project.endDate) && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  {project.startDate && project.endDate && `${project.startDate} - ${project.endDate}`}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Skills Section */}
      {resume.skills && resume.skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-3">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {resume.skills.map((skill, idx) => (
              <Badge key={idx} className="text-sm">{skill.skillName}</Badge>
            ))}
          </div>
        </div>
      )}

      {/* Research Work Section */}
      {resume.researchWork && resume.researchWork.length > 0 && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-3">Research Work</h2>
          {resume.researchWork.map((research, idx) => (
            <div key={idx} className="mb-3">
              <h3 className="font-semibold">{research.title}</h3>
              {research.publication && <p className="text-gray-600 dark:text-gray-300">{research.publication}</p>}
              {research.description && <p className="text-sm text-gray-700 dark:text-gray-200 mt-1">{research.description}</p>}
              {research.link && (
                <a href={research.link} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm">
                  View Publication
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Achievements Section */}
      {resume.achievements && resume.achievements.length > 0 && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-3">Achievements</h2>
          <ul className="list-disc list-inside space-y-1">
            {resume.achievements.map((achievement, idx) => (
              <li key={idx} className="text-gray-700 dark:text-gray-200">{achievement}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Keywords Section */}
      {resume.extractedKeywords && resume.extractedKeywords.length > 0 && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-3">Keywords</h2>
          <div className="flex flex-wrap gap-2">
            {resume.extractedKeywords.map((keyword, idx) => (
              <Badge key={idx} variant="outline" className="text-xs">{keyword}</Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
