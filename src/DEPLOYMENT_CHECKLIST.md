# Production Deployment Checklist - Epicure Cafe

## Pre-Deployment Security Tasks

### 🔒 Critical Security Updates

#### 1. Remove Demo OTP Response
- [ ] Edit `/supabase/functions/server/index.tsx` line 102-103
- [ ] Remove the `otp: otp` field from the response
- [ ] **Before:**
  ```typescript
  return c.json({ 
    success: true, 
    message: "OTP sent successfully",
    otp: otp  // ⚠️ REMOVE THIS LINE
  });
  ```
- [ ] **After:**
  ```typescript
  return c.json({ 
    success: true, 
    message: "OTP sent successfully"
  });
  ```

#### 2. Update CORS Configuration
- [ ] Edit `/supabase/functions/server/index.tsx` line 15
- [ ] Replace `"https://your-domain.vercel.app"` with your actual Vercel URL
- [ ] Remove localhost URLs if not needed
- [ ] **Example:**
  ```typescript
  const ALLOWED_ORIGINS = [
    "https://epicure-cafe.vercel.app"  // Your actual domain
  ];
  ```

#### 3. Set Environment Variables in Supabase
Go to Supabase Dashboard > Edge Functions > Secrets and add:
- [ ] `ENVIRONMENT=production`
- [ ] `MASTER_ADMIN_MOBILE=your_admin_mobile_number`
- [ ] `MANUAL_ENTRY_CODE=generate_secure_random_code`

**Generate a secure staff code:**
```bash
# Use this command to generate a random code:
openssl rand -base64 12
# Or create a memorable but secure code: EPICURE_STAFF_2025
```

## Jio SMS Integration (When API is Ready)

### 4. Configure Jio SMS API
- [ ] Obtain Jio SMS API credentials
- [ ] Add environment variables in Supabase:
  - `JIO_SMS_API_KEY=your_jio_api_key`
  - `JIO_SMS_API_ENDPOINT=jio_sms_endpoint_url`
  - `JIO_SENDER_ID=EPICUR` (or your registered sender ID)

### 5. Update OTP Endpoint with Jio Integration
- [ ] Edit `/supabase/functions/server/index.tsx` line 85-103
- [ ] Replace console.log with actual SMS sending
- [ ] See `/SECURITY.md` for complete code example

## Vercel Deployment

### 6. Push Code to GitHub
```bash
# Make sure all changes are committed
git add .
git commit -m "Security hardening and production preparation"
git push origin main
```

### 7. Vercel Configuration
- [ ] Ensure `vercel.json` is in the repository
- [ ] Verify automatic deployment is enabled
- [ ] Check build logs for errors
- [ ] Confirm deployment URL

### 8. Post-Deployment Verification
- [ ] Test OTP login flow
- [ ] Verify admin access works
- [ ] Test bill scanner functionality
- [ ] Check menu displays correctly
- [ ] Test roadmap progress tracking
- [ ] Verify badge unlocking works

## Security Verification

### 9. Security Checks
- [ ] Verify OTP is NOT returned in API response
- [ ] Confirm CORS only allows your domain
- [ ] Test rate limiting on OTP requests
- [ ] Verify admin routes require authentication
- [ ] Test duplicate bill prevention
- [ ] Confirm staff code validation works

### 10. Create Admin Account
- [ ] Use the master admin mobile number to create your admin account
- [ ] Login with OTP using your admin number
- [ ] Verify admin features are accessible
- [ ] Test adding/removing other admins

## Monitoring Setup

### 11. Enable Monitoring (Recommended)
- [ ] Set up Vercel Analytics (built-in, free)
- [ ] Configure error tracking (e.g., Sentry)
- [ ] Set up uptime monitoring (e.g., UptimeRobot)
- [ ] Create alerts for:
  - High error rates
  - Failed OTP attempts
  - Duplicate bill scans

## Documentation

### 12. Team Training
- [ ] Share staff code with authorized baristas only
- [ ] Train staff on manual entry process
- [ ] Provide admin dashboard guide
- [ ] Document customer support procedures

## Files Ready to Commit

The following files have been updated and are ready for deployment:

1. ✅ `/supabase/functions/server/index.tsx` - Security hardened
2. ✅ `/data/menuData.ts` - Only drinks (food items removed)
3. ✅ `/components/BillScanner.tsx` - Enhanced OCR with invoice detection
4. ✅ `/SECURITY.md` - Comprehensive security documentation
5. ✅ `/DEPLOYMENT_CHECKLIST.md` - This file

## Post-Production Tasks

### 13. Regular Maintenance
- [ ] Review security logs weekly
- [ ] Update dependencies monthly
- [ ] Rotate staff code quarterly
- [ ] Audit admin users monthly
- [ ] Backup customer data weekly (via Supabase)

### 14. Performance Monitoring
- [ ] Monitor API response times
- [ ] Check Supabase usage quotas
- [ ] Monitor Vercel function execution times
- [ ] Review bill scanner success rate

## Rollback Plan

If issues are detected after deployment:

1. **Immediate Rollback:**
   ```bash
   # In Vercel Dashboard:
   # Deployments > Select previous stable deployment > "Promote to Production"
   ```

2. **Fix Issues Locally:**
   ```bash
   git revert HEAD
   git push origin main
   ```

3. **Contact Support:**
   - Vercel Support: vercel.com/support
   - Supabase Support: supabase.com/support

## Final Pre-Deployment Command

Run this before pushing to GitHub:
```bash
# Check for security issues
npm audit

# Run type checking
npm run build

# Commit everything
git add .
git commit -m "Production-ready: Security hardened, menu updated, ready for Jio SMS"
git push origin main
```

---

## Quick Reference

**Current Environment Variables Set:**
- ✅ SUPABASE_URL
- ✅ SUPABASE_ANON_KEY
- ✅ SUPABASE_SERVICE_ROLE_KEY
- ✅ SUPABASE_DB_URL
- ✅ TWILIO_ACCOUNT_SID (legacy, can be removed)
- ✅ TWILIO_AUTH_TOKEN (legacy, can be removed)
- ✅ TWILIO_PHONE_NUMBER (legacy, can be removed)

**Need to Add:**
- ⚠️ ENVIRONMENT=production
- ⚠️ MASTER_ADMIN_MOBILE=your_number
- ⚠️ MANUAL_ENTRY_CODE=your_secure_code
- ⏳ JIO_SMS_API_KEY (when available)
- ⏳ JIO_SMS_API_ENDPOINT (when available)

---

**Ready to Deploy?** Make sure all checkboxes above are completed! ✅
