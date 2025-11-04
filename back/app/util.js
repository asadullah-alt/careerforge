const { JSDOM } = require('jsdom');

/**
 * Extracts skills from LinkedIn profile HTML
 * @param {string} html - The HTML content from LinkedIn profile skills section
 * @returns {Array<string>} - Array of unique skills
 */
function extractSkills(html) {
  const skills = [];
  const dom = new JSDOM(html);
  const doc = dom.window.document;
  
  // Find all list items in the skills section
  const listItems = doc.querySelectorAll('li[id*="profilePagedListComponent"]');
  
  listItems.forEach(item => {
    // Look for span elements that contain skill names
    const spans = item.querySelectorAll('span[aria-hidden="true"]');
    
    spans.forEach(span => {
      const text = span.textContent.trim();
      
      // Filter out empty strings, endorsement text, and other non-skill content
      if (text && 
          !text.includes('endorsement') && 
          !text.includes('Show more') &&
          text.length > 0) {
        skills.push(text);
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
    if (skill && 
        !skill.includes('endorsement') && 
        !skill.includes('Show more')) {
      skills.add(skill);
    }
  }
  
  return Array.from(skills);
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
    const skillsArray = extractSkillsWithRegex(cleaned);
    return skillsArray;
  }

  if (moduleTypeCV === "projects") {
    const projectsArray = parseLinkedInProjects(cleaned);
    return projectsArray;
  }

  return cleaned;
}

function parseLinkedInProjects(html) {
  const dom = new JSDOM(html);
  const doc = dom.window.document;
  
  // Find all project list items
  const projectItems = doc.querySelectorAll('li[id^="profilePagedListComponent"]');
  
  const projects = [];
  
  projectItems.forEach(item => {
    const project = {
      projectName: null,
      startTime: null,
      endTime: null,
      associatedWith: null,
      description: null
    };
    
    // Extract project name
    const nameElements = item.querySelectorAll('span[aria-hidden="true"]');
    for (let elem of nameElements) {
      const text = elem.textContent.trim();
      // First substantial text is usually the project name
      if (text && !text.includes('Associated with') && !text.includes('Aug ') && 
          !text.includes('Sep ') && !text.includes('Jan ') && !text.includes('Feb ') &&
          !text.includes('Mar ') && !text.includes('Apr ') && !text.includes('May ') &&
          !text.includes('Jun ') && !text.includes('Jul ') && !text.includes('Oct ') &&
          !text.includes('Nov ') && !text.includes('Dec ')) {
        project.projectName = text;
        break;
      }
    }
    
    // Extract dates
    const dateElements = item.querySelectorAll('span > span[aria-hidden="true"]');
    for (let elem of dateElements) {
      const text = elem.textContent.trim();
      if (text.includes(' - ')) {
        const [start, end] = text.split(' - ').map(s => s.trim());
        project.startTime = parseDate(start);
        project.endTime = parseDate(end);
        break;
      }
    }
    
    // Extract associated organization
    const allSpans = item.querySelectorAll('span[aria-hidden="true"]');
    for (let elem of allSpans) {
      const text = elem.textContent.trim();
      if (text.startsWith('Associated with ')) {
        project.associatedWith = text.replace('Associated with ', '');
        break;
      }
    }
    
    // Extract description (usually the longest text content)
    let longestText = '';
    allSpans.forEach(elem => {
      const text = elem.textContent.trim();
      // Description is typically a long paragraph
      if (text.length > longestText.length && 
          text.length > 50 && 
          !text.startsWith('Associated with') &&
          text !== project.projectName) {
        longestText = text;
      }
    });
    if (longestText) {
      project.description = longestText;
    }
    
    projects.push(project);
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

// Export for use in different environments
module.exports = { 
  extractSkills, 
  extractSkillsWithRegex, 
  parseLinkedInProjects, 
  cleanHTML 
};