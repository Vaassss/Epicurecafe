# Security Guide - Epicure Cafe Loyalty System

This document outlines the security measures implemented in the application and provides guidelines for maintaining security in production.

## OWASP Top 10 Compliance

### ✅ 1. Broken Access Control
**Mitigations Implemented:**
- Admin routes require verification via `X-Admin-Mobile` header
- Master admin cannot be removed by other admins
- Customer data access restricted to authenticated users
- Staff code verification for manual bill entry
- Rate limiting on admin API calls (100 requests/hour)

**Production Checklist:**
- [ ] Change `MASTER_ADMIN_MOBILE` environment variable to your actual admin number
- [ ] Rotate `MANUAL_ENTRY_CODE` regularly (monthly recommended)
- [ ] Monitor admin action logs
- [ ] Implement additional IP-based access controls if needed

### ✅ 2. Cryptographic Failures
**Mitigations Implemented:**
- SHA-256 hashing for bill duplicate detection
- Secure random OTP generation (6-digit numeric)
- Mobile numbers validated with regex pattern
- Staff code transmitted securely over HTTPS

**Known Limitations (Demo Mode):**
- ⚠️ **CRITICAL**: OTP is returned in API response for demo purposes
- ⚠️ Remove `otp: otp` from `/send-otp` response in production

**Production Checklist:**
- [ ] Remove OTP from API response in `/send-otp` endpoint (line 102-103)
- [ ] Implement SMS provider (Jio API integration ready)
- [ ] Use environment variables for all secrets
- [ ] Enable HTTPS only (enforced by Vercel)

### ✅ 3. Injection
**Mitigations Implemented:**
- Using key-value store with safe parameterized queries
- Input validation on all user inputs
- Mobile number regex validation (`/^\d{10}$/`)
- No raw SQL queries
- Sanitized text processing in OCR scanner

**Security Notes:**
- KV store operations are injection-safe
- All data types are strongly typed (TypeScript)

### ✅ 4. Insecure Design
**Mitigations Implemented:**
- OTP attempt limiting (max 5 attempts)
- OTP rate limiting (max 3 requests per phone per hour)
- OTP expiration (10 minutes)
- Bill duplicate prevention using hash
- Invoice number extraction and validation

**Production Checklist:**
- [ ] Monitor OTP request patterns for abuse
- [ ] Implement account lockout after repeated failures
- [ ] Set up alerts for suspicious activity

### ✅ 5. Security Misconfiguration
**Mitigations Implemented:**
- CORS restricted to allowed origins in production
- Environment-based configuration
- Secure headers enabled
- Credentials mode for CORS

**Configuration Required:**
```bash
# Environment Variables (Supabase Dashboard > Edge Functions > Secrets)
ENVIRONMENT=production
MASTER_ADMIN_MOBILE=your_admin_mobile
MANUAL_ENTRY_CODE=your_secure_code
```

**Production Checklist:**
- [ ] Update `ALLOWED_ORIGINS` in `/supabase/functions/server/index.tsx` (line 15)
- [ ] Replace `"https://your-domain.vercel.app"` with your actual Vercel domain
- [ ] Set `ENVIRONMENT=production` in Supabase Edge Functions
- [ ] Verify CORS configuration

### ✅ 6. Vulnerable and Outdated Components
**Current Dependencies:**
- Hono (latest) - Web framework
- Tesseract.js - OCR library
- Motion (Framer Motion) - Animation library
- Supabase client - Database & auth

**Production Checklist:**
- [ ] Run `npm audit` regularly
- [ ] Update dependencies monthly
- [ ] Monitor security advisories for Supabase

### ✅ 7. Identification and Authentication Failures
**Mitigations Implemented:**
- OTP-based authentication (industry standard)
- Maximum 5 OTP verification attempts
- OTP expiration after 10 minutes
- Rate limiting on OTP generation
- Admin verification on sensitive endpoints

**Known Limitations:**
- No session tokens (stateless authentication via customer ID)
- Admin authentication via header (can be enhanced)

**Production Checklist:**
- [ ] Implement session management if needed
- [ ] Consider JWT tokens for long-lived sessions
- [ ] Monitor failed authentication attempts
- [ ] Set up alerts for brute force attempts

### ✅ 8. Software and Data Integrity Failures
**Mitigations Implemented:**
- Bill hash validation (SHA-256)
- Invoice number extraction and storage
- Purchase record tracking with timestamps
- Source tracking (scanner/barista/manual)

**Security Notes:**
- Bill hash uses SHA-256 of image data
- Invoice numbers prevent duplicate scanning
- All purchases timestamped and auditable

### ✅ 9. Security Logging and Monitoring Failures
**Current Logging:**
- Console logging enabled for all routes
- Error logging with context
- OTP generation logged (for demo)

**Production Enhancements Needed:**
```typescript
// Recommended logging for production:
- Failed OTP attempts (rate limiting triggers)
- Admin actions (add/remove users, purchases)
- Duplicate bill scan attempts
- Staff code verification failures
- Suspicious patterns (multiple OTPs, rapid requests)
```

**Production Checklist:**
- [ ] Set up centralized logging (e.g., Datadog, LogRocket)
- [ ] Create alerts for:
  - Failed authentication attempts > 10/hour
  - Duplicate bill scanning attempts
  - Admin actions
- [ ] Remove OTP from console logs in production

### ✅ 10. Server-Side Request Forgery (SSRF)
**Status:** No SSRF vulnerabilities
- No external URL fetching based on user input
- OCR processing done locally (Tesseract.js)
- Image processing in browser (FileReader API)

## Jio SMS OTP Integration (Ready for Implementation)

When you receive the Jio SMS API, update `/supabase/functions/server/index.tsx`:

```typescript
// Line 85-103: Update send-otp endpoint
app.post("/make-server-6a458d4b/send-otp", async (c) => {
  try {
    const { mobile } = await c.req.json();
    
    if (!mobile || !/^\d{10}$/.test(mobile)) {
      return c.json({ error: "Invalid mobile number. Must be 10 digits." }, 400);
    }

    // Check rate limit...

    const otp = generateOTP();
    const expiresAt = Date.now() + 10 * 60 * 1000;

    const otpData: OTPData = {
      mobile,
      otp,
      expiresAt,
      attempts: 0
    };

    await kv.set(`otp:${mobile}`, otpData);

    // ✅ PRODUCTION: Send SMS via Jio API
    const smsResponse = await fetch("JIO_SMS_API_ENDPOINT", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${Deno.env.get("JIO_SMS_API_KEY")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        mobile: mobile,
        message: `Your Epicure Cafe OTP is: ${otp}. Valid for 10 minutes.`,
        sender: "EPICUR" // Your registered sender ID
      })
    });

    if (!smsResponse.ok) {
      console.error("Failed to send SMS:", await smsResponse.text());
      return c.json({ error: "Failed to send OTP" }, 500);
    }

    console.log(`OTP sent to ${mobile} via SMS`);

    // ⚠️ REMOVE THIS IN PRODUCTION - Only for demo
    // return c.json({ success: true, message: "OTP sent successfully", otp: otp });
    
    // ✅ PRODUCTION RESPONSE:
    return c.json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return c.json({ error: "Failed to send OTP" }, 500);
  }
});
```

**Jio API Environment Variables:**
```bash
JIO_SMS_API_KEY=your_jio_api_key
JIO_SMS_API_ENDPOINT=https://jio-sms-endpoint.com/send
```

## Security Best Practices

### 1. Environment Variables
Store all secrets in Supabase Edge Functions environment:
- `MASTER_ADMIN_MOBILE` - Your admin phone number
- `MANUAL_ENTRY_CODE` - Staff code for manual entry
- `JIO_SMS_API_KEY` - Jio SMS API key (when available)
- `ENVIRONMENT` - Set to "production" for production deployment

### 2. CORS Configuration
Update `/supabase/functions/server/index.tsx` line 15:
```typescript
const ALLOWED_ORIGINS = [
  "https://your-actual-domain.vercel.app", // Your production domain
  "http://localhost:5173" // Remove in production
];
```

### 3. Regular Security Audits
- [ ] Review admin users monthly
- [ ] Check for suspicious purchase patterns
- [ ] Monitor duplicate bill scan attempts
- [ ] Rotate staff codes quarterly
- [ ] Update dependencies monthly

### 4. Incident Response
If you detect suspicious activity:
1. Immediately rotate `MANUAL_ENTRY_CODE`
2. Review admin user list (`/admin/list-admins`)
3. Check recent purchase history
4. Monitor logs for patterns
5. Consider temporary rate limit reduction

## Contact Security Team
For security concerns or to report vulnerabilities, contact the development team immediately.

---

**Last Updated:** December 4, 2025  
**Next Security Review:** March 4, 2026
