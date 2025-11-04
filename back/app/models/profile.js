const mongoose = require('mongoose');

const ExperienceSchema = new mongoose.Schema({
  jobTitle: { type: String },
  companyName: { type: String },
  startTime: { type: Date },
  endTime: { type: String },
  address: { type: String },
  description: { type: String },
  companyPicURL: { type: String }
}, { _id: false });

const EducationSchema = new mongoose.Schema({
  QualificationName: { type: String },
  EducationalInstitute: { type: String },
  endTime: { type: Date },
  startTime: { type: Date },
  Grade: { type: String },
}, { _id: false });

const ProjectSchema = new mongoose.Schema({
  projectName: { type: String },
  description: { type: String },
  associatedWith: { type: String },
  startTime: { type: Date },
  endTime: { type: Date }
}, { _id: false });

const ProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  profileUrl: { type: String, required: true },
  name: { type: String },
  headline: { type: String },
  location: { type: String },
  about: { type: String },
  experience: { type: [ExperienceSchema], default: [] },
  projects: { type: [ProjectSchema], default: [] },
  education: { type: [EducationSchema], default: [] },
  skills: { type: [String], default: [] }
}, { timestamps: true });

module.exports = mongoose.model('Profile', ProfileSchema);
