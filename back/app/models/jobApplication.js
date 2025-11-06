const mongoose = require('mongoose');

const processedJobSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true
  },
  job_id: {
    type: String,
    required: true
  },
  job_title: {
    type: String,
    default: null
  },
  company_profile: {
    type: String,
    default: null
  },
  location: {
    type: String,
    default: null
  },
  date_posted: {
    type: String,
    default: null
  },
  employment_type: {
    type: String,
    default: null
  },
  job_summary: {
    type: String,
    default: null
  },
  key_responsibilities: {
    type: String,
    default: null
  },
  qualifications: {
    type: String,
    default: null
  },
  compensation_and_benfits: {
    type: String,
    default: null
  },
  application_info: {
    type: String,
    default: null
  },
  extracted_keywords: {
    type: String,
    default: null
  },
  processed_at: {
    type: Date,
    default: Date.now
  }
}, {
    collection : 'ProcessedJob' // the collection to use for this schema
  });

const jobSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true
  },
  job_id: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});
const ProcessedJob = mongoose.model('ProcessedJob', processedJobSchema);
const Job = mongoose.model('Job', jobSchema);
module.exports = {
  ProcessedJob, // Key and value are the same: { ProcessedJob: ProcessedJob }
  Job           // Key and value are the same: { Job: Job }
};