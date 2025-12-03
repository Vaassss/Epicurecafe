# 🚀 Quick Admin Setup Guide

## Step 1: Configure Master Admin Number

**Open:** `/supabase/functions/server/index.tsx`

**Find Line 23:**
```typescript
const MASTER_ADMIN_MOBILE = "9999999999"; // Change this to the owner's phone number
```

**Change to your actual phone number:**
```typescript
const MASTER_ADMIN_MOBILE = "1234567890"; // Replace with owner's 10-digit mobile
```

**Save the file.**

---

## Step 2: Configure Staff Code

**In the same file, Line 24:**
```typescript
const MANUAL_ENTRY_CODE = "CAFE2024"; // Staff code for manual entry - store securely
```

**Change to your desired code:**
```typescript
const MANUAL_ENTRY_CODE = "YOUR_SECRET_CODE"; // Must be uppercase letters/numbers
```

**⚠️ Important:**
- Keep this code secret
- Share only with trusted staff
- Change it periodically
- Don't include in public repositories

**Save the file.**

---

## Step 3: Test Admin Access

1. **Open the app** in your browser
2. **Click "Login"**
3. **Enter your phone number** (the one you set as master admin)
4. **Enter OTP** when prompted
5. **If new user:** Enter your name
6. **You should see:** "Welcome, Admin [Your Name]!"
7. **You'll be redirected to:** Admin Dashboard (not customer dashboard)

---

## Step 4: Add Additional Admins (Optional)

Once you're logged in as admin:

1. **Click the "Admins" tab**
2. **Enter mobile number** of staff member
3. **Click "Add Admin"**
4. **Done!** They can now login as admin

---

## Step 5: Share Staff Code with Team

**For Manual Entry:**
- Give the staff code to your baristas/staff
- They'll need it to manually add items when a bill can't be scanned
- Change it if it gets compromised

---

## 🔐 Security Checklist

- [x] Changed master admin number to real phone
- [x] Changed staff code from default
- [x] Tested admin login
- [x] Staff code is kept private
- [x] Ready to add other admins

---

## 📱 Admin Features Overview

### What You Can Do as Admin:

1. **View All Customers**
   - See everyone who has registered
   - Search by name or phone
   - View their purchase history
   - Check their progress on roadmaps

2. **Manage Orders**
   - Add purchases for any customer
   - Remove incorrect purchases
   - Fix mistakes easily

3. **Control Admin Access**
   - Add staff as admins
   - Remove admin access
   - Master admin cannot be removed

4. **Monitor Menu**
   - View all menu items
   - See prices and categories
   - (Editing coming soon)

---

## 🎯 Common Admin Tasks

### Task: Add a purchase for a customer who forgot to scan
1. Click "Customers" tab
2. Search for customer by name/phone
3. Click on their name
4. Click "Add Items"
5. Select items from menu
6. Click "Add X Items"
7. ✅ Done!

### Task: Remove a duplicate/incorrect purchase
1. Click "Customers" tab
2. Find and select customer
3. Scroll to "Purchase History"
4. Find the incorrect purchase
5. Click trash icon (🗑️)
6. Confirm deletion
7. ✅ Done!

### Task: Make a staff member an admin
1. Click "Admins" tab
2. Enter staff's 10-digit mobile
3. Click "Add Admin"
4. ✅ They can now login as admin!

### Task: Remove someone's admin access
1. Click "Admins" tab
2. Find the person in the list
3. Click "Remove" next to their number
4. Confirm
5. ✅ They're back to regular customer

---

## 🚨 Important Notes

### Master Admin
- **Cannot be removed** from admin list
- Has full control over everything
- Should be the cafe owner

### Staff Code
- Required for **manual item entry only**
- Not required for scanning bills
- Change it monthly for security

### Regular Staff vs Admin Staff
- **Regular staff:** Have staff code, can help customers scan bills manually
- **Admin staff:** Added via Admins tab, can manage all customers and orders

### Customer Privacy
- Admins can see **all customer data**
- Only give admin access to **trusted employees**
- Remove admin access when employees leave

---

## 🐛 Troubleshooting

### "Cannot access admin dashboard after login"
- Check if you entered the correct master admin number
- Make sure it's exactly 10 digits
- Try logging out and back in

### "Staff code not working"
- Check if code matches exactly (case-sensitive)
- Verify you saved the changes in server file
- Restart the server if needed

### "Cannot add admin user"
- Make sure you're logged in as admin
- Check that mobile number is 10 digits
- Try refreshing the page

---

## 📞 Support

If you need help:
1. Check this guide first
2. Review `/ADMIN_AND_SECURITY_FEATURES.md` for detailed documentation
3. Check browser console for errors
4. Verify all configuration steps were completed

---

## ✅ You're All Set!

Your admin system is now configured and ready to use. 

**Next Steps:**
1. Login as admin to test
2. Add your staff as admins if needed
3. Share staff code with baristas
4. Start managing your cafe's loyalty program!

---

## 🔄 Regular Maintenance

**Monthly:**
- [ ] Change staff code
- [ ] Review admin list
- [ ] Check for suspicious activity

**When staff changes:**
- [ ] Add new admins
- [ ] Remove ex-staff from admin list
- [ ] Update staff code if they knew it

**Security Best Practices:**
- Never share admin credentials publicly
- Keep staff code confidential
- Monitor admin activity
- Update codes regularly
