# 🔧 Troubleshooting Guide - Epicure Cafe

## Error: "Name is required for new customers"

### What It Means
This is **NOT actually an error** - it's the expected behavior for new users! The system is working correctly.

### How It Should Work

When a **new user** (someone who hasn't registered before) enters their OTP:

1. ✅ Backend checks if customer exists in database
2. ✅ Customer not found → sends error with `isNewUser: true` flag
3. ✅ Frontend detects the flag
4. ✅ **Automatically transitions to registration step**
5. ✅ User enters their name
6. ✅ Account created successfully

### If You're Seeing the Error Message

**Check browser console (F12) for these logs:**

```
[Login] Verifying OTP for mobile: XXXXXXXXXX
[API] Calling /verify-otp POST
[API Error] /verify-otp (400): Name is required for new customers
[API Error Response Full]: { error: "Name is required for new customers", isNewUser: true }
[Login] Verify OTP response: { error: "...", isNewUser: true }
[Login] isNewUser flag: true
[Login] New user detected, transitioning to registration step
```

**Expected behavior:**
- ✅ Toast notification: "Welcome! Please enter your name to complete registration"
- ✅ Screen changes to show "Your Name" input field
- ✅ Error message disappears
- ✅ "Complete Registration" button appears

### If It's NOT Transitioning to Registration

**Possible causes:**

1. **JavaScript console has errors** → Check for red errors in console
2. **Old cached code** → Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
3. **Server not returning isNewUser flag** → Check `[API Error Response Full]` log

**Quick fix:**
```bash
# Hard refresh the page
Ctrl + Shift + R (Windows/Linux)
Cmd + Shift + R (Mac)
```

---

## Complete Test Flow

### Test 1: New User Registration ✅

```
Step 1: Enter mobile number
→ Input: 9876543210
→ Click: "Send OTP"
→ See toast with OTP (e.g., "123456")

Step 2: Enter OTP
→ Input: 123456
→ Click: "Verify OTP"
→ Should automatically transition to registration step ✅

Step 3: Enter name
→ Input: "Test User"
→ Click: "Complete Registration"
→ See: "Welcome to Epicure Cafe, Test User!" ✅
→ Redirected to dashboard ✅
```

### Test 2: Existing User Login ✅

```
Step 1: Enter same mobile number
→ Input: 9876543210 (from Test 1)
→ Click: "Send OTP"

Step 2: Enter OTP
→ Input: (new OTP from toast)
→ Click: "Verify OTP"
→ See: "Welcome back, Test User!" ✅
→ Redirected to dashboard (no name prompt) ✅
```

---

## Common Issues

### Issue 1: "OTP not found or expired"

**Cause**: OTP expired (10 minutes) or wrong OTP entered

**Solution**:
1. Click "Change phone number"
2. Re-enter mobile number
3. Request new OTP
4. Enter new OTP

---

### Issue 2: "Invalid OTP. Please check and try again."

**Cause**: Wrong OTP entered

**Solution**:
1. Check the toast notification for correct OTP (demo mode)
2. Re-enter the correct 6-digit code
3. OTP is NOT deleted, you can retry!

---

### Issue 3: Error message shows but doesn't transition

**Cause**: Frontend not detecting `isNewUser` flag

**Debug steps**:
1. Open browser console (F12)
2. Look for: `[Login] isNewUser flag: true`
3. If missing, check: `[API Error Response Full]`
4. Should contain: `{ error: "...", isNewUser: true }`

**Solution**:
```typescript
// The response should look like this:
{
  error: "Name is required for new customers",
  isNewUser: true  // ← This flag MUST be present
}
```

If `isNewUser` is missing from the API response:
- ✅ Server code is correct (already fixed)
- ✅ Hard refresh the page to clear cache

---

### Issue 4: Registration completes but data not saved

**Cause**: Database connectivity issue

**Debug steps**:
```
1. Check console for: [API Success] /verify-otp
2. Look for customer object in response
3. Verify customer ID is generated
```

**Check database**:
```typescript
// In browser console
localStorage.getItem('customerId') 
// Should return: "customer_1733056789_abc123"
```

---

## Console Logs Reference

### Normal Flow Logs

**Sending OTP:**
```
[API] Calling /send-otp POST
[API Success] /send-otp { success: true, otp: "123456" }
```

**New User OTP Verification:**
```
[API] Calling /verify-otp POST
[API Error] /verify-otp (400): Name is required for new customers
[API Error Response Full]: { error: "...", isNewUser: true }
[Login] isNewUser flag: true
[Login] New user detected, transitioning to registration step
```

**Completing Registration:**
```
[API] Calling /verify-otp POST
[API Success] /verify-otp { success: true, customer: {...} }
[Login] Successfully logged in customer: Test User
```

**Existing User Login:**
```
[API] Calling /verify-otp POST
[API Success] /verify-otp { success: true, customer: {...} }
[Login] Successfully logged in customer: Test User
```

---

## Error Messages Explained

| Error Message | Meaning | Action |
|---------------|---------|--------|
| **Name is required for new customers** | New user needs to register | ✅ Automatically transitions to registration |
| **OTP not found or expired** | No OTP exists for this number | Request new OTP |
| **OTP expired. Please request a new OTP** | OTP is older than 10 minutes | Request new OTP |
| **Invalid OTP. Please check and try again** | Wrong OTP entered | Retry with correct OTP |
| **Invalid mobile number** | Not 10 digits or contains letters | Enter valid 10-digit number |
| **Mobile and OTP are required** | API request malformed | Contact developer |

---

## Backend Status Check

### Check if backend is running:

```
Open browser console → Look for:
[API] Calling /health GET
[API Success] /health { status: "ok", timestamp: "..." }
```

If health check fails:
- ❌ Backend is down
- Contact developer or check Supabase dashboard

---

## Production Readiness Checklist

Before launching to real customers:

### Backend
- [x] OTP generation working
- [x] OTP expiry set to 10 minutes
- [x] Database persistence working
- [x] Customer creation working
- [x] Purchase tracking working
- [x] Roadmap completion working
- [x] Badge awarding working
- [ ] Real SMS integration (Airtel)
- [ ] Rate limiting enabled
- [ ] Monitoring setup

### Frontend
- [x] Login flow complete
- [x] Registration flow complete
- [x] Error handling robust
- [x] Console logging enabled (for debug)
- [ ] Remove OTP from toast (production)
- [ ] Remove debug console logs (production)
- [ ] Analytics tracking

### Security
- [x] Service role key server-side only
- [x] OTP one-time use
- [x] OTP expires after 10 minutes
- [x] Input validation (mobile numbers)
- [ ] Rate limiting on OTP requests
- [ ] IP blocking for abuse
- [ ] HTTPS enforced

---

## Quick Diagnostics

### Is the error actually a problem?

**NO** if:
- ✅ User is new (first time logging in)
- ✅ Screen transitions to "Complete your profile"
- ✅ Name input appears
- ✅ After entering name, account created successfully

**YES** if:
- ❌ Error shows and nothing happens
- ❌ Registration step doesn't appear
- ❌ Stuck on OTP step
- ❌ Same error after entering name

---

## Developer Debug Commands

### Check customer in database:
```javascript
// In browser console after logging in
const customerId = localStorage.getItem('customerId');
console.log('Customer ID:', customerId);

// API call to get customer data
fetch(`https://${projectId}.supabase.co/functions/v1/make-server-6a458d4b/customer/${customerId}`, {
  headers: {
    'Authorization': `Bearer ${publicAnonKey}`
  }
}).then(r => r.json()).then(console.log);
```

### Check if customer exists for mobile:
```javascript
const mobile = "9876543210";
fetch(`https://${projectId}.supabase.co/functions/v1/make-server-6a458d4b/check-customer/${mobile}`, {
  headers: {
    'Authorization': `Bearer ${publicAnonKey}`
  }
}).then(r => r.json()).then(console.log);
// Should return: { exists: true/false, isNewUser: true/false }
```

### Manually send OTP:
```javascript
fetch(`https://${projectId}.supabase.co/functions/v1/make-server-6a458d4b/send-otp`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${publicAnonKey}`
  },
  body: JSON.stringify({ mobile: "9876543210" })
}).then(r => r.json()).then(console.log);
// Returns: { success: true, otp: "123456" }
```

---

## Still Having Issues?

### Collect this information:

1. **Browser console logs** (copy all)
2. **Network tab** (check /verify-otp request/response)
3. **Steps taken** (exact clicks)
4. **Mobile number used** (for testing)
5. **Expected vs actual behavior**

### Check these files:
- `/supabase/functions/server/index.tsx` (line 116-119)
- `/components/LoginPage.tsx` (line 79-90)
- `/utils/api.ts` (line 33-34)

### Verify the flow:
```
User enters mobile → OTP sent → User enters OTP → 
If new user: isNewUser=true → Show registration → 
User enters name → Account created ✅

If existing user: Customer found → Login successful ✅
```

---

**Remember**: "Name is required for new customers" is an expected response, not an error! The frontend should automatically handle it and show the registration form.

**Status**: System working as designed ✅  
**Last Updated**: December 1, 2025
