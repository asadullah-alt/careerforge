const mongoose = require('mongoose');
const User = require('./models/user');
const Profile = require('./models/profile');
const JobApplication = require('./models/jobApplication');
const { raw } = require('body-parser');
const { default: ollamaClient } = require('ollama');
const { GoogleGenAI } = require("@google/genai");
const ai = new GoogleGenAI({});
function cleanHTML(htmlContent, options = {}) {
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
  const opts = { ...defaultOptions, ...options };

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

  return cleaned;
}
async function runGeminiFlash(model, prompt) {
  try {
    // Note: model and prompt are now parameters, not constants inside the function.
    console.log(`Sending prompt to ${model}: "${prompt}"\n`);
    
    // Call the model to generate content
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text.trim();

  } catch (error) {
    console.error("An error occurred:", error);
     return error;
  }
}
module.exports = function (app, passport) {
  
  app.post('/login', (req, res, next) => {

    return passport.authenticate('local-login', { session: false }, (err, passportUser, info) => {
      if (err) {
        return res.json({ 'errors': err });
      }

      if (passportUser) {
        return res.status(200).json({ user: passportUser, token: passportUser.generateJWT(passportUser.local.email) });
      }

      return res.status(400).json({
        info
      });
    })(req, res, next);

  });

  app.post('/signup', (req, res, next) => {

    return passport.authenticate('local-signup', { session: false }, (err, passportUser, info) => {
      if (err) {
        return res.json({ 'errors': err });
      }

      if (passportUser) {
        return res.json({ user: passportUser, token: passportUser.generateJWT(passportUser.local.email) });
      }

      return res.status(400).json({
        info
      });
    })(req, res, next);

  });

  app.get('/auth/facebook', passport.authenticate('facebook', {
    scope: ['email']
  }));

  app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
      scope: ['email']
    }), (req, res) => {
      let token = req.user.facebook.token;
      res.redirect('https://careerforge.datapsx.com/game?token=' + token)
    });

  app.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email'],
    redirect_uri: 'https://careerback.datapsx.com/auth/google/callback'
  }));

  app.get('/auth/google/callback',
    passport.authenticate('google', ), (req, res) => {
      console.log(req.user.google)
      let token = req.user.google.token;
      res.redirect('https://careerforge.datapsx.com/dashboard?token=' + token)
    });

    app.get('/auth/linkedin', passport.authenticate('linkedin'));
  
    app.get('/auth/linkedin/callback',
      passport.authenticate('linkedin', ), (req, res) => {
        let token = req.user.linkedin.token;
        res.redirect('https://careerforge.datapsx.com/game?token=' + token)
      });

  app.get('/jwt', passport.authenticate('jwt-auth', { session: false }), (req, res) => {
    res.json({ user: req.user })
  });

  app.get('/token', (req, res, next) => {

    return passport.authenticate('jwt-auth', { session: false }, (err, passportUser, info) => {
      if (err) {
        return res.status(401).json({ 'errors': err });
      }

      if (passportUser) {
        return res.status(200).json({ user: passportUser});
      }

      return res.status(400).json({
        info : 'Please check if your token is valid and provide a good one'
      });
    })(req, res, next);

  });

  // Save LinkedIn profile data endpoint
  app.post('/api/saveProfile', (req, res) => {
    try {
      const payload = req.body || {};
      const token = payload.token || (req.headers && (req.headers.authorization || req.headers.Authorization) ? (req.headers.authorization || req.headers.Authorization).replace(/^Bearer\s+/i, '') : null);
      
      
      if (!token) {
        return res.status(400).json({ success: false, message: 'Missing token in request body or Authorization header.' });
      }

      // Find the user by any stored social token
      User.findOne({ $or: [{ 'Extensiontoken': token },{'google.token':token}, { 'linkedin.token': token }] }, (err, user) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        if (!user) return res.status(401).json({ success: false, message: 'Invalid token or user not found.' });
         
          const profileData = {
          user: user._id,
          profileUrl: payload.profileUrl || '',
          name: payload.name || '',
          headline: payload.headline || '',
          location: payload.location || '',
          about: payload.about || '',
          experience: Array.isArray(payload.experience) ? payload.experience : [],
          education: Array.isArray(payload.education) ? payload.education : [],
          rawExperience: cleanHTML(payload.details_experience_main) || '',
          rawEducation: cleanHTML(payload.details_education_main) || '',
          rawSkills: cleanHTML(payload.details_skills_main) || '',
          rawProjects: cleanHTML(payload.details_projects_main)  || '',
          skills: Array.isArray(payload.skills) ? payload.skills : []
        };
        console.log("user found for profile save:", user._id);
        // Upsert profile by user + profileUrl
        Profile.findOneAndUpdate({ user: user._id }, profileData, { upsert: true, new: true, setDefaultsOnInsert: true }, (err2, savedProfile) => {
          if (err2) {console.log(err2.message);
            return res.status(500).json({ success: false, message: err2.message });}
            console.log("Profile saved for user:", user._id);
          return res.json({ success: true, message: 'Profile saved successfully.', profile: savedProfile });
        });
      });
    } catch (e) {
      console.log(e.message);
      return res.status(500).json({ success: false, message: e.message });
    }
  });

  // Save job application (HTML + url) sent from extension or client
  app.post('/api/SaveJobApplication', async (req, res) => {
    try {
      const payload = req.body || {};
      const token = payload.token || (req.headers && (req.headers.authorization || req.headers.Authorization) ? (req.headers.authorization || req.headers.Authorization).replace(/^Bearer\s+/i, '') : null);

      const url = payload.url || '';
      const html = payload.html || '';
      const systemPromptData = {"system_prompt":"using the schema above convert the information into the JSON object","user_input":"{ \"jobId\": \"\", \"title\": \"\", \"companyName\": \"\", \"companyLogoUrl\": \"\", \"companyWebsite\": \"\", \"companyDescription\": \"\", \"description\": \"\", \"responsibilities\": [], \"requirements\": { \"mustHave\": [], \"niceToHave\": [] }, \"location\": { \"city\": \"\", \"state\": \"\", \"country\": \"\", \"postalCode\": \"\", \"address\": \"\", \"locationType\": \"\" }, \"employmentType\": \"\", \"schedule\": \"\", \"salary\": { \"min\": null, \"max\": null, \"currency\": \"\", \"payPeriod\": \"\", \"details\": \"\" }, \"benefits\": [], \"howToApply\": \"\", \"applyUrl\": \"\", \"contactEmail\": \"\", \"datePosted\": \"\", \"validThrough\": \"\", \"department\": \"\", \"experienceLevel\": \"\", \"industry\": \"\" }"};

let cleanedHTML = cleanHTML(html);
      const response = await ollamaClient.generate({
    model: 'gpt-oss:latest',
    prompt: cleanedHTML+systemPromptData.user_input+systemPromptData.system_prompt,
    stream: false
  });
responseGemini = response.response;
  // responseGemini = await runGeminiFlash('gemini-2.5-flash', cleanedHTML+systemPromptData.user_input+systemPromptData.system_prompt);
  console.log(responseGemini);
      if (!token) {
        return res.status(400).json({ success: false, message: 'Missing token' });
      }

      // find user by token
      User.findOne({ $or: [{ 'Extensiontoken': token }, { 'extensionToken': token }, { 'linkedin.token': token }, { 'google.token': token }] }, (err, user) => {
        if (err) return res.status(500).json({ success: false, message: err.message });

        // attempt to extract JSON from responseGemini
        let parsed = null;
        let parseError = null;
        try {
          if (responseGemini) {
            // look for fenced code block with json: ```json ... ``` or '''json ... '''
            const fencedJsonMatch = responseGemini.match(/```\s*json\s*([\s\S]*?)```/i) || responseGemini.match(/'''\s*json\s*([\s\S]*?)'''/i);
            let jsonText = null;
            if (fencedJsonMatch && fencedJsonMatch[1]) {
              jsonText = fencedJsonMatch[1].trim();
            } else {
              // fallback: find the first { ... } JSON object in the text
              const firstBrace = responseGemini.indexOf('{');
              if (firstBrace !== -1) {
                // attempt to capture a balanced JSON substring
                let start = firstBrace;
                let depth = 0;
                let end = -1;
                for (let i = start; i < responseGemini.length; i++) {
                  const ch = responseGemini[i];
                  if (ch === '{') depth++;
                  if (ch === '}') depth--;
                  if (depth === 0) { end = i; break; }
                }
                if (end !== -1) {
                  jsonText = responseGemini.slice(start, end + 1);
                }
              }
            }

            if (jsonText) {
              parsed = JSON.parse(jsonText);
            }
          }
        } catch (pe) {
          parseError = pe && pe.message ? pe.message : String(pe);
        }

        const doc = new JobApplication({
          user: user ? user._id : undefined,
          url,
          html,
          parsed: parsed? JSON.stringify(parsed) : null,
        });

        doc.save((saveErr, saved) => {
          if (saveErr) return res.status(500).json({ success: false, message: saveErr.message, parseError });
          return res.json({ message: responseGemini, success: true, id: saved._id, user: user ? ((user.local && user.local.email) || user._id) : null, parsed, parseError });
        });
      });
    } catch (e) {
      return res.status(500).json({ success: false, message: e.message });
    }
  });

  // Create or return existing extension token for authenticated user
  app.post('/api/extension-token', passport.authenticate('jwt-auth', { session: false }), (req, res) => {
    try {
      const user = req.user;
      if (!user) return res.status(401).json({ success: false, message: 'Not authenticated' });

      // If user already has a token, return it
      const token = user.Extensiontoken || user.extensionToken;
      if (token) {
        return res.json({ success: true, token });
      }

      // Otherwise generate a random token and save it on the user
      const newToken = require('crypto').randomBytes(20).toString('hex');
      user.Extensiontoken = newToken;
      user.extensionToken = newToken;
      user.save((err) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        return res.json({ success: true, token: newToken });
      });
    } catch (e) {
      return res.status(500).json({ success: false, message: e.message });
    }
  });

  // Get the extension token for the authenticated user
  app.get('/api/extension-token', passport.authenticate('jwt-auth', { session: false }), (req, res) => {
    try {
      const user = req.user;
      if (!user) return res.status(401).json({ success: false, message: 'Not authenticated' });
      const token = user.Extensiontoken || user.extensionToken || null;
      return res.json({ success: true, token });
    } catch (e) {
      return res.status(500).json({ success: false, message: e.message });
    }
  });

  // Check an extension token for validity and return username when valid
  // Accepts token in body { token }, query ?token=..., or Authorization header
  app.post('/api/checkExtensionToken', (req, res) => {
    try {
      const payload = req.body || {};
      const token = payload.token || req.query.token || (req.headers && (req.headers.authorization || req.headers.Authorization) ? (req.headers.authorization || req.headers.Authorization).replace(/^Bearer\s+/i, '') : null);
      if (!token) {
        return res.status(400).json({ success: false, valid: false, message: 'Missing token' });
      }

      User.findOne({ $or: [{ 'google.token': token }, { 'extensionToken': token }, { 'linkedin.token': token }] }, (err, user) => {
        if (err) return res.status(500).json({ success: false, valid: false, message: err.message });
        if (!user) return res.json({ success: true, valid: false });

        const username = (user.local && user.local.email) || (user.linkedin && user.linkedin.name) || (user.google && user.google.name) || (user.facebook && user.facebook.name) || (user._id && user._id.toString()) || null;
        return res.json({ success: true, valid: true, username });
      });
    } catch (e) {
      return res.status(500).json({ success: false, valid: false, message: e.message });
    }
  });

  // GET variant for convenience
  app.get('/api/checkExtensionToken', (req, res) => {
    try {
      const token = req.query.token || (req.headers && (req.headers.authorization || req.headers.Authorization) ? (req.headers.authorization || req.headers.Authorization).replace(/^Bearer\s+/i, '') : null);
      if (!token) {
        return res.status(400).json({ success: false, valid: false, message: 'Missing token' });
      }

      User.findOne({ $or: [{ 'Extensiontoken': token }, { 'extensionToken': token }, { 'linkedin.token': token }] }, (err, user) => {
        if (err) return res.status(500).json({ success: false, valid: false, message: err.message });
        if (!user) return res.json({ success: true, valid: false });

        const username = (user.local && user.local.email) || (user.linkedin && user.linkedin.name) || (user.google && user.google.name) || (user.facebook && user.facebook.name) || (user._id && user._id.toString()) || null;
        return res.json({ success: true, valid: true, username });
      });
    } catch (e) {
      return res.status(500).json({ success: false, valid: false, message: e.message });
    }
  });

};