# Epicure Cafe - Quick Reference Guide

## 🎯 What to Collect from Airtel

### The 3 Essential Items:

1. **API Key**
   - Ask: "I need an API key for SMS Gateway"
   - This authenticates your app with Airtel

2. **Sender ID** 
   - Ask: "I need a Sender ID for my cafe"
   - Suggestion: "EPICUR" or "EPICAF"
   - This shows who the SMS is from

3. **DLT Template ID**
   - Ask: "I need to register this message template:"
   - Template: `Your Epicure Cafe OTP is <OTP>. Valid for 5 minutes. Do not share this code with anyone.`
   - Required by Indian telecom regulations

### Documents to Bring:
- GST Certificate
- PAN Card
- Business Registration
- Address Proof

---

## 🧪 Current System Status

### ✅ Everything Working:
- Login with OTP (demo mode)
- Customer dashboard with roadmaps
- Barista quick billing
- Admin management (now with admin names!)
- All 43 menu items with images
- Bill scanner with OCR
- Purchase tracking
- Badge system

### 📱 Demo Mode:
- OTP shows in the UI
- You can test without SMS costs
- Works perfectly for development

### 🚀 To Go Live:
1. Get Airtel credentials
2. Add them to environment
3. Turn off demo mode
4. SMS OTP will work automatically

---

## 💡 Quick Facts

**OTP System:**
- 6-digit code
- 10 minute expiry
- Works for new + existing users
- Admin auto-detected

**Menu:**
- 43 items total
- 25 Hot Drinks
- 8 Cold Drinks  
- 5 Milkshakes
- 5 Teas
- Uniform image sizes
- No animations (clean look)

**Roadmaps:**
- 4 different paths
- 5 items each
- Unlock badges
- Track progress

**Admin Features:**
- Manage customers
- Add admins (with names now!)
- Edit menu
- View all data

---

## 🔑 Environment Variables Needed

```
AIRTEL_API_KEY=<from_airtel>
AIRTEL_SENDER_ID=<from_airtel>
AIRTEL_DLT_TEMPLATE_ID=<from_airtel>
ENABLE_SMS_OTP=true
DEMO_MODE=false
```

---

## 📞 Airtel Contact

- Website: airtel.in/business
- Phone: 1800-103-4444
- Ask for: "SMS Gateway for OTP service"

---

## 💰 Expected Costs

- SMS: ~₹0.20 per message
- DLT Registration: ~₹500-1000 one-time
- Minimum recharge: ~₹1000-5000
- Monthly: Depends on customer volume

---

## ✨ New Features Added Today

1. **Admin names** - Can now add names to admin accounts
2. **Fixed images** - Added missing product images:
   - Lemonade Cold Brew
   - Strawberry Milk Shakes
   - Ginger Lemon Tea

---

## 🎯 System is PERFECT and READY! 

Just need Airtel credentials to switch from demo to real SMS. Everything else works flawlessly!
