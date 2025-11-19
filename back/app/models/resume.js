const mongoose = require('mongoose');

// Sub-schemas based on the provided Pydantic model
const LocationSchema = new mongoose.Schema({
  city: { type: String, default: null },
  country: { type: String, default: null },
});

const PersonalDataSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, default: null },
  email: { type: String, default: null },
  phone: { type: String, default: null },
  linkedin: { type: String, default: null },
  portfolio: { type: String, default: null },
  location: { type: LocationSchema, default: {} },
});

const ExperienceSchema = new mongoose.Schema({
  job_title: { type: String, required: true },
  company: { type: String, default: null },
  location: { type: String, default: null },
  start_date: { type: String, required: true },
  end_date: { type: String, required: true },
  description: { type: [String], default: [] },
  technologies_used: { type: [String], default: [] },
});

const ProjectSchema = new mongoose.Schema({
  project_name: { type: String, required: true },
  description: { type: String, default: null },
  technologies_used: { type: [String], default: [] },
  link: { type: String, default: null },
  start_date: { type: String, default: null },
  end_date: { type: String, default: null },
});

const SkillSchema = new mongoose.Schema({
  category: { type: String, default: null },
  skill_name: { type: String, required: true },
});

const ResearchWorkSchema = new mongoose.Schema({
  title: { type: String, default: null },
  publication: { type: String, default: null },
  date: { type: String, default: null },
  link: { type: String, default: null },
  description: { type: String, default: null },
});

const EducationSchema = new mongoose.Schema({
  institution: { type: String, default: null },
  degree: { type: String, default: null },
  field_of_study: { type: String, default: null },
  start_date: { type: String, default: null },
  end_date: { type: String, default: null },
  grade: { type: String, default: null },
  description: { type: String, default: null },
});



// ProcessedResume schema
const ProcessedResumeSchema = new mongoose.Schema({
  resume_id:{type:String,index:true},
  user_id: {type:String },
  title: { type: String, default: 'Untitled Resume' },
   personal_data: { type: PersonalDataSchema, required: true },
  experiences: { type: [ExperienceSchema], default: [] },
  projects: { type: [ProjectSchema], default: [] },
  skills: { type: [SkillSchema], default: [] },
  research_work: { type: [ResearchWorkSchema], default: [] },
  achievements: { type: [String], default: [] },
  education: { type: [EducationSchema], default: [] },
  extracted_keywords: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, {
    collection : 'ProcessedResume' // the collection to use for this schema
  });

ProcessedResumeSchema.index({ user_id: 1, updatedAt: -1 });

module.exports = mongoose.model('ProcessedResume', ProcessedResumeSchema);
