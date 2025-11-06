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
  jobTitle: {
    type: String,
    default: null
  },
  companyProfile: {
    companyName: {
      type: String,
      required: true
    },
    industry: {
      type: String,
      default: null
    },
    website: {
      type: String,
      default: null
    },
    description: {
      type: String,
      default: null
    }
  },
  location: {
    city: {
      type: String,
      default: null
    },
    state: {
      type: String,
      default: null
    },
    country: {
      type: String,
      default: null
    },
    remoteStatus: {
      type: String,
      default: null
    }
  },
  datePosted: {
    type: String,
    default: null
  },
  employmentType: {
    type: String,
    default: null
  },
  jobSummary: {
    type: String,
    default: null
  },
  keyResponsibilities: {
    type: [String],
    default: []
  },
  qualifications: {
    required: {
      type: [String],
      default: []
    },
    preferred: {
      type: [String],
      default: []
    }
  },
  compensationAndBenefits: {
    type: String,
    default: null
  },
  applicationInfo: {
    howToApply: {
      type: String,
      default: null
    },
    applyLink: {
      type: String,
      default: null
    },
    contactEmail: {
      type: String,
      default: null
    }
  },
  extractedKeywords: {
    type: [String],
    default: []
  },
  processed_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
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