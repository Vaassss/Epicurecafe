# 🚀 Complete Deployment Guide - Epicure Cafe

## Quick Start - Production Deployment

This guide will walk you through deploying the complete Epicure Cafe loyalty system to production with all features enabled.

---

## 📋 Pre-Deployment Checklist

### ✅ Files to Verify

- [ ] `/vercel.json` - Deployment configuration exists
- [ ] `/.gitignore` - Build artifacts excluded
- [ ] `/public/epicure-logo.png` - Logo file present
- [ ] `/supabase/functions/server/index.tsx` - Backend configured
- [ ] All admin features working locally

---

## Step 1: Configure Admin System

### 1.1 Set Master Admin Number

**File:** `/supabase/functions/server/index.tsx`

**Find line 23 and update:**
```typescript
// BEFORE
const MASTER_ADMIN_MOBILE = "9999999999"; 

// AFTER (use owner's actual phone)
const MASTER_ADMIN_MOBILE = "YOUR_PHONE_NUMBER";
```

### 1.2 Set Staff Code

**Same file, line 24:**
```typescript
// BEFORE
const MANUAL_ENTRY_CODE = "CAFE2024";

// AFTER (use your secret code)
const MANUAL_ENTRY_CODE = "YOUR_SECRET_CODE";
```

**Save the file.**

---

## Step 2: Verify Deployment Files

### 2.1 Check vercel.json

**File:** `/vercel.json`

Should contain:
```json
{
  "version": 2,
  "builds": [{ "src": "dist/**/*", "use": "@vercel/static" }],
  "routes": [
    { "handle": "filesystem" },
    { "src": "/.*", "dest": "/dist/index.html" }
  ],
  "outputDirectory": "dist"
}
```

✅ **This enables SPA routing and prevents 404s on refresh**

### 2.2 Check .gitignore

**File:** `/.gitignore`

Must include:
```gitignore
# Build output
dist/
build/

# Environment
.env
.env.local

# Vercel
.vercel
```

✅ **This prevents build artifacts from being committed**

### 2.3 Verify Logo

**Location:** `/public/epicure-logo.png`

```bash
# Check if file exists
ls -la public/epicure-logo.png

# Should show: epicure-logo.png (PNG format)
```

✅ **Logo is used as fallback for local/Vercel environments**

---

## Step 3: Test Local Build

Before deploying, ensure everything works locally:

```bash
# 1. Install dependencies (if needed)
npm install

# 2. Build the application
npm run build

# 3. Verify dist/ folder was created
ls -la dist/

# You should see:
#   index.html
#   assets/
#   (various CSS, JS files)

# 4. Preview the build locally
npm run preview

# 5. Open browser to http://localhost:4173
# Test:
#   - Home page loads
#   - Login works
#   - Navigation works
#   - Logo displays
```

**If local build fails, fix errors before deploying!**

---

## Step 4: Deploy to Vercel

### Option A: Using Vercel CLI (Recommended)

```bash
# 1. Install Vercel CLI globally
npm install -g vercel

# 2. Login to Vercel
vercel login
# Follow the authentication prompts

# 3. Link to project (first time only)
vercel link
# Answer the prompts:
#   - Set up and deploy? Yes
#   - Scope: Your account
#   - Link to existing project? No (for new) / Yes (for existing)
#   - Project name: epicure-cafe (or your choice)

# 4. Deploy to production
vercel --prod

# 5. Wait for deployment to complete
# You'll get a URL like: https://epicure-cafe.vercel.app
```

### Option B: Using Git Integration

```bash
# 1. Commit all changes
git add .
git commit -m "Deploy: Admin system + Vercel configuration"

# 2. Push to main branch
git push origin main

# 3. Vercel will auto-deploy (if GitHub integration is set up)
# Check Vercel dashboard for deployment status
```

---

## Step 5: Configure Environment Variables (Supabase)

**In Vercel Dashboard:**

1. Go to your project
2. Click **Settings** → **Environment Variables**
3. Add these variables:

```bash
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_DB_URL=your_database_url
```

**Note:** Get these from your Supabase project settings

4. Click **Save**
5. **Redeploy** to apply environment variables

---

## Step 6: Verify Deployment

### 6.1 Basic Functionality

Visit your deployed URL and test:

- [ ] **Homepage loads** - Main landing page appears
- [ ] **Logo displays** - Epicure logo shows correctly
- [ ] **Menu section** - All 43 items visible with 3D effects
- [ ] **About section** - Content loads properly
- [ ] **Map section** - Google Maps embedded correctly

### 6.2 Routing & SPA Behavior

Test SPA routing:

- [ ] **Direct navigation** - Visit `https://your-app.vercel.app/login`
- [ ] **Page refresh** - Press F5 on any page (should NOT 404)
- [ ] **Browser back/forward** - Navigation works smoothly
- [ ] **Client-side routing** - Click links, no full page reload

### 6.3 Customer Features

Test as a customer:

- [ ] **Login flow** - Enter mobile, receive OTP, verify
- [ ] **Customer dashboard** - Loads after login
- [ ] **View roadmaps** - 4 roadmaps displayed
- [ ] **Scan bill** - Camera access works
- [ ] **Purchase history** - Shows transactions
- [ ] **Badges** - Displays earned badges

### 6.4 Admin Features

Test as admin (using master admin number):

- [ ] **Admin login** - Use configured admin number
- [ ] **Admin dashboard** - Redirected to admin panel (not customer)
- [ ] **View customers** - All registered customers visible
- [ ] **Search customers** - Search by name/phone works
- [ ] **Add purchase** - Can add items to any customer
- [ ] **Remove purchase** - Can delete transactions
- [ ] **Add admin** - Can grant admin access
- [ ] **Remove admin** - Can revoke admin access

### 6.5 Security Features

Test security measures:

- [ ] **Staff code** - Manual entry requires valid code
- [ ] **Duplicate bill** - Same bill can't be scanned twice
- [ ] **Regular user** - Cannot access admin features
- [ ] **Admin access** - Only works with configured numbers

### 6.6 Mobile & Performance

Test on mobile:

- [ ] **Responsive design** - Looks good on phone
- [ ] **Touch interactions** - All buttons work
- [ ] **Camera access** - Bill scanner uses camera
- [ ] **Fast loading** - Pages load quickly

---

## Step 7: Post-Deployment Setup

### 7.1 Test Admin Login

1. **Open your deployed app**
2. **Click "Login"**
3. **Enter master admin number** (the one you configured)
4. **Verify OTP** (check server logs for OTP in demo mode)
5. **Should see:** "Welcome, Admin [Your Name]!"
6. **Should land on:** Admin Dashboard

### 7.2 Add Staff as Admins

From admin dashboard:

1. Click **"Admins"** tab
2. Enter staff member's mobile number
3. Click **"Add Admin"**
4. Staff can now login with admin access

### 7.3 Share Staff Code

- Give staff code to baristas/counter staff
- They need it for manual entry when bills can't be scanned
- Keep it confidential

---

## 🎯 Common Issues & Solutions

### Issue 1: 404 on Page Refresh

**Symptom:** Direct URL or refresh shows 404

**Solution:**
```bash
# Verify vercel.json exists and has correct routes
cat vercel.json

# Should see fallback route:
# { "src": "/.*", "dest": "/dist/index.html" }

# If missing, create it as shown in Step 2.1
# Then redeploy: vercel --prod
```

### Issue 2: Admin Dashboard Not Loading

**Symptom:** Admin sees customer dashboard instead

**Solution:**
```typescript
// Check master admin number in backend
// File: /supabase/functions/server/index.tsx (line 23)

// Make sure it matches your login number EXACTLY
const MASTER_ADMIN_MOBILE = "1234567890"; // Must be 10 digits, no spaces

// Redeploy backend if changed
```

### Issue 3: Logo Not Displaying

**Symptom:** Broken image or missing logo

**Solutions:**

**Check file exists:**
```bash
ls -la public/epicure-logo.png
# Should show the PNG file
```

**Check format:**
- Must be PNG format
- Should have transparency
- Reasonable file size (< 500KB)

**Rebuild and redeploy:**
```bash
npm run build
vercel --prod
```

### Issue 4: Staff Code Not Working

**Symptom:** "Invalid staff code" error

**Solution:**
```typescript
// Verify code in backend
// File: /supabase/functions/server/index.tsx (line 24)

const MANUAL_ENTRY_CODE = "YOUR_CODE"; // Check this matches

// Code is case-sensitive
// Must use uppercase when entering
// Redeploy if changed
```

### Issue 5: Duplicate Bill Not Detected

**Symptom:** Same bill can be scanned multiple times

**Solution:**
- Feature depends on consistent image hashing
- Different photos of same bill may have different hashes
- This is expected behavior
- Best practice: Train staff to verify before scanning

### Issue 6: Backend Not Responding

**Symptom:** API calls fail, no data loads

**Solution:**
```bash
# Check Supabase Edge Functions are deployed
# Visit Supabase Dashboard → Edge Functions
# Ensure 'make-server-6a458d4b' is deployed

# Check environment variables in Vercel
# Settings → Environment Variables
# Verify all Supabase variables are set

# Force redeploy
vercel --prod --force
```

---

## 🔧 Maintenance & Updates

### Regular Tasks

**Weekly:**
- [ ] Check for errors in Vercel logs
- [ ] Review customer registrations
- [ ] Verify backend is responding

**Monthly:**
- [ ] Update staff code for security
- [ ] Review admin user list
- [ ] Check for any suspicious activity
- [ ] Update dependencies: `npm update`

**When Staff Changes:**
- [ ] Add new staff as admins (if needed)
- [ ] Remove ex-staff from admin list
- [ ] Change staff code if they knew it

### Updating the App

```bash
# 1. Make changes locally
# 2. Test locally
npm run build
npm run preview

# 3. Commit changes
git add .
git commit -m "Update: Description of changes"

# 4. Deploy
vercel --prod

# 5. Verify deployment
# Visit your URL and test the changes
```

---

## 📊 Monitoring

### Vercel Dashboard

**Check regularly:**
- **Deployments** - Ensure successful
- **Analytics** - Monitor traffic
- **Logs** - Check for errors
- **Bandwidth** - Monitor usage

### Supabase Dashboard

**Check regularly:**
- **Database** - Monitor size and connections
- **Edge Functions** - Check invocations and errors
- **Logs** - Review function logs
- **Auth** - Monitor user signups

---

## 🎉 Success Checklist

Your deployment is complete and successful when:

### Technical
- [x] ✅ Vercel deployment succeeds
- [x] ✅ All routes accessible
- [x] ✅ SPA routing works (no 404s)
- [x] ✅ Logo displays correctly
- [x] ✅ Assets load properly
- [x] ✅ Backend API responds
- [x] ✅ No console errors

### Features
- [x] ✅ Customer can login
- [x] ✅ Bill scanner works
- [x] ✅ Purchase history displays
- [x] ✅ Roadmaps track progress
- [x] ✅ Badges are awarded
- [x] ✅ Admin dashboard loads
- [x] ✅ Admin can manage customers
- [x] ✅ Staff code works
- [x] ✅ Duplicate bills prevented

### Security
- [x] ✅ Admin access restricted
- [x] ✅ Staff code required for manual entry
- [x] ✅ Environment variables protected
- [x] ✅ Customer data isolated
- [x] ✅ Master admin cannot be removed

---

## 📚 Documentation Reference

For detailed information, see:

- **VERCEL_DEPLOYMENT_FIX.md** - Deployment configuration details
- **ADMIN_SETUP_GUIDE.md** - Admin system setup
- **ADMIN_AND_SECURITY_FEATURES.md** - Complete feature documentation
- **SCANNER_AND_HISTORY_FEATURE.md** - Bill scanner details
- **NEW_FEATURES_SUMMARY.md** - All features overview

---

## 🆘 Getting Help

### Deployment Issues
1. Check Vercel deployment logs
2. Review **VERCEL_DEPLOYMENT_FIX.md**
3. Test local build first
4. Check configuration files

### Admin Issues
1. Review **ADMIN_SETUP_GUIDE.md**
2. Verify admin number configuration
3. Check backend logs
4. Test with different account

### Feature Issues
1. Check **ADMIN_AND_SECURITY_FEATURES.md**
2. Review implementation details
3. Verify API endpoints
4. Test in incognito mode

### Technical Support
- **Vercel Docs:** https://vercel.com/docs
- **Supabase Docs:** https://supabase.com/docs
- **Vite Docs:** https://vitejs.dev

---

## ✅ Final Steps

### 1. Configure Admin
```bash
☐ Update master admin number
☐ Set staff code
☐ Test admin login
```

### 2. Deploy
```bash
☐ Verify local build
☐ Deploy to Vercel
☐ Set environment variables
```

### 3. Test
```bash
☐ Test all features
☐ Verify routing
☐ Check mobile
```

### 4. Launch
```bash
☐ Share URL with team
☐ Train staff on features
☐ Monitor for issues
```

---

## 🎊 You're Live!

Congratulations! Your Epicure Cafe loyalty system is now live with:

✅ Full admin system
✅ Bill scanning with OCR
✅ Duplicate prevention
✅ Staff security codes
✅ Role-based access
✅ Purchase tracking
✅ Roadmap gamification
✅ Badge rewards
✅ Responsive design
✅ Production-ready deployment

**Enjoy managing your cafe's loyalty program!** ☕

---

**Deployment Date:** _________________
**Deployed By:** _________________
**Production URL:** _________________
**Admin Contact:** _________________

---

*Save this guide for reference during updates and maintenance.*
