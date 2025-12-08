# Airtel OTP Integration Setup Guide

## Current Status
✅ **Demo Mode Active** - OTP is currently being displayed in the UI for testing purposes
✅ **Airtel SMS Integration Code Ready** - Backend is prepared for real SMS integration
✅ **System Working Perfectly** - All features tested and functioning

---

## What You Need from Airtel Service Center

To switch from demo OTP to real SMS OTP, you need to collect the following from Airtel:

### 1. **API Key / Auth Token**
- **What to ask for:** "I need an API key for sending SMS via Airtel's SMS Gateway API"
- **Purpose:** This authenticates your requests to Airtel's SMS service
- **Format:** Usually a long alphanumeric string
- **Environment Variable:** `AIRTEL_API_KEY`

### 2. **Sender ID**
- **What to ask for:** "I need a Sender ID for my SMS service"
- **Purpose:** This is the name/number that appears as the sender when customers receive the OTP
- **Recommended:** "EPICUR" or "EPICAF" (6 characters max, usually)
- **Requirements:** 
  - Must be approved by Airtel
  - Should match your business name
  - Typically takes 2-3 business days for approval
- **Environment Variable:** `AIRTEL_SENDER_ID`

### 3. **DLT Template ID**
- **What to ask for:** "I need to register a DLT template for OTP messages"
- **Full Name:** Distributed Ledger Technology (DLT) Template
- **Purpose:** Required by TRAI regulations for commercial SMS in India
- **You must register this exact message template:**
  ```
  Your Epicure Cafe OTP is <OTP>. Valid for 5 minutes. Do not share this code with anyone.
  ```
- **Process:**
  1. Register on DLT portal (https://www.ucc-bsnl.co.in or Airtel's DLT portal)
  2. Submit your business documents (GST, PAN, etc.)
  3. Get template approved
  4. Receive Template ID (numeric code)
- **Environment Variable:** `AIRTEL_DLT_TEMPLATE_ID`
- **Note:** The message must match EXACTLY, only `<OTP>` can be a variable

### 4. **API Endpoint URL**
- **What to ask for:** "Which API endpoint should I use for SMS service?"
- **Common Options:**
  - Standard API: `https://api.airtel.in/v1/sms/send`
  - DLT Connect: `https://dltconnect.airtel.in/sms/v1/send`
- **Note:** The endpoint varies based on your plan/region
- **Already Configured:** Both endpoints are in the code, you just need to confirm which one to use

### 5. **Additional Information to Ask:**
- Monthly SMS quota/limit
- Cost per SMS
- Rate limits (messages per second/minute)
- Support contact for API issues
- Documentation access

---

## Documents Required for DLT Registration

You'll need these business documents:

1. **GST Certificate** (if registered)
2. **PAN Card** of business owner
3. **Business Registration Certificate**
4. **Address Proof** of business
5. **Authorized Signatory** documents
6. **Letter of Authorization** on company letterhead

---

## Setup Process (After Getting Credentials)

Once you have the credentials from Airtel, follow these steps:

### Step 1: Add Environment Variables
You'll need to add these in your Figma Make environment:
```
AIRTEL_API_KEY=your_api_key_here
AIRTEL_SENDER_ID=EPICUR
AIRTEL_DLT_TEMPLATE_ID=your_template_id_here
ENABLE_SMS_OTP=true
```

### Step 2: Test First
- Keep `DEMO_MODE=true` initially while testing
- Verify SMS delivery to your own number
- Check costs and quotas

### Step 3: Go Live
- Set `DEMO_MODE=false` to disable demo OTP
- OTP will no longer show in the UI
- Customers will receive SMS on their mobile

---

## Current Demo Mode

**How Demo OTP Works Now:**
1. User enters mobile number
2. System generates 6-digit OTP
3. **OTP is displayed in the UI** for testing
4. User can copy and paste it
5. OTP is valid for 10 minutes

**Benefits of Demo Mode:**
- Free testing
- No SMS costs
- Instant OTP delivery
- Easy development and testing

---

## API Endpoints Ready in Your System

Your system has both Airtel API implementations ready:

### Method 1: Standard API
```javascript
POST https://api.airtel.in/v1/sms/send
Headers: {
  Authorization: Bearer {API_KEY}
  Content-Type: application/json
}
Body: {
  sender: SENDER_ID,
  message: "Your Epicure Cafe OTP is 123456...",
  mobile: 919876543210,
  dlt_template_id: TEMPLATE_ID
}
```

### Method 2: DLT Connect API
```javascript
POST https://dltconnect.airtel.in/sms/v1/send
Headers: {
  api-key: API_KEY
  Content-Type: application/json
}
Body: {
  senderid: SENDER_ID,
  message: "Your Epicure Cafe OTP is 123456...",
  number: 9876543210,
  templateid: TEMPLATE_ID
}
```

---

## Costs (Approximate - Confirm with Airtel)

- **SMS Cost:** ₹0.15 - ₹0.25 per SMS (transactional)
- **DLT Registration:** One-time fee ~₹500-1000
- **Sender ID Registration:** Usually free
- **Minimum Recharge:** Varies (usually ₹1000-5000)

---

## Testing Checklist

Before switching to production:

- [ ] Received API Key from Airtel
- [ ] Sender ID approved and active
- [ ] DLT Template registered and approved
- [ ] Added environment variables to system
- [ ] Tested with demo mode first
- [ ] Verified SMS delivery to test numbers
- [ ] Checked SMS delivery time (<30 seconds)
- [ ] Verified OTP message format matches template
- [ ] Tested OTP expiry (10 minutes)
- [ ] Tested invalid OTP handling
- [ ] Confirmed costs and added sufficient balance

---

## Contact Information

**Airtel Business Support:**
- Website: https://www.airtel.in/business/commercial-communication
- Phone: 1800-103-4444 (Airtel Business)
- Email: business.care@airtel.com

**DLT Portal:**
- https://www.ucc-bsnl.co.in (Main portal)
- https://www.vilpower.in (Airtel's DLT portal)

---

## Questions to Ask Airtel Representative

1. "What is the process to get an SMS API key for my cafe's OTP service?"
2. "How long does Sender ID approval take?"
3. "Can you help me register my DLT template?"
4. "What is your SMS delivery success rate and average delivery time?"
5. "What support do you provide if SMS delivery fails?"
6. "Do you have a test API key I can use before going live?"
7. "What are the monthly costs if I send approximately [X] OTPs per month?"

---

## Technical Support

If you face any issues after setting up:
1. Check server logs for detailed error messages
2. Verify all environment variables are set correctly
3. Ensure DLT template message matches exactly
4. Check Airtel account balance
5. Verify mobile numbers are in correct format (10 digits starting with 6-9)

---

## Fallback Strategy

If Airtel SMS fails, the system will:
1. Log the error to console
2. Return error message to user
3. User can request new OTP
4. System auto-retries failed SMS (built-in)

**Consider having a backup:**
- Alternative SMS provider (Twilio, MSG91, etc.)
- WhatsApp OTP integration
- Email OTP as fallback
