const mongoose = require('mongoose');
const User = require('./models/user');
const { OpenAI } = require('openai');
const JobApplication = require('./models/jobApplication');
const { raw } = require('body-parser');
const { default: ollamaClient } = require('ollama');
const { GoogleGenAI } = require("@google/genai");
const ai = new GoogleGenAI({});
const crypto = require('crypto');
const { ProcessedJob } = require('./models/jobApplication');
const { ProcessedResume, Resume, Improvement } = require('./models/resume');
const { extractSkills, extractSkillsWithRegex, cleanHTML, parseLinkedInProjects } = require('./util');
const { error } = require('console');

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
      console.log(passportUser);
      console.log(info);
      if (passportUser) {
        return res.status(200).json({ user: passportUser, token: passportUser.local.token });
      }
      console.log("Info", info)
      return res.status(400).json({
        info
      });
    })(req, res, next);

  });

  app.post('/signup', (req, res, next) => {
    return passport.authenticate('local-signup', { session: false }, async (err, passportUser, info) => {
      if (err) {
        return res.json({ 'errors': err });
      }

      if (passportUser) {
        try {
          // If this is a local signup (email/password) and the user is not verified,
          // generate a verification code, save it, send the email, and do NOT return a JWT.
          if (passportUser.local && passportUser.local.email && !passportUser.isVerified) {
            const { generateVerificationCode, sendVerificationEmail } = require('./utils/emailService');
            const verificationCode = generateVerificationCode();
            const expiresAt = new Date();
            expiresAt.setMinutes(expiresAt.getMinutes() + 15);
            passportUser.createdAt = new Date();
            passportUser.verificationCode = {
              code: verificationCode,
              expiresAt
            };
            await passportUser.save();

            // Send verification email (best-effort)
            await sendVerificationEmail(passportUser.local.email, verificationCode);

            return res.status(200).json({
              success: true,
              message: 'Verification code sent to email. Please verify to complete signup',
              user: { email: passportUser.local.email }
            });
          }

          // Otherwise (e.g., OAuth signups which are marked verified), return token
          const mailForToken = (passportUser.local && passportUser.local.email) || (passportUser.google && passportUser.google.email) || '';
          return res.json({ user: passportUser, token: passportUser.generateJWT(mailForToken) });
        } catch (e) {
          console.error('Signup post-processing error:', e);
          return res.status(500).json({ success: false, message: 'An error occurred during signup' });
        }
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
      res.redirect('https://bhaikaamdo.com/game?token=' + token)
    });

  app.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email'],
    redirect_uri: 'https://careerback.bhaikaamdo.com/auth/google/callback'
  }));

  app.get('/auth/google/callback',
    passport.authenticate('google',), (req, res) => {
      console.log(req.user.google)
      if (!req.user.isVerified) {
        // Redirect to verification page if email not verified
        res.redirect(`https://bhaikaamdo.com/verify?email=${encodeURIComponent(req.user.google.email)}`)
      } else {
        // If already verified, redirect to dashboard with token
        let token = req.user.google.token;
        res.redirect('https://bhaikaamdo.com/dashboard?token=' + token)
      }
    });

  app.get('/auth/linkedin', passport.authenticate('linkedin'));

  app.get('/auth/linkedin/callback',
    passport.authenticate('linkedin',), (req, res) => {
      let token = req.user.linkedin.token;
      res.redirect('https://bhaikaamdo.com/game?token=' + token)
    });

  app.get('/jwt', passport.authenticate('jwt-auth', { session: false }), (req, res) => {
    res.json({ user: req.user })
  });

  const { verificationRateLimiter } = require('./middleware/rateLimiter');

  // Verify email route
  app.post('/verify-email', verificationRateLimiter, async (req, res) => {
    const { email, code } = req.body;

    try {
      const user = await User.findOne({
        $or: [
          { 'local.email': email },
          { 'google.email': email }
        ],
        'verificationCode.code': code,
        'verificationCode.expiresAt': { $gt: new Date() }
      });

      if (!user) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or expired verification code'
        });
      }
      const token = user.generateJWT(email);

      // Update user verification status
      user.isVerified = true;
      user.verificationCode = undefined; // Clear verification code
      user.local.token = token;
      await user.save();

      // Generate JWT token

      res.json({
        success: true,
        message: 'Email verified successfully',
        token,
        user: {
          email: email,
          name: user.google.name || user.local.email,
          isVerified: true
        }
      });
    } catch (error) {
      console.error('Verification error:', error);
      res.status(500).json({
        success: false,
        message: 'An error occurred during verification'
      });
    }
  });

  // Resend verification code
  app.post('/resend-verification', async (req, res) => {
    const { email } = req.body;
    const { generateVerificationCode, sendVerificationEmail } = require('./utils/emailService');

    try {
      const user = await User.findOne({
        $or: [
          { 'local.email': email },
          { 'google.email': email }
        ],
        isVerified: false
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found or already verified'
        });
      }

      // Generate new verification code
      const verificationCode = generateVerificationCode();
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 15);

      // Update user with new code
      user.verificationCode = {
        code: verificationCode,
        expiresAt
      };
      await user.save();

      // Send new verification email
      await sendVerificationEmail(email, verificationCode);

      res.json({
        success: true,
        message: 'Verification code sent successfully'
      });
    } catch (error) {
      console.error('Resend verification error:', error);
      res.status(500).json({
        success: false,
        message: 'An error occurred while resending verification code'
      });
    }
  });

  // Forgot password - send reset link
  app.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    try {
      if (!email) {
        return res.status(400).json({
          success: false,
          message: 'Email is required'
        });
      }

      // Find user by email
      const user = await User.findOne({
        $or: [
          { 'local.email': email },
          { 'google.email': email }
        ]
      });

      if (!user) {
        // For security, don't reveal if email exists or not
        return res.json({
          success: true,
          message: 'If that email exists, a password reset link has been sent'
        });
      }

      // Generate UUID for password reset
      const resetToken = crypto.randomUUID();
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 10); // 10 minutes expiry

      // Save reset token and expiry to user
      user.passwordResetToken = resetToken;
      user.passwordResetExpires = expiresAt;
      await user.save();

      // Send password reset email
      const { sendPasswordResetEmail } = require('./utils/emailService');
      await sendPasswordResetEmail(email, resetToken);

      res.json({
        success: true,
        message: 'If that email exists, a password reset link has been sent'
      });
    } catch (error) {
      console.error('Forgot password error:', error);
      res.status(500).json({
        success: false,
        message: 'An error occurred while processing your request'
      });
    }
  });

  // Reset password with token
  app.post('/reset-password', async (req, res) => {
    const { token, newPassword } = req.body;

    try {
      if (!token || !newPassword) {
        return res.status(400).json({
          success: false,
          message: 'Token and new password are required'
        });
      }

      // Find user with valid reset token
      const user = await User.findOne({
        passwordResetToken: token,
        passwordResetExpires: { $gt: new Date() }
      });

      if (!user) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or expired reset token'
        });
      }

      // Update password
      user.local.password = user.generateHash(newPassword);

      // Clear reset token fields
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;

      await user.save();

      res.json({
        success: true,
        message: 'Password has been reset successfully'
      });
    } catch (error) {
      console.error('Reset password error:', error);
      res.status(500).json({
        success: false,
        message: 'An error occurred while resetting your password'
      });
    }
  });

  app.get('/token', (req, res, next) => {

    return passport.authenticate('jwt-auth', { session: false }, (err, passportUser, info) => {
      if (err) {
        return res.status(401).json({ 'errors': err });
      }

      if (passportUser) {
        return res.status(200).json({ user: passportUser });
      }

      return res.status(400).json({
        info: 'Please check if your token is valid and provide a good one'
      });
    })(req, res, next);

  });

  // Save LinkedIn profile data endpoint
  app.post('/api/saveProfile', async (req, res) => {
    try {
      const payload = req.body || {};
      const token = payload.token || (req.headers && (req.headers.authorization || req.headers.Authorization) ? (req.headers.authorization || req.headers.Authorization).replace(/^Bearer\s+/i, '') : null);


      if (!token) {
        return res.status(400).json({ success: false, message: 'Missing token in request body or Authorization header.' });
      }

      // Find the user by any stored social token
      const user = await User.findOne({ $or: [{ 'Extensiontoken': token }, { 'local.token': token }, { 'google.token': token }, { 'linkedin.token': token }] });

      if (!user) return res.status(401).json({ success: false, message: 'Invalid token or user not found.' });

      // Build a ProcessedResume-compatible object from the incoming payload
      const resumeId = crypto.randomUUID();
      let certificates = cleanHTML(payload.details_certifications_main, "certifications") || [];
      let rawSkills = cleanHTML(payload.details_skills_main, "skills") || [];
      console.log(rawSkills)
      const resumeContent = {
        personal_data: {
          first_name: (payload.name || '').split(' ')[0] || '',
          last_name: (payload.name || '').split(' ').slice(1).join(' ') || null,
          linkedin: payload.profileUrl || null,
          location: { city: payload.location || null }
        },

        experiences: cleanHTML(payload.details_experience_main, "experience") || [],
        projects: cleanHTML(payload.details_projects_main, "projects") || [],
        education: cleanHTML(payload.details_education_main, "education") || [],
        skills: rawSkills
      }
      stringResume = JSON.stringify(resumeContent)
      console.log("Resume content stringified:", stringResume);
      const ResumeData = {
        user_id: user._id.toString(),
        resume_name: payload.name || 'LinkedIn Import',
        resume_id: resumeId,
        content_type: "md",
        content: stringResume

      }
      job = new Resume(ResumeData);
      try {
        await job.save();
        console.log("Resume saved for user:", user._id);
      } catch (errr) {
        console.error('Error saving resume:', errr);
        return res.status(500).json({ success: false, message: errr.message });
      }

      const processedResumeData = {
        user_id: user._id.toString(),
        resume_name: payload.name || 'LinkedIn Import',
        resume_id: resumeId,

        personal_data: {
          first_name: (payload.name || '').split(' ')[0] || '',
          last_name: (payload.name || '').split(' ').slice(1).join(' ') || null,
          linkedin: payload.profileUrl || null,
          location: { city: payload.location || null }
        },

        experiences: cleanHTML(payload.details_experience_main, "experience") || [],
        projects: cleanHTML(payload.details_projects_main, "projects") || [],
        education: cleanHTML(payload.details_education_main, "education") || [],
        skills: rawSkills,
        extracted_keywords: [],
        processed_at: new Date()
      };

      console.log("user found for profile save:", user._id);
      console.log("FINALL", processedResumeData.education);
      // Upsert ProcessedResume record (based on user_id + resume_id)
      try {
        const savedResume = await ProcessedResume.findOneAndUpdate(
          { user_id: user._id.toString(), resume_id: resumeId },
          processedResumeData,
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        console.log("Processed resume saved for user:", user._id);
        return res.json({ success: true, message: 'Processed resume saved successfully.', resume: savedResume });
      } catch (err2) {
        console.error('Error saving processed resume:', err2);
        return res.status(500).json({ success: false, message: err2.message });
      }
    } catch (e) {
      console.log(e.message);
      return res.status(500).json({ success: false, message: e.message });
    }
  });

  // Save personal data for an existing resume by resume_id
  app.post('/api/savePersonalData', async (req, res) => {
    try {
      const payload = req.body || {};
      const { personal_data, resume_id } = payload;
      console.log(resume_id);
      console.log(personal_data);
      if (!personal_data) {
        return res.status(400).json({ success: false, message: 'Missing personal_data in request body' });
      }

      if (!resume_id) {
        // If no resume_id provided, still accept but require token-based user lookup to create a new resume
        return res.status(400).json({ success: false, message: 'Missing resume_id in request body' });
      }

      // Optionally accept a token to narrow update to a user's resume
      const token = payload.token || (req.headers && (req.headers.authorization || req.headers.Authorization) ? (req.headers.authorization || req.headers.Authorization).replace(/^Bearer\s+/i, '') : null);

      const proceedUpdate = async (userIdFilter) => {
        const filter = userIdFilter ? { resume_id: resume_id, user_id: userIdFilter } : { resume_id: resume_id };
        const update = { personal_data, updatedAt: new Date(), processed_at: new Date() };
        // Upsert so we create a minimal record if none exists
        try {
          const saved = await ProcessedResume.findOneAndUpdate(filter, { $set: update, $setOnInsert: { resume_id: resume_id } }, { upsert: true, new: true, setDefaultsOnInsert: true });
          return res.json({ success: true, message: 'Personal data saved', resume: saved });
        } catch (err) {
          return res.status(500).json({ success: false, message: err.message });
        }
      };

      if (token) {
        // find user by token and restrict update to that user's resume
        const user = await User.findOne({ $or: [{ 'Extensiontoken': token }, { 'local.token': token }, { 'google.token': token }, { 'linkedin.token': token }] });
        if (!user) return res.status(401).json({ success: false, message: 'Invalid token or user not found.' });
        await proceedUpdate(user._id.toString());
      } else {
        // No token: update by resume_id alone
        await proceedUpdate(null);
      }
    } catch (e) {
      console.error('Error in savePersonalData:', e);
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
      const systemPromptData = { "system_prompt": "using the schema above convert the information into the JSON object", "user_input": "{ \"jobId\": \"\", \"title\": \"\", \"companyName\": \"\", \"companyLogoUrl\": \"\", \"companyWebsite\": \"\", \"companyDescription\": \"\", \"description\": \"\", \"responsibilities\": [], \"requirements\": { \"mustHave\": [], \"niceToHave\": [] }, \"location\": { \"city\": \"\", \"state\": \"\", \"country\": \"\", \"postalCode\": \"\", \"address\": \"\", \"locationType\": \"\" }, \"employmentType\": \"\", \"schedule\": \"\", \"salary\": { \"min\": null, \"max\": null, \"currency\": \"\", \"payPeriod\": \"\", \"details\": \"\" }, \"benefits\": [], \"howToApply\": \"\", \"applyUrl\": \"\", \"contactEmail\": \"\", \"datePosted\": \"\", \"validThrough\": \"\", \"department\": \"\", \"experienceLevel\": \"\", \"industry\": \"\" }" };

      let cleanedHTML = cleanHTML(html);
      const response = await ollamaClient.generate({
        model: 'gpt-oss:latest',
        prompt: cleanedHTML + systemPromptData.user_input + systemPromptData.system_prompt,
        stream: false
      });
      responseGemini = response.response;
      // responseGemini = await runGeminiFlash('gemini-2.5-flash', cleanedHTML+systemPromptData.user_input+systemPromptData.system_prompt);
      console.log(responseGemini);
      if (!token) {
        return res.status(400).json({ success: false, message: 'Missing token' });
      }

      // find user by token
      let user;
      try {
        user = await User.findOne({ $or: [{ 'Extensiontoken': token }, { 'local.token': token }, { 'extensionToken': token }, { 'linkedin.token': token }, { 'google.token': token }] });
      } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
      }

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
        parsed: parsed ? JSON.stringify(parsed) : null,
      });

      try {
        const saved = await doc.save();
        return res.json({ message: responseGemini, success: true, id: saved._id, user: user ? ((user.local && user.local.email) || user._id) : null, parsed, parseError });
      } catch (saveErr) {
        return res.status(500).json({ success: false, message: saveErr.message, parseError });
      }
    } catch (e) {
      return res.status(500).json({ success: false, message: e.message });
    }
  });

  // Create or return existing extension token for authenticated user
  app.post('/api/extension-token', passport.authenticate('jwt-auth', { session: false }), async (req, res) => {
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
      try {
        await user.save();
        return res.json({ success: true, token: newToken });
      } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
      }
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
  app.post('/api/checkExtensionToken', async (req, res) => {
    try {
      console.log("POST CHECK EXTENSION TOKEN")
      console.log("TOken:", req.body.token)
      const payload = req.body || {};
      const token = payload.token || req.query.token || (req.headers && (req.headers.authorization || req.headers.Authorization) ? (req.headers.authorization || req.headers.Authorization).replace(/^Bearer\s+/i, '') : null);
      if (!token) {
        return res.status(400).json({ success: false, valid: false, message: 'Missing token' });
      }

      try {
        const user = await User.findOne({ $or: [{ 'google.token': token }, { 'local.token': token }, { 'extensionToken': token }, { 'linkedin.token': token }] });
        if (!user) return res.json({ success: true, valid: false });

        const username = (user.local && user.local.email) || (user.linkedin && user.linkedin.name) || (user.google && user.google.name) || (user.facebook && user.facebook.name) || (user._id && user._id.toString()) || null;
        return res.json({ success: true, valid: true, username });
      } catch (err) {
        return res.status(500).json({ success: false, valid: false, message: err.message });
      }
    } catch (e) {
      return res.status(500).json({ success: false, valid: false, message: e.message });
    }
  });

  // GET variant for convenience
  app.get('/api/checkExtensionToken', async (req, res) => {
    try {
      const token = req.query.token || (req.headers && (req.headers.authorization || req.headers.Authorization) ? (req.headers.authorization || req.headers.Authorization).replace(/^Bearer\s+/i, '') : null);
      if (!token) {
        return res.status(400).json({ success: false, valid: false, message: 'Missing token' });
      }

      try {
        const user = await User.findOne({ $or: [{ 'Extensiontoken': token }, { 'extensionToken': token }, { 'linkedin.token': token }, { 'local.token': token }] });
        if (!user) return res.json({ success: true, valid: false });

        const username = (user.local && user.local.email) || (user.linkedin && user.linkedin.name) || (user.google && user.google.name) || (user.facebook && user.facebook.name) || (user._id && user._id.toString()) || null;
        return res.json({ success: true, valid: true, username });
      } catch (err) {
        return res.status(500).json({ success: false, valid: false, message: err.message });
      }
    } catch (e) {
      return res.status(500).json({ success: false, valid: false, message: e.message });
    }
  });

  // Get all processed jobs for a user
  app.post('/api/allJobs', async (req, res) => {
    try {
      const token = req.body.token || (req.headers && (req.headers.authorization || req.headers.Authorization) ? (req.headers.authorization || req.headers.Authorization).replace(/^Bearer\s+/i, '') : null);

      if (!token) {
        return res.status(400).json({ success: false, message: 'Missing token' });
      }

      // Find user by token
      try {
        const user = await User.findOne({ $or: [{ 'Extensiontoken': token }, { 'local.token': token }, { 'extensionToken': token }, { 'linkedin.token': token }, { 'google.token': token }] });
        if (!user) return res.status(401).json({ success: false, message: 'Invalid token or user not found' });

        // Get all processed jobs for the user
        console.log("Fetching jobs for user:", user._id);
        const jobs = await ProcessedJob.find({ user_id: user._id }).sort({ processed_at: -1 }); // Sort by processed_at in descending order

        return res.json({ success: true, jobs });
      } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
      }
    } catch (e) {
      return res.status(500).json({ success: false, message: e.message });
    }
  });

  // Resume endpoints

  // Save or update a resume
  app.post('/api/resume/save', async (req, res) => {
    try {
      const token = req.body.token || req.headers.authorization?.replace(/^Bearer\s+/i, '') || null;

      if (!token) {
        return res.status(400).json({ success: false, message: 'Missing token' });
      }

      try {
        const user = await User.findOne({ $or: [{ 'Extensiontoken': token }, { 'local.token': token }, { 'extensionToken': token }, { 'linkedin.token': token }, { 'google.token': token }] });
        if (!user) return res.status(401).json({ success: false, message: 'Invalid token or user not found' });

        const { id, title, data } = req.body;
        const resumeTitle = title || `${data?.personal_data?.firstName || ''} ${data?.personal_data?.lastName || ''}`.trim() || 'Untitled Resume';

        if (id) {
          // Update existing resume
          try {
            const updated = await ProcessedResume.findByIdAndUpdate(id, { title: resumeTitle, data, updatedAt: new Date() }, { new: true });
            if (!updated) return res.status(404).json({ success: false, message: 'Resume not found' });
            return res.json({ success: true, message: 'Resume updated', id: updated._id });
          } catch (err) {
            return res.status(500).json({ success: false, message: err.message });
          }
        } else {
          // Create new resume
          const uuid = crypto.randomUUID();
          const resume = new ProcessedResume({ resume_id: uuid, user_id: user._id, title: resumeTitle, data });
          try {
            const saved = await resume.save();
            return res.json({ success: true, message: 'Resume saved', id: saved._id });
          } catch (err) {
            return res.status(500).json({ success: false, message: err.message });
          }
        }
      } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
      }
    } catch (e) {
      return res.status(500).json({ success: false, message: e.message });
    }
  });

  // List all resumes for a user
  app.post('/api/resume/list', async (req, res) => {
    try {
      const token = req.body.token || req.headers.authorization?.replace(/^Bearer\s+/i, '') || null;

      if (!token) {
        return res.status(400).json({ success: false, message: 'Missing token' });
      }

      try {
        const user = await User.findOne({ $or: [{ 'Extensiontoken': token }, { 'local.token': token }, { 'extensionToken': token }, { 'linkedin.token': token }, { 'google.token': token }] });
        if (!user) return res.status(401).json({ success: false, message: 'Invalid token or user not found' });

        // Get all resumes for the user   
        const resumes = await ProcessedResume.find({ user_id: user._id }).sort({ updatedAt: -1 });
        return res.json({ success: true, data: resumes });
      } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
      }
    } catch (e) {
      return res.status(500).json({ success: false, message: e.message });
    }
  });

  // Load a single resume
  app.post('/api/resume/load', async (req, res) => {
    try {
      const token = req.body.token || req.headers.authorization?.replace(/^Bearer\s+/i, '') || null;
      const id = req.body.id;
      console.log(req.body);
      if (!token) {
        return res.status(400).json({ success: false, message: 'Missing token' });
      }

      if (!id) {
        return res.status(400).json({ success: false, message: 'Missing resume id' });
      }

      try {
        const user = await User.findOne({ $or: [{ 'Extensiontoken': token }, { 'local.token': token }, { 'extensionToken': token }, { 'linkedin.token': token }, { 'google.token': token }] });
        if (!user) return res.status(401).json({ success: false, message: 'Invalid token or user not found' });
        console.log("ID for resume load:", id);
        const resume = await ProcessedResume.findOne({ _id: id, user_id: user._id });
        if (!resume) return res.status(404).json({ success: false, message: 'Resume not found' });
        return res.json({ success: true, data: resume });
      } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
      }
    } catch (e) {
      return res.status(500).json({ success: false, message: e.message });
    }
  });

  // Delete a resume
  app.post('/api/resume/delete', async (req, res) => {
    try {
      const token = req.body.token || req.headers.authorization?.replace(/^Bearer\s+/i, '') || null;
      const { id } = req.body; // This 'id' refers to the _id of the ProcessedResume

      if (!token) {
        return res.status(400).json({ success: false, message: 'Missing token' });
      }

      if (!id) {
        return res.status(400).json({ success: false, message: 'Missing resume id' });
      }

      try {
        const user = await User.findOne({ $or: [{ 'Extensiontoken': token }, { 'local.token': token }, { 'extensionToken': token }, { 'linkedin.token': token }, { 'google.token': token }] });
        if (!user) return res.status(401).json({ success: false, message: 'Invalid token or user not found' });

        // 1. Find the processed resume to get the resume_id (UUID)
        const processedResume = await ProcessedResume.findOne({ _id: id, user_id: user._id.toString() });
        if (!processedResume) {
          return res.status(404).json({ success: false, message: 'Resume not found' });
        }

        const resumeId = processedResume.resume_id;

        // 2. Delete from ProcessedResume
        await ProcessedResume.deleteOne({ _id: id });

        // 3. Delete related documents from Resume collection
        await Resume.deleteMany({ resume_id: resumeId, user_id: user._id.toString() });

        // 4. Cleanup of 'improvement' collection using Mongoose
        try {
          await Improvement.deleteMany({ resume_id: resumeId, user_id: user._id.toString() });
          console.log(`Cleanup of 'improvement' collection for resume_id: ${resumeId} completed.`);
        } catch (improveErr) {
          console.error("Error cleaning up 'improvement' collection:", improveErr);
          // Best effort, so we don't fail the whole request
        }

        return res.json({ success: true, message: 'Resume and all linked data deleted successfully' });
      } catch (err) {
        console.error('Inner deletion error:', err);
        return res.status(500).json({ success: false, message: err.message });
      }
    } catch (e) {
      console.error('Outer deletion error:', e);
      return res.status(500).json({ success: false, message: e.message });
    }
  });

  // Rename a resume
  app.post('/api/resume/rename', async (req, res) => {
    try {
      const token = req.body.token || req.headers.authorization?.replace(/^Bearer\s+/i, '') || null;
      const { id, title } = req.body;

      if (!token) {
        return res.status(400).json({ success: false, message: 'Missing token' });
      }

      if (!id || !title) {
        return res.status(400).json({ success: false, message: 'Missing id or title' });
      }

      try {
        const user = await User.findOne({ $or: [{ 'Extensiontoken': token }, { 'local.token': token }, { 'extensionToken': token }, { 'linkedin.token': token }, { 'google.token': token }] });
        if (!user) return res.status(401).json({ success: false, message: 'Invalid token or user not found' });

        const updated = await Resume.findByIdAndUpdate({ _id: id, user_id: user._id }, { title, updatedAt: new Date() }, { new: true });
        if (!updated) return res.status(404).json({ success: false, message: 'Resume not found' });
        return res.json({ success: true, message: 'Resume renamed' });
      } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
      }
    } catch (e) {
      return res.status(500).json({ success: false, message: e.message });
    }
  });

};