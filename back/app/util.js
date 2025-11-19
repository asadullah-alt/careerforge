const cheerio = require('cheerio');

/**
 * Extracts skills from LinkedIn profile HTML
 * @param {string} html - The HTML content from LinkedIn profile skills section
 * @returns {Array<string>} - Array of unique skills
 */
function extractSkills(html) {
  const skills = [];
  const $ = cheerio.load(html);
  
  // Find all list items in the skills section
  const listItems = $('li[id*="profilePagedListComponent"]');
  
  listItems.each((i, item) => {
    // Look for span elements that contain skill names
    const spans = $(item).find('span[aria-hidden="true"]');
    
    spans.each((j, span) => {
      const text = $(span).text().trim();
      
      // Filter out empty strings, endorsement text, and other non-skill content
      if (text && 
          !text.includes('endorsement') && 
          !text.includes('Show more') &&
          text.length > 0) {
        skills.push({ category: null, skill_name: text });
      }
    });
  });
  
  // Remove duplicates and return
  return [...new Set(skills)];
}

// Alternative approach using regex (works without DOM parser)
function extractSkillsWithRegex(html) {
  const skills = new Set();

  // Pattern to match skill names in the specific HTML structure
  const pattern = /<span aria-hidden="true"><!---->([^<]+?)<!----><\/span>/g;

  let match;
  while ((match = pattern.exec(html)) !== null) {
    const skill = match[1].trim();

    // Filter out endorsement text and empty strings
    if (skill && !skill.includes('endorsement') && !skill.includes('Show more')) {
      skills.add(skill);
    }
  }

  // Return array of Skill objects compatible with ProcessedResume schema
  return Array.from(skills).map(s => ({ category: null, skill_name: s }));
}

function cleanHTML(htmlContent, moduleTypeCV = 'default') {
  // Default options - remove everything by default
  const defaultOptions = {
    removeScript: true,
    removeStyle: true,
    removeInlineStyle: true,
    removeEvents: true,
    removeLink: true,
    removeImg: true,
    removeIframe: true,
    removeClasses: true,
    removeATags: true,
    removeMeta: true,
    removeNewlines: true
  };

  // Merge user options with defaults
  const opts = { ...defaultOptions };

  let cleaned = htmlContent;

  // Remove <script> tags and their content
  if (opts.removeScript) {
    cleaned = cleaned.replace(/<script\b[^>]*>.*?<\/script>/gis, '');
  }

  // Remove <style> tags and their content
  if (opts.removeStyle) {
    cleaned = cleaned.replace(/<style\b[^>]*>.*?<\/style>/gis, '');
  }

  // Remove inline style attributes
  if (opts.removeInlineStyle) {
    cleaned = cleaned.replace(/\s+style\s*=\s*["'][^"']*["']/gi, '');
  }

  // Remove inline event handlers (onclick, onload, etc.)
  if (opts.removeEvents) {
    cleaned = cleaned.replace(/\s+on\w+\s*=\s*["'][^"']*["']/gi, '');
  }

  // Remove <link> tags for stylesheets
  if (opts.removeLink) {
    cleaned = cleaned.replace(/<link\b[^>]*(?:rel\s*=\s*["']stylesheet["']|type\s*=\s*["']text\/css["'])[^>]*>/gi, '');
  }

  // Remove <img> tags
  if (opts.removeImg) {
    cleaned = cleaned.replace(/<img\b[^>]*>/gi, '');
  }

  // Remove <iframe> tags and their content
  if (opts.removeIframe) {
    cleaned = cleaned.replace(/<iframe\b[^>]*>.*?<\/iframe>/gis, '');
  }

  // Remove class attributes
  if (opts.removeClasses) {
    cleaned = cleaned.replace(/\s+class\s*=\s*["'][^"']*["']/gi, '');
  }

  // Remove <a> tags but keep the text content
  if (opts.removeATags) {
    cleaned = cleaned.replace(/<a\b[^>]*>(.*?)<\/a>/gis, '$1');
  }

  // Remove <meta> tags
  if (opts.removeMeta) {
    cleaned = cleaned.replace(/<meta\b[^>]*>/gi, '');
  }

  // Remove newlines
  if (opts.removeNewlines) {
    cleaned = cleaned.replace(/\n/g, '');
  }

  if (moduleTypeCV === 'skills') {
    const skillsArray = extractSkills(cleaned);
    return skillsArray;
  }

  if (moduleTypeCV === "projects") {
    const projectsArray = parseLinkedInProjects(cleaned);
    return projectsArray;
  }

  if(moduleTypeCV === "experience") {
    const experienceArray = parseLinkedInExperience(cleaned);
    return experienceArray;
  }
  if(moduleTypeCV === "education") {
    const educationArray = parseEducation(cleaned);
    return educationArray;
  }

  return cleaned;
}

function parseLinkedInProjects(html) {
  const $ = cheerio.load(html);
  
  // Find all project list items
  const projectItems = $('li[id^="profilePagedListComponent"]');
  
  const projects = [];
  
  projectItems.each((i, item) => {
    const project = {
      project_name: null,
      start_date: null,
      end_date: null,
      associatedWith: null,
      description: null,
      technologies_used: [],
      link: null
    };
    
    // Extract project name
    const nameElements = $(item).find('span[aria-hidden="true"]');
    let foundName = false;
    nameElements.each((j, elem) => {
      if (foundName) return;
      const text = $(elem).text().trim();
      // First substantial text is usually the project name
      if (text && !text.includes('Associated with') && !text.includes('Aug ') && 
          !text.includes('Sep ') && !text.includes('Jan ') && !text.includes('Feb ') &&
          !text.includes('Mar ') && !text.includes('Apr ') && !text.includes('May ') &&
          !text.includes('Jun ') && !text.includes('Jul ') && !text.includes('Oct ') &&
          !text.includes('Nov ') && !text.includes('Dec ')) {
        project.project_name = text;
        foundName = true;
      }
    });
    
    // Extract dates
    const dateElements = $(item).find('span > span[aria-hidden="true"]');
    let foundDate = false;
    dateElements.each((j, elem) => {
      if (foundDate) return;
      const text = $(elem).text().trim();
      if (text.includes(' - ')) {
        const [start, end] = text.split(' - ').map(s => s.trim());
        const sd = parseDate(start);
        const ed = parseDate(end);
        project.start_date = sd ? sd.toISOString().slice(0,10) : null;
        project.end_date = ed ? ed.toISOString().slice(0,10) : null;
        foundDate = true;
      }
    });
    
    // Extract associated organization
    const allSpans = $(item).find('span[aria-hidden="true"]');
    let foundAssoc = false;
    allSpans.each((j, elem) => {
      if (foundAssoc) return;
      const text = $(elem).text().trim();
      if (text.startsWith('Associated with ')) {
        project.associatedWith = text.replace('Associated with ', '');
        foundAssoc = true;
      }
    });
    
    // Extract description (usually the longest text content)
    let longestText = '';
    allSpans.each((j, elem) => {
      const text = $(elem).text().trim();
      // Description is typically a long paragraph
      if (text.length > longestText.length && text.length > 50 && !text.startsWith('Associated with') && text !== project.project_name) {
        longestText = text;
      }
    });
    if (longestText) {
      project.description = longestText;
      // Attempt to extract technologies used by splitting on common separators
      const techMatches = longestText.match(/\b(JavaScript|TypeScript|React|Node|Python|Django|Flask|MongoDB|Postgres|SQL|AWS|Docker|Kubernetes|C\+\+|Java|Go)\b/ig);
      if (techMatches) {
        project.technologies_used = Array.from(new Set(techMatches.map(t => t.trim())));
      }
    }
    
    projects.push({
      project_name: project.project_name,
      description: project.description,
      technologies_used: project.technologies_used,
      link: project.link,
      start_date: project.start_date,
      end_date: project.end_date,
      associatedWith: project.associatedWith
    });
  });
  
  return projects;
}

/**
 * Helper function to parse date strings into Date objects
 * @param {string} dateStr - Date string like "Aug 2021" or "Present"
 * @returns {Date|null} Parsed date or null
 */
function parseDate(dateStr) {
  if (!dateStr || dateStr.toLowerCase() === 'present') {
    return null;
  }
  
  const monthMap = {
    'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
    'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
  };
  
  const parts = dateStr.split(' ');
  if (parts.length === 2) {
    const month = monthMap[parts[0]];
    const year = parseInt(parts[1]);
    if (month !== undefined && !isNaN(year)) {
      return new Date(year, month, 1);
    }
  }
  
  return null;
}


function parseLinkedInExperience(html) {
  const $ = cheerio.load(html);
  
  // Find all experience list items
  const experienceItems = $('li[id*="profilePagedListComponent"]');
  const jobs = [];
  
  experienceItems.each((index, item) => {
    const $item = $(item);
    
    const job = {
      job_title: null,
      start_date: null,
      end_date: null,
      location: null,
      description: [],
      company: null,
      companyPicURL: null,
      technologies_used: []
    };
    
    // Extract all span elements with aria-hidden="true"
    const spans = $item.find('span[aria-hidden="true"]');
    const spanTexts = [];

    spans.each((i, span) => {
      const text = $(span).text().trim();
      if (text) spanTexts.push(text);
    });
    
    // Extract job title (usually the first span that doesn't contain · or dates)
    if (spanTexts.length > 0) {
      const titleText = spanTexts[0];
      if (titleText && !titleText.includes('·') && !titleText.includes('-') && !titleText.match(/\d{4}/)) {
        job.job_title = titleText;
      }
    }
    
    // Extract company name (span that contains · and employment type)
    const companySpan = spanTexts.find(text => text.includes('·') && (text.includes('Full-time') || text.includes('Part-time') || text.includes('Contract') || text.includes('Internship')));
    if (companySpan) {
      const companyText = companySpan.split('·')[0].trim();
      if (companyText) job.company = companyText;
    }
    
    // Extract date range (start and end time)
    const dateSpan = spanTexts.find(text => text.includes('Present') || (text.match(/\d{4}/) && (text.includes('-') || text.includes('to'))));
    if (dateSpan) {
      const dateMatch = dateSpan.match(/([\w\s]+\d{4})\s*[-–to]+\s*([\w\s]+\d{4}|Present)/i);
      if (dateMatch) {
        const startStr = dateMatch[1].trim();
        const endStr = dateMatch[2].trim();
        const sd = parseDateExp(startStr);
        job.start_date = sd ? sd.toISOString().slice(0,10) : null;
        if (endStr.toLowerCase().includes('present')) {
          job.end_date = 'Present';
        } else {
          const ed = parseDateExp(endStr);
          job.end_date = ed ? ed.toISOString().slice(0,10) : endStr;
        }
      }
    }
    
    // Extract location/address
    const locationSpan = spanTexts.find(text => !text.includes('·') && !text.includes('-') && !text.match(/\d{4}/) && text.length > 2 && text.length < 100 && text !== job.job_title && text !== job.company && (text.includes('Pakistan') || text.includes('Islamabad') || text.includes('On-site') || text.includes('Hybrid') || text.includes('Remote') || text.includes('Comsats')));
    if (locationSpan) job.location = locationSpan;
    
    // Extract description (look for bullet point content)
    const descriptionElements = $item.find('div ul li div span[aria-hidden="true"]');
    const descriptions = [];
    descriptionElements.each((i, el) => {
      const text = $(el).text().trim();
      if (text && text.length > 20) descriptions.push(text);
    });
    if (descriptions.length > 0) job.description = descriptions;
    
    // Extract company picture URL
    const img = $item.find('img').first();
    if (img.length && img.attr('src')) job.companyPicURL = img.attr('src');
    
    // Try extracting simple technology mentions from spanTexts or descriptions
    const techMatches = spanTexts.join(' ').match(/\b(JavaScript|TypeScript|React|Node|Python|Django|Flask|MongoDB|Postgres|SQL|AWS|Docker|Kubernetes|C\+\+|Java|Go)\b/ig);
    if (techMatches) job.technologies_used = Array.from(new Set(techMatches.map(t => t.trim())));

    jobs.push(job);
  });
  
  return jobs;
}

/**
 * Helper function to parse date strings into Date objects
 * @param {string} dateStr - Date string like "Jan 2025" or "Feb 2022"
 * @returns {Date|null} Date object or null if parsing fails
 */
function parseDateExp(dateStr) {
  if (!dateStr) return null;
  
  const months = {
    'jan': 0, 'feb': 1, 'mar': 2, 'apr': 3, 'may': 4, 'jun': 5,
    'jul': 6, 'aug': 7, 'sep': 8, 'oct': 9, 'nov': 10, 'dec': 11,
    'january': 0, 'february': 1, 'march': 2, 'april': 3, 'june': 5,
    'july': 6, 'august': 7, 'september': 8, 'october': 9, 'november': 10, 'december': 11
  };
  
  const match = dateStr.match(/(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|january|february|march|april|june|july|august|september|october|november|december)\s+(\d{4})/i);
  
  if (match) {
    const month = months[match[1].toLowerCase()];
    const year = parseInt(match[2]);
    return new Date(year, month, 1);
  }
  
  return null;
}
function parseDates(dateString) {
  if (!dateString) {
    return { startTime: null, endTime: null };
  }

  // Split the string by the separator " - "
  const parts = dateString.split(' - ');
  const startStr = parts[0] ? parts[0].trim() : null;
  const endStr = parts[1] ? parts[1].trim() : null;

  let startTime = null;
  let endTime = null;

  // Attempt to parse the start date
  if (startStr) {
    const startDate = new Date(startStr);
    // Check if the parsed date is valid
    if (!isNaN(startDate.getTime())) {
      startTime = startDate;
    }
  }

  // Attempt to parse the end date
  if (endStr) {
    // Handle the "Present" case
    if (endStr.toLowerCase() === 'present') {
      endTime = null; // "Present" means no end time has occurred
    } else {
      const endDate = new Date(endStr);
      // Check if the parsed date is valid
      if (!isNaN(endDate.getTime())) {
        endTime = endDate;
      }
    }
  }

  return { startTime, endTime };
}

/**
 * Parses the education section from a LinkedIn profile HTML string.
 *
 * @param {string} html - The raw HTML content of the profile page.
 * @returns {Array<Object>} An array of education objects in the specified format.
 */
function parseEducation(html) {
  const $ = cheerio.load(html);
  const educationList = [];

  // Find each education list item. We use a partial attribute selector 
  // because the ID contains a stable substring "EDUCATION-VIEW-DETAILS".
  $('li[id*="EDUCATION-VIEW-DETAILS"]').each((i, el) => {
    const $li = $(el);

    // Find the main content block for this entry using a stable data-attribute
    const $contentBlock = $li.find('div[data-view-name="profile-component-entity"]')
                            .children('div').eq(1) // Skips the icon div
                            .children('div').first(); // Gets the container for text

    // 1. Get Educational Institute
    // This is the first div child of the content block
    const educationalInstitute = $contentBlock.children('div').first()
                                            .find('span[aria-hidden="true"]').first()
                                            .text().trim() || null;

    // 2. Get Qualification Name
    // This is the first span child of the content block
    const qualificationName = $contentBlock.children('span').eq(0)
                                          .find('span[aria-hidden="true"]').first()
                                          .text().trim() || null;

    // 3. Get Dates
    // This is the second span child of the content block
    const dateString = $contentBlock.children('span').eq(1)
                                    .find('span[aria-hidden="true"]').first()
                                    .text().trim() || null;

    // Parse the date string into start and end dates
    const { startTime, endTime } = parseDates(dateString);

    // 4. Get Grade
    let grade = null;
    // The grade is in a separate <ul> (often for details/activities)
    // We iterate over all spans in that list to find the one starting with "Grade:"
    $li.find('ul li span[aria-hidden="true"]').each((j, span) => {
      const spanText = $(span).text().trim();
      if (spanText.startsWith('Grade:')) {
        grade = spanText.replace('Grade:', '').trim();
      }
    });

    // Add the compiled object to our results array
    educationList.push({
      QualificationName: qualificationName,
      EducationalInstitute: educationalInstitute,
      endTime: endTime,
      startTime: startTime,
      Grade: grade
    });
  });

  return educationList;
}
// Export for use in different environments
module.exports = { 
  extractSkills, 
  extractSkillsWithRegex, 
  parseLinkedInProjects, 
  cleanHTML,
  parseLinkedInExperience,
  parseDateExp
};