
/**
 * Extracts skills from LinkedIn profile HTML
 * @param {string} html - The HTML content from LinkedIn profile skills section
 * @returns {Array<string>} - Array of unique skills
 */
function extractSkills(html) {
  const skills = [];
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  
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

function cleanHTML(htmlContent,moduleTypeCV='default') {
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
  if(moduleTypeCV==='skills'){
    
 skillsArray = extractSkillsWithRegex(cleaned);
  return skillsArray;
}
return cleaned;
}

// Example usage:
// const html = document.querySelector('section').outerHTML; // or your HTML string
// const skills = extractSkills(html);
// console.log(skills);

// Export for use in different environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { extractSkills, extractSkillsWithRegex, cleanHTML };
}