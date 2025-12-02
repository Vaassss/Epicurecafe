# Admin System and Enhanced Security Features

## Overview
Implemented comprehensive admin system with security controls, duplicate bill prevention, and staff-only manual entry for the Epicure Cafe loyalty program.

---

## 🔐 Security Features

### 1. Duplicate Bill Prevention
**Problem Solved:** Same bill cannot be scanned multiple times across any customer account.

**Implementation:**
- Each scanned image generates a unique SHA-256 hash
- Hash is stored in the database when bill is processed
- Before processing, system checks if hash already exists
- Clear error message: "This bill has already been scanned"

**Technical Details:**
```typescript
// Generate hash from image
const hash = await crypto.subtle.digest('SHA-256', imageData);

// Check for duplicates
const existingBill = await kv.get(`bill:${billHash}`);
if (existingBill) {
  return error("This bill has already been scanned");
}
```

### 2. Staff Code for Manual Entry
**Problem Solved:** Only cafe staff can manually add items (not scanned from bills).

**Implementation:**
- Manual item addition requires a staff code
- Code verification happens server-side
- Default code: `CAFE2024` (configurable in backend)
- Invalid codes are rejected with clear error

**User Experience:**
1. Customer clicks "Add Items Manually"
2. Staff code input modal appears
3. Enter code → Verify
4. If valid: Access manual item selection
5. If invalid: Error message, try again

**Security:**
- Code is stored as constant in backend (not in frontend)
- Can be changed to environment variable for production
- Backend validates code before allowing manual entry

---

## 👑 Admin System

### Master Admin
**Phone Number:** `9999999999` (configured in backend)
- This number is automatically granted admin privileges
- Cannot be removed from admin list
- Has full control over the system

**To Change Master Admin Number:**
Edit `/supabase/functions/server/index.tsx`:
```typescript
const MASTER_ADMIN_MOBILE = "YOUR_PHONE_NUMBER";
```

### Admin Capabilities

#### 1. View All Customers
- See complete list of all registered customers
- Search by name or mobile number
- View customer stats:
  - Total purchases
  - Badges earned
  - Registration date
  - Last purchase date

#### 2. Manage Customer Orders
**Add Purchases:**
- Select any customer
- Click "Add Items"
- Choose items from menu
- Items added immediately to customer's history
- Contributes to their roadmap progress

**Remove Purchases:**
- View customer's purchase history
- Click trash icon on any purchase
- Confirm deletion
- Purchase removed, roadmap progress recalculated

#### 3. Admin User Management
**Add Admins:**
- Enter 10-digit mobile number
- Click "Add Admin"
- Number added to admin list
- User gets admin access on next login

**Remove Admins:**
- View list of all admins
- Click "Remove" next to any admin (except master admin)
- Admin loses privileges immediately
- Cannot remove master admin

#### 4. Menu Management
- View all 43 menu items
- See categories and prices
- (Menu editing coming in future update)

---

## 🔄 Updated Data Structures

### Customer Data
```typescript
interface CustomerData {
  id: string;
  name: string;
  mobile: string;
  purchases: string[];
  purchaseHistory: PurchaseRecord[];
  completedRoadmaps: string[];
  badges: string[];
  createdAt: string;
  lastPurchaseAt?: string;
  isAdmin?: boolean; // NEW
}
```

### Purchase Record
```typescript
interface PurchaseRecord {
  id: string;
  items: string[];
  timestamp: string;
  source: 'scanner' | 'barista' | 'manual';
  billId?: string;
  billHash?: string; // NEW - for duplicate prevention
}
```

### Scanned Bill Tracking
```typescript
interface ScannedBill {
  billHash: string;
  customerId: string;
  scannedAt: string;
}
```

---

## 🚀 New API Endpoints

### Admin Endpoints (Require X-Admin-Mobile Header)

#### Get All Customers
```
GET /admin/customers
Headers: { X-Admin-Mobile: "admin_phone_number" }
Response: { customers: CustomerData[] }
```

#### Add Purchase for Customer
```
POST /admin/customer/:mobile/purchase
Headers: { X-Admin-Mobile: "admin_phone_number" }
Body: { items: string[], action: 'add' }
Response: { success: boolean, customer: CustomerData }
```

#### Remove Purchase
```
POST /admin/customer/:mobile/purchase
Headers: { X-Admin-Mobile: "admin_phone_number" }
Body: { purchaseId: string, action: 'remove' }
Response: { success: boolean, customer: CustomerData }
```

#### Add Admin
```
POST /admin/add-admin
Headers: { X-Admin-Mobile: "admin_phone_number" }
Body: { mobile: string }
Response: { success: boolean, message: string }
```

#### Remove Admin
```
POST /admin/remove-admin
Headers: { X-Admin-Mobile: "admin_phone_number" }
Body: { mobile: string }
Response: { success: boolean, message: string }
```

#### List All Admins
```
GET /admin/list-admins
Headers: { X-Admin-Mobile: "admin_phone_number" }
Response: { admins: AdminRecord[] }
```

### Security Endpoints

#### Verify Staff Code
```
POST /verify-staff-code
Body: { code: string }
Response: { valid: boolean }
```

---

## 🎯 User Flows

### Admin Login Flow
1. Enter phone number (master admin or added admin)
2. Receive OTP
3. Verify OTP
4. **Automatically routed to Admin Dashboard** (not customer dashboard)
5. Access admin features

### Customer Login Flow
1. Enter phone number
2. Receive OTP
3. Verify OTP
4. If new: Provide name
5. **Routed to Customer Dashboard**
6. Cannot access admin features

### Staff Manual Entry Flow
1. Customer clicks "Scan Bill"
2. Clicks "Add Items Manually (Staff Only)"
3. Staff code prompt appears
4. Staff enters code: `CAFE2024`
5. If valid: Manual item selection shown
6. Select items → Submit
7. Items added with source: 'manual'

### Bill Scanning with Duplicate Prevention
1. Customer takes photo of bill
2. System generates hash of image
3. Checks if hash exists in database
4. If duplicate: Error "This bill has already been scanned"
5. If new: Proceed with OCR and item detection
6. Save bill hash after successful submission

---

## 🛡️ Security Considerations

### Access Control
- ✅ Admin endpoints require admin mobile in header
- ✅ Backend verifies admin status before processing
- ✅ Master admin cannot be removed
- ✅ Customers cannot access admin features
- ✅ Staff code required for manual entry

### Data Integrity
- ✅ Bill hashes prevent duplicate scanning
- ✅ Purchase records maintain audit trail
- ✅ Source tracking (scanner/barista/manual)
- ✅ Timestamp on all transactions

### Best Practices Implemented
1. **Server-side validation** for all operations
2. **No sensitive data in frontend** (codes, admin lists)
3. **Audit trail** for all purchases
4. **Role-based access control** (admin vs customer)
5. **Duplicate prevention** at database level

---

## 📋 Configuration

### Backend Configuration File
`/supabase/functions/server/index.tsx`

```typescript
// Admin Configuration
const MASTER_ADMIN_MOBILE = "9999999999"; // Change to owner's number
const MANUAL_ENTRY_CODE = "CAFE2024";     // Change to your staff code
```

### Production Recommendations
1. Move `MANUAL_ENTRY_CODE` to environment variable
2. Change `MASTER_ADMIN_MOBILE` to owner's actual number
3. Use secure SMS provider for OTP (currently demo mode)
4. Enable HTTPS only
5. Add rate limiting to prevent abuse

---

## 🎨 UI Components Created

### AdminDashboard.tsx
Full-featured admin panel with:
- Customer management
- Purchase management
- Admin user management
- Menu viewing
- Responsive design
- Search functionality

### Enhanced BillScanner.tsx
- Staff code verification UI
- Duplicate bill error handling
- Manual entry protection
- Image hash generation

---

## 📊 Feature Comparison

| Feature | Customer | Admin |
|---------|----------|-------|
| View own orders | ✅ | ✅ |
| View all orders | ❌ | ✅ |
| Scan bills | ✅ | ✅ |
| Manual entry | ⚠️ With staff code | ✅ |
| Add purchases for others | ❌ | ✅ |
| Remove purchases | ❌ | ✅ |
| Manage admins | ❌ | ✅ |
| View menu | ✅ | ✅ |
| Track roadmaps | ✅ | ✅ |

---

## 🔧 Testing Checklist

### Admin Features
- [ ] Master admin can login and access admin dashboard
- [ ] Admin can view all customers
- [ ] Admin can add purchases to any customer
- [ ] Admin can remove purchases from any customer
- [ ] Admin can add new admin users
- [ ] Admin can remove admin users (except master)
- [ ] Regular customer cannot access admin features

### Security Features
- [ ] Staff code required for manual entry
- [ ] Invalid staff code rejected
- [ ] Valid staff code grants access
- [ ] Same bill cannot be scanned twice
- [ ] Duplicate bill shows clear error
- [ ] Bill hash generated correctly

### User Experience
- [ ] Admin automatically routed to admin dashboard
- [ ] Customer routed to customer dashboard
- [ ] Clear differentiation between roles
- [ ] All buttons and features work on mobile
- [ ] Error messages are clear and helpful

---

## 🚀 Future Enhancements

1. **Menu Management**
   - Add/edit/delete menu items
   - Update prices
   - Manage categories

2. **Advanced Analytics**
   - Sales reports
   - Popular items
   - Customer retention metrics

3. **Bulk Operations**
   - Import customers from CSV
   - Bulk purchase addition
   - Export reports

4. **Notifications**
   - Alert admin on new customer
   - Notify customers on rewards
   - Low stock alerts

5. **Enhanced Security**
   - Two-factor authentication for admins
   - Activity logs
   - Session management

---

## 📝 Files Modified/Created

### Created
- `/components/AdminDashboard.tsx` - Complete admin panel
- `/ADMIN_AND_SECURITY_FEATURES.md` - This documentation

### Modified
- `/supabase/functions/server/index.tsx` - Admin endpoints, security
- `/components/BillScanner.tsx` - Staff code, duplicate prevention
- `/components/LoginPage.tsx` - Admin detection and routing
- `/App.tsx` - Admin routing support
- `/utils/api.ts` - Admin API methods

---

## 🎓 Admin User Guide

### For the Owner (Master Admin)

**Initial Setup:**
1. Register with your phone number (9999999999)
2. You'll automatically be an admin
3. Login to access Admin Dashboard

**Daily Operations:**
1. **Check customer activity**
   - Click "Customers" tab
   - View who made purchases
   - Check roadmap progress

2. **Add purchases** (if customer forgot to scan)
   - Select customer
   - Click "Add Items"
   - Choose items
   - Submit

3. **Correct mistakes**
   - Select customer
   - Find incorrect purchase
   - Click trash icon
   - Confirm deletion

4. **Add staff as admins**
   - Click "Admins" tab
   - Enter staff phone number
   - Click "Add Admin"
   - Staff gets admin access

**Best Practices:**
- Review purchases daily
- Keep admin list updated
- Change staff code periodically
- Monitor for suspicious activity

---

## 🔒 Security Notes

**Staff Code:** `CAFE2024`
- Share only with trusted staff
- Change regularly
- Don't post publicly

**Master Admin Number:** `9999999999`
- Update to your real number
- Keep it secret
- Cannot be removed

**Admin Access:**
- Only give to trusted employees
- Can view all customer data
- Can modify all orders
- Remove access when employee leaves
