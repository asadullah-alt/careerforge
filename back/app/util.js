const cheerio = require('cheerio');

/**
 * Extracts skills from LinkedIn profile HTML
 * @param {string} html - The HTML content from LinkedIn profile skills section
 * @returns {Array<string>} - Array of unique skills
 */
function extractSkills(html) {
  const skills = new Set(); // Use a Set to automatically handle duplicates
  const $ = cheerio.load(html);

  // 1. Target the containers that specifically look like skills
  // The HTML shows a pattern: componentkey="com.linkedin.sdui.profile.skill..."
  const skillContainers = $('div[componentkey*="com.linkedin.sdui.profile.skill"]');

  skillContainers.each((i, item) => {
    // 2. Inside these containers, the text is located in a <p> tag
    const pTag = $(item).find('p');
    const text = pTag.text().trim();

    // 3. Validate the text
    if (text &&
      !text.includes('endorsement') &&
      !text.includes('Show more') &&
      text.length > 0) {

      skills.add(text);
    }
  });

  // 4. Convert Set back to the array format you wanted
  return Array.from(skills).map(skill => ({
    category: null,
    skill_name: skill
  }));
}
function removeDuplicatesByKey(array, key) {
  const seen = new Set();
  return array.filter(item => {
    const value = item[key];
    if (seen.has(value)) return false;
    seen.add(value);
    return true;
  });
}
function extractSkillsAltOne(html) {
  const $ = cheerio.load(html);
  const skills = new Set();

  // LinkedIn skills are usually inside <li> tags that contain two <span> items.
  $("li").each((_, li) => {
    // Find the spans containing the visible and hidden versions of text
    const spans = $(li).find("span");

    if (spans.length > 0) {
      // Take the last non-empty span text
      spans.each((_, span) => {
        const text = $(span).text().trim();
        if (text && text.length > 1) {
          skills.add({ "skill_name": text, "category": null });
        }
      });
    }
  });

  return removeDuplicatesByKey(Array.from(skills), "skill_name");
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
  if (htmlContent == null) {
    if (moduleTypeCV === 'skills' || moduleTypeCV === 'projects' || moduleTypeCV === 'experience' || moduleTypeCV === 'education') {
      return [];
    }
    return '';
  }
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
    console.log("Skills");
    console.log(cleaned);
    let skillsArray = extractSkills(cleaned);
    if (skillsArray.length === 0) {
      skillsArray = extractSkillsAltOne(cleaned);
      console.log(skillsArray)
    }
    return skillsArray;
  }

  if (moduleTypeCV === "projects") {
    console.log("Projects");
    console.log(cleaned);
    let projectsArray = parseLinkedInProjects(cleaned);
    if (projectsArray.length === 0) { 
      projectsArray = extractProjectsAlt(cleaned);
    }

    return projectsArray;
  }

  if (moduleTypeCV === "experience") {
    console.log("Experience");
    console.log(cleaned);
    const experienceArray = parseLinkedInExperience(cleaned);
    return experienceArray;
  }
  if (moduleTypeCV === "education") {
    console.log("Education");
    console.log(cleaned);
    let educationArray = extractEducation(cleaned);
    if (educationArray.length === 0) {
      console.log("DID THIS TRIGGER")
      educationArray = []
      educationArray = extractEducationAlt(cleaned);
     
    }
     console.log("EDUCACTION ARRAY", educationArray);
    return educationArray;
  }

  return cleaned;
}
function extractProjectsAlt(html) {
const $ = cheerio.load(html);
  const projects = [];

  // Find all project containers - they are siblings separated by <hr> tags
  $('[data-view-name="profile-projects-details-view"]').find('> div > div > div > div').each((i, container) => {
    const $container = $(container);
    
    // Skip hr elements and button containers
    if ($container.is('hr') || $container.find('button[type="button"]').length > 0 && !$container.find('p').first().length) {
      return;
    }

    // Check if this div contains project info (has multiple child divs)
    const mainDiv = $container.find('> div > div');
    if (mainDiv.length === 0) {
      return;
    }

    const project = {
      project_name: null,
      description: null,
      technologies_used: [],
      link: null,
      start_date: null,
      end_date: null
    };

    // Extract project name (first p tag)
    const nameElem = mainDiv.find('> div > p').first();
    if (nameElem.length) {
      project.project_name = nameElem.text().trim();
    }

    // Extract dates (second p tag with date range)
    const dateElem = mainDiv.find('> div').eq(0).find('> p').eq(1);
    if (dateElem.length && dateElem.text().includes('–')) {
      const dateText = dateElem.text().trim();
      const dates = dateText.split('–').map(d => d.trim());
      project.start_date = dates[0] || null;
      project.end_date = dates[1] || null;
    }

    // Extract description (text inside expandable-text-box)
    const descElem = mainDiv.find('[data-testid="expandable-text-box"]');
    if (descElem.length) {
      project.description = descElem.text().trim();
    }

    // Extract link (check for "Show project" link with external icon)
    const linkSpan = mainDiv.find('span').filter((i, el) => {
      return $(el).text().trim() === 'Show project';
    });
    if (linkSpan.length) {
      const parentAnchor = linkSpan.closest('a');
      if (parentAnchor.length) {
        project.link = parentAnchor.attr('href') || 'link-present';
      } else {
        project.link = 'link-present';
      }
    }

    // Only add projects that have at least a name
    if (project.project_name) {
      projects.push(project);
    }
  });

  return projects;
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
        project.start_date = sd ? sd.toISOString().slice(0, 10) : null;
        project.end_date = ed ? ed.toISOString().slice(0, 10) : null;
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
    if(project.project_name!==null)
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
      if (titleText && !titleText.includes('·') && !titleText.match(/\d{4}/)) {
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
        job.start_date = sd ? sd.toISOString().slice(0, 10) : null;
        if (endStr.toLowerCase().includes('present')) {
          job.end_date = 'Present';
        } else {
          const ed = parseDateExp(endStr);
          job.end_date = ed ? ed.toISOString().slice(0, 10) : endStr;
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

function extractEducationAlt(html) {
  const $ = cheerio.load(html);
  const educationList = [];

  // Find all education entries by looking for edit buttons with aria-label containing "Edit education"
  // Each education entry has its own edit button
  $('button[aria-label*="Edit education"]').each((index, button) => {
    // Navigate up to find the parent container of this education entry
    const $entry = $(button).closest('div').parent();

    // Skip if this doesn't have the expected structure
    if (!$entry.find('figure').length) {
      return; // continue to next iteration
    }

    // Extract institution name (first p tag in the content area)
    const institution = $entry.find('figure').next('div').find('p').first().text().trim();

    // Extract degree and field of study (second p tag)
    const degreeText = $entry.find('figure').next('div').find('p').eq(1).text().trim();
    let degree = '';
    let fieldOfStudy = '';

    if (degreeText) {
      // Split by comma to separate degree from field of study
      const commaIndex = degreeText.indexOf(',');
      if (commaIndex !== -1) {
        degree = degreeText.substring(0, commaIndex).trim();
        fieldOfStudy = degreeText.substring(commaIndex + 1).trim();
      } else {
        // If no comma, check if it looks like a degree or field
        if (degreeText.toLowerCase().includes('degree') ||
          degreeText.toLowerCase().includes('school') ||
          degreeText.toLowerCase().includes('high school')) {
          degree = degreeText;
        } else {
          fieldOfStudy = degreeText;
        }
      }
    }

    // Extract date range (third p tag)
    const dateText = $entry.find('figure').next('div').find('p').eq(2).text().trim();
    let startDate = '';
    let endDate = '';

    if (dateText) {
      // Parse dates like "Mar 2025 – Jun 2025" or "2010 – 2014"
      const dateParts = dateText.split('–').map(d => d.trim());
      if (dateParts.length === 2) {
        startDate = dateParts[0];
        endDate = dateParts[1];
      } else if (dateParts.length === 1) {
        startDate = dateParts[0];
      }
    }

    // Extract grade and description from all p tags
    let grade = '';
    let description = '';

    $entry.find('p').each((i, p) => {
      const text = $(p).text().trim();
      if (text.startsWith('Grade:')) {
        grade = text.replace('Grade:', '').trim();
      } else if (text.startsWith('Activities and societies:')) {
        description = text.replace('Activities and societies:', '').trim();
      }
    });

    // Only add if we found an institution
    if (institution) {
      educationList.push({
        institution: institution,
        degree: degree,
        field_of_study: fieldOfStudy,
        start_date: startDate,
        end_date: endDate,
        grade: grade,
        description: description
      });
    }
  });

  // Remove duplicates based on institution and degree combined
  const uniqueEducation = [];
  const seen = new Set();

  for (const edu of educationList) {
    // Create a unique key from institution and degree
    const key = `${edu.institution.toLowerCase()}|${edu.degree.toLowerCase()}`;

    if (!seen.has(key)) {
      seen.add(key);
      uniqueEducation.push(edu);
    }
  }
console.log("UNIQUE", uniqueEducation)
  return uniqueEducation;
}

function extractEducation(htmlContent) {
  const $ = cheerio.load(htmlContent);
  const educationData = [];

  // Select the specific list items that contain education details
  // The snippet shows IDs containing 'EDUCATION-VIEW-DETAILS'
  $('li[id*="EDUCATION-VIEW-DETAILS"]').each((index, element) => {

    // Initialize default object structure
    const entry = {
      institution: null,
      degree: null,
      field_of_study: null,
      start_date: null,
      end_date: null,
      grade: null,
      description: null,
    };

    // Strategy: Extract all clean text from 'span[aria-hidden="true"]'
    // The HTML provided uses aria-hidden spans for visual text and hidden spans for screen readers.
    // We capture the visual text to avoid duplication.
    const textNodes = [];
    $(element).find('span[aria-hidden="true"]').each((i, el) => {
      const text = $(el).text().trim();
      if (text) textNodes.push(text);
    });

    // --- Apply Heuristics to map text nodes to fields ---

    if (textNodes.length > 0) {
      // 1. Institution is typically the first element
      entry.institution = textNodes[0];
    }

    if (textNodes.length > 1) {
      // 2. Degree and Field of Study are typically the second element
      // Format usually: "Degree, Field" or "Degree - Field"
      const degreeRaw = textNodes[1];

      // Simple logic to separate degree from field based on the first comma
      if (degreeRaw.includes(',')) {
        const parts = degreeRaw.split(',');
        entry.degree = parts[0].trim();
        entry.field_of_study = parts.slice(1).join(',').trim(); // Join rest in case of multiple commas
      } else {
        entry.degree = degreeRaw;
      }
    }

    if (textNodes.length > 2) {
      // 3. Dates are typically the third element
      // Format usually: "Aug 2011 - Sep 2013"
      const dateRaw = textNodes[2];
      const dateParts = dateRaw.split(' - ');

      if (dateParts.length >= 1) entry.start_date = dateParts[0].trim();
      if (dateParts.length >= 2) entry.end_date = dateParts[1].trim();
    }

    // 4. Loop through remaining nodes to find Grade, Activities, or Description
    // We skip the first 3 indices as we already processed them
    for (let i = 3; i < textNodes.length; i++) {
      const text = textNodes[i];

      if (text.startsWith('Grade:')) {
        entry.grade = text.replace('Grade:', '').trim();
      }
      else if (text.startsWith('Activities and societies:')) {
        // If you wanted to capture activities, you could add a field here.
        // For this schema, we append it to description or ignore it.
        const activity = text.replace('Activities and societies:', '').trim();
        entry.description = entry.description
          ? `${entry.description}\n\nActivities: ${activity}`
          : `Activities: ${activity}`;
      }
      else {
        // If it doesn't match known prefixes, it's likely the Description
        // (The long text block at the end)
        entry.description = entry.description
          ? `${entry.description}\n\n${text}`
          : text;
      }
    }
    if (entry.institution !== null && entry.degree !== null)
      educationData.push(entry);
  });
  console.log("EDUCATION DATA", educationData);
  return educationData;
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