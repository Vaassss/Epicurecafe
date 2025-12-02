import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Admin Configuration
const MASTER_ADMIN_MOBILE = "9999999999"; // Change this to the owner's phone number
const MANUAL_ENTRY_CODE = "CAFE2024"; // Staff code for manual entry - store securely

// Types
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
  isAdmin?: boolean; // New: track admin users
}

interface PurchaseRecord {
  id: string;
  items: string[];
  timestamp: string;
  source: 'scanner' | 'barista' | 'manual';
  billId?: string;
  billHash?: string; // New: to prevent duplicate scanning
}

interface OTPData {
  mobile: string;
  otp: string;
  expiresAt: number;
}

interface ScannedBill {
  billHash: string;
  customerId: string;
  scannedAt: string;
}

// Utility Functions
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function generateCustomerId(): string {
  return `customer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function generatePurchaseId(): string {
  return `purchase_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// OTP Routes
app.post("/make-server-6a458d4b/send-otp", async (c) => {
  try {
    const { mobile } = await c.req.json();
    
    if (!mobile || !/^\d{10}$/.test(mobile)) {
      return c.json({ error: "Invalid mobile number. Must be 10 digits." }, 400);
    }

    const otp = generateOTP();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes (extended from 5)

    const otpData: OTPData = {
      mobile,
      otp,
      expiresAt
    };

    await kv.set(`otp:${mobile}`, otpData);

    // In production, you would send SMS here
    console.log(`OTP for ${mobile}: ${otp}`);

    return c.json({ 
      success: true, 
      message: "OTP sent successfully",
      // For demo purposes, return OTP. Remove in production!
      otp: otp 
    });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return c.json({ error: "Failed to send OTP" }, 500);
  }
});

app.post("/make-server-6a458d4b/verify-otp", async (c) => {
  try {
    const { mobile, otp, name } = await c.req.json();

    if (!mobile || !otp) {
      return c.json({ error: "Mobile and OTP are required" }, 400);
    }

    const storedOTPData = await kv.get<OTPData>(`otp:${mobile}`);

    if (!storedOTPData) {
      return c.json({ error: "OTP not found or expired. Please request a new OTP." }, 400);
    }

    if (Date.now() > storedOTPData.expiresAt) {
      await kv.del(`otp:${mobile}`);
      return c.json({ error: "OTP expired. Please request a new OTP." }, 400);
    }

    if (storedOTPData.otp !== otp) {
      // Don't delete OTP on wrong attempt, allow retry
      return c.json({ error: "Invalid OTP. Please check and try again." }, 400);
    }

    // Check if customer exists
    let customer = await kv.get<CustomerData>(`customer:mobile:${mobile}`);

    if (!customer) {
      // New customer - name is required
      if (!name || !name.trim()) {
        // Don't delete OTP yet - user needs to provide name
        return c.json({ 
          error: "Name is required for new customers",
          isNewUser: true 
        }, 400);
      }

      // Create new customer
      const customerId = generateCustomerId();
      const isAdmin = mobile === MASTER_ADMIN_MOBILE;
      
      customer = {
        id: customerId,
        name: name.trim(),
        mobile,
        purchases: [],
        purchaseHistory: [],
        completedRoadmaps: [],
        badges: [],
        createdAt: new Date().toISOString(),
        isAdmin: isAdmin
      };

      // If this is the master admin, add to admin list
      if (isAdmin) {
        await kv.set(`admin:${mobile}`, { mobile, addedAt: new Date().toISOString() });
      }

      await kv.set(`customer:${customerId}`, customer);
      await kv.set(`customer:mobile:${mobile}`, customer);
    } else {
      // Check if this mobile is an admin
      const adminRecord = await kv.get(`admin:${mobile}`);
      if (adminRecord && !customer.isAdmin) {
        customer.isAdmin = true;
        await kv.set(`customer:${customer.id}`, customer);
        await kv.set(`customer:mobile:${mobile}`, customer);
      }
    }

    // OTP verified successfully - now delete it
    await kv.del(`otp:${mobile}`);

    return c.json({ 
      success: true, 
      customer: {
        id: customer.id,
        name: customer.name,
        mobile: customer.mobile,
        isAdmin: customer.isAdmin || false
      }
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return c.json({ error: "Failed to verify OTP" }, 500);
  }
});

// Customer Routes
app.get("/make-server-6a458d4b/customer/:id", async (c) => {
  try {
    const customerId = c.req.param("id");
    const customer = await kv.get<CustomerData>(`customer:${customerId}`);

    if (!customer) {
      return c.json({ error: "Customer not found" }, 404);
    }

    // Ensure purchaseHistory exists (for backward compatibility)
    if (!customer.purchaseHistory) {
      customer.purchaseHistory = [];
    }

    return c.json({ customer });
  } catch (error) {
    console.error("Error fetching customer:", error);
    return c.json({ error: "Failed to fetch customer data" }, 500);
  }
});

app.post("/make-server-6a458d4b/customer/:id/purchase", async (c) => {
  try {
    const customerId = c.req.param("id");
    const { items } = await c.req.json();

    if (!Array.isArray(items) || items.length === 0) {
      return c.json({ error: "Items array is required" }, 400);
    }

    const customer = await kv.get<CustomerData>(`customer:${customerId}`);

    if (!customer) {
      return c.json({ error: "Customer not found" }, 404);
    }

    // Add purchases
    customer.purchases.push(...items);
    customer.lastPurchaseAt = new Date().toISOString();

    // Add purchase record
    const purchaseId = generatePurchaseId();
    const purchaseRecord: PurchaseRecord = {
      id: purchaseId,
      items: items,
      timestamp: new Date().toISOString(),
      source: 'scanner'
    };
    customer.purchaseHistory.push(purchaseRecord);

    // Save updated customer
    await kv.set(`customer:${customerId}`, customer);
    await kv.set(`customer:mobile:${customer.mobile}`, customer);

    return c.json({ success: true, customer });
  } catch (error) {
    console.error("Error adding purchase:", error);
    return c.json({ error: "Failed to add purchase" }, 500);
  }
});

app.post("/make-server-6a458d4b/customer/:id/complete-roadmap", async (c) => {
  try {
    const customerId = c.req.param("id");
    const { roadmapId, badge } = await c.req.json();

    if (!roadmapId || !badge) {
      return c.json({ error: "Roadmap ID and badge are required" }, 400);
    }

    const customer = await kv.get<CustomerData>(`customer:${customerId}`);

    if (!customer) {
      return c.json({ error: "Customer not found" }, 404);
    }

    // Add completed roadmap and badge
    if (!customer.completedRoadmaps.includes(roadmapId)) {
      customer.completedRoadmaps.push(roadmapId);
    }
    
    if (!customer.badges.includes(badge)) {
      customer.badges.push(badge);
    }

    // Save updated customer
    await kv.set(`customer:${customerId}`, customer);
    await kv.set(`customer:mobile:${customer.mobile}`, customer);

    return c.json({ success: true, customer });
  } catch (error) {
    console.error("Error completing roadmap:", error);
    return c.json({ error: "Failed to complete roadmap" }, 500);
  }
});

// Barista Routes
app.get("/make-server-6a458d4b/barista/search/:mobile", async (c) => {
  try {
    const mobile = c.req.param("mobile");

    if (!mobile || !/^\d{10}$/.test(mobile)) {
      return c.json({ error: "Invalid mobile number" }, 400);
    }

    const customer = await kv.get<CustomerData>(`customer:mobile:${mobile}`);

    if (!customer) {
      return c.json({ error: "Customer not found" }, 404);
    }

    return c.json({ customer });
  } catch (error) {
    console.error("Error searching customer:", error);
    return c.json({ error: "Failed to search customer" }, 500);
  }
});

app.post("/make-server-6a458d4b/barista/add-purchase", async (c) => {
  try {
    const { mobile, items } = await c.req.json();

    if (!mobile || !Array.isArray(items) || items.length === 0) {
      return c.json({ error: "Mobile and items are required" }, 400);
    }

    const customer = await kv.get<CustomerData>(`customer:mobile:${mobile}`);

    if (!customer) {
      return c.json({ error: "Customer not found" }, 404);
    }

    // Ensure purchaseHistory exists (for backward compatibility)
    if (!customer.purchaseHistory) {
      customer.purchaseHistory = [];
    }

    // Add purchases
    customer.purchases.push(...items);
    customer.lastPurchaseAt = new Date().toISOString();

    // Add purchase record
    const purchaseId = generatePurchaseId();
    const purchaseRecord: PurchaseRecord = {
      id: purchaseId,
      items: items,
      timestamp: new Date().toISOString(),
      source: 'barista'
    };
    customer.purchaseHistory.push(purchaseRecord);

    // Save updated customer
    await kv.set(`customer:${customer.id}`, customer);
    await kv.set(`customer:mobile:${mobile}`, customer);

    return c.json({ success: true, customer });
  } catch (error) {
    console.error("Error adding purchase via barista:", error);
    return c.json({ error: "Failed to add purchase" }, 500);
  }
});

// Health check endpoint
app.get("/make-server-6a458d4b/health", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Check if customer exists (for OTP flow)
app.get("/make-server-6a458d4b/check-customer/:mobile", async (c) => {
  try {
    const mobile = c.req.param("mobile");

    if (!mobile || !/^\d{10}$/.test(mobile)) {
      return c.json({ error: "Invalid mobile number" }, 400);
    }

    const customer = await kv.get<CustomerData>(`customer:mobile:${mobile}`);

    return c.json({ 
      exists: !!customer,
      isNewUser: !customer
    });
  } catch (error) {
    console.error("Error checking customer:", error);
    return c.json({ error: "Failed to check customer" }, 500);
  }
});

// Verify staff code
app.post("/make-server-6a458d4b/verify-staff-code", async (c) => {
  try {
    const { code } = await c.req.json();
    
    if (code === MANUAL_ENTRY_CODE) {
      return c.json({ valid: true });
    }
    
    return c.json({ valid: false }, 403);
  } catch (error) {
    console.error("Error verifying staff code:", error);
    return c.json({ error: "Failed to verify code" }, 500);
  }
});

// Admin Routes - Get all customers
app.get("/make-server-6a458d4b/admin/customers", async (c) => {
  try {
    const adminMobile = c.req.header("X-Admin-Mobile");
    
    // Verify admin
    const admin = await kv.get<CustomerData>(`customer:mobile:${adminMobile}`);
    if (!admin || !admin.isAdmin) {
      return c.json({ error: "Unauthorized. Admin access required." }, 403);
    }

    // Get all customers
    const customers = await kv.getByPrefix<CustomerData>("customer:mobile:");
    
    return c.json({ customers: customers || [] });
  } catch (error) {
    console.error("Error fetching all customers:", error);
    return c.json({ error: "Failed to fetch customers" }, 500);
  }
});

// Admin - Add/Remove purchases for any customer
app.post("/make-server-6a458d4b/admin/customer/:mobile/purchase", async (c) => {
  try {
    const adminMobile = c.req.header("X-Admin-Mobile");
    const targetMobile = c.req.param("mobile");
    const { items, action } = await c.req.json(); // action: 'add' or 'remove'
    
    // Verify admin
    const admin = await kv.get<CustomerData>(`customer:mobile:${adminMobile}`);
    if (!admin || !admin.isAdmin) {
      return c.json({ error: "Unauthorized. Admin access required." }, 403);
    }

    const customer = await kv.get<CustomerData>(`customer:mobile:${targetMobile}`);
    if (!customer) {
      return c.json({ error: "Customer not found" }, 404);
    }

    if (!customer.purchaseHistory) {
      customer.purchaseHistory = [];
    }

    if (action === 'add') {
      // Add items
      customer.purchases.push(...items);
      customer.lastPurchaseAt = new Date().toISOString();
      
      const purchaseId = generatePurchaseId();
      const purchaseRecord: PurchaseRecord = {
        id: purchaseId,
        items: items,
        timestamp: new Date().toISOString(),
        source: 'barista'
      };
      customer.purchaseHistory.push(purchaseRecord);
    } else if (action === 'remove') {
      // Remove purchase record by ID
      const { purchaseId } = await c.req.json();
      customer.purchaseHistory = customer.purchaseHistory.filter(p => p.id !== purchaseId);
      
      // Rebuild purchases list from history
      customer.purchases = [];
      customer.purchaseHistory.forEach(record => {
        customer.purchases.push(...record.items);
      });
    }

    await kv.set(`customer:${customer.id}`, customer);
    await kv.set(`customer:mobile:${targetMobile}`, customer);

    return c.json({ success: true, customer });
  } catch (error) {
    console.error("Error managing customer purchase:", error);
    return c.json({ error: "Failed to manage purchase" }, 500);
  }
});

// Admin - Add admin user
app.post("/make-server-6a458d4b/admin/add-admin", async (c) => {
  try {
    const adminMobile = c.req.header("X-Admin-Mobile");
    const { mobile } = await c.req.json();
    
    // Verify admin
    const admin = await kv.get<CustomerData>(`customer:mobile:${adminMobile}`);
    if (!admin || !admin.isAdmin) {
      return c.json({ error: "Unauthorized. Admin access required." }, 403);
    }

    // Add to admin list
    await kv.set(`admin:${mobile}`, { mobile, addedAt: new Date().toISOString(), addedBy: adminMobile });
    
    // Update customer record if exists
    const customer = await kv.get<CustomerData>(`customer:mobile:${mobile}`);
    if (customer) {
      customer.isAdmin = true;
      await kv.set(`customer:${customer.id}`, customer);
      await kv.set(`customer:mobile:${mobile}`, customer);
    }

    return c.json({ success: true, message: "Admin added successfully" });
  } catch (error) {
    console.error("Error adding admin:", error);
    return c.json({ error: "Failed to add admin" }, 500);
  }
});

// Admin - Remove admin user
app.post("/make-server-6a458d4b/admin/remove-admin", async (c) => {
  try {
    const adminMobile = c.req.header("X-Admin-Mobile");
    const { mobile } = await c.req.json();
    
    // Verify admin
    const admin = await kv.get<CustomerData>(`customer:mobile:${adminMobile}`);
    if (!admin || !admin.isAdmin) {
      return c.json({ error: "Unauthorized. Admin access required." }, 403);
    }

    // Cannot remove master admin
    if (mobile === MASTER_ADMIN_MOBILE) {
      return c.json({ error: "Cannot remove master admin" }, 403);
    }

    // Remove from admin list
    await kv.del(`admin:${mobile}`);
    
    // Update customer record if exists
    const customer = await kv.get<CustomerData>(`customer:mobile:${mobile}`);
    if (customer) {
      customer.isAdmin = false;
      await kv.set(`customer:${customer.id}`, customer);
      await kv.set(`customer:mobile:${mobile}`, customer);
    }

    return c.json({ success: true, message: "Admin removed successfully" });
  } catch (error) {
    console.error("Error removing admin:", error);
    return c.json({ error: "Failed to remove admin" }, 500);
  }
});

// Admin - Get all admins
app.get("/make-server-6a458d4b/admin/list-admins", async (c) => {
  try {
    const adminMobile = c.req.header("X-Admin-Mobile");
    
    // Verify admin
    const admin = await kv.get<CustomerData>(`customer:mobile:${adminMobile}`);
    if (!admin || !admin.isAdmin) {
      return c.json({ error: "Unauthorized. Admin access required." }, 403);
    }

    const admins = await kv.getByPrefix("admin:");
    
    return c.json({ admins: admins || [] });
  } catch (error) {
    console.error("Error fetching admins:", error);
    return c.json({ error: "Failed to fetch admins" }, 500);
  }
});

// Process scanned bill
app.post("/make-server-6a458d4b/customer/:id/scan-bill", async (c) => {
  try {
    const customerId = c.req.param("id");
    const { scannedText, items, billHash, staffCode } = await c.req.json();

    if (!Array.isArray(items) || items.length === 0) {
      return c.json({ error: "Items array is required" }, 400);
    }

    const customer = await kv.get<CustomerData>(`customer:${customerId}`);

    if (!customer) {
      return c.json({ error: "Customer not found" }, 404);
    }

    // Check if bill was already scanned (prevent duplicates)
    if (billHash) {
      const existingBill = await kv.get<ScannedBill>(`bill:${billHash}`);
      if (existingBill) {
        return c.json({ 
          error: "This bill has already been scanned", 
          isDuplicate: true 
        }, 400);
      }
    }

    // Ensure purchaseHistory exists (for backward compatibility)
    if (!customer.purchaseHistory) {
      customer.purchaseHistory = [];
    }

    // Determine source - check if staff code was provided for manual entry
    let source: 'scanner' | 'barista' | 'manual' = 'scanner';
    if (staffCode) {
      // Validate staff code for manual entry
      if (staffCode !== MANUAL_ENTRY_CODE) {
        return c.json({ error: "Invalid staff code" }, 403);
      }
      source = 'manual';
    }

    // Add purchases to main list
    customer.purchases.push(...items);
    customer.lastPurchaseAt = new Date().toISOString();

    // Add detailed purchase record
    const purchaseId = generatePurchaseId();
    const billId = `bill_${Date.now()}`;
    const purchaseRecord: PurchaseRecord = {
      id: purchaseId,
      items: items,
      timestamp: new Date().toISOString(),
      source: source,
      billId: billId,
      billHash: billHash
    };
    customer.purchaseHistory.push(purchaseRecord);

    // Store bill hash to prevent duplicate scanning
    if (billHash) {
      const scannedBill: ScannedBill = {
        billHash: billHash,
        customerId: customerId,
        scannedAt: new Date().toISOString()
      };
      await kv.set(`bill:${billHash}`, scannedBill);
    }

    // Save updated customer
    await kv.set(`customer:${customerId}`, customer);
    await kv.set(`customer:mobile:${customer.mobile}`, customer);

    return c.json({ success: true, customer, purchaseId });
  } catch (error) {
    console.error("Error processing scanned bill:", error);
    return c.json({ error: "Failed to process scanned bill" }, 500);
  }
});

Deno.serve(app.fetch);