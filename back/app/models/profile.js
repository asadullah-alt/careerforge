const mongoose = require('mongoose');

const ExperienceSchema = new mongoose.Schema({
  title: { type: String },
  company: { type: String },
  duration: { type: String }
}, { _id: false });

const EducationSchema = new mongoose.Schema({
  school: { type: String },
  degree: { type: String },
  duration: { type: String }
}, { _id: false });

const ProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  profileUrl: { type: String, required: true },
  name: { type: String },
  headline: { type: String },
  location: { type: String },
  about: { type: String },
  experience: { type: [ExperienceSchema], default: [] },
  rawExperience: { type: String, default: '' },
  rawEducation: { type: String, default: '' },
  rawSkills: { type: String, default: '' },
  rawProjects: { type: String, default: '' },
  education: { type: [EducationSchema], default: [] },
  skills: { type: [String], default: [] }
}, { timestamps: true });

module.exports = mongoose.model('Profile', ProfileSchema);
