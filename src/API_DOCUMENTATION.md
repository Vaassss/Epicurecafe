# Epicure Cafe API Documentation

## Base URL
```
https://{projectId}.supabase.co/functions/v1/make-server-6a458d4b
```

## Authentication
All requests require the following header:
```
Authorization: Bearer {publicAnonKey}
```

---

## Endpoints

### Health Check

#### `GET /health`
Check if the backend server is operational.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-11-29T10:30:00.000Z"
}
```

---

## Authentication Endpoints

### Send OTP

#### `POST /send-otp`
Send OTP to a mobile number for authentication.

**Request Body:**
```json
{
  "mobile": "9876543210"
}
```

**Validation:**
- `mobile` must be exactly 10 digits
- Only numeric characters allowed

**Success Response (200):**
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "otp": "123456"  // Demo mode only - remove in production
}
```

**Error Response (400):**
```json
{
  "error": "Invalid mobile number. Must be 10 digits."
}
```

---

### Verify OTP

#### `POST /verify-otp`
Verify OTP and login or register user.

**Request Body (Existing User):**
```json
{
  "mobile": "9876543210",
  "otp": "123456"
}
```

**Request Body (New User):**
```json
{
  "mobile": "9876543210",
  "otp": "123456",
  "name": "John Doe"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "customer": {
    "id": "customer_1732885200_abc123def",
    "name": "John Doe",
    "mobile": "9876543210"
  }
}
```

**Error Responses:**

OTP Expired (400):
```json
{
  "error": "OTP expired. Please request a new OTP."
}
```

Invalid OTP (400):
```json
{
  "error": "Invalid OTP. Please check and try again."
}
```

OTP Not Found (400):
```json
{
  "error": "OTP not found or expired. Please request a new OTP."
}
```

New User Missing Name (400):
```json
{
  "error": "Name is required for new customers",
  "isNewUser": true
}
```

---

## Customer Endpoints

### Get Customer Data

#### `GET /customer/:id`
Retrieve complete customer data including purchases and badges.

**Parameters:**
- `id` - Customer ID (string)

**Success Response (200):**
```json
{
  "customer": {
    "id": "customer_1732885200_abc123def",
    "name": "John Doe",
    "mobile": "9876543210",
    "purchases": ["Latte", "Cold Brew", "Chocolate Shake"],
    "completedRoadmaps": ["hot_drinks_explorer"],
    "badges": ["☕ Hot Drinks Explorer"],
    "createdAt": "2025-11-29T10:00:00.000Z",
    "lastPurchaseAt": "2025-11-29T15:30:00.000Z"
  }
}
```

**Error Response (404):**
```json
{
  "error": "Customer not found"
}
```

---

### Add Purchase

#### `POST /customer/:id/purchase`
Add purchased items to customer's record.

**Parameters:**
- `id` - Customer ID (string)

**Request Body:**
```json
{
  "items": ["Latte", "Cappuccino Med", "Americano"]
}
```

**Validation:**
- `items` must be a non-empty array
- Item names must match menu items exactly

**Success Response (200):**
```json
{
  "success": true,
  "customer": {
    "id": "customer_1732885200_abc123def",
    "name": "John Doe",
    "mobile": "9876543210",
    "purchases": ["Latte", "Cappuccino Med", "Americano"],
    "completedRoadmaps": [],
    "badges": [],
    "createdAt": "2025-11-29T10:00:00.000Z",
    "lastPurchaseAt": "2025-11-29T16:00:00.000Z"
  }
}
```

**Error Responses:**

Invalid Items (400):
```json
{
  "error": "Items array is required"
}
```

Customer Not Found (404):
```json
{
  "error": "Customer not found"
}
```

---

### Complete Roadmap

#### `POST /customer/:id/complete-roadmap`
Mark a roadmap as completed and award badge.

**Parameters:**
- `id` - Customer ID (string)

**Request Body:**
```json
{
  "roadmapId": "hot_drinks_explorer",
  "badge": "☕ Hot Drinks Explorer"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "customer": {
    "id": "customer_1732885200_abc123def",
    "name": "John Doe",
    "mobile": "9876543210",
    "purchases": ["Latte", "Cappuccino Med", "Americano"],
    "completedRoadmaps": ["hot_drinks_explorer"],
    "badges": ["☕ Hot Drinks Explorer"],
    "createdAt": "2025-11-29T10:00:00.000Z",
    "lastPurchaseAt": "2025-11-29T16:00:00.000Z"
  }
}
```

**Error Response (400):**
```json
{
  "error": "Roadmap ID and badge are required"
}
```

---

## Barista Endpoints

### Search Customer by Mobile

#### `GET /barista/search/:mobile`
Search for a customer using their mobile number.

**Parameters:**
- `mobile` - 10-digit mobile number (string)

**Success Response (200):**
```json
{
  "customer": {
    "id": "customer_1732885200_abc123def",
    "name": "John Doe",
    "mobile": "9876543210",
    "purchases": ["Latte", "Cold Brew"],
    "completedRoadmaps": [],
    "badges": [],
    "createdAt": "2025-11-29T10:00:00.000Z",
    "lastPurchaseAt": "2025-11-29T15:30:00.000Z"
  }
}
```

**Error Responses:**

Invalid Mobile (400):
```json
{
  "error": "Invalid mobile number"
}
```

Not Found (404):
```json
{
  "error": "Customer not found"
}
```

---

### Add Purchase (Barista)

#### `POST /barista/add-purchase`
Record a purchase for a customer via barista dashboard.

**Request Body:**
```json
{
  "mobile": "9876543210",
  "items": ["Latte", "Cappuccino Med"]
}
```

**Validation:**
- `mobile` must be 10 digits
- `items` must be non-empty array

**Success Response (200):**
```json
{
  "success": true,
  "customer": {
    "id": "customer_1732885200_abc123def",
    "name": "John Doe",
    "mobile": "9876543210",
    "purchases": ["Latte", "Cappuccino Med", "Cold Brew"],
    "completedRoadmaps": [],
    "badges": [],
    "createdAt": "2025-11-29T10:00:00.000Z",
    "lastPurchaseAt": "2025-11-29T16:30:00.000Z"
  }
}
```

**Error Responses:**

Invalid Request (400):
```json
{
  "error": "Mobile and items are required"
}
```

Customer Not Found (404):
```json
{
  "error": "Customer not found"
}
```

---

## Data Models

### Customer
```typescript
interface Customer {
  id: string;              // Unique identifier
  name: string;            // Customer full name
  mobile: string;          // 10-digit mobile number
  purchases: string[];     // Array of purchased item names
  completedRoadmaps: string[]; // Array of completed roadmap IDs
  badges: string[];        // Array of earned badge names
  createdAt: string;       // ISO 8601 timestamp
  lastPurchaseAt?: string; // ISO 8601 timestamp (optional)
}
```

### OTP Data
```typescript
interface OTPData {
  mobile: string;    // Mobile number
  otp: string;       // 6-digit OTP
  expiresAt: number; // Unix timestamp (milliseconds)
}
```

---

## Roadmap IDs

- `hot_drinks_explorer` - Hot Drinks Explorer
- `cold_drinks_fan` - Cold Drinks Fan
- `sweet_tooth` - Sweet Tooth
- `epicure_master` - Epicure Master

---

## Error Handling

All errors follow this format:
```json
{
  "error": "Human-readable error message"
}
```

HTTP Status Codes:
- `200` - Success
- `400` - Bad Request (validation error)
- `404` - Not Found
- `500` - Internal Server Error

---

## Rate Limiting

Currently no rate limiting is implemented. Consider adding for production:
- OTP requests: 3 per mobile number per hour
- API requests: 100 per IP per minute

---

## Example Usage

### JavaScript/TypeScript (Frontend)

```typescript
import { api } from './utils/api';

// Send OTP
const result = await api.sendOTP('9876543210');

// Verify OTP
const customer = await api.verifyOTP('9876543210', '123456', 'John Doe');

// Get customer data
const customerData = await api.getCustomer(customerId);

// Add purchase
await api.addPurchase(customerId, ['Latte', 'Cold Brew']);

// Search customer (barista)
const found = await api.searchCustomer('9876543210');

// Add purchase via barista
await api.baristaAddPurchase('9876543210', ['Cappuccino Med']);
```

### cURL Examples

Send OTP:
```bash
curl -X POST https://yourproject.supabase.co/functions/v1/make-server-6a458d4b/send-otp \
  -H "Authorization: Bearer your_anon_key" \
  -H "Content-Type: application/json" \
  -d '{"mobile":"9876543210"}'
```

Verify OTP:
```bash
curl -X POST https://yourproject.supabase.co/functions/v1/make-server-6a458d4b/verify-otp \
  -H "Authorization: Bearer your_anon_key" \
  -H "Content-Type: application/json" \
  -d '{"mobile":"9876543210","otp":"123456","name":"John Doe"}'
```

Get Customer:
```bash
curl https://yourproject.supabase.co/functions/v1/make-server-6a458d4b/customer/customer_123 \
  -H "Authorization: Bearer your_anon_key"
```

---

## Logging

All API requests and responses are logged to the console for debugging:

```
[API] Calling /send-otp POST
[API Success] /send-otp { success: true, ... }
```

Errors are logged with full context:
```
[API Error] /verify-otp (400): Invalid OTP
```

---

## Security Notes

1. **Never expose `SUPABASE_SERVICE_ROLE_KEY` to frontend**
2. OTP expires after 5 minutes
3. OTPs are one-time use (deleted after verification)
4. Mobile numbers are validated (10 digits, numeric only)
5. All sensitive operations require authentication
6. CORS is configured for cross-origin requests

---

**API Version:** 1.0.0  
**Last Updated:** November 29, 2025  
**Status:** Production Ready